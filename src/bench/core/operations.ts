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
]
