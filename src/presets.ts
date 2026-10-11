import type { Json, SystemOneRequest } from './types'

export interface Preset {
  name: string
  description: string
  request: SystemOneRequest
  /** States d'exemple pour le mode lot, sur les mêmes questions. */
  batch?: Json[]
}

export const PRESETS: Preset[] = [
  {
    name: 'Triage de support',
    description: 'Noul + Choice + Score sur un ticket client.',
    request: {
      model: 'clef',
      state: 'Help! My payouts have been failing for 3 days.',
      questions: {
        is_urgent: {
          type: 'noul',
          instructions: 'Does this convey urgency?',
          criteria: { true: 'Explicitly time-sensitive', false: 'No urgency expressed' },
        },
        department: {
          type: 'choice',
          instructions: 'Which team should handle this?',
          criteria: {
            billing: 'Payments, invoicing, refunds',
            technical: 'Bugs, outages, integrations',
            sales: 'Pricing, upgrades, new accounts',
          },
        },
        frustration: {
          type: 'score',
          instructions: 'How frustrated is the customer?',
          criteria: ['Calm', 'Frustrated', 'Very angry'],
        },
      },
    },
    batch: [
      'Help! My payouts have been failing for 3 days.',
      'Hi, how much is the Enterprise plan for 50 seats?',
      'Your API returns 500 on every webhook since this morning, production is down!!!',
      'I was charged twice this month, can you refund one of them?',
      'Bonjour, je voudrais passer au plan supérieur, comment faire ?',
      'This is the third time I write. Nobody answers. I am cancelling.',
    ],
  },
  {
    name: 'Avis produit (FR)',
    description: 'Sentiment gradué et aspects mentionnés, en français.',
    request: {
      model: 'clef',
      state: "Produit reçu avec une semaine de retard et le carton était abîmé, mais la machine fonctionne très bien et le café est excellent.",
      questions: {
        sentiment: {
          type: 'score',
          instructions: "Quel est le sentiment global de l'avis ?",
          criteria: ['Très négatif', 'Plutôt négatif', 'Mitigé ou neutre', 'Plutôt positif', 'Très positif'],
        },
        main_aspect: {
          type: 'choice',
          instructions: "Quel aspect est le plus important pour l'auteur de l'avis ?",
          criteria: {
            livraison: 'Délais, emballage, transporteur',
            qualite: 'Fonctionnement, durabilité, résultat',
            prix: 'Rapport qualité-prix, promotions',
            service: 'Service client, SAV, retours',
          },
        },
        mentions_delivery_issue: { type: 'noul', instructions: "L'avis mentionne-t-il un problème de livraison ?" },
        would_recommend: { type: 'noul', instructions: "L'auteur recommanderait-il probablement ce produit ?" },
      },
    },
    batch: [
      'Parfait, rien à redire, je recommande à 100 %.',
      'Cassé au bout de deux semaines, le SAV ne répond pas. Arnaque.',
      "Correct pour le prix, sans plus.",
      'Livraison express, très bien emballé. Par contre le produit est bruyant.',
    ],
  },
  {
    name: 'Modération',
    description: 'Plusieurs Noul indépendants (multi-label) + catégorie.',
    request: {
      model: 'clef',
      state: "Contact me at john.doe@gmail.com or 06 12 34 56 78 for cheap followers, best price guaranteed!!!",
      questions: {
        is_spam: { type: 'noul', instructions: 'Is this message unsolicited advertising or spam?' },
        has_personal_info: {
          type: 'noul',
          instructions: 'Does the message contain personal contact information (email, phone, address)?',
        },
        is_toxic: { type: 'noul', instructions: 'Is the message insulting, harassing or hateful toward someone?' },
        category: {
          type: 'choice',
          instructions: 'What is the main moderation category for this message?',
          criteria: {
            ok: 'Acceptable content, no action needed',
            spam: 'Advertising, scams, unsolicited promotion',
            harassment: 'Insults or attacks targeting a person',
            hate: 'Attacks on a group based on identity',
            other: 'Another policy problem',
          },
        },
      },
    },
    batch: [
      'Thanks for the help yesterday, it worked!',
      'You are an idiot and everyone here hates you.',
      'BUY CHEAP WATCHES NOW www.cheap-watches.biz',
      'My address is 12 rue de la Paix, can someone pick up the package?',
    ],
  },
  {
    name: "Routage d'intention",
    description: 'Choisir la fonction à appeler, avec une option « none ».',
    request: {
      model: 'clef',
      state: { user_message: 'Remind me to call the dentist tomorrow at 9', timezone: 'Europe/Paris' },
      questions: {
        tool: {
          type: 'choice',
          instructions: 'Which function should handle `user_message`?',
          criteria: {
            get_weather: 'Questions about weather or forecasts',
            create_reminder: 'Set a reminder or alarm at a given time',
            send_email: 'Write or send an email to someone',
            search_web: 'Look up general information online',
            none: 'Small talk or nothing actionable',
          },
        },
        has_explicit_time: { type: 'noul', instructions: 'Does `user_message` specify an explicit date or time?' },
      },
    },
    batch: [
      { user_message: "What's the weather like in Lyon this weekend?" },
      { user_message: 'Send an email to Paul saying I will be late' },
      { user_message: 'lol thanks' },
      { user_message: 'Who won the 2018 World Cup?' },
    ],
  },
  {
    name: 'Déduplication',
    description: 'State structuré + instructions sous forme d’objet.',
    request: {
      model: 'clef',
      state: {
        resume: {
          name: 'Jonathan Smith',
          city: 'Oakland, CA',
          experience: [{ company: 'Google', role: 'Software Engineer', years: '2016-2022' }],
        },
      },
      questions: {
        same_person: {
          type: 'noul',
          instructions: {
            potential_duplicate: { name: 'John Smith', location: 'Oakland, California', last_employer: 'Google' },
            question: 'Is `resume` for the same person as `potential_duplicate`?',
          },
        },
      },
    },
  },
  {
    name: 'Vérification de citation',
    description: 'Une affirmation est-elle soutenue par la source ?',
    request: {
      model: 'clef',
      state: {
        source:
          'The Eiffel Tower was completed in March 1889 for the World Fair. It is 330 metres tall and was the tallest man-made structure until 1930.',
        claim: 'The Eiffel Tower was the tallest structure in the world until the 1950s.',
      },
      questions: {
        supported: { type: 'noul', instructions: 'Is `claim` fully supported by `source`?' },
        support_level: {
          type: 'score',
          instructions: 'How well does `source` support `claim`?',
          criteria: [
            'The source contradicts the claim',
            'The source does not address the claim',
            'The source partially supports the claim',
            'The source fully supports the claim',
          ],
        },
      },
    },
  },
  {
    name: 'Détection de langue',
    description: 'Choice simple, utile pour tester le multilingue.',
    request: {
      model: 'clef',
      state: '¿Dónde está la estación de tren más cercana?',
      questions: {
        language: {
          type: 'choice',
          instructions: 'In which language is this text written?',
          criteria: { fr: 'French', en: 'English', es: 'Spanish', de: 'German', it: 'Italian', other: null },
        },
      },
    },
    batch: ['Où est la gare ?', 'Where is the station?', 'Wo ist der Bahnhof?', 'Dov’è la stazione?', 'Onde fica a estação?'],
  },
]
