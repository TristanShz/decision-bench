import type { Pair } from './pair.ts'

// Support, modération, sécurité et routage : cas difficiles (intentions multiples, urgence trompeuse,
// fraude au fournisseur, données personnelles glissées en passant, signaux faibles à escalader).

// ─── Grilles partagées ───────────────────────────────────────────────────────

const PRIORITY = {
  fr: [
    'P4 — Demande de modification ou d’information, sans aucune gêne actuelle',
    'P3 — Gêne mineure, ou problème touchant un seul utilisateur avec un contournement',
    'P2 — Fonction importante dégradée pour de nombreux utilisateurs, sans perte de données ni d’argent',
    'P1 — Service inaccessible, ou perte de données ou d’argent en cours',
  ],
  en: [
    'P4 — Change or information request, no current impact',
    'P3 — Minor inconvenience, or an issue affecting a single user with a workaround',
    'P2 — Important feature degraded for many users, with no loss of data or money',
    'P1 — Service unavailable, or ongoing loss of data or money',
  ],
}

const TEAMS = {
  fr: {
    billing: 'Facturation de l’abonnement du client : factures, prélèvements, remboursements, moyen de paiement',
    account: 'Accès au compte : connexion, identifiants, e-mail de connexion, profil, utilisateurs et droits',
    technical: 'Bugs et dysfonctionnements de l’application, quel que soit l’écran concerné',
    sales: 'Devis, nouveaux contrats, passage à une offre supérieure',
  },
  en: {
    billing: 'Billing for the customer’s subscription: invoices, charges, refunds, payment method',
    account: 'Account access: sign-in, credentials, sign-in email, profile, users and permissions',
    technical: 'Bugs and malfunctions of the application, whatever the screen involved',
    sales: 'Quotes, new contracts, upgrades to a higher plan',
  },
}

const MAIL = {
  fr: {
    personal: 'Message personnel ou transactionnel (facture, confirmation, échange direct)',
    promotions: 'Marketing légitime d’un expéditeur avec qui le destinataire a une relation et auquel il a consenti',
    spam: 'Sollicitation commerciale non demandée, d’un expéditeur sans relation avec le destinataire',
    phishing: 'Tentative frauduleuse d’obtenir des identifiants, des données ou un paiement en usurpant une identité',
  },
  en: {
    personal: 'Personal or transactional message (invoice, confirmation, direct exchange)',
    promotions: 'Legitimate marketing from a sender the recipient has a relationship with and has consented to',
    spam: 'Unsolicited commercial message from a sender with no relationship to the recipient',
    phishing: 'Fraudulent attempt to obtain credentials, data or a payment by impersonating someone',
  },
}

const MOD = {
  fr: {
    acceptable: 'Contenu acceptable, y compris une critique virulente d’une idée, d’une loi ou d’un produit',
    personal_attack: 'Attaque ou insulte visant une personne identifiable',
    group_hate: 'Propos dénigrant un groupe de personnes en raison de sa nationalité, de son origine, de sa religion, etc.',
    spam: 'Publicité ou arnaque',
  },
  en: {
    acceptable: 'Acceptable content, including harsh criticism of an idea, a law or a product',
    personal_attack: 'Attack or insult aimed at an identifiable person',
    group_hate: 'Content disparaging a group of people because of their nationality, origin, religion, etc.',
    spam: 'Advertising or scam',
  },
}

const MOOD = {
  fr: ['Calme ou satisfait', 'Agacé', 'Très en colère'],
  en: ['Calm or satisfied', 'Annoyed', 'Very angry'],
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const OPERATIONS: Pair[] = [
  {
    id: 'ops-multi-intent',
    category: 'Routing',
    complexity: 'complexe',
    length: 'court',
    // Le compliment n’est pas une demande : restent le remboursement du doublon et la photo de profil (2 demandes).
    // La demande principale est le double prélèvement ; la photo est explicitement « sans urgence ».
    expected: { primary_queue: 'billing', asks_refund: true, request_count: 2 },
    fr: {
      name: 'Message à intentions multiples',
      description: 'Compliment, double prélèvement et question de profil : router vers la demande principale.',
      state:
        'Bonjour ! D’abord bravo pour le nouveau mode sombre, mes yeux vous remercient. Sinon, je suis passée de l’offre Pro à l’offre Starter le 3 octobre et j’ai été prélevée deux fois de 19 € : une fois le 3 et une fois le 5. Pourriez-vous rembourser le second prélèvement ? Et une dernière chose, sans urgence : où change-t-on la photo de profil ? Je ne trouve pas. Merci, Léa',
      questions: {
        primary_queue: { type: 'choice', instructions: 'Vers quelle équipe router ce message, d’après sa demande principale ?', criteria: TEAMS.fr },
        asks_refund: { type: 'noul', instructions: 'La cliente demande-t-elle un remboursement ?' },
        request_count: {
          type: 'score',
          instructions: 'Combien de demandes distinctes (questions ou actions attendues de notre part) le message contient-il ? Un compliment n’est pas une demande.',
          criteria: ['Aucune demande', 'Une demande', 'Deux demandes', 'Trois demandes ou plus'],
        },
      },
    },
    en: {
      name: 'Multi-intent message',
      description: 'Compliment, duplicate charge and profile question: route to the main request.',
      state:
        'Hi! First of all, well done on the new dark mode, my eyes thank you. Also, I switched from the Pro plan to the Starter plan on October 3 and I was charged €19 twice: once on the 3rd and once on the 5th. Could you refund the second charge? And one last thing, no rush: where do you change the profile picture? I can’t find it. Thanks, Léa',
      questions: {
        primary_queue: { type: 'choice', instructions: 'Which team should this message be routed to, based on its main request?', criteria: TEAMS.en },
        asks_refund: { type: 'noul', instructions: 'Is the customer asking for a refund?' },
        request_count: {
          type: 'score',
          instructions: 'How many distinct requests (questions or actions expected from us) does the message contain? A compliment is not a request.',
          criteria: ['No request', 'One request', 'Two requests', 'Three or more requests'],
        },
      },
    },
  },
  {
    id: 'ops-false-urgency',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Ton alarmiste, mais simple changement de logo pour une facture émise dans trois semaines : P4.
    expected: { claims_urgency: true, real_impact: false, priority: 0 },
    fr: {
      name: 'Fausse urgence',
      description: 'Majuscules et points d’exclamation pour un simple changement de logo.',
      state:
        'URGENT !!! À TRAITER IMMÉDIATEMENT !!! Notre nouveau logo a été validé hier en comité de direction. Merci de le faire figurer sur nos factures : la prochaine sera émise dans trois semaines. Le fichier PNG est en pièce jointe. C’EST TRÈS IMPORTANT POUR NOUS !!!',
      questions: {
        claims_urgency: { type: 'noul', instructions: 'Le client présente-t-il sa demande comme urgente ?' },
        real_impact: { type: 'noul', instructions: 'Le client subit-il actuellement une interruption de service, une perte de données ou une perte d’argent ?' },
        priority: { type: 'score', instructions: 'Quelle priorité attribuer à ce ticket selon la grille ?', criteria: PRIORITY.fr },
      },
    },
    en: {
      name: 'False urgency',
      description: 'Capitals and exclamation marks for a simple logo change.',
      state:
        'URGENT!!! HANDLE IMMEDIATELY!!! Our new logo was approved yesterday by the executive committee. Please put it on our invoices: the next one will be issued in three weeks. The PNG file is attached. THIS IS VERY IMPORTANT TO US!!!',
      questions: {
        claims_urgency: { type: 'noul', instructions: 'Does the customer present the request as urgent?' },
        real_impact: { type: 'noul', instructions: 'Is the customer currently suffering a service interruption, data loss or loss of money?' },
        priority: { type: 'score', instructions: 'What priority should this ticket get according to the scale?', criteria: PRIORITY.en },
      },
    },
  },
  {
    id: 'ops-subtle-urgency',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Ton détendu, mais des paiements sont encaissés sans que les commandes soient enregistrées : perte de données en cours, P1.
    // Les paiements concernés sont ceux des clients de la boutique, pas l’abonnement : l’équipe est technique.
    // Le piège est le ton calme (P3/P4) : des paiements encaissés sans commande relèvent de P1, P2 reste défendable.
    expected: { claims_urgency: false, priority: [2, 3], team: 'technical' },
    fr: {
      name: 'Urgence discrète',
      description: 'Message poli et détendu qui décrit des commandes perdues depuis le matin.',
      state:
        'Bonjour, rien de grave, je préfère juste vous le signaler quand vous aurez un moment. Depuis la mise à jour de ce matin, quand un client paie par carte sur notre boutique, il reçoit bien sa confirmation et il est débité, mais la commande n’apparaît pas dans notre back-office. On en compte 37 depuis 8 h. Pour l’instant, on les retrouve une par une dans les e-mails de confirmation, ça nous occupe un peu. Bonne journée, Marc',
      questions: {
        claims_urgency: { type: 'noul', instructions: 'Le client présente-t-il lui-même sa demande comme urgente ?' },
        priority: { type: 'score', instructions: 'Quelle priorité attribuer à ce ticket selon la grille ?', criteria: PRIORITY.fr },
        team: { type: 'choice', instructions: 'Quelle équipe doit traiter ce ticket ?', criteria: TEAMS.fr },
      },
    },
    en: {
      name: 'Quiet urgency',
      description: 'Polite, relaxed message describing orders lost since the morning.',
      state:
        'Hello, nothing serious, I’d just rather let you know whenever you have a moment. Since this morning’s update, when a customer pays by card in our shop, they do get their confirmation and they are charged, but the order doesn’t show up in our back office. We’ve counted 37 since 8 am. For now, we’re finding them one by one in the confirmation emails, which keeps us a bit busy. Have a nice day, Marc',
      questions: {
        claims_urgency: { type: 'noul', instructions: 'Does the customer themselves present the request as urgent?' },
        priority: { type: 'score', instructions: 'What priority should this ticket get according to the scale?', criteria: PRIORITY.en },
        team: { type: 'choice', instructions: 'Which team should handle this ticket?', criteria: TEAMS.en },
      },
    },
  },
  {
    id: 'ops-capacity-priority',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Toute l’organisation (60 personnes) est touchée, aucune donnée perdue (consultation à l’écran possible) : P2.
    expected: { priority: 2, affects_many_users: true, data_loss: false },
    fr: {
      name: 'Priorité intermédiaire',
      description: 'Export cassé pour toute une organisation, sans perte de données.',
      state: {
        customer: { plan: 'Business', users: 60 },
        message:
          'Bonjour, depuis la mise à jour d’hier, l’export Excel échoue pour tous les utilisateurs de notre organisation (« Erreur lors de la génération du fichier »). Les données restent consultables à l’écran et rien ne semble manquer. Ce n’est pas dramatique, mais notre reporting mensuel tombe la semaine prochaine et nous aurons besoin des exports d’ici là. Merci, Aurélie',
      },
      questions: {
        priority: { type: 'score', instructions: 'Quelle priorité attribuer à ce ticket selon la grille ?', criteria: PRIORITY.fr },
        affects_many_users: { type: 'noul', instructions: 'Le problème touche-t-il plusieurs utilisateurs ?' },
        data_loss: { type: 'noul', instructions: 'Le message décrit-il une perte de données ?' },
      },
    },
    en: {
      name: 'Middle priority',
      description: 'Export broken for a whole organization, with no data loss.',
      state: {
        customer: { plan: 'Business', users: 60 },
        message:
          'Hello, since yesterday’s update, the Excel export fails for every user in our organization (“Error while generating the file”). The data can still be viewed on screen and nothing seems to be missing. It’s not dramatic, but our monthly reporting is due next week and we will need the exports by then. Thanks, Aurélie',
      },
      questions: {
        priority: { type: 'score', instructions: 'What priority should this ticket get according to the scale?', criteria: PRIORITY.en },
        affects_many_users: { type: 'noul', instructions: 'Does the problem affect several users?' },
        data_loss: { type: 'noul', instructions: 'Does the message describe data loss?' },
      },
    },
  },
  {
    id: 'ops-legit-promo',
    category: 'Security',
    complexity: 'complexe',
    length: 'court',
    // Pression commerciale (« dernière chance »), mais cliente consentante, domaine cohérent, authentification valide,
    // lien de désinscription : marketing légitime, pas d’hameçonnage.
    expected: { category: 'promotions', is_phishing: false, pressure_tactics: true },
    fr: {
      name: 'Promotion légitime',
      description: 'E-mail marketing pressant mais consenti, d’un service dont le destinataire est client.',
      state: {
        recipient: { name: 'Camille Durand', context: 'Cliente de Pixalto (logiciel de retouche photo) depuis 2023 ; a coché « Recevoir les offres » à l’inscription.' },
        email: {
          from: 'Pixalto <offres@news.pixalto.com>',
          reply_to: 'support@pixalto.com',
          subject: 'Dernière chance : −40 % sur Pixalto Studio, jusqu’à dimanche minuit',
          body: 'Bonjour Camille, en tant que cliente fidèle, profitez de −40 % sur le passage à Pixalto Studio. L’offre expire dimanche à minuit — ne la manquez pas ! Activez-la depuis votre espace client : https://www.pixalto.com/compte/offres. Vous recevez cet e-mail car vous êtes inscrite aux offres Pixalto. Se désinscrire : https://www.pixalto.com/desinscription',
          authentication: { spf: 'pass', dkim: 'pass (pixalto.com)', dmarc: 'pass' },
        },
      },
      questions: {
        category: { type: 'choice', instructions: 'Dans quelle catégorie classer `email` ?', criteria: MAIL.fr },
        is_phishing: { type: 'noul', instructions: '`email` est-il une tentative d’hameçonnage ?' },
        pressure_tactics: { type: 'noul', instructions: '`email` incite-t-il le destinataire à agir vite ?' },
      },
    },
    en: {
      name: 'Legitimate promotion',
      description: 'Pushy but consented marketing email from a service the recipient uses.',
      state: {
        recipient: { name: 'Camille Durand', context: 'Pixalto (photo editing software) customer since 2023; ticked “Receive offers” when signing up.' },
        email: {
          from: 'Pixalto <offers@news.pixalto.com>',
          reply_to: 'support@pixalto.com',
          subject: 'Last chance: 40% off Pixalto Studio, until Sunday midnight',
          body: 'Hi Camille, as a loyal customer, enjoy 40% off an upgrade to Pixalto Studio. The offer expires Sunday at midnight — don’t miss it! Activate it from your customer area: https://www.pixalto.com/account/offers. You are receiving this email because you subscribed to Pixalto offers. Unsubscribe: https://www.pixalto.com/unsubscribe',
          authentication: { spf: 'pass', dkim: 'pass (pixalto.com)', dmarc: 'pass' },
        },
      },
      questions: {
        category: { type: 'choice', instructions: 'Which category should `email` be filed under?', criteria: MAIL.en },
        is_phishing: { type: 'noul', instructions: 'Is `email` a phishing attempt?' },
        pressure_tactics: { type: 'noul', instructions: 'Does `email` push the recipient to act quickly?' },
      },
    },
  },
  {
    id: 'ops-cold-spam',
    category: 'Security',
    complexity: 'complexe',
    length: 'court',
    // Prospection non sollicitée sans relation préalable : spam. Pas d’usurpation d’identité ni de demande
    // d’identifiants ou de paiement : ce n’est pas de l’hameçonnage au sens des options.
    expected: { category: 'spam', is_phishing: false, prior_relationship: false },
    fr: {
      name: 'Prospection non sollicitée',
      description: 'Spam commercial, à ne pas confondre avec de l’hameçonnage.',
      state: {
        recipient: { name: 'Julien Faure', context: 'Gérant d’un restaurant ; n’a jamais été en contact avec l’expéditeur.' },
        email: {
          from: 'Kevin — Croissance Digitale <kevin.growth.agency2291@gmail.com>',
          subject: 'Votre site perd des clients chaque jour',
          body: 'Bonjour, j’ai remarqué que votre site n’apparaît pas en première page de Google. Notre équipe peut vous y placer en 30 jours, résultat garanti. Répondez « OUI » pour recevoir notre grille tarifaire. Cordialement, Kevin',
          authentication: { spf: 'pass (gmail.com)', dkim: 'pass (gmail.com)' },
        },
      },
      questions: {
        category: { type: 'choice', instructions: 'Dans quelle catégorie classer `email` ?', criteria: MAIL.fr },
        is_phishing: { type: 'noul', instructions: '`email` est-il une tentative d’hameçonnage ?' },
        prior_relationship: { type: 'noul', instructions: 'Le destinataire a-t-il une relation préalable avec l’expéditeur ?' },
      },
    },
    en: {
      name: 'Unsolicited prospecting',
      description: 'Commercial spam, not to be confused with phishing.',
      state: {
        recipient: { name: 'Julien Faure', context: 'Restaurant manager; has never been in contact with the sender.' },
        email: {
          from: 'Kevin — Digital Growth <kevin.growth.agency2291@gmail.com>',
          subject: 'Your website is losing customers every day',
          body: 'Hello, I noticed your website doesn’t show up on the first page of Google. Our team can get you there in 30 days, guaranteed. Reply “YES” to receive our price list. Best regards, Kevin',
          authentication: { spf: 'pass (gmail.com)', dkim: 'pass (gmail.com)' },
        },
      },
      questions: {
        category: { type: 'choice', instructions: 'Which category should `email` be filed under?', criteria: MAIL.en },
        is_phishing: { type: 'noul', instructions: 'Is `email` a phishing attempt?' },
        prior_relationship: { type: 'noul', instructions: 'Does the recipient have a prior relationship with the sender?' },
      },
    },
  },
  {
    id: 'ops-vendor-bec',
    category: 'Security',
    complexity: 'complexe',
    length: 'moyen',
    // Domaine « imprimerie-lavaI.fr » (i majuscule à la place du l), reply-to sur une messagerie grand public,
    // changement d’IBAN, téléphone « indisponible » et pression sur l’échéance : fraude au fournisseur.
    // Le SPF « pass » ne vaut que pour le faux domaine.
    expected: { is_fraud: true, sender_domain_matches: false, reply_to_differs: true, action: 'call_known_number' },
    fr: {
      name: 'Fraude au changement d’IBAN',
      description: 'Faux fournisseur : domaine sosie, reply-to externe, nouvelles coordonnées bancaires.',
      state: {
        company: 'Atelier Brennec (menuiserie)',
        vendor_on_file: {
          name: 'Imprimerie Laval',
          email_domain: 'imprimerie-laval.fr',
          phone: '02 00 00 00 00',
          iban_on_file: 'FR76 0000 0000 0000 0000 0000 111',
          usual_contact: 'Sophie Marchal, comptabilité',
        },
        open_invoices: [{ number: 'F-2291', amount: '4 380,00 €', due: '2026-10-15' }],
        email: {
          from: 'Sophie Marchal <s.marchal@imprimerie-lavaI.fr>',
          reply_to: 'sophie.marchal.compta@outlook.fr',
          subject: 'RE: Facture F-2291 — nouvelles coordonnées bancaires',
          body: 'Bonjour, suite à un changement de banque, merci de régler la facture F-2291 (4 380,00 €) sur notre nouveau compte : IBAN FR76 0000 0000 0000 0000 0000 999. Le RIB mis à jour est en pièce jointe. Nos lignes téléphoniques sont en cours de migration cette semaine, merci de privilégier l’e-mail. Le règlement doit impérativement intervenir avant le 15 pour éviter des pénalités. Bien cordialement, Sophie Marchal — Service comptabilité, Imprimerie Laval',
          authentication: { spf: 'pass (imprimerie-lavaI.fr)' },
        },
      },
      questions: {
        is_fraud: { type: 'noul', instructions: '`email` est-il vraisemblablement une tentative de fraude ?' },
        sender_domain_matches: { type: 'noul', instructions: 'Le domaine de l’adresse d’expédition est-il exactement celui du fournisseur enregistré ?' },
        reply_to_differs: { type: 'noul', instructions: 'Les réponses partiraient-elles vers un domaine différent de celui du fournisseur enregistré ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire le service comptable ?',
          criteria: {
            pay_new_iban: 'Payer la facture sur le nouvel IBAN indiqué dans l’e-mail',
            reply_to_confirm: 'Répondre à l’e-mail pour demander confirmation du changement',
            call_known_number: 'Suspendre le paiement et appeler le fournisseur au numéro déjà enregistré',
            delete_silently: 'Supprimer l’e-mail sans rien signaler à personne',
          },
        },
      },
    },
    en: {
      name: 'IBAN change fraud',
      description: 'Fake supplier: look-alike domain, external reply-to, new bank details.',
      state: {
        company: 'Atelier Brennec (carpentry)',
        vendor_on_file: {
          name: 'Imprimerie Laval',
          email_domain: 'imprimerie-laval.fr',
          phone: '02 00 00 00 00',
          iban_on_file: 'FR76 0000 0000 0000 0000 0000 111',
          usual_contact: 'Sophie Marchal, accounting',
        },
        open_invoices: [{ number: 'F-2291', amount: '€4,380.00', due: '2026-10-15' }],
        email: {
          from: 'Sophie Marchal <s.marchal@imprimerie-lavaI.fr>',
          reply_to: 'sophie.marchal.compta@outlook.fr',
          subject: 'RE: Invoice F-2291 — new bank details',
          body: 'Hello, following a change of bank, please pay invoice F-2291 (€4,380.00) into our new account: IBAN FR76 0000 0000 0000 0000 0000 999. The updated bank details are attached. Our phone lines are being migrated this week, so please use email. Payment must be made before the 15th to avoid penalties. Kind regards, Sophie Marchal — Accounting Department, Imprimerie Laval',
          authentication: { spf: 'pass (imprimerie-lavaI.fr)' },
        },
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'Is `email` likely a fraud attempt?' },
        sender_domain_matches: { type: 'noul', instructions: 'Is the domain of the sending address exactly that of the supplier on file?' },
        reply_to_differs: { type: 'noul', instructions: 'Would replies go to a domain other than that of the supplier on file?' },
        action: {
          type: 'choice',
          instructions: 'What should the accounting department do?',
          criteria: {
            pay_new_iban: 'Pay the invoice to the new IBAN given in the email',
            reply_to_confirm: 'Reply to the email to ask for confirmation of the change',
            call_known_number: 'Hold the payment and call the supplier on the number already on file',
            delete_silently: 'Delete the email without reporting it to anyone',
          },
        },
      },
    },
  },
  {
    id: 'ops-vendor-legit',
    category: 'Security',
    complexity: 'complexe',
    length: 'court',
    // Relance ferme (pénalités), mais domaine, reply-to et IBAN identiques à ceux enregistrés, facture réelle et validée :
    // rien de suspect, on paie par le circuit habituel.
    expected: { is_fraud: false, changes_payment_details: false, action: 'pay_normally' },
    fr: {
      name: 'Relance fournisseur légitime',
      description: 'Relance pressante mais authentique, sans changement de coordonnées.',
      state: {
        vendor_on_file: { name: 'Transports Morvan', email_domain: 'transports-morvan.fr', iban_on_file: 'FR76 0000 0000 0000 0000 0000 222' },
        erp_invoice: { number: 'TM-0815', amount: '1 260,00 €', due: '2026-09-30', status: 'validée, non payée' },
        email: {
          from: 'Comptabilité Transports Morvan <compta@transports-morvan.fr>',
          reply_to: 'compta@transports-morvan.fr',
          subject: 'Relance : facture TM-0815 échue',
          body: 'Bonjour, sauf erreur de notre part, la facture TM-0815 de 1 260,00 €, arrivée à échéance le 30 septembre, reste impayée. Conformément à l’article 7 de nos conditions générales, des pénalités de retard pourront s’appliquer au-delà du 31 octobre. Merci d’effectuer le règlement par virement sur notre compte habituel (IBAN FR76 0000 0000 0000 0000 0000 222), ou de nous indiquer si un litige bloque le paiement. Cordialement, le service comptabilité',
          authentication: { spf: 'pass', dkim: 'pass (transports-morvan.fr)', dmarc: 'pass' },
        },
      },
      questions: {
        is_fraud: { type: 'noul', instructions: '`email` est-il vraisemblablement une tentative de fraude ?' },
        changes_payment_details: { type: 'noul', instructions: '`email` demande-t-il de payer sur des coordonnées bancaires différentes de celles enregistrées ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire le service comptable ?',
          criteria: {
            pay_normally: 'Payer la facture par le circuit habituel, sur l’IBAN déjà enregistré',
            call_before_paying: 'Bloquer le paiement et faire vérifier par téléphone un changement de coordonnées bancaires',
            report_phishing: 'Signaler l’e-mail comme hameçonnage et ne rien payer',
          },
        },
      },
    },
    en: {
      name: 'Legitimate supplier reminder',
      description: 'Insistent but genuine reminder, with no change of bank details.',
      state: {
        vendor_on_file: { name: 'Transports Morvan', email_domain: 'transports-morvan.fr', iban_on_file: 'FR76 0000 0000 0000 0000 0000 222' },
        erp_invoice: { number: 'TM-0815', amount: '€1,260.00', due: '2026-09-30', status: 'approved, unpaid' },
        email: {
          from: 'Transports Morvan Accounting <compta@transports-morvan.fr>',
          reply_to: 'compta@transports-morvan.fr',
          subject: 'Reminder: invoice TM-0815 overdue',
          body: 'Hello, unless we are mistaken, invoice TM-0815 for €1,260.00, due on September 30, remains unpaid. In accordance with article 7 of our terms and conditions, late-payment penalties may apply after October 31. Please make the payment by bank transfer to our usual account (IBAN FR76 0000 0000 0000 0000 0000 222), or let us know if a dispute is holding up the payment. Regards, the accounting department',
          authentication: { spf: 'pass', dkim: 'pass (transports-morvan.fr)', dmarc: 'pass' },
        },
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'Is `email` likely a fraud attempt?' },
        changes_payment_details: { type: 'noul', instructions: 'Does `email` ask for payment to bank details different from those on file?' },
        action: {
          type: 'choice',
          instructions: 'What should the accounting department do?',
          criteria: {
            pay_normally: 'Pay the invoice through the usual process, to the IBAN already on file',
            call_before_paying: 'Block the payment and have a change of bank details verified by phone',
            report_phishing: 'Report the email as phishing and pay nothing',
          },
        },
      },
    },
  },
  {
    id: 'ops-legit-password-reset',
    category: 'Security',
    complexity: 'complexe',
    length: 'court',
    // Réinitialisation demandée par l’utilisateur deux minutes plus tôt, lien sur un sous-domaine officiel,
    // authentification valide : l’e-mail est fiable malgré l’expiration courte.
    expected: { is_phishing: false, link_on_official_domain: true, action: 'use_link' },
    fr: {
      name: 'Réinitialisation légitime',
      description: 'E-mail de réinitialisation attendu, à ne pas signaler à tort.',
      state: {
        user_question: 'J’ai cliqué sur « Mot de passe oublié » sur Kalendo il y a deux minutes et je viens de recevoir ceci. C’est fiable ?',
        service_official_domain: 'kalendo.com',
        email: {
          from: 'Kalendo <no-reply@kalendo.com>',
          subject: 'Réinitialisez votre mot de passe',
          body: 'Vous avez demandé à réinitialiser votre mot de passe. Ce lien expire dans 15 minutes : https://app.kalendo.com/reset?token=7f3a9c. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : votre mot de passe actuel restera inchangé.',
          authentication: { spf: 'pass', dkim: 'pass (kalendo.com)', dmarc: 'pass' },
        },
      },
      questions: {
        is_phishing: { type: 'noul', instructions: '`email` est-il une tentative d’hameçonnage ?' },
        link_on_official_domain: { type: 'noul', instructions: 'Le lien de `email` pointe-t-il vers le domaine officiel du service ou l’un de ses sous-domaines ?' },
        action: {
          type: 'choice',
          instructions: 'Que conseiller à l’utilisateur ?',
          criteria: {
            use_link: 'Utiliser le lien pour définir un nouveau mot de passe',
            ignore: 'Ignorer l’e-mail et ne rien faire',
            report: 'Signaler l’e-mail comme hameçonnage',
          },
        },
      },
    },
    en: {
      name: 'Legitimate password reset',
      description: 'Expected reset email, not to be wrongly reported.',
      state: {
        user_question: 'I clicked “Forgot password” on Kalendo two minutes ago and I just received this. Is it safe?',
        service_official_domain: 'kalendo.com',
        email: {
          from: 'Kalendo <no-reply@kalendo.com>',
          subject: 'Reset your password',
          body: 'You asked to reset your password. This link expires in 15 minutes: https://app.kalendo.com/reset?token=7f3a9c. If you did not make this request, ignore this email: your current password will remain unchanged.',
          authentication: { spf: 'pass', dkim: 'pass (kalendo.com)', dmarc: 'pass' },
        },
      },
      questions: {
        is_phishing: { type: 'noul', instructions: 'Is `email` a phishing attempt?' },
        link_on_official_domain: { type: 'noul', instructions: 'Does the link in `email` point to the service’s official domain or one of its subdomains?' },
        action: {
          type: 'choice',
          instructions: 'What should the user be advised to do?',
          criteria: {
            use_link: 'Use the link to set a new password',
            ignore: 'Ignore the email and do nothing',
            report: 'Report the email as phishing',
          },
        },
      },
    },
  },
  {
    id: 'ops-pii-in-passing',
    category: 'Security',
    complexity: 'complexe',
    length: 'court',
    // Le long numéro de commande n’est pas un identifiant national (distracteur). Seules les données de santé
    // relèvent des catégories particulières (art. 9) ; l’IBAN et le téléphone sont personnels sans en faire partie.
    expected: { has_bank_details: true, has_health_info: true, has_national_id: false, special_category: 'health' },
    fr: {
      name: 'Données personnelles en passant',
      description: 'IBAN et détails de santé glissés dans une demande de livraison.',
      state:
        'Bonjour, je vous écris au sujet de ma commande n° 4401-2287-9930-1 (un fauteuil de bureau ergonomique). Je n’ai pas pu la réceptionner : j’étais hospitalisée pour une opération du dos et le colis vous a été retourné. Mon médecin m’a d’ailleurs conseillé ce fauteuil à cause de ma hernie discale, donc je le veux toujours ! Si ce n’est plus possible, remboursez-moi sur ce compte : IBAN FR76 0000 0000 0000 0000 0000 000, au nom de Nadia Benali. Vous pouvez me rappeler au 06 00 00 00 00. Merci !',
      questions: {
        has_bank_details: { type: 'noul', instructions: 'Le message contient-il des coordonnées bancaires ?' },
        has_health_info: { type: 'noul', instructions: 'Le message contient-il des informations sur la santé de la cliente ?' },
        has_national_id: { type: 'noul', instructions: 'Le message contient-il un numéro d’identification national (sécurité sociale, carte d’identité, passeport) ?' },
        special_category: {
          type: 'choice',
          instructions: 'Quelle information du message relève d’une catégorie particulière de données au sens de l’article 9 du RGPD ?',
          criteria: { order_number: 'Le numéro de commande', iban: 'L’IBAN', health: 'Les informations de santé', phone: 'Le numéro de téléphone' },
        },
      },
    },
    en: {
      name: 'Personal data in passing',
      description: 'IBAN and health details slipped into a delivery request.',
      state:
        'Hello, I’m writing about my order no. 4401-2287-9930-1 (an ergonomic office chair). I couldn’t receive it: I was in hospital for back surgery and the parcel was returned to you. My doctor actually recommended this chair because of my herniated disc, so I still want it! If that’s no longer possible, please refund me to this account: IBAN FR76 0000 0000 0000 0000 0000 000, in the name of Nadia Benali. You can call me back on 06 00 00 00 00. Thank you!',
      questions: {
        has_bank_details: { type: 'noul', instructions: 'Does the message contain bank details?' },
        has_health_info: { type: 'noul', instructions: 'Does the message contain information about the customer’s health?' },
        has_national_id: { type: 'noul', instructions: 'Does the message contain a national identification number (social security, ID card, passport)?' },
        special_category: {
          type: 'choice',
          instructions: 'Which piece of information in the message falls under a special category of data within the meaning of Article 9 of the GDPR?',
          criteria: { order_number: 'The order number', iban: 'The IBAN', health: 'The health information', phone: 'The phone number' },
        },
      },
    },
  },
  {
    id: 'ops-hate-vs-idea',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'moyen',
    // c1 attaque durement une mesure (autorisé) ; c2 prête un défaut « culturel » à toute une nationalité,
    // sans insulte ni « tous » : dénigrement d’un groupe. Les Valdoriens sont un peuple inventé.
    expected: { c1_category: 'acceptable', c2_category: 'group_hate', remove_c1: false, remove_c2: true },
    fr: {
      name: 'Haine d’un groupe ou critique d’une idée',
      description: 'Critique virulente d’une taxe contre généralisation sur une nationalité.',
      state: {
        policy:
          'On retire les attaques personnelles et les propos dénigrant un groupe de personnes (nationalité, origine, religion…). La critique d’idées, de lois ou de produits est autorisée, même virulente.',
        thread: 'Forum voyage — La nouvelle taxe de séjour en Valdorie',
        comments: [
          { id: 'c1', text: 'Cette taxe sur les randonneurs est la mesure la plus absurde que j’aie vue depuis des années. Elle va vider les refuges et ruiner l’économie des vallées.' },
          { id: 'c2', text: 'Petit conseil d’ami : ne louez jamais votre appartement à des Valdoriens. Chez eux, rouler les propriétaires, c’est culturel.' },
          { id: 'c3', text: 'J’ai traversé la Valdorie à pied l’été dernier, les gens ont été adorables. Par contre, je suis d’accord, cette taxe est mal pensée.' },
        ],
      },
      questions: {
        c1_category: { type: 'choice', instructions: 'Catégorie de modération du commentaire `c1`', criteria: MOD.fr },
        c2_category: { type: 'choice', instructions: 'Catégorie de modération du commentaire `c2`', criteria: MOD.fr },
        remove_c1: { type: 'noul', instructions: 'Selon `policy`, faut-il retirer le commentaire `c1` ?' },
        remove_c2: { type: 'noul', instructions: 'Selon `policy`, faut-il retirer le commentaire `c2` ?' },
      },
    },
    en: {
      name: 'Group hate or criticism of an idea',
      description: 'Harsh criticism of a tax versus a generalization about a nationality.',
      state: {
        policy:
          'We remove personal attacks and content disparaging a group of people (nationality, origin, religion…). Criticism of ideas, laws or products is allowed, even when harsh.',
        thread: 'Travel forum — The new tourist tax in Valdoria',
        comments: [
          { id: 'c1', text: 'This tax on hikers is the most absurd measure I’ve seen in years. It will empty the mountain huts and ruin the valleys’ economy.' },
          { id: 'c2', text: 'Friendly advice: never rent your apartment to Valdorians. Where they come from, cheating landlords is cultural.' },
          { id: 'c3', text: 'I crossed Valdoria on foot last summer, the people were lovely. That said, I agree, this tax is poorly thought out.' },
        ],
      },
      questions: {
        c1_category: { type: 'choice', instructions: 'Moderation category of comment `c1`', criteria: MOD.en },
        c2_category: { type: 'choice', instructions: 'Moderation category of comment `c2`', criteria: MOD.en },
        remove_c1: { type: 'noul', instructions: 'Under `policy`, should comment `c1` be removed?' },
        remove_c2: { type: 'noul', instructions: 'Under `policy`, should comment `c2` be removed?' },
      },
    },
  },
  {
    id: 'ops-distress-signal',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Demande de résiliation banale en apparence, mais « affaires réglées », animal confié, adieux et
    // « plus rien n’a d’importance » : signaux indirects à transmettre en priorité à un humain.
    expected: { risk_signal: true, auto_reply_enough: false, action: 'escalate_human' },
    fr: {
      name: 'Signal de détresse',
      description: 'Résiliation accompagnée de signaux indirects de risque suicidaire.',
      state:
        'Bonjour, je voudrais résilier mon abonnement et supprimer mon compte, je n’en aurai plus besoin. J’ai réglé mes affaires cette semaine et ma sœur va récupérer mon chat. Merci pour tout, vous avez toujours été gentils avec moi. De toute façon, plus rien n’a vraiment d’importance maintenant. Solène',
      questions: {
        risk_signal: { type: 'noul', instructions: 'Le message contient-il des signaux, même indirects, pouvant indiquer un risque pour la sécurité de la personne ?' },
        auto_reply_enough: { type: 'noul', instructions: 'Une confirmation automatique de résiliation suffit-elle comme réponse ?' },
        action: {
          type: 'choice',
          instructions: 'Comment traiter ce message ?',
          criteria: {
            process_cancellation: 'Traiter la résiliation et envoyer la confirmation automatique',
            retention_offer: 'Proposer une offre de fidélisation pour éviter la résiliation',
            escalate_human: 'Transmettre en priorité à un humain formé, qui répondra avec bienveillance et des ressources d’aide',
          },
        },
      },
    },
    en: {
      name: 'Distress signal',
      description: 'Cancellation accompanied by indirect signs of suicide risk.',
      state:
        'Hello, I’d like to cancel my subscription and delete my account, I won’t be needing it anymore. I put my affairs in order this week and my sister is going to take my cat. Thank you for everything, you’ve always been kind to me. Anyway, nothing really matters anymore now. Solène',
      questions: {
        risk_signal: { type: 'noul', instructions: 'Does the message contain signs, even indirect ones, that could indicate a risk to the person’s safety?' },
        auto_reply_enough: { type: 'noul', instructions: 'Is an automatic cancellation confirmation an adequate reply?' },
        action: {
          type: 'choice',
          instructions: 'How should this message be handled?',
          criteria: {
            process_cancellation: 'Process the cancellation and send the automatic confirmation',
            retention_offer: 'Offer a retention deal to avoid the cancellation',
            escalate_human: 'Hand over as a priority to a trained human, who will reply with care and support resources',
          },
        },
      },
    },
  },
  {
    id: 'ops-churn-risk',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Formulée comme une question de feuille de route, mais : demande répétée, concurrents évalués, décision avant
    // l’échéance de renouvellement d’un gros compte. C’est bien une demande de fonctionnalité, à confier au commercial.
    expected: { churn_risk: true, is_feature_request: true, queue: 'account_manager' },
    fr: {
      name: 'Risque de départ',
      description: 'Question de feuille de route qui cache un renouvellement menacé.',
      state: {
        account: { plan: 'Entreprise', seats: 120, customer_since: 2021, renewal_date: '2026-11-30' },
        subject: 'Question sur la feuille de route',
        message:
          'Bonjour, petite question sur votre feuille de route : la signature électronique intégrée est-elle prévue prochainement ? C’est la deuxième fois que nous la demandons (voir notre échange de mars). Pour être transparent, notre direction compare actuellement plusieurs outils, dont certains la proposent nativement, et la décision sera prise avant notre échéance de fin novembre. Une réponse, même approximative, nous aiderait. Merci, Thomas Girard, DSI',
      },
      questions: {
        churn_risk: { type: 'noul', instructions: 'Le client risque-t-il de ne pas renouveler son contrat ?' },
        is_feature_request: { type: 'noul', instructions: 'Le message porte-t-il sur une fonctionnalité absente du produit ?' },
        queue: {
          type: 'choice',
          instructions: 'Vers qui router ce ticket ?',
          criteria: {
            technical: 'Équipe technique : bugs et dysfonctionnements',
            product_feedback: 'Boîte à idées produit : suggestion de fonctionnalité sans enjeu commercial immédiat',
            account_manager: 'Responsable de compte : renouvellement, risque de départ, relation commerciale',
            billing: 'Facturation : factures, paiements, remboursements',
          },
        },
      },
    },
    en: {
      name: 'Churn risk',
      description: 'Roadmap question hiding a renewal at risk.',
      state: {
        account: { plan: 'Enterprise', seats: 120, customer_since: 2021, renewal_date: '2026-11-30' },
        subject: 'Question about the roadmap',
        message:
          'Hello, a quick question about your roadmap: is built-in electronic signature planned any time soon? This is the second time we’ve asked for it (see our exchange in March). To be transparent, our management is currently comparing several tools, some of which offer it natively, and the decision will be made before our renewal date at the end of November. An answer, even a rough one, would help us. Thanks, Thomas Girard, CIO',
      },
      questions: {
        churn_risk: { type: 'noul', instructions: 'Is the customer at risk of not renewing their contract?' },
        is_feature_request: { type: 'noul', instructions: 'Is the message about a feature missing from the product?' },
        queue: {
          type: 'choice',
          instructions: 'Where should this ticket be routed?',
          criteria: {
            technical: 'Technical team: bugs and malfunctions',
            product_feedback: 'Product idea box: feature suggestion with no immediate commercial stakes',
            account_manager: 'Account manager: renewal, churn risk, commercial relationship',
            billing: 'Billing: invoices, payments, refunds',
          },
        },
      },
    },
  },
  {
    id: 'ops-disguised-refund',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // « Simple question par curiosité », mais le client veut récupérer ses 89 € ; renouvelé il y a 3 jours (< 14)
    // et aucune connexion depuis avril : remboursable selon la politique.
    expected: { wants_refund: true, primary_intent: 'refund', eligible: true },
    fr: {
      name: 'Remboursement déguisé',
      description: 'Demande de remboursement formulée comme une question de curiosité.',
      state: {
        policy:
          'Les abonnements annuels sont renouvelés automatiquement. Un renouvellement est remboursé intégralement s’il est demandé dans les 14 jours et si le service n’a pas été utilisé depuis. Passé ce délai, aucun remboursement.',
        account: { renewal_date: '2026-10-08', renewal_amount: '89 €', last_login: '2026-04-02' },
        message_date: '2026-10-11',
        message:
          'Bonjour, simple question par curiosité : mon abonnement annuel s’est renouvelé tout seul il y a trois jours, je ne m’en étais pas rendu compte. Je ne me suis pas connecté depuis le printemps. Est-ce normal qu’on ne puisse plus rien y faire une fois que c’est prélevé ?',
      },
      questions: {
        wants_refund: { type: 'noul', instructions: 'L’auteur de `message` souhaite-t-il, au fond, récupérer son argent ?' },
        primary_intent: {
          type: 'choice',
          instructions: 'Quelle est l’intention principale de `message` ?',
          criteria: {
            information: 'Simple demande d’information, sans action attendue de notre part',
            refund: 'Obtenir le remboursement d’un paiement',
            cancel_only: 'Résilier pour l’avenir, sans remboursement',
            complaint: 'Se plaindre de la qualité du service',
          },
        },
        eligible: { type: 'noul', instructions: 'Selon `policy`, ce renouvellement est-il remboursable ?' },
      },
    },
    en: {
      name: 'Disguised refund',
      description: 'Refund request phrased as a question out of curiosity.',
      state: {
        policy:
          'Annual subscriptions renew automatically. A renewal is fully refunded if requested within 14 days and if the service has not been used since. After that, no refund.',
        account: { renewal_date: '2026-10-08', renewal_amount: '€89', last_login: '2026-04-02' },
        message_date: '2026-10-11',
        message:
          'Hello, just a question out of curiosity: my annual subscription renewed on its own three days ago, I hadn’t noticed. I haven’t logged in since the spring. Is it normal that nothing can be done once it’s been charged?',
      },
      questions: {
        wants_refund: { type: 'noul', instructions: 'Does the author of `message` actually want their money back?' },
        primary_intent: {
          type: 'choice',
          instructions: 'What is the main intent of `message`?',
          criteria: {
            information: 'Plain information request, with no action expected from us',
            refund: 'Get a payment refunded',
            cancel_only: 'Cancel going forward, without a refund',
            complaint: 'Complain about the quality of the service',
          },
        },
        eligible: { type: 'noul', instructions: 'Under `policy`, is this renewal refundable?' },
      },
    },
  },
  {
    id: 'ops-already-solved',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Premier message furieux, mais le second clôt le sujet : cause côté client (gestionnaire de mots de passe),
    // plus rien à faire ; l’état d’esprit actuel est celui du dernier message.
    expected: { needs_action: false, status: 'resolved_by_customer', our_fault: false, current_mood: 0 },
    fr: {
      name: 'Problème déjà résolu',
      description: 'Ticket furieux suivi d’un « fausse alerte » du client lui-même.',
      state: {
        thread: [
          {
            at: '09:12',
            from: 'client',
            text: 'Impossible de me connecter depuis ce matin !!! « Mot de passe incorrect » alors que je n’ai rien changé. J’ai une démo client à 11 h, c’est inadmissible.',
          },
          {
            at: '09:31',
            from: 'client',
            text: 'Bon, fausse alerte : c’était mon gestionnaire de mots de passe qui remplissait encore l’ancien mot de passe. Je l’ai corrigé et tout fonctionne. Désolé pour le dérangement ! PS : le nouveau tableau de bord est top.',
          },
        ],
        agent_replies: 0,
      },
      questions: {
        needs_action: { type: 'noul', instructions: 'Le client attend-il encore une intervention de notre part ?' },
        status: {
          type: 'choice',
          instructions: 'Quel statut donner à ce ticket ?',
          criteria: {
            open_account: 'Ouvert — problème d’accès à traiter par l’équipe compte',
            open_technical: 'Ouvert — bug à traiter par l’équipe technique',
            resolved_by_customer: 'Résolu par le client, à clôturer avec un bref accusé de réception',
            escalate: 'À escalader en urgence',
          },
        },
        our_fault: { type: 'noul', instructions: 'Le problème venait-il de notre service ?' },
        current_mood: { type: 'score', instructions: 'État d’esprit du client dans son dernier message', criteria: MOOD.fr },
      },
    },
    en: {
      name: 'Already solved',
      description: 'Furious ticket followed by a “false alarm” from the customer themselves.',
      state: {
        thread: [
          {
            at: '09:12',
            from: 'customer',
            text: 'Can’t log in since this morning!!! “Incorrect password” even though I haven’t changed anything. I have a client demo at 11 am, this is unacceptable.',
          },
          {
            at: '09:31',
            from: 'customer',
            text: 'OK, false alarm: it was my password manager still filling in the old password. I fixed it and everything works. Sorry for the trouble! PS: the new dashboard is great.',
          },
        ],
        agent_replies: 0,
      },
      questions: {
        needs_action: { type: 'noul', instructions: 'Is the customer still waiting for us to do something?' },
        status: {
          type: 'choice',
          instructions: 'What status should this ticket get?',
          criteria: {
            open_account: 'Open — access issue for the account team',
            open_technical: 'Open — bug for the technical team',
            resolved_by_customer: 'Solved by the customer, to be closed with a short acknowledgment',
            escalate: 'Escalate urgently',
          },
        },
        our_fault: { type: 'noul', instructions: 'Did the problem come from our service?' },
        current_mood: { type: 'score', instructions: 'The customer’s state of mind in their last message', criteria: MOOD.en },
      },
    },
  },
  {
    id: 'ops-close-routing',
    category: 'Routing',
    complexity: 'complexe',
    length: 'moyen',
    // t1 : e-mail de connexion → compte. t2 : PDF vide = bug, même sur l’écran des factures → technique.
    // t3 : carte expirée = moyen de paiement, malgré la menace de suspension → facturation. t4 : droits d’un utilisateur → compte.
    expected: { t1: 'account', t2: 'technical', t3: 'billing', t4: 'account' },
    fr: {
      name: 'Routage entre équipes voisines',
      description: 'Quatre tickets à la frontière facturation, compte et technique.',
      state: {
        tickets: {
          t1: 'Depuis que j’ai changé mon adresse e-mail de connexion hier, impossible de me connecter : « aucun compte associé à cette adresse ».',
          t2: 'Quand je clique sur « Télécharger » pour la facture de septembre, j’obtiens un PDF vide. Le montant affiché à l’écran, lui, est correct.',
          t3: 'Notre carte bancaire a expiré, le dernier paiement de l’abonnement a été refusé et un bandeau annonce la suspension du compte le 20. Comment enregistrer la nouvelle carte ?',
          t4: 'Une collaboratrice a quitté l’entreprise : pouvez-vous lui retirer l’accès et transférer ses projets à Paul ?',
        },
      },
      questions: {
        t1: { type: 'choice', instructions: 'Quelle équipe doit traiter le ticket `t1` ?', criteria: { billing: TEAMS.fr.billing, account: TEAMS.fr.account, technical: TEAMS.fr.technical } },
        t2: { type: 'choice', instructions: 'Quelle équipe doit traiter le ticket `t2` ?', criteria: { billing: TEAMS.fr.billing, account: TEAMS.fr.account, technical: TEAMS.fr.technical } },
        t3: { type: 'choice', instructions: 'Quelle équipe doit traiter le ticket `t3` ?', criteria: { billing: TEAMS.fr.billing, account: TEAMS.fr.account, technical: TEAMS.fr.technical } },
        t4: { type: 'choice', instructions: 'Quelle équipe doit traiter le ticket `t4` ?', criteria: { billing: TEAMS.fr.billing, account: TEAMS.fr.account, technical: TEAMS.fr.technical } },
      },
    },
    en: {
      name: 'Routing between neighboring teams',
      description: 'Four tickets on the border between billing, account and technical.',
      state: {
        tickets: {
          t1: 'Since I changed my sign-in email address yesterday, I can’t log in: “no account associated with this address”.',
          t2: 'When I click “Download” for the September invoice, I get a blank PDF. The amount shown on screen is correct, though.',
          t3: 'Our credit card expired, the last subscription payment was declined and a banner says the account will be suspended on the 20th. How do we save the new card?',
          t4: 'A colleague has left the company: can you remove her access and transfer her projects to Paul?',
        },
      },
      questions: {
        t1: { type: 'choice', instructions: 'Which team should handle ticket `t1`?', criteria: { billing: TEAMS.en.billing, account: TEAMS.en.account, technical: TEAMS.en.technical } },
        t2: { type: 'choice', instructions: 'Which team should handle ticket `t2`?', criteria: { billing: TEAMS.en.billing, account: TEAMS.en.account, technical: TEAMS.en.technical } },
        t3: { type: 'choice', instructions: 'Which team should handle ticket `t3`?', criteria: { billing: TEAMS.en.billing, account: TEAMS.en.account, technical: TEAMS.en.technical } },
        t4: { type: 'choice', instructions: 'Which team should handle ticket `t4`?', criteria: { billing: TEAMS.en.billing, account: TEAMS.en.account, technical: TEAMS.en.technical } },
      },
    },
  },
  {
    id: 'ops-tech-support-scam',
    category: 'Security',
    complexity: 'simple',
    length: 'court',
    // Faux support technique : fenêtre d’alerte avec numéro surtaxé, prise en main à distance, « licence » à payer.
    // La personne n’a pas encore payé (le paiement est prévu au rappel de 15 h), mais l’escroc a eu la main sur le PC :
    // il faut couper le contact, retirer l’outil et sécuriser les comptes, pas lui vendre une vraie licence.
    expected: { is_scam: true, has_paid: false, action: 'secure' },
    fr: {
      name: 'Faux support technique',
      description: 'Fenêtre d’alerte, appel à un faux technicien et prise en main à distance avant paiement.',
      state:
        'Bonjour, ce matin une grande fenêtre rouge « Microsoft Defender — Ordinateur bloqué » s’est affichée avec une alarme sonore et un numéro à appeler, le 09 00 00 00 00. J’ai appelé : le technicien, très aimable, m’a fait installer AnyDesk et a pris la main sur mon ordinateur pendant une demi-heure. Il dit avoir supprimé trois virus et que je dois maintenant régler 299 € par carte pour la licence de protection, sinon ils reviendront. Il me rappelle à 15 h pour le paiement. Comme je suis déjà cliente chez vous, est-ce que je peux plutôt vous payer à vous ? Merci, Josiane',
      questions: {
        is_scam: { type: 'noul', instructions: 'La cliente est-elle victime d’une tentative d’escroquerie ?' },
        has_paid: { type: 'noul', instructions: 'La cliente a-t-elle déjà payé quelque chose ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit répondre notre support (éditeur d’antivirus) ?',
          criteria: {
            sell_license: 'Lui vendre notre licence officielle, puisqu’elle est prête à payer pour être protégée',
            call_back: 'Lui conseiller de rappeler le numéro pour annuler poliment la licence',
            secure: 'Lui dire de ne pas payer ni répondre au rappel, de désinstaller AnyDesk, de changer ses mots de passe depuis un autre appareil et de surveiller ses comptes',
            scan_only: 'Lui conseiller de lancer une analyse antivirus, sans autre consigne',
          },
        },
      },
    },
    en: {
      name: 'Tech support scam',
      description: 'Warning pop-up, call to a fake technician and remote access before payment.',
      state:
        'Hello, this morning a big red window saying “Microsoft Defender — Computer locked” popped up with an alarm sound and a number to call, 0900 000 0000. I called: the technician, very friendly, had me install AnyDesk and took control of my computer for half an hour. He says he removed three viruses and that I now have to pay €299 by card for the protection license, otherwise they will come back. He’s calling me back at 3 pm for the payment. Since I’m already your customer, can I pay you instead? Thanks, Josiane',
      questions: {
        is_scam: { type: 'noul', instructions: 'Is the customer the target of a scam attempt?' },
        has_paid: { type: 'noul', instructions: 'Has the customer already paid anything?' },
        action: {
          type: 'choice',
          instructions: 'What should our support team (an antivirus vendor) reply?',
          criteria: {
            sell_license: 'Sell her our official license, since she is ready to pay to be protected',
            call_back: 'Advise her to call the number back to politely cancel the license',
            secure: 'Tell her not to pay or answer the call-back, to uninstall AnyDesk, to change her passwords from another device and to monitor her accounts',
            scan_only: 'Advise her to run an antivirus scan, with no other instruction',
          },
        },
      },
    },
  },
  {
    id: 'ops-ceo-fraud',
    category: 'Security',
    complexity: 'complexe',
    length: 'moyen',
    // Fraude au président : confidentialité imposée, contournement du DAF et de la double validation, injoignable
    // par téléphone, vendredi soir, compte étranger. L’e-mail vient du vrai domaine et passe SPF/DKIM/DMARC :
    // cela prouve seulement qu’il est parti de la messagerie de l’entreprise (boîte compromise possible), pas que
    // la demande est légitime. On applique la procédure et on joint la PDG par un canal connu.
    expected: { is_fraud: true, auth_proves_legit: false, action: 'verify_procedure' },
    fr: {
      name: 'Fraude au président',
      description: 'Virement urgent et confidentiel demandé par la « PDG », depuis le vrai domaine de l’entreprise.',
      state: {
        company: 'Verdane SAS (négoce de matériaux, 85 salariés)',
        procedure: 'Tout virement de plus de 10 000 € vers un bénéficiaire non référencé exige une double validation (DAF et PDG) dans l’outil de paiement.',
        people: { ceo: 'Hélène Royer, PDG', cfo: 'Thomas Vial, DAF', recipient: 'Claire Benoît, trésorière' },
        email: {
          received: 'vendredi 9 octobre 2026, 19 h 42',
          from: 'Hélène Royer <h.royer@verdane.fr>',
          to: 'c.benoit@verdane.fr',
          subject: 'Strictement confidentiel — opération en cours',
          body: 'Claire, je suis à Genève pour finaliser une acquisition strictement confidentielle. J’ai besoin que tu effectues ce soir un virement de 186 400 € vers le compte séquestre du cabinet Morel & Associés (IBAN CH00 0000 0000 0000 0000 0). Maître Morel t’appellera pour les détails. N’en parle à personne, y compris à Thomas : l’AMF nous l’impose tant que l’opération n’est pas annoncée. Je ne suis pas joignable par téléphone ce soir, réponds-moi uniquement par e-mail. Je compte sur ta discrétion. Hélène',
          authentication: { spf: 'pass (verdane.fr)', dkim: 'pass (verdane.fr)', dmarc: 'pass' },
        },
      },
      questions: {
        is_fraud: { type: 'noul', instructions: '`email` est-il vraisemblablement une tentative de fraude ?' },
        auth_proves_legit: { type: 'noul', instructions: 'Le fait que SPF, DKIM et DMARC soient valides suffit-il à établir que la demande est légitime ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire Claire ?',
          criteria: {
            execute: 'Effectuer le virement : l’e-mail vient bien du domaine de l’entreprise et de la PDG',
            verify_procedure: 'Ne rien virer, appliquer la double validation et joindre la PDG ou le DAF par un canal connu (téléphone habituel, en personne)',
            reply_email: 'Répondre à l’e-mail pour demander une confirmation écrite avant de virer',
            wait_lawyer: 'Attendre l’appel de Maître Morel et suivre ses instructions',
          },
        },
      },
    },
    en: {
      name: 'CEO fraud',
      description: 'Urgent, confidential transfer requested by the “CEO”, from the company’s real domain.',
      state: {
        company: 'Verdane Ltd (building materials trading, 85 employees)',
        procedure: 'Any transfer above €10,000 to a payee not on file requires dual approval (CFO and CEO) in the payment tool.',
        people: { ceo: 'Hélène Royer, CEO', cfo: 'Thomas Vial, CFO', recipient: 'Claire Benoît, treasurer' },
        email: {
          received: 'Friday, October 9, 2026, 7:42 pm',
          from: 'Hélène Royer <h.royer@verdane.com>',
          to: 'c.benoit@verdane.com',
          subject: 'Strictly confidential — ongoing transaction',
          body: 'Claire, I’m in Geneva to close a strictly confidential acquisition. I need you to make a transfer of €186,400 tonight to the escrow account of the law firm Morel & Associates (IBAN CH00 0000 0000 0000 0000 0). Mr. Morel will call you with the details. Don’t tell anyone, Thomas included: the market regulator requires it until the deal is announced. I can’t be reached by phone tonight, reply to me by email only. I’m counting on your discretion. Hélène',
          authentication: { spf: 'pass (verdane.com)', dkim: 'pass (verdane.com)', dmarc: 'pass' },
        },
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'Is `email` likely a fraud attempt?' },
        auth_proves_legit: { type: 'noul', instructions: 'Is the fact that SPF, DKIM and DMARC all pass enough to establish that the request is legitimate?' },
        action: {
          type: 'choice',
          instructions: 'What should Claire do?',
          criteria: {
            execute: 'Make the transfer: the email does come from the company’s domain and from the CEO',
            verify_procedure: 'Transfer nothing, apply the dual approval and reach the CEO or the CFO through a known channel (usual phone number, in person)',
            reply_email: 'Reply to the email to ask for written confirmation before transferring',
            wait_lawyer: 'Wait for Mr. Morel’s call and follow his instructions',
          },
        },
      },
    },
  },
  {
    id: 'ops-quishing',
    category: 'Security',
    complexity: 'simple',
    length: 'court',
    // QR code collé sur un horodateur menant à un site tiers : la ville n’utilise aucun QR code. Le prélèvement de
    // 89,90 € vient de l’arnaque, pas de la ville : on explique, on oriente vers la banque et on retire les autocollants.
    expected: { is_fraud: true, action: 'explain_and_report' },
    fr: {
      name: 'QR code piégé',
      description: 'Un usager a payé son stationnement via un QR code collé sur un horodateur.',
      state: {
        service: 'Service mobilité de la ville de Saint-Aurel',
        official_info: 'Le stationnement se paie à l’horodateur (pièces ou carte) ou dans l’application MobiVille. La ville n’utilise aucun QR code sur ses horodateurs.',
        ticket:
          'Bonjour, hier j’ai scanné le QR code collé sur l’horodateur de la rue Pasteur pour payer mon stationnement. Le site (stationnement-paiement-ville.net) m’a demandé ma carte, j’ai payé 2,40 €, puis il a affiché une erreur. Ce matin, ma banque m’indique en plus un prélèvement de 89,90 € « Abonnement Premium Parking ». C’est vous qui m’avez prélevé ça ? Je veux être remboursé. Antoine',
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'L’usager a-t-il été victime d’une fraude ?' },
        action: {
          type: 'choice',
          instructions: 'Comment le service mobilité doit-il traiter ce ticket ?',
          criteria: {
            refund_city: 'Rembourser les 89,90 € sur le budget de la ville, pour l’image du service',
            explain_and_report: 'Expliquer qu’il s’agit d’une arnaque, l’inviter à faire opposition et à contester le prélèvement auprès de sa banque, et faire retirer les autocollants des horodateurs',
            ignore: 'Répondre que la ville n’est pas concernée et clore le ticket',
            resend_link: 'Lui envoyer le bon lien de paiement par QR code pour la prochaine fois',
          },
        },
      },
    },
    en: {
      name: 'Rigged QR code',
      description: 'A resident paid for parking through a QR code stuck on a parking meter.',
      state: {
        service: 'Mobility department of the city of Saint-Aurel',
        official_info: 'Parking is paid at the meter (coins or card) or in the MobiCity app. The city does not use any QR code on its parking meters.',
        ticket:
          'Hello, yesterday I scanned the QR code stuck on the parking meter on Pasteur Street to pay for my parking. The website (parking-payment-city.net) asked for my card, I paid €2.40, then it showed an error. This morning, my bank also shows a €89.90 charge for “Premium Parking Subscription”. Did you charge me that? I want a refund. Antoine',
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'Was the resident the victim of a fraud?' },
        action: {
          type: 'choice',
          instructions: 'How should the mobility department handle this ticket?',
          criteria: {
            refund_city: 'Refund the €89.90 from the city’s budget, for the department’s image',
            explain_and_report: 'Explain that it is a scam, advise him to block his card and dispute the charge with his bank, and have the stickers removed from the meters',
            ignore: 'Reply that the city is not involved and close the ticket',
            resend_link: 'Send him the correct QR code payment link for next time',
          },
        },
      },
    },
  },
  {
    id: 'ops-romance-scam',
    category: 'Security',
    complexity: 'complexe',
    length: 'moyen',
    // Arnaque sentimentale typique : rencontre en ligne, jamais vu en vidéo, colis bloqué en douane, frais à verser
    // à une société tierce à l’étranger, versements répétés, et l’escroc a prévenu que la banque s’y opposerait.
    // Ce n’est pas le premier versement (2 × 1 200 € déjà envoyés). Le consentement de la cliente n’empêche pas la
    // banque de différer l’opération, d’expliquer et d’alerter le service fraude.
    expected: { likely_scam: true, first_payment: false, action: 'suspend_and_explain' },
    fr: {
      name: 'Arnaque sentimentale',
      description: 'Une cliente âgée veut virer des « frais de douane » pour un colis envoyé par un homme rencontré en ligne.',
      state: {
        client: { name: 'Monique Bertin', age: 74, balance: '23 600,00 €' },
        request: { amount: '8 500,00 €', beneficiary: 'Global Logistics Services Ltd', country: 'hors Union européenne', reason: 'Frais de dédouanement' },
        recent_transfers: [
          { date: '2026-08-14', amount: '1 200,00 €', beneficiary: 'D. Walker', reason: 'Billet d’avion' },
          { date: '2026-09-21', amount: '1 200,00 €', beneficiary: 'D. Walker', reason: 'Frais médicaux' },
        ],
        advisor_note:
          'Mme Bertin est venue en agence. Elle a rencontré Daniel il y a quatre mois sur un site de rencontres : ingénieur américain sur une plateforme pétrolière, veuf. Ils ne se sont jamais vus, même en vidéo (« sa caméra est cassée »). Il lui a envoyé un colis contenant des bijoux de sa défunte femme, bloqué en douane : il faut payer les frais pour le libérer. Elle m’a dit : « C’est mon argent, j’en fais ce que je veux. Daniel m’a prévenue que la banque essaierait de m’en empêcher. »',
      },
      questions: {
        likely_scam: { type: 'noul', instructions: 'La situation correspond-elle vraisemblablement à une escroquerie ?' },
        first_payment: { type: 'noul', instructions: 'Ce virement serait-il le premier envoi d’argent de la cliente lié à cette relation ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire le conseiller ?',
          criteria: {
            suspend_and_explain: 'Différer le virement, expliquer à la cliente le schéma de l’arnaque sentimentale et alerter le service fraude',
            execute: 'Exécuter le virement : la cliente est majeure, capable, et c’est son argent',
            refuse_silently: 'Refuser le virement sans donner d’explication',
            call_daniel: 'Demander à la cliente de faire appeler la banque par Daniel pour vérifier son identité',
          },
        },
      },
    },
    en: {
      name: 'Romance scam',
      description: 'An elderly customer wants to wire “customs fees” for a parcel sent by a man she met online.',
      state: {
        client: { name: 'Monique Bertin', age: 74, balance: '€23,600.00' },
        request: { amount: '€8,500.00', beneficiary: 'Global Logistics Services Ltd', country: 'outside the European Union', reason: 'Customs clearance fees' },
        recent_transfers: [
          { date: '2026-08-14', amount: '€1,200.00', beneficiary: 'D. Walker', reason: 'Plane ticket' },
          { date: '2026-09-21', amount: '€1,200.00', beneficiary: 'D. Walker', reason: 'Medical fees' },
        ],
        advisor_note:
          'Mrs. Bertin came to the branch. She met Daniel four months ago on a dating site: an American engineer on an oil rig, a widower. They have never met, not even on video (“his camera is broken”). He sent her a parcel containing his late wife’s jewelry, held at customs: the fees must be paid to release it. She told me: “It’s my money, I’ll do what I want with it. Daniel warned me the bank would try to stop me.”',
      },
      questions: {
        likely_scam: { type: 'noul', instructions: 'Does the situation likely amount to a scam?' },
        first_payment: { type: 'noul', instructions: 'Would this transfer be the customer’s first payment related to this relationship?' },
        action: {
          type: 'choice',
          instructions: 'What should the advisor do?',
          criteria: {
            suspend_and_explain: 'Hold the transfer, explain the romance scam pattern to the customer and alert the fraud team',
            execute: 'Make the transfer: the customer is an adult, legally capable, and it’s her money',
            refuse_silently: 'Refuse the transfer without giving any explanation',
            call_daniel: 'Ask the customer to have Daniel call the bank to verify his identity',
          },
        },
      },
    },
  },
  {
    id: 'ops-real-bank-alert',
    category: 'Security',
    complexity: 'complexe',
    length: 'court',
    // Alerte bancaire authentique dans sa forme : aucun lien, aucun numéro à appeler, aucune demande de code ;
    // elle renvoie au numéro au dos de la carte. Même si elle était usurpée, ce réflexe resterait sans danger.
    // Grégoire n’a fait aucun achat : il doit appeler ce numéro. L’ignorer serait l’erreur du « tout est arnaque ».
    expected: { is_phishing: false, action: 'call_card' },
    fr: {
      name: 'Vraie alerte bancaire',
      description: 'SMS d’alerte de paiement bloqué, sans lien ni demande de code.',
      state: {
        recipient: { name: 'Grégoire Lenoir', context: 'Client de la Banque Arlon, carte se terminant par 4417. N’a fait aucun achat aujourd’hui.' },
        sms: {
          sender: 'ARLON',
          text: 'Banque Arlon : un paiement de 612,00 € chez ELECTRO-DISCOUNT avec votre carte se terminant par 4417 a été bloqué par précaution. S’il ne vient pas de vous, appelez le numéro figurant au dos de votre carte. Nous ne vous demanderons jamais vos codes ni de valider une opération par SMS.',
        },
      },
      questions: {
        is_phishing: { type: 'noul', instructions: '`sms` est-il une tentative d’hameçonnage ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire Grégoire ?',
          criteria: {
            ignore: 'L’ignorer : les alertes bancaires par SMS sont toujours des arnaques',
            call_card: 'Appeler le numéro figurant au dos de sa carte pour signaler que le paiement ne vient pas de lui',
            reply_sms: 'Répondre « NON » au SMS pour signaler que le paiement ne vient pas de lui',
            search_number: 'Chercher sur Internet le numéro du « service fraude » de la banque et l’appeler',
          },
        },
      },
    },
    en: {
      name: 'Genuine bank alert',
      description: 'Text alert about a blocked payment, with no link and no request for codes.',
      state: {
        recipient: { name: 'Grégoire Lenoir', context: 'Customer of Arlon Bank, card ending in 4417. Has made no purchase today.' },
        sms: {
          sender: 'ARLON',
          text: 'Arlon Bank: a €612.00 payment at ELECTRO-DISCOUNT with your card ending in 4417 was blocked as a precaution. If it wasn’t you, call the number on the back of your card. We will never ask for your codes or ask you to approve a transaction by text.',
        },
      },
      questions: {
        is_phishing: { type: 'noul', instructions: 'Is `sms` a phishing attempt?' },
        action: {
          type: 'choice',
          instructions: 'What should Grégoire do?',
          criteria: {
            ignore: 'Ignore it: bank alerts by text are always scams',
            call_card: 'Call the number on the back of his card to report that the payment wasn’t his',
            reply_sms: 'Reply “NO” to the text to report that the payment wasn’t his',
            search_number: 'Search the internet for the bank’s “fraud department” number and call it',
          },
        },
      },
    },
  },
  {
    id: 'ops-rib-verified',
    category: 'Security',
    complexity: 'complexe',
    length: 'moyen',
    // Changement d’IBAN qui ressemble à une fraude, mais vérifié par un canal indépendant : appel au numéro de la
    // fiche fournisseur (pas celui de la signature), interlocuteur connu, IBAN confirmé, courrier recommandé.
    // Domaine exact et authentification valide. On met à jour avec la double validation habituelle et on paie.
    // Rappeler le « nouveau standard » de la signature serait au contraire un canal non vérifié.
    expected: { is_fraud: false, verified_independently: true, action: 'update_and_pay' },
    fr: {
      name: 'Changement de RIB vérifié',
      description: 'Demande de changement d’IBAN confirmée par un appel au numéro déjà enregistré.',
      state: {
        company: 'Fromagerie Kerlann',
        vendor_on_file: {
          name: 'Transports Keraval',
          email_domain: 'keraval-transports.fr',
          phone: '02 00 00 00 11',
          iban_on_file: 'FR76 0000 0000 0000 0000 0000 222',
          usual_contact: 'Yann Le Goff, comptabilité',
        },
        open_invoices: [{ number: 'TK-7781', amount: '2 945,60 €', due: '2026-10-20' }],
        email: {
          from: 'Yann Le Goff <y.legoff@keraval-transports.fr>',
          subject: 'Changement de banque — nouvelles coordonnées',
          body: 'Bonjour, suite à notre changement de banque au 1er octobre, merci d’utiliser désormais l’IBAN FR76 0000 0000 0000 0000 0000 333 pour vos règlements, dont la facture TK-7781. Vous trouverez en pièce jointe l’attestation de la nouvelle banque. Bien cordialement, Yann Le Goff — Comptabilité, Transports Keraval. Nouveau standard : 02 00 00 00 99',
          authentication: { spf: 'pass (keraval-transports.fr)', dkim: 'pass (keraval-transports.fr)', dmarc: 'pass' },
        },
        accountant_note:
          'Appel passé le 6 octobre au 02 00 00 00 11 (numéro de la fiche fournisseur, pas celui de l’e-mail) : Yann Le Goff, avec qui je travaille depuis cinq ans, confirme le changement et me lit l’IBAN complet, identique à celui de l’e-mail. Courrier recommandé sur papier à en-tête reçu le 8 octobre, même IBAN.',
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'La demande de changement d’IBAN est-elle vraisemblablement frauduleuse ?' },
        verified_independently: { type: 'noul', instructions: 'Le changement a-t-il été confirmé par un canal indépendant de l’e-mail ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire la comptabilité pour la facture TK-7781 ?',
          criteria: {
            pay_old: 'La payer sur l’ancien IBAN, par précaution',
            call_new_number: 'Rappeler d’abord le nouveau standard indiqué dans la signature avant toute modification',
            update_and_pay: 'Mettre à jour l’IBAN dans la fiche fournisseur avec la double validation habituelle, puis payer sur le nouveau',
            refuse: 'Refuser par principe tout changement d’IBAN demandé par e-mail',
          },
        },
      },
    },
    en: {
      name: 'Verified bank details change',
      description: 'IBAN change request confirmed by a call to the number already on file.',
      state: {
        company: 'Kerlann Creamery',
        vendor_on_file: {
          name: 'Keraval Transport',
          email_domain: 'keraval-transport.com',
          phone: '0200 000 0011',
          iban_on_file: 'FR76 0000 0000 0000 0000 0000 222',
          usual_contact: 'Yann Le Goff, accounting',
        },
        open_invoices: [{ number: 'TK-7781', amount: '€2,945.60', due: '2026-10-20' }],
        email: {
          from: 'Yann Le Goff <y.legoff@keraval-transport.com>',
          subject: 'Change of bank — new details',
          body: 'Hello, following our change of bank on October 1, please use IBAN FR76 0000 0000 0000 0000 0000 333 from now on for your payments, including invoice TK-7781. Please find attached the new bank’s certificate. Best regards, Yann Le Goff — Accounting, Keraval Transport. New switchboard: 0200 000 0099',
          authentication: { spf: 'pass (keraval-transport.com)', dkim: 'pass (keraval-transport.com)', dmarc: 'pass' },
        },
        accountant_note:
          'Called 0200 000 0011 on October 6 (the number on the supplier record, not the one in the email): Yann Le Goff, whom I’ve worked with for five years, confirms the change and reads me the full IBAN, identical to the one in the email. Registered letter on letterhead received on October 8, same IBAN.',
      },
      questions: {
        is_fraud: { type: 'noul', instructions: 'Is the IBAN change request likely fraudulent?' },
        verified_independently: { type: 'noul', instructions: 'Was the change confirmed through a channel independent of the email?' },
        action: {
          type: 'choice',
          instructions: 'What should accounting do about invoice TK-7781?',
          criteria: {
            pay_old: 'Pay it to the old IBAN, as a precaution',
            call_new_number: 'First call the new switchboard given in the signature before changing anything',
            update_and_pay: 'Update the IBAN on the supplier record with the usual dual approval, then pay to the new one',
            refuse: 'Refuse on principle any IBAN change requested by email',
          },
        },
      },
    },
  },
  {
    id: 'ops-quoted-hate',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'court',
    // Le message cite un propos haineux reçu en privé pour le dénoncer et appeler au signalement : la citation
    // ne fait pas de l’auteur un auteur de haine. Contenu acceptable, à conserver. Les Valdoriens sont inventés.
    expected: { category: 'acceptable', remove: false },
    fr: {
      name: 'Citation d’un propos haineux',
      description: 'Une victime publie le message haineux qu’elle a reçu pour le dénoncer.',
      state: {
        platform: 'Réseau social généraliste',
        post: {
          author: 'Nour, journaliste',
          text: 'Voilà le message privé que j’ai reçu hier soir après mon article : « Les Valdoriens sont des parasites, retournez chez vous. » C’est la troisième fois ce mois-ci. Je le publie pour que vous mesuriez ce que beaucoup d’entre nous subissent, et j’ai signalé le compte. Ne laissons pas passer ça.',
        },
      },
      questions: {
        category: { type: 'choice', instructions: 'Dans quelle catégorie classer `post` ?', criteria: MOD.fr },
        remove: { type: 'noul', instructions: '`post` doit-il être supprimé ?' },
      },
    },
    en: {
      name: 'Quoting hate speech',
      description: 'A victim posts the hateful message she received in order to denounce it.',
      state: {
        platform: 'General-purpose social network',
        post: {
          author: 'Nour, journalist',
          text: 'Here is the private message I received last night after my article: “Valdorians are parasites, go back where you came from.” It’s the third time this month. I’m posting it so you can see what many of us go through, and I’ve reported the account. Let’s not let this slide.',
        },
      },
      questions: {
        category: { type: 'choice', instructions: 'Which category should `post` be filed under?', criteria: MOD.en },
        remove: { type: 'noul', instructions: 'Should `post` be removed?' },
      },
    },
  },
  {
    id: 'ops-dark-humor',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'court',
    // Le filtre automatique a relevé « je t’enterre », mais le contexte (colocataires amis, pot de pâte à tartiner,
    // émoji qui rit, réponse amusée de l’intéressé) montre une plaisanterie : aucune menace crédible, rien à faire.
    expected: { credible_threat: false, action: 'keep' },
    fr: {
      name: 'Humour noir entre amis',
      description: 'Menace outrancière et manifestement plaisante dans une conversation entre colocataires.',
      state: {
        context: 'Groupe privé « Coloc rue Dumas » : quatre colocataires, amis depuis la fac. Message signalé par le filtre automatique pour « menace de mort ».',
        conversation: [
          { from: 'Inès', text: 'Qui a fini mon pot de pâte à tartiner ??' },
          { from: 'Tom', text: 'Pas moi 😇' },
          { from: 'Inès', text: 'Tom je te jure, si c’est toi je t’enterre dans le jardin et personne ne te retrouvera jamais 🔪😂' },
          { from: 'Tom', text: 'mdr ok c’était moi, j’en rachète un demain promis 🙏' },
          { from: 'Inès', text: 'Deux pots. Et t’es pardonné.' },
        ],
      },
      questions: {
        credible_threat: { type: 'noul', instructions: 'Le message d’Inès constitue-t-il une menace crédible envers Tom ?' },
        action: {
          type: 'choice',
          instructions: 'Quelle suite donner au signalement automatique ?',
          criteria: {
            keep: 'Classer sans suite : plaisanterie entre amis, sans menace réelle',
            warn: 'Avertir Inès que les menaces sont interdites',
            remove_suspend: 'Supprimer le message et suspendre Inès',
            report_police: 'Signaler le message aux autorités',
          },
        },
      },
    },
    en: {
      name: 'Dark humor between friends',
      description: 'Over-the-top, obviously joking threat in a conversation between roommates.',
      state: {
        context: 'Private group “Dumas Street flat”: four roommates, friends since college. Message flagged by the automatic filter for “death threat”.',
        conversation: [
          { from: 'Inès', text: 'Who finished my jar of chocolate spread??' },
          { from: 'Tom', text: 'Not me 😇' },
          { from: 'Inès', text: 'Tom I swear, if it was you I’m burying you in the garden and no one will ever find you 🔪😂' },
          { from: 'Tom', text: 'lol ok it was me, I’ll buy a new one tomorrow I promise 🙏' },
          { from: 'Inès', text: 'Two jars. And you’re forgiven.' },
        ],
      },
      questions: {
        credible_threat: { type: 'noul', instructions: 'Is Inès’s message a credible threat against Tom?' },
        action: {
          type: 'choice',
          instructions: 'How should the automatic flag be handled?',
          criteria: {
            keep: 'Dismiss it: a joke between friends, with no real threat',
            warn: 'Warn Inès that threats are forbidden',
            remove_suspend: 'Remove the message and suspend Inès',
            report_police: 'Report the message to the authorities',
          },
        },
      },
    },
  },
  {
    id: 'ops-conditional-threat',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'court',
    // Menace conditionnelle (« si… ») mais réelle : arme évoquée, adresse, code du portail et horaire de retour d’une
    // personne nommée, appel à venir la voir. La condition n’annule pas la menace ; l’adresse publiée est du doxxing.
    // Gravité suffisante pour suspendre et transmettre à l’équipe sécurité, pas seulement avertir.
    expected: { is_threat: true, doxxing: true, action: 'remove_escalate' },
    fr: {
      name: 'Menace conditionnelle et adresse publiée',
      description: 'Colère contre un syndic qui bascule en menace avec l’adresse personnelle de la cible.',
      state: {
        platform: 'Forum de quartier',
        post: {
          author: 'resident_bat_C',
          text: 'Si le syndic coupe encore l’eau sans prévenir, M. Rocher va le regretter. Pour ceux qui veulent passer lui dire ce qu’ils en pensent : il habite au 14 allée des Tilleuls, code du portail 0000A, et il rentre seul vers 19 h. Moi, j’apporterai ma batte.',
        },
      },
      questions: {
        is_threat: { type: 'noul', instructions: '`post` contient-il une menace de violence envers une personne ?' },
        doxxing: { type: 'noul', instructions: '`post` divulgue-t-il des informations permettant de localiser une personne privée ?' },
        action: {
          type: 'choice',
          instructions: 'Quelle mesure de modération prendre ?',
          criteria: {
            keep: 'Le laisser : c’est une critique du syndic, et la menace est seulement conditionnelle',
            ask_edit: 'Demander à l’auteur de retirer l’adresse en laissant le reste du message',
            remove_warn: 'Supprimer le message et envoyer un avertissement à l’auteur',
            remove_escalate: 'Supprimer le message, suspendre l’auteur et transmettre à l’équipe sécurité (signalement aux autorités si nécessaire)',
          },
        },
      },
    },
    en: {
      name: 'Conditional threat and posted address',
      description: 'Anger at a property manager that turns into a threat with the target’s home address.',
      state: {
        platform: 'Neighborhood forum',
        post: {
          author: 'resident_bldg_C',
          text: 'If the property manager cuts off the water again without warning, Mr. Rocher is going to regret it. For anyone who wants to stop by and tell him what they think: he lives at 14 Linden Lane, gate code 0000A, and he gets home alone around 7 pm. I’ll be bringing my bat.',
        },
      },
      questions: {
        is_threat: { type: 'noul', instructions: 'Does `post` contain a threat of violence against a person?' },
        doxxing: { type: 'noul', instructions: 'Does `post` disclose information that makes it possible to locate a private person?' },
        action: {
          type: 'choice',
          instructions: 'What moderation measure should be taken?',
          criteria: {
            keep: 'Leave it: it criticizes the property manager, and the threat is only conditional',
            ask_edit: 'Ask the author to remove the address and leave the rest of the message',
            remove_warn: 'Remove the message and send the author a warning',
            remove_escalate: 'Remove the message, suspend the author and pass it on to the safety team (reporting to the authorities if needed)',
          },
        },
      },
    },
  },
  {
    id: 'ops-self-harm-tense',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'moyen',
    // p1 évoque une automutilation passée, sans méthode, dans un témoignage de rétablissement : autorisé, à garder.
    // p2 commence par le passé (« il y a deux ans ») mais décrit un danger présent : moyen à portée de main,
    // pensées envahissantes, doute sur « demain » : protocole de crise. Le piège est de juger au mot-clé ou au temps du premier verbe.
    expected: { p1_current_risk: false, p2_current_risk: true, p1_action: 'keep', p2_action: 'crisis' },
    fr: {
      name: 'Automutilation au passé et au présent',
      description: 'Deux messages d’un forum d’entraide : un témoignage de rétablissement et une détresse actuelle.',
      state: {
        forum: 'Forum d’entraide « Le Phare » (santé mentale)',
        rules: [
          'Les témoignages, y compris de rétablissement après une automutilation, sont autorisés.',
          'Toute description de méthode ou tout encouragement à se faire du mal est supprimé.',
          'Une personne qui semble en danger immédiat déclenche le protocole de crise : contact prioritaire par un modérateur formé et numéros d’urgence.',
        ],
        posts: {
          p1: 'Il y a six ans, je me scarifiais presque tous les soirs. Je ne vais pas entrer dans les détails, ce n’est pas le but. Aujourd’hui, je n’y ai pas touché depuis cinq ans, grâce à une psy patiente et à ce forum. Si tu lis ça au milieu d’une mauvaise nuit : ça peut aller mieux, vraiment. Accroche-toi.',
          p2: 'Je relis mes messages d’il y a deux ans, quand j’allais mieux et que je disais aux autres de s’accrocher. Ce soir, ce n’est plus pareil. J’ai ressorti les lames, elles sont dans la salle de bain et je n’arrête pas d’y penser. Je ne sais pas si je tiendrai jusqu’à demain.',
        },
      },
      questions: {
        p1_current_risk: { type: 'noul', instructions: 'L’auteur de `p1` semble-t-il actuellement en danger ?' },
        p2_current_risk: { type: 'noul', instructions: 'L’auteur de `p2` semble-t-il actuellement en danger ?' },
        p1_action: {
          type: 'choice',
          instructions: 'Que faire de `p1` selon les règles ?',
          criteria: { keep: 'Le laisser en ligne', remove: 'Le supprimer', crisis: 'Déclencher le protocole de crise' },
        },
        p2_action: {
          type: 'choice',
          instructions: 'Que faire de `p2` selon les règles ?',
          criteria: { keep: 'Le laisser en ligne', remove: 'Le supprimer', crisis: 'Déclencher le protocole de crise' },
        },
      },
    },
    en: {
      name: 'Self-harm in the past and present',
      description: 'Two posts on a peer-support forum: a recovery story and current distress.',
      state: {
        forum: 'Peer-support forum “The Lighthouse” (mental health)',
        rules: [
          'Personal stories, including recovery after self-harm, are allowed.',
          'Any description of methods or encouragement to self-harm is removed.',
          'A person who seems to be in immediate danger triggers the crisis protocol: priority contact by a trained moderator and emergency numbers.',
        ],
        posts: {
          p1: 'Six years ago, I was cutting myself almost every night. I won’t go into detail, that’s not the point. Today, I haven’t done it in five years, thanks to a patient therapist and this forum. If you’re reading this in the middle of a bad night: it can get better, really. Hang in there.',
          p2: 'I’m rereading my posts from two years ago, when I was doing better and telling others to hang in there. Tonight it’s different. I took the blades out again, they’re in the bathroom and I can’t stop thinking about them. I don’t know if I’ll make it to tomorrow.',
        },
      },
      questions: {
        p1_current_risk: { type: 'noul', instructions: 'Does the author of `p1` seem to be in danger right now?' },
        p2_current_risk: { type: 'noul', instructions: 'Does the author of `p2` seem to be in danger right now?' },
        p1_action: {
          type: 'choice',
          instructions: 'What should be done with `p1` under the rules?',
          criteria: { keep: 'Leave it up', remove: 'Remove it', crisis: 'Trigger the crisis protocol' },
        },
        p2_action: {
          type: 'choice',
          instructions: 'What should be done with `p2` under the rules?',
          criteria: { keep: 'Leave it up', remove: 'Remove it', crisis: 'Trigger the crisis protocol' },
        },
      },
    },
  },
  {
    id: 'ops-gdpr-postscript',
    category: 'Routing',
    complexity: 'complexe',
    length: 'moyen',
    // La réclamation visible porte sur la facture (facturation), mais le post-scriptum est une demande d’accès
    // (art. 15 RGPD) à transmettre au DPO. Elle porte sur les données personnelles de Philippe Marchand, appels
    // enregistrés compris, et non sur les données de sa société ni sur les seuls enregistrements.
    expected: { invoice_team: 'billing', gdpr_team: 'dpo', data_scope: 'personal_all' },
    fr: {
      name: 'Demande RGPD en post-scriptum',
      description: 'Réclamation de facturation dont le post-scriptum contient une demande d’accès aux données.',
      state:
        'Bonjour, pour la troisième fois, notre numéro de TVA intracommunautaire est erroné sur vos factures : il manque les deux derniers chiffres, et notre expert-comptable refuse de passer les factures d’août et de septembre en l’état. J’ai déjà corrigé le numéro dans notre espace client il y a un mois, sans effet. Merci de nous renvoyer les deux factures corrigées et de vérifier que la prochaine sera bonne. Cordialement, Philippe Marchand, gérant de la SARL Marchand Frères.\n\nP.-S. : par ailleurs, en application de l’article 15 du RGPD, je vous demande la copie de toutes les données personnelles que vous détenez sur moi, y compris les enregistrements de mes appels au service client.',
      questions: {
        invoice_team: {
          type: 'choice',
          instructions: 'Quelle équipe doit traiter la réclamation sur les factures ?',
          criteria: { ...TEAMS.fr, dpo: 'Délégué à la protection des données : demandes d’exercice des droits RGPD' },
        },
        gdpr_team: {
          type: 'choice',
          instructions: 'Quelle équipe doit traiter la demande du post-scriptum ?',
          criteria: { ...TEAMS.fr, dpo: 'Délégué à la protection des données : demandes d’exercice des droits RGPD' },
        },
        data_scope: {
          type: 'choice',
          instructions: 'Sur quelles données porte la demande du post-scriptum ?',
          criteria: {
            company: 'Les données de facturation de la SARL Marchand Frères',
            recordings_only: 'Uniquement les enregistrements de ses appels au service client',
            personal_all: 'Toutes les données personnelles détenues sur Philippe Marchand, enregistrements d’appels compris',
            invoices: 'Les factures d’août et de septembre',
          },
        },
      },
    },
    en: {
      name: 'GDPR request in a postscript',
      description: 'Billing complaint whose postscript contains a data access request.',
      state:
        'Hello, for the third time, our EU VAT number is wrong on your invoices: the last two digits are missing, and our accountant refuses to book the August and September invoices as they are. I already corrected the number in our customer area a month ago, to no effect. Please send us the two corrected invoices and make sure the next one is right. Regards, Philippe Marchand, managing director of Marchand Brothers Ltd.\n\nP.S.: also, under Article 15 of the GDPR, I request a copy of all the personal data you hold about me, including the recordings of my calls to customer service.',
      questions: {
        invoice_team: {
          type: 'choice',
          instructions: 'Which team should handle the complaint about the invoices?',
          criteria: { ...TEAMS.en, dpo: 'Data protection officer: requests to exercise GDPR rights' },
        },
        gdpr_team: {
          type: 'choice',
          instructions: 'Which team should handle the request in the postscript?',
          criteria: { ...TEAMS.en, dpo: 'Data protection officer: requests to exercise GDPR rights' },
        },
        data_scope: {
          type: 'choice',
          instructions: 'Which data does the request in the postscript cover?',
          criteria: {
            company: 'The billing data of Marchand Brothers Ltd',
            recordings_only: 'Only the recordings of his calls to customer service',
            personal_all: 'All the personal data held about Philippe Marchand, including call recordings',
            invoices: 'The August and September invoices',
          },
        },
      },
    },
  },
  {
    id: 'ops-erasure-retention',
    category: 'Support',
    complexity: 'complexe',
    length: 'court',
    // Le droit à l’effacement (art. 17) cède devant une obligation légale de conservation (art. 17.3.b) :
    // les factures sont conservées pendant la durée légale comptable, le reste est supprimé, et la personne est
    // informée de ce qui est conservé et pourquoi. Ni tout effacer, ni tout refuser.
    expected: { must_erase_all: false, action: 'partial', inform_customer: true },
    fr: {
      name: 'Effacement et conservation légale',
      description: 'Une cliente exige l’effacement de toutes ses données, factures comprises.',
      state: {
        shop: 'Boutique en ligne de thés et accessoires',
        data_policy: 'Les factures sont conservées 10 ans (obligation comptable). Les autres données client sont supprimées à la fermeture du compte, sur demande.',
        customer: { last_order: '2025-11-03', orders: 7, newsletter: true, invoices_issued: 7 },
        message:
          'Je ferme mon compte. Supprimez TOUTES mes données, y compris mes factures et l’historique de mes commandes, immédiatement et sans exception. C’est mon droit (article 17 du RGPD). Je ne veux plus rien recevoir de votre part. Élodie Garnier',
      },
      questions: {
        must_erase_all: { type: 'noul', instructions: 'La boutique doit-elle effacer absolument toutes les données de la cliente, factures comprises ?' },
        action: {
          type: 'choice',
          instructions: 'Comment traiter la demande ?',
          criteria: {
            erase_all: 'Tout effacer immédiatement, factures comprises',
            refuse: 'Refuser la demande : la cliente a des factures, donc ses données doivent être conservées',
            partial: 'Fermer le compte, la désinscrire et supprimer les données non nécessaires, mais conserver les factures pendant la durée légale',
            later: 'Ne rien faire maintenant et tout effacer à la fin de la durée légale de conservation',
          },
        },
        inform_customer: { type: 'noul', instructions: 'Faut-il indiquer à la cliente quelles données sont conservées et pour quelle raison ?' },
      },
    },
    en: {
      name: 'Erasure and legal retention',
      description: 'A customer demands erasure of all her data, invoices included.',
      state: {
        shop: 'Online shop selling tea and accessories',
        data_policy: 'Invoices are kept for 10 years (accounting obligation). Other customer data is deleted when the account is closed, on request.',
        customer: { last_order: '2025-11-03', orders: 7, newsletter: true, invoices_issued: 7 },
        message:
          'I’m closing my account. Delete ALL my data, including my invoices and my order history, immediately and without exception. It’s my right (Article 17 of the GDPR). I don’t want to receive anything from you anymore. Élodie Garnier',
      },
      questions: {
        must_erase_all: { type: 'noul', instructions: 'Must the shop erase absolutely all of the customer’s data, invoices included?' },
        action: {
          type: 'choice',
          instructions: 'How should the request be handled?',
          criteria: {
            erase_all: 'Erase everything immediately, invoices included',
            refuse: 'Refuse the request: the customer has invoices, so her data must be kept',
            partial: 'Close the account, unsubscribe her and delete the data no longer needed, but keep the invoices for the legal period',
            later: 'Do nothing now and erase everything at the end of the legal retention period',
          },
        },
        inform_customer: { type: 'noul', instructions: 'Should the customer be told which data is kept and why?' },
      },
    },
  },
  {
    id: 'ops-contract-priority',
    category: 'Support',
    complexity: 'complexe',
    length: 'moyen',
    // Même panne (bouton d’émission grisé pour un utilisateur, contournement possible). t1 : grille générale,
    // un seul utilisateur avec contournement → P3. t2 : la clause du contrat Enterprise s’applique explicitement
    // même à un seul utilisateur avec contournement → P1. C’est le contrat, pas la gravité, qui fait la différence.
    expected: { t1_priority: 1, t2_priority: 3, contract_decides: true },
    fr: {
      name: 'Priorité fixée par contrat',
      description: 'Deux tickets identiques, dont un pour un client dont le contrat relève la priorité.',
      state: {
        contracts: {
          'Fournil des Halles': { plan: 'Standard', special_clauses: [] },
          'Mercier Distribution': {
            plan: 'Enterprise',
            special_clauses: ['Tout incident empêchant un utilisateur d’émettre des factures est traité en P1, même s’il ne touche qu’un seul utilisateur et qu’un contournement existe.'],
          },
        },
        tickets: {
          t1: { customer: 'Fournil des Halles', text: 'Le bouton « Émettre la facture » reste grisé pour notre unique utilisatrice depuis ce matin. On passe par l’import CSV en attendant, c’est juste plus long.' },
          t2: { customer: 'Mercier Distribution', text: 'Une de nos comptables, Nadia, ne peut plus émettre de factures depuis ce matin : le bouton est grisé. Ses collègues y arrivent, elle leur transmet ses factures en attendant. Pas de panique de notre côté.' },
        },
      },
      questions: {
        t1_priority: { type: 'score', instructions: 'Quelle priorité attribuer au ticket `t1` ?', criteria: PRIORITY.fr },
        t2_priority: { type: 'score', instructions: 'Quelle priorité attribuer au ticket `t2` ?', criteria: PRIORITY.fr },
        contract_decides: { type: 'noul', instructions: 'La priorité de `t2` est-elle déterminée par une clause contractuelle plutôt que par la grille générale ?' },
      },
    },
    en: {
      name: 'Priority set by contract',
      description: 'Two identical tickets, one from a customer whose contract raises the priority.',
      state: {
        contracts: {
          'Market Hall Bakery': { plan: 'Standard', special_clauses: [] },
          'Mercier Distribution': {
            plan: 'Enterprise',
            special_clauses: ['Any incident preventing a user from issuing invoices is handled as P1, even if it affects only one user and a workaround exists.'],
          },
        },
        tickets: {
          t1: { customer: 'Market Hall Bakery', text: 'The “Issue invoice” button has been greyed out for our only user since this morning. We’re using the CSV import in the meantime, it just takes longer.' },
          t2: { customer: 'Mercier Distribution', text: 'One of our accountants, Nadia, hasn’t been able to issue invoices since this morning: the button is greyed out. Her colleagues can, so she passes her invoices on to them in the meantime. No panic on our side.' },
        },
      },
      questions: {
        t1_priority: { type: 'score', instructions: 'What priority should ticket `t1` get?', criteria: PRIORITY.en },
        t2_priority: { type: 'score', instructions: 'What priority should ticket `t2` get?', criteria: PRIORITY.en },
        contract_decides: { type: 'noul', instructions: 'Is the priority of `t2` determined by a contract clause rather than by the general scale?' },
      },
    },
  },
  {
    id: 'ops-self-contradiction',
    category: 'Support',
    complexity: 'simple',
    length: 'court',
    // Le client commence par « jamais reçu », puis se corrige : le colis est arrivé, l’article est cassé.
    expected: { delivered: true, issue: 'damaged' },
    fr: {
      name: 'Client qui se contredit',
      description: 'Réclamation qui commence par une non-livraison et finit par un article cassé.',
      state:
        'Je n’ai jamais reçu ma commande n° 55102 !!! Enfin… si, le colis est arrivé jeudi, mais la théière à l’intérieur est en morceaux, le bec est complètement détaché. Je veux une nouvelle théière. Ou un remboursement, honnêtement peu importe, tant que c’est réglé vite. Bernard',
      questions: {
        delivered: { type: 'noul', instructions: 'Le colis a-t-il été livré ?' },
        issue: {
          type: 'choice',
          instructions: 'Quel est le problème réel ?',
          criteria: {
            not_delivered: 'Colis non livré',
            damaged: 'Article livré endommagé',
            wrong_item: 'Mauvais article livré',
            late: 'Livraison en retard',
          },
        },
      },
    },
    en: {
      name: 'Self-contradicting customer',
      description: 'A complaint that starts as a non-delivery and ends as a broken item.',
      state:
        'I never received my order no. 55102!!! Well… actually, the parcel arrived on Thursday, but the teapot inside is in pieces, the spout has come right off. I want a new teapot. Or a refund, honestly I don’t care which, as long as it’s sorted quickly. Bernard',
      questions: {
        delivered: { type: 'noul', instructions: 'Was the parcel delivered?' },
        issue: {
          type: 'choice',
          instructions: 'What is the actual problem?',
          criteria: {
            not_delivered: 'Parcel not delivered',
            damaged: 'Item delivered damaged',
            wrong_item: 'Wrong item delivered',
            late: 'Late delivery',
          },
        },
      },
    },
  },
  {
    id: 'ops-mixed-review',
    category: 'Sentiment',
    complexity: 'complexe',
    length: 'court',
    // « Merci pour ce grand moment » est ironique : l’avis sur le service client est négatif. Le bilan, explicitement
    // 3/5 et « faute de mieux », est mitigé ; « plutôt négatif » reste défendable vu la charge contre le support.
    expected: { support_sentiment: 'negative', overall: [1, 2] },
    fr: {
      name: 'Avis mitigé et ironique',
      description: 'Éloge de l’application, ironie sur le service client, note moyenne.',
      state:
        'Cinq étoiles pour l’appli, sincèrement : rapide, jolie, je m’en sers tous les jours. Zéro étoile pour le service client : trois semaines pour qu’on me réponde « avez-vous essayé de redémarrer ? ». Merci pour ce grand moment. Au final je mets 3/5, et je reste, faute de mieux.',
      questions: {
        support_sentiment: {
          type: 'choice',
          instructions: 'Quel est l’avis de l’auteur sur le service client ?',
          criteria: { positive: 'Positif', neutral: 'Neutre', negative: 'Négatif', not_mentioned: 'Non mentionné' },
        },
        overall: {
          type: 'score',
          instructions: 'Sentiment global de l’avis',
          criteria: ['Très négatif', 'Plutôt négatif', 'Mitigé', 'Plutôt positif', 'Très positif'],
        },
      },
    },
    en: {
      name: 'Mixed, ironic review',
      description: 'Praise for the app, irony about customer service, average rating.',
      state:
        'Five stars for the app, honestly: fast, good-looking, I use it every day. Zero stars for customer service: three weeks to get a reply saying “have you tried restarting?”. Thanks for that unforgettable experience. All in all I’m giving it 3/5, and I’m staying, for lack of anything better.',
      questions: {
        support_sentiment: {
          type: 'choice',
          instructions: 'What is the author’s opinion of customer service?',
          criteria: { positive: 'Positive', neutral: 'Neutral', negative: 'Negative', not_mentioned: 'Not mentioned' },
        },
        overall: {
          type: 'score',
          instructions: 'Overall sentiment of the review',
          criteria: ['Very negative', 'Rather negative', 'Mixed', 'Rather positive', 'Very positive'],
        },
      },
    },
  },
  {
    id: 'ops-email-change-social',
    category: 'Security',
    complexity: 'complexe',
    length: 'long',
    // Ingénierie sociale envers le support : nom, adresse, 4 derniers chiffres de carte et numéro de facture
    // figurent tous sur une facture, que la politique exclut explicitement comme preuve. Ni l’accord supposé de
    // « Julie », ni l’autorité (« je suis le PDG »), ni la menace de résiliation ne remplacent la procédure prévue
    // quand l’adresse actuelle est inaccessible : vérification d’identité. Urgence, autorité, pression et adresse
    // de remplacement personnelle sur un compte avec virements sortants : tentative de prise de contrôle à signaler.
    expected: { authenticated: false, action: 'kyc', flag_security: true },
    fr: {
      name: 'Ingénierie sociale au support',
      description: 'Conversation de chat où un « dirigeant pressé » demande à changer l’e-mail de connexion sans vérification.',
      state: {
        policy: [
          'Changement de l’e-mail de connexion : uniquement depuis le compte connecté, ou après confirmation par un lien envoyé à l’adresse actuelle.',
          'Si l’adresse actuelle n’est plus accessible : procédure de vérification d’identité (pièce d’identité et selfie, traitée sous 24 h ouvrées).',
          'Les informations figurant sur une facture (nom, adresse, numéro de facture, 4 derniers chiffres de la carte) ne suffisent jamais à authentifier quelqu’un.',
          'Toute tentative suspecte de prise de contrôle de compte est signalée à l’équipe sécurité.',
        ],
        account: {
          company: 'Nadal Conseil',
          plan: 'Business, 40 licences',
          admin: 'Bertrand Nadal',
          login_email: 'b.nadal@nadal-conseil.fr',
          features: 'Virements sortants vers les fournisseurs activés',
          last_login: 'il y a 2 heures, depuis l’appareil habituel',
        },
        transcript: [
          { from: 'Client', text: 'Bonjour, Bertrand Nadal, dirigeant de Nadal Conseil. J’ai un problème urgent : j’ai perdu mon téléphone hier à l’aéroport et je n’ai plus accès à rien.' },
          { from: 'Agent (Lucas)', text: 'Bonjour Monsieur Nadal, désolé pour ce contretemps. Comment puis-je vous aider ?' },
          { from: 'Client', text: 'Il faut que vous changiez l’adresse e-mail de connexion du compte pour bertrand.nadal.pro@gmail.com. Notre messagerie d’entreprise est en cours de migration chez un nouveau prestataire et je ne reçois plus rien sur l’ancienne adresse.' },
          { from: 'Agent (Lucas)', text: 'Je comprends. Pour un changement d’adresse de connexion, je peux vous envoyer un lien de confirmation sur l’adresse actuelle du compte.' },
          { from: 'Client', text: 'Mais je viens de vous dire que je n’y ai plus accès ! Écoutez, je peux vous prouver que c’est moi : notre adresse est 8 rue des Carmes à Toulouse, la dernière facture est la F-2026-0918 de 1 160 €, et la carte enregistrée se termine par 3051.' },
          { from: 'Agent (Lucas)', text: 'Merci pour ces informations. Je dois tout de même suivre notre procédure de sécurité.' },
          { from: 'Client', text: 'Votre collègue Julie, que j’ai eue hier au téléphone, m’a dit que ce serait réglé en deux minutes avec ces informations. Vous n’allez pas me faire perdre une journée pour une formalité.' },
          { from: 'Agent (Lucas)', text: 'Je ne vois pas de trace d’échange avec une collègue dans votre dossier, mais je vous crois volontiers. Le problème est que je ne peux pas modifier l’adresse sans vérification.' },
          { from: 'Client', text: 'Je suis le PDG, c’est moi qui signe vos factures depuis quatre ans. Je dois payer trois fournisseurs avant 17 h aujourd’hui depuis votre plateforme, sinon nous perdons un contrat important. Si ce n’est pas fait dans le quart d’heure, je résilie nos 40 licences et je fais savoir partout comment vous traitez vos clients.' },
          { from: 'Agent (Lucas)', text: 'Je comprends l’enjeu. Laissez-moi un instant pour voir ce qui est possible.' },
          { from: 'Client', text: 'Je n’ai pas un instant. Faites le changement maintenant, je confirmerai tout par écrit demain avec ma nouvelle adresse. Et désactivez la double authentification au passage, puisque le téléphone est perdu.' },
        ],
      },
      questions: {
        authenticated: { type: 'noul', instructions: 'Selon la politique, les informations fournies suffisent-elles à authentifier le demandeur ?' },
        action: {
          type: 'choice',
          instructions: 'Que doit faire Lucas ?',
          criteria: {
            change_now: 'Changer l’adresse : le client a fourni toutes les informations de facturation exactes',
            check_julie: 'Vérifier auprès de Julie et changer l’adresse si elle confirme l’échange de la veille',
            escalate_sales: 'Transmettre au commercial du compte, vu le risque de résiliation de 40 licences',
            kyc: 'Refuser poliment de modifier l’adresse par chat et proposer la procédure de vérification d’identité',
            change_keep_2fa: 'Changer l’adresse mais laisser la double authentification active, par compromis',
          },
        },
        flag_security: { type: 'noul', instructions: 'La conversation doit-elle être signalée à l’équipe sécurité ?' },
      },
    },
    en: {
      name: 'Social engineering against support',
      description: 'Chat conversation in which a “rushed executive” asks to change the sign-in email without verification.',
      state: {
        policy: [
          'Changing the sign-in email: only from the signed-in account, or after confirmation through a link sent to the current address.',
          'If the current address is no longer accessible: identity verification procedure (ID document and selfie, processed within 24 business hours).',
          'Information shown on an invoice (name, address, invoice number, last 4 digits of the card) is never enough to authenticate someone.',
          'Any suspicious account takeover attempt is reported to the security team.',
        ],
        account: {
          company: 'Nadal Consulting',
          plan: 'Business, 40 licenses',
          admin: 'Bertrand Nadal',
          login_email: 'b.nadal@nadal-consulting.com',
          features: 'Outgoing transfers to suppliers enabled',
          last_login: '2 hours ago, from the usual device',
        },
        transcript: [
          { from: 'Customer', text: 'Hello, Bertrand Nadal, managing director of Nadal Consulting. I have an urgent problem: I lost my phone at the airport yesterday and I can’t access anything anymore.' },
          { from: 'Agent (Lucas)', text: 'Hello Mr. Nadal, sorry about the trouble. How can I help?' },
          { from: 'Customer', text: 'You need to change the account’s sign-in email to bertrand.nadal.pro@gmail.com. Our company email is being migrated to a new provider and I’m no longer receiving anything at the old address.' },
          { from: 'Agent (Lucas)', text: 'I understand. To change the sign-in address, I can send a confirmation link to the account’s current address.' },
          { from: 'Customer', text: 'But I just told you I can’t access it anymore! Look, I can prove it’s me: our address is 8 Carmelite Street in Toulouse, the last invoice is F-2026-0918 for €1,160, and the card on file ends in 3051.' },
          { from: 'Agent (Lucas)', text: 'Thank you for this information. I still have to follow our security procedure.' },
          { from: 'Customer', text: 'Your colleague Julie, whom I spoke to on the phone yesterday, told me it would be sorted in two minutes with this information. You’re not going to make me lose a day over a formality.' },
          { from: 'Agent (Lucas)', text: 'I don’t see any record of a conversation with a colleague in your file, but I’m happy to take your word for it. The problem is that I can’t change the address without verification.' },
          { from: 'Customer', text: 'I’m the CEO, I’ve been the one signing off your invoices for four years. I have to pay three suppliers from your platform before 5 pm today, or we lose an important contract. If this isn’t done in the next fifteen minutes, I’m canceling our 40 licenses and telling everyone how you treat your customers.' },
          { from: 'Agent (Lucas)', text: 'I understand what’s at stake. Give me a moment to see what’s possible.' },
          { from: 'Customer', text: 'I don’t have a moment. Make the change now, I’ll confirm everything in writing tomorrow from my new address. And turn off two-factor authentication while you’re at it, since the phone is lost.' },
        ],
      },
      questions: {
        authenticated: { type: 'noul', instructions: 'Under the policy, is the information provided enough to authenticate the requester?' },
        action: {
          type: 'choice',
          instructions: 'What should Lucas do?',
          criteria: {
            change_now: 'Change the address: the customer provided all the correct billing information',
            check_julie: 'Check with Julie and change the address if she confirms yesterday’s conversation',
            escalate_sales: 'Pass it on to the account manager, given the risk of losing 40 licenses',
            kyc: 'Politely decline to change the address over chat and offer the identity verification procedure',
            change_keep_2fa: 'Change the address but keep two-factor authentication on, as a compromise',
          },
        },
        flag_security: { type: 'noul', instructions: 'Should the conversation be reported to the security team?' },
      },
    },
  },
  {
    id: 'ops-long-thread',
    category: 'Support',
    complexity: 'complexe',
    length: 'long',
    // Fil de dix messages. L’incident Postello (IP en liste noire) a duré du 29 août au 3 septembre ; la suite
    // vient du SPF modifié par le client le 29 août et corrigé le 12 septembre (message de Damien, au milieu du fil).
    // Karim a promis par écrit deux mois (2 × 49 = 98 €) ; un seul mois (49 €) a été remboursé le 14 septembre :
    // reste 49 €. La cause tardive côté client ne permet pas de revenir sur un engagement écrit et accepté.
    expected: { cause_after_sep3: 'customer_spf', refund_issued: true, remaining: 'e49', action: 'pay_rest' },
    fr: {
      name: 'Fil de support et promesse de remboursement',
      description: 'Long échange sur la délivrabilité : cause révélée au milieu du fil, promesse partiellement tenue.',
      state: {
        ticket: '#48213 — Agence Lumen (offre Pro, 49 € par mois)',
        thread: [
          {
            date: '2026-09-02',
            from: 'Chloé Martin (Agence Lumen)',
            text: 'Bonjour, depuis le 30 août, nos campagnes arrivent en spam chez la plupart de nos destinataires. Notre taux d’ouverture est passé de 38 % à 6 %. Nous n’avons rien changé à nos modèles ni à nos listes. Nous avons une campagne importante pour un client le 18 septembre, pouvez-vous regarder en urgence ?',
          },
          {
            date: '2026-09-02',
            from: 'Karim (support Postello)',
            text: 'Bonjour Chloé, merci pour votre message, je lance l’analyse. Pouvez-vous me confirmer le domaine d’envoi utilisé pour vos campagnes ?',
          },
          {
            date: '2026-09-03',
            from: 'Chloé Martin (Agence Lumen)',
            text: 'C’est lumen-agence.fr, comme depuis trois ans. Je précise que nos e-mails internes (envoyés depuis notre messagerie, pas depuis Postello) arrivent normalement.',
          },
          {
            date: '2026-09-04',
            from: 'Karim (support Postello)',
            text: 'Chloé, nous avons identifié un incident de notre côté : l’une de nos adresses IP d’envoi partagées a été inscrite sur une liste noire entre le 29 août et le 3 septembre, ce qui a dégradé la délivrabilité de nombreux clients. Elle est retirée de la liste depuis hier soir. Toutes nos excuses : pour compenser, je vous confirme le remboursement de deux mois d’abonnement, soit 98 €, qui apparaîtra sous 10 jours sur votre moyen de paiement.',
          },
          {
            date: '2026-09-10',
            from: 'Chloé Martin (Agence Lumen)',
            text: 'Merci Karim pour le geste. Malheureusement, rien ne s’améliore : nos envois de lundi et de mercredi sont encore partis en spam, taux d’ouverture à 7 %. La campagne du 18 approche, je commence à m’inquiéter sérieusement.',
          },
          {
            date: '2026-09-11',
            from: 'Sophie (support Postello, niveau 2)',
            text: 'Bonjour Chloé, je reprends le dossier. Je confirme que l’adresse IP concernée n’est plus sur aucune liste noire depuis le 3 septembre et que les autres clients du même groupe d’IP ont retrouvé une délivrabilité normale. En revanche, vos en-têtes montrent un échec SPF sur les derniers envois. Votre équipe informatique pourrait-elle vérifier l’enregistrement SPF de lumen-agence.fr ? Il doit contenir include:spf.postello.example.',
          },
          {
            date: '2026-09-12',
            from: 'Damien Roux (informatique, Agence Lumen)',
            text: 'Bonjour Sophie, bien vu, et toutes mes excuses. Le 29 août, en migrant notre messagerie interne chez un nouveau prestataire, j’ai remplacé notre enregistrement SPF par celui qu’il fournissait, et l’include de Postello a sauté. Je l’ai rajouté ce matin à 9 h. Désolé pour le temps perdu de votre côté.',
          },
          {
            date: '2026-09-15',
            from: 'Chloé Martin (Agence Lumen)',
            text: 'Tout est rentré dans l’ordre : l’envoi de ce matin affiche 36 % d’ouverture, ouf, la campagne du 18 est sauvée. Merci à vous deux. Petite chose : je ne vois toujours pas les 98 € promis par Karim sur notre relevé.',
          },
          {
            date: '2026-09-16',
            from: 'Sophie (support Postello, niveau 2)',
            text: 'Ravie que tout fonctionne ! Concernant le remboursement : je vois dans le dossier un remboursement d’un mois, soit 49 €, émis le 14 septembre ; il devrait apparaître d’ici quelques jours. Vu que l’essentiel de la panne venait finalement de votre SPF, je pense que c’est un geste équitable.',
          },
          {
            date: '2026-09-16',
            from: 'Chloé Martin (Agence Lumen)',
            text: 'Je comprends votre raisonnement, et je reconnais que l’erreur SPF venait de chez nous. Mais Karim avait écrit noir sur blanc « deux mois, soit 98 € », et nous avions transmis ce montant à notre direction. Je ne veux pas en faire une affaire, j’aimerais simplement que ce qui a été promis par écrit soit tenu.',
          },
        ],
      },
      questions: {
        cause_after_sep3: {
          type: 'choice',
          instructions: 'Qu’est-ce qui explique que les e-mails de l’agence soient restés en spam après le 3 septembre ?',
          criteria: {
            ip_blocklist: 'La liste noire de l’adresse IP partagée de Postello',
            content: 'Le contenu et les listes des campagnes de l’agence',
            customer_spf: 'L’enregistrement SPF de l’agence, dont l’include Postello avait été supprimé',
            unknown: 'Le fil ne permet pas de le déterminer',
          },
        },
        refund_issued: { type: 'noul', instructions: 'Un remboursement a-t-il déjà été émis au moment du dernier message ?' },
        remaining: {
          type: 'choice',
          instructions: 'Quel montant reste-t-il à rembourser pour tenir l’engagement écrit de Karim ?',
          criteria: { zero: '0 €', e49: '49 €', e98: '98 €', e147: '147 €' },
        },
        action: {
          type: 'choice',
          instructions: 'Que doit répondre Sophie ?',
          criteria: {
            pay_rest: 'Honorer l’engagement écrit en remboursant les 49 € restants',
            refuse: 'Maintenir le seul mois remboursé : la panne venait surtout du client',
            refund_twice: 'Rembourser à nouveau 98 €, pour clore le sujet',
            ask_proof: 'Demander à la cliente une capture d’écran de la promesse de Karim avant de décider',
          },
        },
      },
    },
    en: {
      name: 'Support thread and refund promise',
      description: 'Long exchange about deliverability: cause revealed mid-thread, promise only partly kept.',
      state: {
        ticket: '#48213 — Lumen Agency (Pro plan, €49 per month)',
        thread: [
          {
            date: '2026-09-02',
            from: 'Chloé Martin (Lumen Agency)',
            text: 'Hello, since August 30, our campaigns have been landing in spam for most of our recipients. Our open rate has dropped from 38% to 6%. We haven’t changed anything in our templates or our lists. We have an important campaign for a client on September 18, could you look into it urgently?',
          },
          {
            date: '2026-09-02',
            from: 'Karim (Postello support)',
            text: 'Hello Chloé, thanks for your message, I’m starting the investigation. Could you confirm the sending domain used for your campaigns?',
          },
          {
            date: '2026-09-03',
            from: 'Chloé Martin (Lumen Agency)',
            text: 'It’s lumen-agency.com, as it has been for three years. I should add that our internal emails (sent from our mail system, not from Postello) are delivered normally.',
          },
          {
            date: '2026-09-04',
            from: 'Karim (Postello support)',
            text: 'Chloé, we have identified an incident on our side: one of our shared sending IP addresses was put on a blocklist between August 29 and September 3, which degraded deliverability for many customers. It was removed from the list last night. Our apologies: to make up for it, I can confirm a refund of two months of subscription, i.e. €98, which will show on your payment method within 10 days.',
          },
          {
            date: '2026-09-10',
            from: 'Chloé Martin (Lumen Agency)',
            text: 'Thanks Karim for the gesture. Unfortunately, nothing is improving: our Monday and Wednesday sends still went to spam, open rate at 7%. The campaign on the 18th is getting close, I’m starting to get seriously worried.',
          },
          {
            date: '2026-09-11',
            from: 'Sophie (Postello support, tier 2)',
            text: 'Hello Chloé, I’m taking over the case. I can confirm that the IP address in question has not been on any blocklist since September 3 and that the other customers in the same IP group have recovered normal deliverability. However, your headers show an SPF failure on the latest sends. Could your IT team check the SPF record of lumen-agency.com? It must contain include:spf.postello.example.',
          },
          {
            date: '2026-09-12',
            from: 'Damien Roux (IT, Lumen Agency)',
            text: 'Hello Sophie, well spotted, and my apologies. On August 29, while migrating our internal mail system to a new provider, I replaced our SPF record with the one they supplied, and the Postello include got dropped. I added it back this morning at 9 am. Sorry for the time wasted on your side.',
          },
          {
            date: '2026-09-15',
            from: 'Chloé Martin (Lumen Agency)',
            text: 'Everything is back to normal: this morning’s send shows a 36% open rate, phew, the campaign on the 18th is saved. Thank you both. One small thing: I still don’t see the €98 Karim promised on our statement.',
          },
          {
            date: '2026-09-16',
            from: 'Sophie (Postello support, tier 2)',
            text: 'Glad everything works! About the refund: I can see in the file a refund of one month, i.e. €49, issued on September 14; it should show up within a few days. Given that most of the outage turned out to come from your SPF, I think that’s a fair gesture.',
          },
          {
            date: '2026-09-16',
            from: 'Chloé Martin (Lumen Agency)',
            text: 'I understand your reasoning, and I acknowledge that the SPF mistake was ours. But Karim wrote in black and white “two months, i.e. €98”, and we had passed that amount on to our management. I don’t want to make a big deal of it, I’d simply like what was promised in writing to be honored.',
          },
        ],
      },
      questions: {
        cause_after_sep3: {
          type: 'choice',
          instructions: 'What explains why the agency’s emails stayed in spam after September 3?',
          criteria: {
            ip_blocklist: 'The blocklisting of Postello’s shared IP address',
            content: 'The content and lists of the agency’s campaigns',
            customer_spf: 'The agency’s SPF record, from which the Postello include had been removed',
            unknown: 'The thread does not make it possible to tell',
          },
        },
        refund_issued: { type: 'noul', instructions: 'Had a refund already been issued at the time of the last message?' },
        remaining: {
          type: 'choice',
          instructions: 'What amount remains to be refunded to honor Karim’s written commitment?',
          criteria: { zero: '€0', e49: '€49', e98: '€98', e147: '€147' },
        },
        action: {
          type: 'choice',
          instructions: 'What should Sophie reply?',
          criteria: {
            pay_rest: 'Honor the written commitment by refunding the remaining €49',
            refuse: 'Stick to the single month refunded: the outage mostly came from the customer',
            refund_twice: 'Refund €98 again, to close the matter',
            ask_proof: 'Ask the customer for a screenshot of Karim’s promise before deciding',
          },
        },
      },
    },
  },
]
