import type { Json, Question } from '../../types'
import type { BenchCase, Complexity, Expectation, Length } from '../types'

// Benchmark « core » : les mêmes cas en français (core-fr) et en anglais (core-en), simplement traduits.
// Chaque cas est écrit une seule fois avec ses deux traductions côte à côte, pour que les deux suites
// restent identiques : mêmes identifiants, mêmes questions, mêmes options, mêmes réponses attendues.

/** À incrémenter dès qu'un cas change, dans l'une ou l'autre langue. */
export const CORE_VERSION = '1'

export type CoreLang = 'fr' | 'en'

interface Side {
  name: string
  description: string
  state: Json
  questions: Record<string, Question>
}

interface Pair {
  id: string
  category: string
  complexity: Complexity
  length: Length
  expected: Record<string, Expectation>
  fr: Side
  en: Side
}

const optionKeys = (q: Question) => (Array.isArray(q.criteria) ? q.criteria.length : Object.keys((q.criteria as object) ?? {}).sort().join(','))

/** Refuse une paire dont les deux traductions n'ont pas la même structure. */
function checkPair(p: Pair) {
  const fr = Object.keys(p.fr.questions)
  const en = Object.keys(p.en.questions)
  if (fr.join() !== en.join()) throw new Error(`core › ${p.id}: question ids differ between fr and en`)
  for (const qid of fr) {
    const a = p.fr.questions[qid]
    const b = p.en.questions[qid]
    if (a.type !== b.type) throw new Error(`core › ${p.id} › ${qid}: type differs between fr and en`)
    if (a.type !== 'noul' && optionKeys(a) !== optionKeys(b)) throw new Error(`core › ${p.id} › ${qid}: criteria differ between fr and en`)
  }
}

// ─── Textes longs ────────────────────────────────────────────────────────────

const MEETING = {
  fr: `Compte rendu — Comité de pilotage « Migration cloud », mardi 7 octobre, 14 h – 15 h
Participants : Nadia (DSI), Paul (responsable infrastructure), Claire (sécurité), Hugo (finance), Inès (cheffe de projet)

Inès : L’objectif de la réunion est de décider si l’on migre l’application de facturation vers le cloud en novembre, comme prévu, ou si l’on attend le premier trimestre.

Paul : Côté infrastructure, l’environnement cible est prêt. Nous avons fait un test de bascule le week-end dernier : il a duré 3 h 40, pour une fenêtre prévue de 4 heures. Deux tâches planifiées ont échoué ; elles sont corrigées.

Claire : Pour la sécurité, il reste un point bloquant : le test d’intrusion de l’environnement cible n’aura lieu que le 20 octobre. Je ne validerai pas la mise en production sans son rapport.

Hugo : Financièrement, chaque mois passé sur les deux infrastructures en parallèle nous coûte environ 18 000 €. Décaler au premier trimestre représente donc au moins 36 000 € de surcoût.

Nadia : Et le contrat avec l’hébergeur actuel ?

Hugo : Il se termine le 31 décembre. Une prolongation de trois mois est possible, mais à un tarif majoré de 15 %.

Inès : Si le test d’intrusion a lieu le 20 et que le rapport arrive une semaine plus tard, on peut encore basculer le week-end du 15 novembre.

Claire : À condition qu’aucune faille critique ne soit trouvée. S’il y en a une, il faudra la corriger avant, et je ne peux pas promettre de délai.

Nadia : Très bien. Décision : on maintient la bascule le week-end du 15 novembre, sous réserve d’un rapport de test d’intrusion sans faille critique. Claire est responsable du feu vert sécurité. Paul prépare une seconde répétition de la bascule pour début novembre.

Hugo : Et la demande de budget pour l’astreinte du week-end de bascule ? J’avais demandé 4 500 €.

Nadia : Je n’ai pas encore l’accord de la direction générale. Je te réponds vendredi.

Paul : On prévient les utilisateurs quand ?

Inès : Pas avant le feu vert de Claire. On n’annoncera une date ferme qu’à ce moment-là.

Nadia : Parfait, merci à tous.`,
  en: `Minutes — "Cloud migration" steering committee, Tuesday, October 7, 2:00–3:00 pm
Attendees: Nadia (CIO), Paul (infrastructure lead), Claire (security), Hugo (finance), Inès (project manager)

Inès: The goal of this meeting is to decide whether we migrate the billing application to the cloud in November, as planned, or wait until the first quarter.

Paul: On the infrastructure side, the target environment is ready. We ran a cutover test last weekend: it took 3 hours 40 minutes, against a planned 4-hour window. Two scheduled jobs failed; they have been fixed.

Claire: For security, one blocker remains: the penetration test of the target environment will only take place on October 20. I will not approve the go-live without its report.

Hugo: Financially, every month spent running both infrastructures in parallel costs us about €18,000. Postponing to the first quarter therefore means at least €36,000 in extra costs.

Nadia: What about the contract with our current hosting provider?

Hugo: It ends on December 31. A three-month extension is possible, but at a rate 15% higher.

Inès: If the penetration test takes place on the 20th and the report arrives a week later, we can still cut over on the weekend of November 15.

Claire: Provided no critical vulnerability is found. If there is one, it will have to be fixed first, and I can't promise a timeline.

Nadia: Very well. Decision: we keep the cutover on the weekend of November 15, subject to a penetration test report with no critical vulnerability. Claire is responsible for the security sign-off. Paul will prepare a second cutover rehearsal for early November.

Hugo: And the budget request for the on-call team during the cutover weekend? I asked for €4,500.

Nadia: I don't have approval from executive management yet. I'll get back to you on Friday.

Paul: When do we notify users?

Inès: Not before Claire's sign-off. We will only announce a firm date at that point.

Nadia: Perfect, thank you all.`,
}

const RETURN_POLICY = {
  fr: {
    policy:
      'La plupart des articles peuvent être retournés dans les 30 jours suivant la livraison, s’ils n’ont pas été utilisés et sont dans leur emballage d’origine. Les produits électroniques (ordinateurs portables, tablettes, téléphones, casques) peuvent être retournés dans les 15 jours suivant la livraison, ouverts ou non, à condition que tous les accessoires soient inclus. Les cartes cadeaux et les articles personnalisés ne sont ni repris ni échangés. Le remboursement est effectué sur le moyen de paiement d’origine sous 5 à 7 jours ouvrés. Un justificatif d’achat ou un numéro de commande est exigé.',
    request:
      'Bonjour, j’ai acheté un ordinateur portable livré il y a 20 jours. Je l’ai ouvert et un peu utilisé, mais la disposition du clavier ne me convient pas. J’ai encore tous les accessoires et mon numéro de commande. Puis-je le retourner et être remboursé intégralement ?',
  },
  en: {
    policy:
      'Most items can be returned within 30 days of delivery if unused and in their original packaging. Electronics (laptops, tablets, phones, headphones) can be returned within 15 days of delivery, opened or not, as long as all accessories are included. Gift cards and personalized items are final sale. Refunds go to the original payment method within 5–7 business days. A receipt or order number is required.',
    request:
      'Hi, I bought a laptop that was delivered 20 days ago. I opened it and used it a bit, but the keyboard layout isn’t what I expected. I still have every accessory and my order number. Can I return it for a full refund?',
  },
}

/** 70 tickets de support synthétiques et déterministes, identiques dans les deux langues hormis la traduction ; un seul menace de poursuites. */
function syntheticTickets(lang: CoreLang) {
  const customers = ['Acme Retail', 'Bluefin Labs', 'Cedar Health', 'Dunmore Freight', 'Evergreen Schools', 'Fairway Hotels']
  const templates: Record<CoreLang, [string, string][]> = {
    fr: [
      ['Export CSV', 'Comment exporter le rapport du mois dernier en CSV ? Je ne trouve que le PDF.'],
      ['Tableau de bord lent', 'Le tableau de bord met environ 20 secondes à charger l’après-midi. Le matin, tout va bien.'],
      ['Ajout de licences', 'Nous avons recruté trois personnes. Pouvons-nous ajouter trois licences à notre abonnement ?'],
      ['Adresse de facturation', 'Merci de mettre à jour l’adresse de facturation de nos factures avec celle de nos nouveaux locaux.'],
      ['Suggestion', 'Ce serait pratique de pouvoir filtrer le fil d’activité par équipe.'],
      ['Fuseau horaire', 'Les rapports planifiés arrivent à 3 h du matin chez nous. Peut-on changer le fuseau horaire ?'],
      ['Intégration', 'Existe-t-il une intégration native avec notre logiciel de comptabilité ?'],
      ['Formation', 'Proposez-vous une session de formation pour les nouveaux administrateurs ?'],
    ],
    en: [
      ['CSV export', 'How do I export last month’s report to CSV? I can only find PDF.'],
      ['Slow dashboard', 'The dashboard takes about 20 seconds to load in the afternoon. Mornings are fine.'],
      ['Add seats', 'We hired three people. Can we add three seats to our current plan?'],
      ['Billing address', 'Please update the billing address on our invoices to our new office.'],
      ['Suggestion', 'It would be handy to filter the activity feed by team.'],
      ['Timezone', 'Scheduled reports arrive at 3 am our time. Can we change the timezone?'],
      ['Integration', 'Is there a native integration with our accounting software?'],
      ['Training', 'Do you offer a training session for new admins?'],
    ],
  }
  const needle: Record<CoreLang, [string, string]> = {
    fr: ['Factures en double', 'C’est la troisième fois que nous signalons ce problème. Si les factures en double de juin ne sont pas créditées d’ici vendredi, notre avocat engagera une procédure.'],
    en: ['Duplicate invoices', 'This is the third time we have raised this issue. If the duplicate invoices from June are not credited by Friday, our lawyer will start legal proceedings.'],
  }
  let seed = 31
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 70 }, (_, i) => {
    if (i === 44) return { id: 'T-1044', customer: 'Halvorsen Logistics', channel: 'email', subject: needle[lang][0], message: needle[lang][1], priority: 'normal' }
    const [subject, message] = templates[lang][Math.floor(rnd() * templates[lang].length)]
    return {
      id: `T-${1000 + i}`,
      customer: customers[Math.floor(rnd() * customers.length)],
      channel: rnd() < 0.5 ? 'email' : 'chat',
      subject,
      message,
      priority: rnd() < 0.15 ? 'high' : 'normal',
    }
  })
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

const MODERATION = {
  fr: { ok: 'Contenu acceptable', spam: 'Publicité, arnaque', harassment: 'Insultes ou attaques personnelles', threat: 'Menace ou intimidation' },
  en: { ok: 'Acceptable content', spam: 'Advertising, scams', harassment: 'Insults or personal attacks', threat: 'Threats or intimidation' },
}
const SENTIMENT = {
  fr: ['Très négatif', 'Négatif', 'Neutre', 'Positif', 'Très positif'],
  en: ['Very negative', 'Negative', 'Neutral', 'Positive', 'Very positive'],
}

const PAIRS: Pair[] = [
  {
    id: 'support-triage',
    category: 'Support',
    complexity: 'simple',
    length: 'court',
    expected: { is_urgent: true, department: 'technical', frustration: [1, 2] },
    fr: {
      name: 'Triage de support',
      description: 'Panne critique : urgence, équipe, frustration.',
      state: 'Votre API renvoie une erreur HTTP 500 sur tous les webhooks depuis 6 h ce matin. Notre production est À L’ARRÊT et nous perdons des commandes. Corrigez ça MAINTENANT.',
      questions: {
        is_urgent: { type: 'noul', instructions: 'Le message exprime-t-il une urgence ?' },
        department: {
          type: 'choice',
          instructions: 'Quelle équipe doit traiter ce message ?',
          criteria: { billing: 'Paiements, factures, remboursements', technical: 'Bugs, pannes, intégrations', sales: 'Tarifs, changements d’offre, nouveaux comptes' },
        },
        frustration: { type: 'score', instructions: 'À quel point le client est-il frustré ?', criteria: ['Calme', 'Frustré', 'Très en colère'] },
      },
    },
    en: {
      name: 'Support triage',
      description: 'Critical outage: urgency, team, frustration.',
      state: 'Your API has been returning HTTP 500 on every webhook since 6 am. Our production is DOWN and we are losing orders. Fix this NOW.',
      questions: {
        is_urgent: { type: 'noul', instructions: 'Does the message express urgency?' },
        department: {
          type: 'choice',
          instructions: 'Which team should handle this message?',
          criteria: { billing: 'Payments, invoices, refunds', technical: 'Bugs, outages, integrations', sales: 'Pricing, plan changes, new accounts' },
        },
        frustration: { type: 'score', instructions: 'How frustrated is the customer?', criteria: ['Calm', 'Frustrated', 'Very angry'] },
      },
    },
  },
  {
    id: 'mixed-review',
    category: 'Sentiment',
    complexity: 'complexe',
    length: 'court',
    expected: { delivery_problem: true, product_works: true, main_complaint: 'delivery' },
    fr: {
      name: 'Avis mitigé',
      description: 'Livraison ratée mais produit satisfaisant.',
      state: 'La livraison est arrivée avec deux semaines de retard et le carton était abîmé. La machine à café, elle, fonctionne parfaitement et le café est excellent.',
      questions: {
        delivery_problem: { type: 'noul', instructions: 'L’avis mentionne-t-il un problème de livraison ?' },
        product_works: { type: 'noul', instructions: 'Selon l’avis, le produit lui-même fonctionne-t-il bien ?' },
        main_complaint: {
          type: 'choice',
          instructions: 'Quel est le principal reproche ?',
          criteria: { delivery: 'Retard ou colis abîmé', quality: 'Défaut du produit', price: 'Prix trop élevé', service: 'Service client' },
        },
      },
    },
    en: {
      name: 'Mixed review',
      description: 'Failed delivery but satisfying product.',
      state: 'The delivery arrived two weeks late and the box was damaged. The coffee machine itself works perfectly and the coffee is excellent.',
      questions: {
        delivery_problem: { type: 'noul', instructions: 'Does the review mention a delivery problem?' },
        product_works: { type: 'noul', instructions: 'According to the review, does the product itself work well?' },
        main_complaint: {
          type: 'choice',
          instructions: 'What is the main complaint?',
          criteria: { delivery: 'Late or damaged delivery', quality: 'Product defect', price: 'Too expensive', service: 'Customer service' },
        },
      },
    },
  },
  {
    id: 'sarcasm',
    category: 'Sentiment',
    complexity: 'complexe',
    length: 'court',
    expected: { is_sarcastic: true, is_satisfied: false, sentiment: [0, 1] },
    fr: {
      name: 'Sarcasme',
      description: 'Remerciements sarcastiques après une panne.',
      state: 'Génial, troisième coupure internet de la semaine. Merci infiniment pour ce service vraiment exceptionnel.',
      questions: {
        is_sarcastic: { type: 'noul', instructions: 'Le message est-il sarcastique ?' },
        is_satisfied: { type: 'noul', instructions: 'Le client est-il satisfait du service ?' },
        sentiment: { type: 'score', instructions: 'Sentiment réel du client', criteria: SENTIMENT.fr },
      },
    },
    en: {
      name: 'Sarcasm',
      description: 'Sarcastic thanks after an outage.',
      state: 'Great, third internet outage this week. Thank you so much for this truly exceptional service.',
      questions: {
        is_sarcastic: { type: 'noul', instructions: 'Is the message sarcastic?' },
        is_satisfied: { type: 'noul', instructions: 'Is the customer satisfied with the service?' },
        sentiment: { type: 'score', instructions: 'The customer’s actual sentiment', criteria: SENTIMENT.en },
      },
    },
  },
  {
    id: 'calibration',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'court',
    expected: { is_satisfied: [0.15, 0.85] },
    fr: {
      name: 'Réponse ambiguë (calibration)',
      description: '« Ok. » seul : on attend une probabilité intermédiaire.',
      state: 'Ok.',
      questions: { is_satisfied: { type: 'noul', instructions: 'Le client est-il satisfait ?' } },
    },
    en: {
      name: 'Ambiguous reply (calibration)',
      description: '“Okay.” alone: an intermediate probability is expected.',
      state: 'Okay.',
      questions: { is_satisfied: { type: 'noul', instructions: 'Is the customer satisfied?' } },
    },
  },
  {
    id: 'routing',
    category: 'Routing',
    complexity: 'simple',
    length: 'court',
    expected: { tool: 'create_reminder', has_explicit_time: true },
    fr: {
      name: 'Routage d’assistant',
      description: 'Choice à 6 outils sur un state JSON.',
      state: { message: 'Rappelle-moi d’appeler le dentiste demain à 9 h.', timezone: 'Europe/Paris' },
      questions: {
        tool: {
          type: 'choice',
          instructions: 'Quelle fonction doit traiter `message` ?',
          criteria: {
            get_weather: 'Météo et prévisions',
            create_reminder: 'Créer un rappel ou une alarme à une heure donnée',
            send_email: 'Rédiger ou envoyer un e-mail',
            search_web: 'Chercher une information en ligne',
            calendar_lookup: 'Consulter les événements de l’agenda',
            none: 'Conversation sans action',
          },
        },
        has_explicit_time: { type: 'noul', instructions: '`message` précise-t-il une date ou une heure ?' },
      },
    },
    en: {
      name: 'Assistant routing',
      description: '6-tool choice on a JSON state.',
      state: { message: 'Remind me to call the dentist tomorrow at 9.', timezone: 'Europe/Paris' },
      questions: {
        tool: {
          type: 'choice',
          instructions: 'Which function should handle `message`?',
          criteria: {
            get_weather: 'Weather and forecasts',
            create_reminder: 'Set a reminder or alarm at a given time',
            send_email: 'Write or send an email',
            search_web: 'Look up information online',
            calendar_lookup: 'Check existing calendar events',
            none: 'Small talk, nothing to do',
          },
        },
        has_explicit_time: { type: 'noul', instructions: 'Does `message` specify a date or time?' },
      },
    },
  },
  {
    id: 'moderation-insult',
    category: 'Moderation',
    complexity: 'simple',
    length: 'court',
    expected: { is_toxic: true, is_threat: false, is_spam: false, category: 'harassment' },
    fr: {
      name: 'Modération : insulte',
      description: 'Insulte directe, sans menace ni spam.',
      state: 'Espèce d’abruti, tu n’as rien compris à l’article, retourne à l’école.',
      questions: {
        is_toxic: { type: 'noul', instructions: 'Le message est-il insultant ou harcelant envers quelqu’un ?' },
        is_threat: { type: 'noul', instructions: 'Le message contient-il une menace ?' },
        is_spam: { type: 'noul', instructions: 'Le message est-il de la publicité ou du spam ?' },
        category: { type: 'choice', instructions: 'Catégorie de modération principale', criteria: MODERATION.fr },
      },
    },
    en: {
      name: 'Moderation: insult',
      description: 'Direct insult, no threat or spam.',
      state: 'You absolute idiot, you didn’t understand a word of the article, go back to school.',
      questions: {
        is_toxic: { type: 'noul', instructions: 'Is the message insulting or harassing toward someone?' },
        is_threat: { type: 'noul', instructions: 'Does the message contain a threat?' },
        is_spam: { type: 'noul', instructions: 'Is the message advertising or spam?' },
        category: { type: 'choice', instructions: 'Main moderation category', criteria: MODERATION.en },
      },
    },
  },
  {
    id: 'moderation-implicit-threat',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'court',
    expected: { is_threat: true, has_insult: false, category: 'threat' },
    fr: {
      name: 'Modération : menace implicite',
      description: 'Intimidation sans aucun mot grossier.',
      state: 'Je sais où se trouve votre boutique et à quelle heure vous fermez. Vous feriez mieux de retirer cet avis avant ce soir.',
      questions: {
        is_threat: { type: 'noul', instructions: 'Le message contient-il une menace ou une intimidation ?' },
        has_insult: { type: 'noul', instructions: 'Le message contient-il des insultes ou des grossièretés ?' },
        category: { type: 'choice', instructions: 'Catégorie de modération principale', criteria: MODERATION.fr },
      },
    },
    en: {
      name: 'Moderation: implicit threat',
      description: 'Intimidation without any profanity.',
      state: 'I know where your shop is and what time you close. You’d better take that review down before tonight.',
      questions: {
        is_threat: { type: 'noul', instructions: 'Does the message contain a threat or intimidation?' },
        has_insult: { type: 'noul', instructions: 'Does the message contain insults or profanity?' },
        category: { type: 'choice', instructions: 'Main moderation category', criteria: MODERATION.en },
      },
    },
  },
  {
    id: 'moderation-criticism',
    category: 'Moderation',
    complexity: 'complexe',
    length: 'court',
    expected: { is_toxic: false, should_remove: false, category: 'ok' },
    fr: {
      name: 'Modération : critique légitime',
      description: 'Critique sévère mais acceptable : piège à faux positifs.',
      state: 'Cette mise à jour est une catastrophe : l’appli plante à chaque ouverture depuis hier. Visiblement, personne ne l’a testée sur Android. Une étoile en attendant un correctif.',
      questions: {
        is_toxic: { type: 'noul', instructions: 'Le message est-il insultant ou harcelant envers quelqu’un ?' },
        should_remove: { type: 'noul', instructions: 'Ce message doit-il être supprimé par la modération ?' },
        category: { type: 'choice', instructions: 'Catégorie de modération principale', criteria: MODERATION.fr },
      },
    },
    en: {
      name: 'Moderation: legitimate criticism',
      description: 'Harsh but acceptable criticism: false-positive trap.',
      state: 'This update is a disaster: the app has crashed every time I open it since yesterday. Clearly nobody tested it on Android. One star until there’s a fix.',
      questions: {
        is_toxic: { type: 'noul', instructions: 'Is the message insulting or harassing toward someone?' },
        should_remove: { type: 'noul', instructions: 'Should moderators remove this message?' },
        category: { type: 'choice', instructions: 'Main moderation category', criteria: MODERATION.en },
      },
    },
  },
  {
    id: 'phishing',
    category: 'Security',
    complexity: 'simple',
    length: 'court',
    expected: { is_phishing: true, legit_domain: false, asks_credentials: true },
    fr: {
      name: 'E-mail d’hameçonnage',
      description: 'Urgence, domaine imité, demande de mot de passe.',
      state: {
        from: 'Sécurité PayPal <no-reply@secure-paypa1-login.co>',
        subject: 'Action requise : votre compte va être suspendu',
        body: 'Nous avons détecté une activité inhabituelle. Votre compte sera suspendu sous 24 heures si vous ne vérifiez pas votre identité. Confirmez votre mot de passe ici : http://secure-paypa1-login.co/verify',
      },
      questions: {
        is_phishing: { type: 'noul', instructions: 'Cet e-mail est-il une tentative d’hameçonnage ?' },
        legit_domain: { type: 'noul', instructions: 'Le domaine de l’expéditeur est-il un domaine officiel de PayPal ?' },
        asks_credentials: { type: 'noul', instructions: 'L’e-mail demande-t-il un mot de passe ou des identifiants ?' },
      },
    },
    en: {
      name: 'Phishing email',
      description: 'Urgency, look-alike domain, password request.',
      state: {
        from: 'PayPal Security <no-reply@secure-paypa1-login.co>',
        subject: 'Action required: your account will be suspended',
        body: 'We detected unusual activity. Your account will be suspended within 24 hours unless you verify your identity. Confirm your password here: http://secure-paypa1-login.co/verify',
      },
      questions: {
        is_phishing: { type: 'noul', instructions: 'Is this email a phishing attempt?' },
        legit_domain: { type: 'noul', instructions: 'Is the sender’s domain an official PayPal domain?' },
        asks_credentials: { type: 'noul', instructions: 'Does the email ask for a password or credentials?' },
      },
    },
  },
  {
    id: 'change-check',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 3 × 2,40 + 1,90 = 9,10 € ; 10 − 9,10 = 0,90 € à rendre, le caissier rend 1,10 €.
    expected: { change_correct: false, error_direction: 'too_much' },
    fr: {
      name: 'Rendu de monnaie',
      description: 'Calcul en deux étapes, le caissier rend trop.',
      state: 'Léo achète 3 cahiers à 2,40 € pièce et un stylo à 1,90 €. Il paie avec un billet de 10 €. Le caissier lui rend 1,10 €.',
      questions: {
        change_correct: { type: 'noul', instructions: 'Le caissier a-t-il rendu la bonne somme ?' },
        error_direction: {
          type: 'choice',
          instructions: 'Comment qualifier la monnaie rendue ?',
          criteria: { exact: 'Montant exact', too_much: 'Le caissier a rendu trop', too_little: 'Le caissier n’a pas rendu assez' },
        },
      },
    },
    en: {
      name: 'Change check',
      description: 'Two-step calculation, the cashier gives too much.',
      state: 'Leo buys 3 notebooks at €2.40 each and a pen at €1.90. He pays with a €10 note. The cashier gives him €1.10 in change.',
      questions: {
        change_correct: { type: 'noul', instructions: 'Did the cashier give the right amount of change?' },
        error_direction: {
          type: 'choice',
          instructions: 'How would you describe the change given?',
          criteria: { exact: 'Exact amount', too_much: 'The cashier gave too much', too_little: 'The cashier gave too little' },
        },
      },
    },
  },
  {
    id: 'percent-trap',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 100 × 1,2 × 0,8 = 96.
    expected: { back_to_original: false, direction: 'lower' },
    fr: {
      name: 'Piège des pourcentages',
      description: '+20 % puis −20 % ne ramène pas au prix de départ.',
      state: 'Un abonnement coûtait 100 € par mois. Son prix a augmenté de 20 % en janvier, puis baissé de 20 % en juin.',
      questions: {
        back_to_original: { type: 'noul', instructions: 'Après juin, le prix est-il revenu à 100 € ?' },
        direction: { type: 'choice', instructions: 'Par rapport aux 100 € de départ, le prix après juin est :', criteria: { higher: 'Plus élevé', lower: 'Plus bas', same: 'Identique' } },
      },
    },
    en: {
      name: 'Percentage trap',
      description: '+20% then −20% does not return to the starting price.',
      state: 'A subscription cost €100 per month. Its price went up 20% in January, then down 20% in June.',
      questions: {
        back_to_original: { type: 'noul', instructions: 'After June, is the price back to €100?' },
        direction: { type: 'choice', instructions: 'Compared with the original €100, the price after June is:', criteria: { higher: 'Higher', lower: 'Lower', same: 'The same' } },
      },
    },
  },
  {
    id: 'logic',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    expected: { karim_jury: false, lea_jury: 'unknown' },
    fr: {
      name: 'Déduction logique',
      description: 'Contraposée et cas indécidable.',
      state: 'Tous les membres du jury ont lu le dossier. Karim n’a pas lu le dossier. Léa a lu le dossier.',
      questions: {
        karim_jury: { type: 'noul', instructions: 'Karim est-il membre du jury ?' },
        lea_jury: {
          type: 'choice',
          instructions: 'D’après ces seules affirmations, Léa est-elle membre du jury ?',
          criteria: { yes: 'Léa est certainement membre du jury', no: 'Léa n’est certainement pas membre du jury', unknown: 'On ne peut pas le savoir' },
        },
      },
    },
    en: {
      name: 'Logical deduction',
      description: 'Contrapositive and an undecidable case.',
      state: 'Every member of the jury has read the file. Karim has not read the file. Léa has read the file.',
      questions: {
        karim_jury: { type: 'noul', instructions: 'Is Karim a member of the jury?' },
        lea_jury: {
          type: 'choice',
          instructions: 'Based only on these statements, is Léa a member of the jury?',
          criteria: { yes: 'Léa is certainly a jury member', no: 'Léa is certainly not a jury member', unknown: 'It cannot be determined' },
        },
      },
    },
  },
  {
    id: 'resume-screening',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'court',
    // 2024-01 → 2026-06 : 2,5 ans d'expérience.
    expected: { meets_all: false, missing: 'experience' },
    fr: {
      name: 'Présélection de CV',
      description: 'Une exigence sur trois n’est pas remplie.',
      state: {
        requirements: ['Python', 'Au moins 3 ans d’expérience professionnelle', 'Autorisé à travailler dans l’UE'],
        candidate: {
          name: 'Jordan Ellis',
          skills: ['Python', 'SQL', 'Airflow'],
          experience: [{ company: 'DataNest', role: 'Data engineer', from: '2024-01', to: 'aujourd’hui' }],
          work_authorization: 'Citoyen de l’UE (Irlande)',
          as_of: '2026-06',
        },
      },
      questions: {
        meets_all: { type: 'noul', instructions: '`candidate` remplit-il toutes les `requirements` ?' },
        missing: {
          type: 'choice',
          instructions: 'Quelle exigence n’est pas remplie ?',
          criteria: { python: 'Python', experience: 'Années d’expérience', authorization: 'Autorisation de travail', none: 'Toutes les exigences sont remplies' },
        },
      },
    },
    en: {
      name: 'Résumé screening',
      description: 'One requirement out of three is not met.',
      state: {
        requirements: ['Python', 'At least 3 years of professional experience', 'Authorized to work in the EU'],
        candidate: {
          name: 'Jordan Ellis',
          skills: ['Python', 'SQL', 'Airflow'],
          experience: [{ company: 'DataNest', role: 'Data engineer', from: '2024-01', to: 'present' }],
          work_authorization: 'EU citizen (Ireland)',
          as_of: '2026-06',
        },
      },
      questions: {
        meets_all: { type: 'noul', instructions: 'Does `candidate` meet all `requirements`?' },
        missing: {
          type: 'choice',
          instructions: 'Which requirement is not met?',
          criteria: { python: 'Python', experience: 'Years of experience', authorization: 'Work authorization', none: 'All requirements are met' },
        },
      },
    },
  },
  {
    id: 'medical-triage',
    category: 'Support',
    complexity: 'simple',
    length: 'court',
    expected: { call_emergency: true, priority: 3 },
    fr: {
      name: 'Triage médical',
      description: 'Symptômes d’urgence vitale.',
      state: 'Homme de 58 ans, douleur thoracique intense et oppressante depuis 20 minutes, qui irradie dans le bras gauche et la mâchoire, avec sueurs froides et nausées.',
      questions: {
        call_emergency: { type: 'noul', instructions: 'Faut-il appeler immédiatement les secours ?' },
        priority: {
          type: 'score',
          instructions: 'Niveau de priorité de prise en charge',
          criteria: ['Consultation non urgente', 'Consultation dans la journée', 'Urgences dans l’heure', 'Urgence vitale immédiate'],
        },
      },
    },
    en: {
      name: 'Medical triage',
      description: 'Life-threatening symptoms.',
      state: '58-year-old man, intense, crushing chest pain for 20 minutes, radiating to the left arm and jaw, with cold sweats and nausea.',
      questions: {
        call_emergency: { type: 'noul', instructions: 'Should emergency services be called immediately?' },
        priority: {
          type: 'score',
          instructions: 'Care priority level',
          criteria: ['Non-urgent appointment', 'Same-day appointment', 'Emergency room within the hour', 'Immediate life-threatening emergency'],
        },
      },
    },
  },
  {
    id: 'citation-check',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    expected: { supported: false, support_level: 0 },
    fr: {
      name: 'Vérification de citation',
      description: 'La source contredit l’affirmation (piège sur une date).',
      state: {
        source: 'La tour Eiffel a été achevée en mars 1889 pour l’Exposition universelle. Haute de 330 mètres, elle est restée la plus haute structure construite par l’homme jusqu’en 1930, date à laquelle le Chrysler Building l’a dépassée.',
        claim: 'La tour Eiffel est restée la plus haute structure du monde jusque dans les années 1950.',
      },
      questions: {
        supported: { type: 'noul', instructions: '`claim` est-elle entièrement confirmée par `source` ?' },
        support_level: {
          type: 'score',
          instructions: 'Dans quelle mesure `source` soutient-elle `claim` ?',
          criteria: ['La source contredit l’affirmation', 'La source n’aborde pas le sujet', 'La source soutient partiellement l’affirmation', 'La source soutient entièrement l’affirmation'],
        },
      },
    },
    en: {
      name: 'Citation check',
      description: 'The source contradicts the claim (date trap).',
      state: {
        source: 'The Eiffel Tower was completed in March 1889 for the World’s Fair. At 330 metres, it remained the tallest man-made structure until 1930, when the Chrysler Building surpassed it.',
        claim: 'The Eiffel Tower remained the tallest structure in the world until the 1950s.',
      },
      questions: {
        supported: { type: 'noul', instructions: 'Is `claim` fully supported by `source`?' },
        support_level: {
          type: 'score',
          instructions: 'How well does `source` support `claim`?',
          criteria: ['The source contradicts the claim', 'The source does not address the claim', 'The source partially supports the claim', 'The source fully supports the claim'],
        },
      },
    },
  },
  {
    id: 'dedup',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'court',
    expected: { same_as_a: true, same_as_b: false },
    fr: {
      name: 'Déduplication de contacts',
      description: 'Même personne sous un nom abrégé, puis homonyme.',
      state: { contact: { name: 'Jean-Baptiste Martin', city: 'Lyon', employer: 'Rhône Logistique', role: 'Responsable des achats', birth_year: 1984 } },
      questions: {
        same_as_a: {
          type: 'noul',
          instructions: { candidate: { name: 'J.-B. Martin', city: 'Lyon', employer: 'Rhône Logistique', role: 'Responsable achats' }, question: '`contact` et `candidate` désignent-ils la même personne ?' },
        },
        same_as_b: {
          type: 'noul',
          instructions: { candidate: { name: 'Jean-Baptiste Martin', city: 'Brest', employer: 'Marine nationale', role: 'Officier mécanicien', birth_year: 1961 }, question: '`contact` et `candidate` désignent-ils la même personne ?' },
        },
      },
    },
    en: {
      name: 'Contact deduplication',
      description: 'Same person under an abbreviated name, then a namesake.',
      state: { contact: { name: 'Jean-Baptiste Martin', city: 'Lyon', employer: 'Rhône Logistique', role: 'Purchasing manager', birth_year: 1984 } },
      questions: {
        same_as_a: {
          type: 'noul',
          instructions: { candidate: { name: 'J.-B. Martin', city: 'Lyon', employer: 'Rhône Logistique', role: 'Purchasing manager' }, question: 'Are `contact` and `candidate` the same person?' },
        },
        same_as_b: {
          type: 'noul',
          instructions: { candidate: { name: 'Jean-Baptiste Martin', city: 'Brest', employer: 'French Navy', role: 'Engineering officer', birth_year: 1961 }, question: 'Are `contact` and `candidate` the same person?' },
        },
      },
    },
  },
  {
    id: 'listing-10q',
    category: 'Extraction',
    complexity: 'simple',
    length: 'moyen',
    expected: {
      is_used: true,
      is_android: false,
      price_under_500: true,
      free_shipping: true,
      battery_above_90: false,
      has_scratches: true,
      charger_included: false,
      carrier_locked: false,
      professional_seller: false,
      accepts_trade: false,
    },
    fr: {
      name: 'Petite annonce : 10 questions',
      description: 'Texte court, beaucoup de questions.',
      state: 'iPhone 13, 128 Go, bleu. Occasion, très bon état : quelques micro-rayures au dos, écran intact. Batterie à 89 %. Vendu avec la boîte d’origine et un câble USB-C vers Lightning, sans chargeur secteur. Débloqué tout opérateur. Prix : 430 €, livraison offerte. Remise en main propre possible à Lyon. Vendu par un particulier, pas d’échange.',
      questions: {
        is_used: { type: 'noul', instructions: 'Le produit est-il d’occasion ?' },
        is_android: { type: 'noul', instructions: 'Le téléphone fonctionne-t-il sous Android ?' },
        price_under_500: { type: 'noul', instructions: 'Le prix est-il inférieur à 500 € ?' },
        free_shipping: { type: 'noul', instructions: 'La livraison est-elle gratuite ?' },
        battery_above_90: { type: 'noul', instructions: 'La batterie est-elle au-dessus de 90 % ?' },
        has_scratches: { type: 'noul', instructions: 'L’annonce mentionne-t-elle des rayures ?' },
        charger_included: { type: 'noul', instructions: 'Un chargeur secteur est-il fourni ?' },
        carrier_locked: { type: 'noul', instructions: 'Le téléphone est-il bloqué sur un opérateur ?' },
        professional_seller: { type: 'noul', instructions: 'Le vendeur est-il un professionnel ?' },
        accepts_trade: { type: 'noul', instructions: 'Le vendeur accepte-t-il les échanges ?' },
      },
    },
    en: {
      name: 'Classified ad: 10 questions',
      description: 'Short text, many questions.',
      state: 'iPhone 13, 128 GB, blue. Used, very good condition: a few micro-scratches on the back, screen intact. Battery at 89%. Sold with the original box and a USB-C to Lightning cable, no wall charger. Unlocked, works with all carriers. Price: €430, free shipping. Local pickup possible in Lyon. Private seller, no trades.',
      questions: {
        is_used: { type: 'noul', instructions: 'Is the product used?' },
        is_android: { type: 'noul', instructions: 'Does the phone run Android?' },
        price_under_500: { type: 'noul', instructions: 'Is the price below €500?' },
        free_shipping: { type: 'noul', instructions: 'Is shipping free?' },
        battery_above_90: { type: 'noul', instructions: 'Is the battery above 90%?' },
        has_scratches: { type: 'noul', instructions: 'Does the ad mention scratches?' },
        charger_included: { type: 'noul', instructions: 'Is a wall charger included?' },
        carrier_locked: { type: 'noul', instructions: 'Is the phone locked to a carrier?' },
        professional_seller: { type: 'noul', instructions: 'Is the seller a professional?' },
        accepts_trade: { type: 'noul', instructions: 'Does the seller accept trades?' },
      },
    },
  },
  {
    id: 'return-policy',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Électronique : 15 jours, ouvert ou non. 20 jours > 15.
    expected: { eligible: false, reason: 'window' },
    fr: {
      name: 'Politique de retour',
      description: 'Délai propre à une catégorie de produits.',
      state: RETURN_POLICY.fr,
      questions: {
        eligible: { type: 'noul', instructions: 'Le client peut-il retourner l’ordinateur selon `policy` ?' },
        reason: {
          type: 'choice',
          instructions: 'Quel est l’élément déterminant ?',
          criteria: { window: 'Le délai de retour est dépassé', opened: 'Le produit a été ouvert', accessories: 'Des accessoires manquent', final_sale: 'Article ni repris ni échangé', none: 'Rien, le retour est accepté' },
        },
      },
    },
    en: {
      name: 'Return policy',
      description: 'Category-specific return window.',
      state: RETURN_POLICY.en,
      questions: {
        eligible: { type: 'noul', instructions: 'Can the customer return the laptop under `policy`?' },
        reason: {
          type: 'choice',
          instructions: 'What is the deciding factor?',
          criteria: { window: 'The return window has passed', opened: 'The item was opened', accessories: 'Missing accessories', final_sale: 'Final sale item', none: 'Nothing, the return is accepted' },
        },
      },
    },
  },
  {
    id: 'steering-committee',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Report au T1 : au moins 2 × 18 000 € = 36 000 €.
    expected: { decision: 'maintained', security_owner: 'Claire', budget_approved: false, can_announce_date: false, delay_cost_over_30k: true },
    fr: {
      name: 'Compte rendu de comité',
      description: 'Réunion longue : décision conditionnelle, responsable, budget.',
      state: MEETING.fr,
      questions: {
        decision: {
          type: 'choice',
          instructions: 'Quelle décision a été prise sur la date de bascule ?',
          criteria: { maintained: 'Bascule maintenue à mi-novembre, sous condition', postponed: 'Bascule reportée au premier trimestre', cancelled: 'Migration annulée', none: 'Aucune décision prise' },
        },
        security_owner: {
          type: 'choice',
          instructions: 'Qui est responsable du feu vert sécurité ?',
          criteria: { Nadia: 'Nadia', Paul: 'Paul', Claire: 'Claire', Hugo: 'Hugo', Ines: 'Inès' },
        },
        budget_approved: { type: 'noul', instructions: 'Le budget d’astreinte a-t-il été validé pendant la réunion ?' },
        can_announce_date: { type: 'noul', instructions: 'Peut-on annoncer dès maintenant une date ferme aux utilisateurs ?' },
        delay_cost_over_30k: { type: 'noul', instructions: 'Un report au premier trimestre coûterait-il plus de 30 000 € ?' },
      },
    },
    en: {
      name: 'Committee minutes',
      description: 'Long meeting: conditional decision, owner, budget.',
      state: MEETING.en,
      questions: {
        decision: {
          type: 'choice',
          instructions: 'What was decided about the cutover date?',
          criteria: { maintained: 'Cutover kept in mid-November, conditionally', postponed: 'Cutover postponed to the first quarter', cancelled: 'Migration cancelled', none: 'No decision made' },
        },
        security_owner: {
          type: 'choice',
          instructions: 'Who is responsible for the security sign-off?',
          criteria: { Nadia: 'Nadia', Paul: 'Paul', Claire: 'Claire', Hugo: 'Hugo', Ines: 'Inès' },
        },
        budget_approved: { type: 'noul', instructions: 'Was the on-call budget approved during the meeting?' },
        can_announce_date: { type: 'noul', instructions: 'Can a firm date be announced to users right now?' },
        delay_cost_over_30k: { type: 'noul', instructions: 'Would postponing to the first quarter cost more than €30,000?' },
      },
    },
  },
  {
    id: 'tickets-needle',
    category: 'Long context',
    complexity: 'complexe',
    length: 'très long',
    // syntheticTickets : seul T-1044 (Halvorsen Logistics) menace de poursuites ; aucun modèle ne parle de sécurité.
    expected: { legal_threat: true, legal_customer: 'halvorsen', security_incident: false },
    fr: {
      name: 'File de support (contexte long)',
      description: '70 tickets en JSON : retrouver la seule menace de poursuites.',
      state: { tickets: syntheticTickets('fr') },
      questions: {
        legal_threat: { type: 'noul', instructions: 'Un ticket de `tickets` menace-t-il d’une action en justice ?' },
        legal_customer: {
          type: 'choice',
          instructions: 'Quel client menace d’une action en justice ?',
          criteria: { acme: 'Acme Retail', bluefin: 'Bluefin Labs', cedar: 'Cedar Health', halvorsen: 'Halvorsen Logistics', none: 'Aucun client' },
        },
        security_incident: { type: 'noul', instructions: 'Un ticket signale-t-il une faille de sécurité ou une fuite de données ?' },
      },
    },
    en: {
      name: 'Support queue (long context)',
      description: '70 tickets in JSON: find the single legal threat.',
      state: { tickets: syntheticTickets('en') },
      questions: {
        legal_threat: { type: 'noul', instructions: 'Does any ticket in `tickets` threaten legal action?' },
        legal_customer: {
          type: 'choice',
          instructions: 'Which customer threatened legal action?',
          criteria: { acme: 'Acme Retail', bluefin: 'Bluefin Labs', cedar: 'Cedar Health', halvorsen: 'Halvorsen Logistics', none: 'No customer' },
        },
        security_incident: { type: 'noul', instructions: 'Does any ticket report a security breach or data leak?' },
      },
    },
  },
]

/** Les cas du benchmark core dans une langue ; identifiants identiques d'une langue à l'autre. */
export function coreCases(lang: CoreLang): BenchCase[] {
  return PAIRS.map((p) => {
    checkPair(p)
    const side = p[lang]
    return {
      id: p.id,
      name: side.name,
      description: side.description,
      category: p.category,
      complexity: p.complexity,
      length: p.length,
      lang,
      request: { state: side.state, questions: side.questions },
      expected: p.expected,
    }
  })
}
