import type { Pair } from './pair.ts'

// Savoir s’abstenir : réponse absente du texte malgré des éléments proches, présupposé faux, sources contradictoires,
// attribution incertaine, référence réellement ambiguë, données incomplètes qui empêchent un calcul, et calibration
// quand le texte est équivoque. En contrepoint, environ un tiers des questions ont une réponse bien présente (parfois
// enfouie ou à déduire) : répondre systématiquement « le texte ne le précise pas » ne paie pas.

// ─── Textes longs ────────────────────────────────────────────────────────────

const COPRO_MINUTES = {
  fr: `Procès-verbal de l’assemblée générale — Résidence Les Tilleuls, 14 mai 2025

Présents ou représentés : 23 copropriétaires sur 31, totalisant 7 120 tantièmes sur 10 000.

1. Approbation des comptes 2024
Les comptes de l’exercice 2024 sont approuvés à l’unanimité des présents. Le syndic rappelle que le budget prévisionnel 2025 s’élève à 48 000 €, en hausse de 4 % par rapport à 2024, principalement à cause du contrat d’entretien de la chaufferie.

2. Remplacement de l’ascenseur
Trois devis ont été présentés : Ascenda à 21 000 €, Elevis à 18 400 € et Monteo à 14 800 €. Le conseil syndical signale que le devis Monteo n’inclut pas la mise aux normes des portes palières, ce qui le rendrait en réalité plus cher. Après débat, l’assemblée retient le devis Elevis. Elevis indique pouvoir intervenir dans un délai de six semaines après la signature du bon de commande ; le syndic précise qu’il ne signera qu’une fois le premier appel de fonds encaissé.

3. Ravalement de la façade
M. Lemoine présente l’état de la façade côté rue. Plusieurs copropriétaires demandent un second devis avant de se prononcer. La résolution est reportée à la prochaine assemblée ; aucun vote n’a lieu sur ce point.

4. Dégât des eaux au 4e étage
Une fuite a endommagé en mars le plafond de l’appartement de Mme Bertin, au 3e étage. L’appartement situé juste au-dessus appartient à M. Dubreuil, mais la canalisation en cause passe aussi dans la gaine commune. L’expert mandaté par l’assurance n’a pas encore rendu son rapport ; M. Dubreuil conteste toute responsabilité.

5. Local à vélos
La demande d’agrandissement du local à vélos, déposée par six copropriétaires, est adoptée à la majorité de l’article 24. Les travaux, estimés à 2 300 €, seront réalisés pendant l’été.

6. Questions diverses
Le gardien, M. Sanchez, partira à la retraite en fin d’année ; le syndic lancera le recrutement de son remplaçant à la rentrée. Mme Okafor signale que l’éclairage du parking est défaillant depuis plusieurs semaines ; le syndic s’engage à faire intervenir un électricien.

La prochaine assemblée générale est fixée au jeudi 12 mars 2026 à 18 h 30, dans la salle polyvalente de la mairie.

La séance est levée à 21 h 10.`,
  en: `Minutes of the general meeting — Les Tilleuls residence, May 14, 2025

Present or represented: 23 co-owners out of 31, holding 7,120 shares out of 10,000.

1. Approval of the 2024 accounts
The accounts for 2024 are approved unanimously by those present. The managing agent points out that the 2025 budget amounts to €48,000, up 4% on 2024, mainly because of the boiler room maintenance contract.

2. Lift replacement
Three quotes were presented: Ascenda at €21,000, Elevis at €18,400 and Monteo at €14,800. The owners’ council notes that the Monteo quote does not include bringing the landing doors up to standard, which would actually make it more expensive. After discussion, the meeting chooses the Elevis quote. Elevis says it can start work within six weeks of the purchase order being signed; the managing agent specifies that he will only sign once the first call for funds has been collected.

3. Façade renovation
Mr. Lemoine presents the condition of the street-side façade. Several co-owners ask for a second quote before deciding. The resolution is postponed to the next meeting; no vote is held on this item.

4. Water damage on the 4th floor
In March, a leak damaged the ceiling of Mrs. Bertin’s flat on the 3rd floor. The flat directly above belongs to Mr. Dubreuil, but the pipe involved also runs through the shared service duct. The expert appointed by the insurer has not yet submitted his report; Mr. Dubreuil denies any liability.

5. Bike room
The request to enlarge the bike room, submitted by six co-owners, is adopted by a simple majority. The work, estimated at €2,300, will be carried out over the summer.

6. Any other business
The caretaker, Mr. Sanchez, will retire at the end of the year; the managing agent will start recruiting his replacement in September. Mrs. Okafor reports that the car park lighting has been faulty for several weeks; the managing agent undertakes to call in an electrician.

The next general meeting is set for Thursday, March 12, 2026 at 6:30 pm, in the town hall’s community room.

The meeting closes at 9:10 pm.`,
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const ABSTENTION: Pair[] = [
  {
    id: 'abs-refund-presupposition',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'court',
    // Présupposé faux : le client a choisi l’échange, aucun remboursement n’a eu lieu. La date d’expédition, elle, est donnée (18 mars).
    // Rien n’est dit sur des frais pour l’échange ; la confirmation de réception du 21 mars répond à la dernière question.
    expected: { refund_date: 'no_refund', shipped_date: 'march_18', exchange_fee: false, replacement_received: true },
    fr: {
      name: 'Remboursement qui n’a pas eu lieu',
      description: 'Une question présuppose un remboursement alors que le client a choisi l’échange.',
      state:
        'Ticket n° 4471 — Client : Paul Mercier.\n12 mars : le client signale que sa bouilloire (commande C-2291, 49,90 €) ne chauffe plus.\n14 mars : l’agente, Léa, lui propose soit un remboursement, soit un échange ; le client choisit l’échange.\n18 mars : la bouilloire de remplacement est expédiée.\n21 mars : le client confirme la réception et le ticket est clos.',
      questions: {
        refund_date: {
          type: 'choice',
          instructions: 'Quel jour le remboursement a-t-il été effectué ?',
          criteria: { march_14: 'Le 14 mars', march_18: 'Le 18 mars', march_21: 'Le 21 mars', no_refund: 'Aucun remboursement n’a été effectué' },
        },
        shipped_date: {
          type: 'choice',
          instructions: 'Quel jour la bouilloire de remplacement a-t-elle été expédiée ?',
          criteria: { not_stated: 'Le texte ne le précise pas', march_14: 'Le 14 mars', march_18: 'Le 18 mars', march_21: 'Le 21 mars' },
        },
        exchange_fee: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que le client a payé des frais de port pour l’échange ?' },
        replacement_received: { type: 'noul', instructions: 'Le client a-t-il reçu la bouilloire de remplacement ?' },
      },
    },
    en: {
      name: 'Refund that never happened',
      description: 'A question presupposes a refund, but the customer chose an exchange.',
      state:
        'Ticket #4471 — Customer: Paul Mercier.\nMarch 12: the customer reports that his kettle (order C-2291, €49.90) no longer heats up.\nMarch 14: the agent, Léa, offers him either a refund or an exchange; the customer chooses the exchange.\nMarch 18: the replacement kettle is shipped.\nMarch 21: the customer confirms receipt and the ticket is closed.',
      questions: {
        refund_date: {
          type: 'choice',
          instructions: 'On what day was the refund made?',
          criteria: { march_14: 'March 14', march_18: 'March 18', march_21: 'March 21', no_refund: 'No refund was made' },
        },
        shipped_date: {
          type: 'choice',
          instructions: 'On what day was the replacement kettle shipped?',
          criteria: { not_stated: 'The text doesn’t say', march_14: 'March 14', march_18: 'March 18', march_21: 'March 21' },
        },
        exchange_fee: { type: 'noul', instructions: 'Can we say from the text that the customer paid shipping costs for the exchange?' },
        replacement_received: { type: 'noul', instructions: 'Did the customer receive the replacement kettle?' },
      },
    },
  },
  {
    id: 'abs-missing-price',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'court',
    // Chaises : 12 × 45 = 540 € HT. Le prix des tables manque : le total est indéterminable.
    // Mais les chaises seules dépassent déjà 500 € : la livraison est offerte quel que soit le prix des tables.
    expected: { chairs_total: 'eur_540', order_total: 'unknown', free_delivery: true, table_dearer: false },
    fr: {
      name: 'Prix manquant',
      description: 'Un prix « à confirmer » bloque le total, mais pas le seuil de livraison gratuite.',
      state:
        'Devis pour l’atelier Garnier : 12 chaises à 45 € HT pièce et 3 tables (prix à confirmer par le fournisseur). Livraison offerte pour toute commande de plus de 500 € HT.',
      questions: {
        chairs_total: {
          type: 'choice',
          instructions: 'Quel est le montant HT des chaises ?',
          criteria: { eur_495: '495 €', eur_540: '540 €', eur_600: '600 €', unknown: 'Impossible à déterminer' },
        },
        order_total: {
          type: 'choice',
          instructions: 'Quel est le montant HT total de la commande ?',
          criteria: { eur_540: '540 €', unknown: 'Impossible à déterminer', eur_675: '675 €', eur_1080: '1 080 €' },
        },
        free_delivery: { type: 'noul', instructions: 'La livraison sera-t-elle offerte pour cette commande ?' },
        table_dearer: { type: 'noul', instructions: 'Le texte permet-il d’affirmer qu’une table coûte plus cher qu’une chaise ?' },
      },
    },
    en: {
      name: 'Missing price',
      description: 'A price “to be confirmed” blocks the total, but not the free-delivery threshold.',
      state:
        'Quote for the Garnier workshop: 12 chairs at €45 each excl. VAT and 3 tables (price to be confirmed by the supplier). Free delivery on any order over €500 excl. VAT.',
      questions: {
        chairs_total: {
          type: 'choice',
          instructions: 'What is the amount for the chairs, excl. VAT?',
          criteria: { eur_495: '€495', eur_540: '€540', eur_600: '€600', unknown: 'Impossible to determine' },
        },
        order_total: {
          type: 'choice',
          instructions: 'What is the total amount of the order, excl. VAT?',
          criteria: { eur_540: '€540', unknown: 'Impossible to determine', eur_675: '€675', eur_1080: '€1,080' },
        },
        free_delivery: { type: 'noul', instructions: 'Will delivery be free for this order?' },
        table_dearer: { type: 'noul', instructions: 'Can we say from the text that a table costs more than a chair?' },
      },
    },
  },
  {
    id: 'abs-meeting-room',
    category: 'Abstention',
    complexity: 'simple',
    length: 'court',
    // Deux salles sont citées, mais pour dire qu’elles sont indisponibles : la salle n’est pas encore connue. L’heure, elle, est donnée.
    expected: { room: 'not_stated', time: 'ten', vega_free: false },
    fr: {
      name: 'Salle pas encore connue',
      description: 'Les salles citées sont indisponibles ; la vraie salle n’est pas annoncée.',
      state:
        'Message de Sabine : « La réunion de lancement du projet Hélios aura lieu jeudi à 10 h. La salle Orion est en travaux cette semaine et la salle Véga est réservée par la direction jeudi toute la matinée. Je vous confirme la salle dès que possible. »',
      questions: {
        room: {
          type: 'choice',
          instructions: 'Dans quelle salle aura lieu la réunion de lancement ?',
          criteria: { orion: 'Salle Orion', vega: 'Salle Véga', not_stated: 'Le texte ne le précise pas', lyra: 'Salle Lyra' },
        },
        time: {
          type: 'choice',
          instructions: 'À quelle heure commence la réunion de lancement ?',
          criteria: { not_stated: 'Le texte ne le précise pas', nine: '9 h', ten: '10 h', two_pm: '14 h' },
        },
        vega_free: { type: 'noul', instructions: 'La salle Véga est-elle disponible jeudi à 10 h ?' },
      },
    },
    en: {
      name: 'Room not known yet',
      description: 'The rooms mentioned are unavailable; the actual room isn’t announced.',
      state:
        'Message from Sabine: “The Helios project kick-off meeting will take place on Thursday at 10 am. The Orion room is under renovation this week and the Vega room is booked by management all Thursday morning. I’ll confirm the room as soon as I can.”',
      questions: {
        room: {
          type: 'choice',
          instructions: 'In which room will the kick-off meeting take place?',
          criteria: { orion: 'Orion room', vega: 'Vega room', not_stated: 'The text doesn’t say', lyra: 'Lyra room' },
        },
        time: {
          type: 'choice',
          instructions: 'What time does the kick-off meeting start?',
          criteria: { not_stated: 'The text doesn’t say', nine: '9 am', ten: '10 am', two_pm: '2 pm' },
        },
        vega_free: { type: 'noul', instructions: 'Is the Vega room available on Thursday at 10 am?' },
      },
    },
  },
  {
    id: 'abs-conflicting-delivery',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'moyen',
    // Trois sources, deux dates (vendredi, lundi), aucune qui fasse autorité : le commercial le plus récent n’est « pas sûr »
    // et le suivi n’a pas été démenti. Le départ de l’entrepôt (mercredi) n’est annoncé que par le fournisseur et n’est pas contesté.
    expected: { delivery_day: 'undetermined', departure_day: 'wednesday', can_confirm_friday: false, olivier_called: true },
    fr: {
      name: 'Dates de livraison contradictoires',
      description: 'Courriel, suivi et appel donnent des dates différentes, sans arbitrage.',
      state: {
        commande: 'CMD-8812, 20 cartons de papier',
        messages: [
          { quand: 'lundi 9 h', source: 'courriel du fournisseur', texte: 'Votre commande partira de notre entrepôt mercredi et vous sera livrée vendredi.' },
          { quand: 'mardi 8 h', source: 'site de suivi du transporteur', texte: 'Livraison estimée : lundi prochain.' },
          {
            quand: 'mardi 16 h',
            source: 'note d’Olivier (achats)',
            texte: 'J’ai appelé le commercial du fournisseur : il m’a dit vendredi, mais il n’avait pas l’air sûr de lui et n’a pas regardé le suivi.',
          },
        ],
      },
      questions: {
        delivery_day: {
          type: 'choice',
          instructions: 'Quel jour la commande CMD-8812 sera-t-elle livrée ?',
          criteria: {
            wednesday: 'Mercredi',
            friday: 'Vendredi',
            undetermined: 'Les sources se contredisent : impossible de trancher',
            next_monday: 'Lundi prochain',
          },
        },
        departure_day: {
          type: 'choice',
          instructions: 'Selon le fournisseur, quel jour la commande doit-elle quitter l’entrepôt ?',
          criteria: { monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', friday: 'Vendredi', not_stated: 'Le texte ne le précise pas' },
        },
        can_confirm_friday: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que la commande sera livrée vendredi ?' },
        olivier_called: { type: 'noul', instructions: 'Olivier a-t-il parlé au commercial du fournisseur ?' },
      },
    },
    en: {
      name: 'Conflicting delivery dates',
      description: 'Email, tracking and a phone call give different dates, with nothing to settle it.',
      state: {
        order: 'CMD-8812, 20 boxes of paper',
        messages: [
          { when: 'Monday 9 am', source: 'email from the supplier', text: 'Your order will leave our warehouse on Wednesday and will be delivered to you on Friday.' },
          { when: 'Tuesday 8 am', source: 'carrier’s tracking site', text: 'Estimated delivery: next Monday.' },
          {
            when: 'Tuesday 4 pm',
            source: 'note from Olivier (purchasing)',
            text: 'I called the supplier’s sales rep: he told me Friday, but he didn’t sound sure and didn’t check the tracking.',
          },
        ],
      },
      questions: {
        delivery_day: {
          type: 'choice',
          instructions: 'On what day will order CMD-8812 be delivered?',
          criteria: {
            wednesday: 'Wednesday',
            friday: 'Friday',
            undetermined: 'The sources contradict each other: impossible to tell',
            next_monday: 'Next Monday',
          },
        },
        departure_day: {
          type: 'choice',
          instructions: 'According to the supplier, on what day is the order due to leave the warehouse?',
          criteria: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', friday: 'Friday', not_stated: 'The text doesn’t say' },
        },
        can_confirm_friday: { type: 'noul', instructions: 'Can we say from the text that the order will be delivered on Friday?' },
        olivier_called: { type: 'noul', instructions: 'Did Olivier speak to the supplier’s sales rep?' },
      },
    },
  },
  {
    id: 'abs-anonymous-note',
    category: 'Abstention',
    complexity: 'simple',
    length: 'court',
    // Karim ne fait que supposer ; Valérie ne confirme ni ne dément : l’auteur reste inconnu.
    // « Ni confirmé ni démenti » répond à la deuxième question ; le courriel de Bruno, à la troisième.
    expected: { author: 'unknown', valerie_denied: false, bruno_before: true },
    fr: {
      name: 'Post-it anonyme',
      description: 'Une supposition sur l’auteur n’est pas une attribution.',
      state:
        'Un post-it a été retrouvé sur le frigo de la cuisine du 3e étage : « Merci de laver vos tasses ! » Il n’est pas signé. Karim pense que c’est Valérie, parce qu’elle s’est déjà plainte des tasses sales en réunion. Interrogée, Valérie n’a ni confirmé ni démenti. Bruno, l’office manager, avait envoyé le même message par courriel il y a deux semaines.',
      questions: {
        author: {
          type: 'choice',
          instructions: 'Qui a écrit le post-it ?',
          criteria: { valerie: 'Valérie', unknown: 'On ne peut pas le savoir avec certitude', bruno: 'Bruno', karim: 'Karim' },
        },
        valerie_denied: { type: 'noul', instructions: 'Valérie a-t-elle démenti être l’auteur du post-it ?' },
        bruno_before: { type: 'noul', instructions: 'Le même message avait-il déjà été diffusé auparavant ?' },
      },
    },
    en: {
      name: 'Anonymous sticky note',
      description: 'A guess about the author is not an attribution.',
      state:
        'A sticky note was found on the fridge in the 3rd-floor kitchen: “Please wash your mugs!” It isn’t signed. Karim thinks it was Valérie, because she has already complained about dirty mugs in a meeting. When asked, Valérie neither confirmed nor denied it. Bruno, the office manager, had sent the same message by email two weeks ago.',
      questions: {
        author: {
          type: 'choice',
          instructions: 'Who wrote the sticky note?',
          criteria: { valerie: 'Valérie', unknown: 'There is no way to know for sure', bruno: 'Bruno', karim: 'Karim' },
        },
        valerie_denied: { type: 'noul', instructions: 'Did Valérie deny writing the sticky note?' },
        bruno_before: { type: 'noul', instructions: 'Had the same message already been sent out before?' },
      },
    },
  },
  {
    id: 'abs-ambiguous-reference',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'court',
    // « Il » renvoie à Marc ou à Antoine, cités ensemble et à égalité, de même genre dans les deux langues : rien ne permet de trancher.
    // En revanche, le contrat n’a jamais été envoyé, et quelqu’un s’est bien engagé à l’envoyer demain.
    expected: { who_apologised: 'unclear', contract_sent: false, send_when: 'tomorrow', someone_committed: true },
    fr: {
      name: 'Pronom réellement ambigu',
      description: 'Deux antécédents à égalité, sans indice de sens ni de genre.',
      state:
        'Compte rendu — dossier Lambert. Marc et Antoine ont fait le point ce matin. Constat : le contrat signé n’a jamais été envoyé au client. Il s’en est excusé et s’est engagé à l’envoyer demain. Antoine sera en congé à partir de vendredi.',
      questions: {
        who_apologised: {
          type: 'choice',
          instructions: 'Qui s’est excusé de l’oubli du contrat ?',
          criteria: { marc: 'Marc', antoine: 'Antoine', both: 'Marc et Antoine', unclear: 'Le texte ne permet pas de le déterminer' },
        },
        contract_sent: { type: 'noul', instructions: 'Le contrat signé a-t-il été envoyé au client ?' },
        send_when: {
          type: 'choice',
          instructions: 'Quand le contrat doit-il être envoyé ?',
          criteria: { today: 'Aujourd’hui', tomorrow: 'Demain', friday: 'Vendredi', not_stated: 'Le texte ne le précise pas' },
        },
        someone_committed: { type: 'noul', instructions: 'Le texte indique-t-il que quelqu’un s’est engagé à envoyer le contrat ?' },
      },
    },
    en: {
      name: 'Genuinely ambiguous pronoun',
      description: 'Two antecedents on an equal footing, with no clue from meaning or gender.',
      state:
        'Meeting notes — Lambert file. Marc and Antoine reviewed the file this morning. Finding: the signed contract was never sent to the client. He apologised for it and committed to sending it tomorrow. Antoine will be on leave from Friday.',
      questions: {
        who_apologised: {
          type: 'choice',
          instructions: 'Who apologised for forgetting the contract?',
          criteria: { marc: 'Marc', antoine: 'Antoine', both: 'Marc and Antoine', unclear: 'The text doesn’t make it possible to tell' },
        },
        contract_sent: { type: 'noul', instructions: 'Has the signed contract been sent to the client?' },
        send_when: {
          type: 'choice',
          instructions: 'When is the contract due to be sent?',
          criteria: { today: 'Today', tomorrow: 'Tomorrow', friday: 'Friday', not_stated: 'The text doesn’t say' },
        },
        someone_committed: { type: 'noul', instructions: 'Does the text say that someone committed to sending the contract?' },
      },
    },
  },
  {
    id: 'abs-buried-minutes',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'long',
    // Réponses présentes mais dispersées : devis retenu Elevis (18 400 €, pas le moins cher), façade reportée, prochaine AG le 12 mars 2026.
    // Début des travaux d’ascenseur : six semaines après une signature elle-même conditionnée à un encaissement non daté, donc aucune date.
    // La fuite : expertise en cours et canalisation partagée, on ne peut pas l’imputer à M. Dubreuil.
    expected: { elevator_quote: 'q18400', elevator_start: 'not_fixed', facade_decision: 'postponed', leak_dubreuil: false, next_meeting: 'mar_2026' },
    fr: {
      name: 'Procès-verbal de copropriété',
      description: 'Long procès-verbal : réponses enfouies et deux points réellement non tranchés.',
      state: COPRO_MINUTES.fr,
      questions: {
        elevator_quote: {
          type: 'choice',
          instructions: 'Quel est le montant du devis retenu pour l’ascenseur ?',
          criteria: { q21000: '21 000 €', q18400: '18 400 €', q14800: '14 800 €', not_stated: 'Le texte ne le précise pas' },
        },
        elevator_start: {
          type: 'choice',
          instructions: 'Quand les travaux de l’ascenseur commenceront-ils ?',
          criteria: {
            six_weeks: 'Six semaines après l’assemblée',
            summer: 'Pendant l’été',
            not_fixed: 'Aucune date ne peut encore être donnée',
            march: 'En mars 2026',
          },
        },
        facade_decision: {
          type: 'choice',
          instructions: 'Qu’a décidé l’assemblée au sujet du ravalement de la façade ?',
          criteria: {
            adopted: 'Elle l’a adopté',
            rejected: 'Elle l’a rejeté',
            postponed: 'Elle a reporté la décision',
            not_stated: 'Le texte ne le précise pas',
          },
        },
        leak_dubreuil: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que la fuite provient de l’appartement de M. Dubreuil ?' },
        next_meeting: {
          type: 'choice',
          instructions: 'Quand aura lieu la prochaine assemblée générale ?',
          criteria: { not_stated: 'Le texte ne le précise pas', mar_2026: 'Le 12 mars 2026', may_2026: 'Le 14 mai 2026', end_year: 'En fin d’année 2025' },
        },
      },
    },
    en: {
      name: 'Co-ownership meeting minutes',
      description: 'Long minutes: buried answers and two points that are genuinely unresolved.',
      state: COPRO_MINUTES.en,
      questions: {
        elevator_quote: {
          type: 'choice',
          instructions: 'What is the amount of the quote chosen for the lift?',
          criteria: { q21000: '€21,000', q18400: '€18,400', q14800: '€14,800', not_stated: 'The text doesn’t say' },
        },
        elevator_start: {
          type: 'choice',
          instructions: 'When will work on the lift start?',
          criteria: {
            six_weeks: 'Six weeks after the meeting',
            summer: 'Over the summer',
            not_fixed: 'No date can be given yet',
            march: 'In March 2026',
          },
        },
        facade_decision: {
          type: 'choice',
          instructions: 'What did the meeting decide about the façade renovation?',
          criteria: {
            adopted: 'It adopted it',
            rejected: 'It rejected it',
            postponed: 'It postponed the decision',
            not_stated: 'The text doesn’t say',
          },
        },
        leak_dubreuil: { type: 'noul', instructions: 'Can we say from the text that the leak came from Mr. Dubreuil’s flat?' },
        next_meeting: {
          type: 'choice',
          instructions: 'When will the next general meeting take place?',
          criteria: { not_stated: 'The text doesn’t say', mar_2026: 'March 12, 2026', may_2026: 'May 14, 2026', end_year: 'At the end of 2025' },
        },
      },
    },
  },
  {
    id: 'abs-calibration-review',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'court',
    // Avis mitigé : points positifs (livraison, confort) et réserve sur le rapport qualité-prix. Recommandation : probabilité intermédiaire.
    // Deux jours d’usage ne disent rien de la durabilité, ce que l’auteur souligne lui-même. La livraison rapide est affirmée.
    expected: { would_recommend: [0.25, 0.75], durable: [0.2, 0.8], fast_delivery: true },
    fr: {
      name: 'Avis mitigé (calibration)',
      description: 'Avis client en demi-teinte, durabilité impossible à juger.',
      state:
        'Avis client sur le casque Sonar X2 : « Livraison rapide, emballage soigné. Le casque est confortable, mais je ne l’ai utilisé que deux jours, difficile de dire s’il tiendra dans le temps. Le son est correct, sans plus pour ce prix. »',
      questions: {
        would_recommend: { type: 'noul', instructions: 'Ce client recommanderait-il ce casque ?' },
        durable: { type: 'noul', instructions: 'Ce casque est-il durable ?' },
        fast_delivery: { type: 'noul', instructions: 'Le client a-t-il été livré rapidement ?' },
      },
    },
    en: {
      name: 'Mixed review (calibration)',
      description: 'Lukewarm customer review; durability impossible to judge.',
      state:
        'Customer review of the Sonar X2 headphones: “Fast delivery, carefully packaged. The headphones are comfortable, but I’ve only used them for two days, so it’s hard to say whether they’ll last. The sound is fine, nothing special for the price.”',
      questions: {
        would_recommend: { type: 'noul', instructions: 'Would this customer recommend these headphones?' },
        durable: { type: 'noul', instructions: 'Are these headphones durable?' },
        fast_delivery: { type: 'noul', instructions: 'Was the customer’s delivery fast?' },
      },
    },
  },
  {
    id: 'abs-calibration-hiring',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'court',
    // Deux avis favorables, un avis réservé de la décideuse la plus haut placée, deux autres candidats : issue réellement ouverte.
    // L’entretien technique a eu lieu (mardi) ; le comité ne s’est pas encore réuni, donc aucune offre n’a pu être faite.
    expected: { will_be_hired: [0.15, 0.7], technical_done: true, offer_made: false },
    fr: {
      name: 'Recrutement incertain (calibration)',
      description: 'Avis partagés et concurrence : probabilité intermédiaire attendue.',
      state:
        'Candidature de Léon Petit, poste de chef de projet. Entretien RH : avis favorable. Entretien technique (mardi) : avis favorable, « solide, mais manque d’expérience sur les grands comptes ». Entretien avec la directrice des opérations : avis réservé, « à revoir ». Deux autres candidats sont encore en lice. Le comité de recrutement se réunira vendredi pour décider.',
      questions: {
        will_be_hired: { type: 'noul', instructions: 'Léon Petit sera-t-il recruté ?' },
        technical_done: { type: 'noul', instructions: 'Léon Petit a-t-il passé l’entretien technique ?' },
        offer_made: { type: 'noul', instructions: 'Une offre a-t-elle déjà été faite à Léon Petit ?' },
      },
    },
    en: {
      name: 'Uncertain hiring (calibration)',
      description: 'Split opinions and competition: an intermediate probability is expected.',
      state:
        'Application from Léon Petit, project manager position. HR interview: positive. Technical interview (Tuesday): positive, “solid, but lacks experience with key accounts”. Interview with the operations director: reserved, “to be reconsidered”. Two other candidates are still in the running. The hiring committee will meet on Friday to decide.',
      questions: {
        will_be_hired: { type: 'noul', instructions: 'Will Léon Petit be hired?' },
        technical_done: { type: 'noul', instructions: 'Has Léon Petit had the technical interview?' },
        offer_made: { type: 'noul', instructions: 'Has an offer already been made to Léon Petit?' },
      },
    },
  },
  {
    id: 'abs-salary-expectations',
    category: 'Abstention',
    complexity: 'simple',
    length: 'court',
    // « À discuter » : aucune prétention chiffrée, malgré le salaire actuel et la fourchette du poste tout proches.
    // Le salaire actuel, lui, est donné (42 k€). On ne peut donc pas dire si les prétentions entrent dans la fourchette.
    expected: { expected_salary: 'not_stated', current_salary: 'k42', within_range: false },
    fr: {
      name: 'Prétentions salariales non chiffrées',
      description: 'Salaire actuel et fourchette du poste ne disent pas ce que le candidat demande.',
      state: {
        candidat: 'Samir Benali',
        poste: 'Développeur back-end',
        fourchette_du_poste: '45–50 k€ brut annuel',
        salaire_actuel: '42 k€ brut annuel',
        pretentions: 'à discuter',
        disponibilite: 'préavis de deux mois',
      },
      questions: {
        expected_salary: {
          type: 'choice',
          instructions: 'Quel salaire annuel le candidat demande-t-il ?',
          criteria: { k42: '42 k€', k45: '45 k€', k50: '50 k€', not_stated: 'Le texte ne le précise pas' },
        },
        current_salary: {
          type: 'choice',
          instructions: 'Quel est le salaire annuel actuel du candidat ?',
          criteria: { not_stated: 'Le texte ne le précise pas', k42: '42 k€', k45: '45 k€', k50: '50 k€' },
        },
        within_range: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que les prétentions du candidat entrent dans la fourchette du poste ?' },
      },
    },
    en: {
      name: 'Salary expectations not stated',
      description: 'Current salary and the position’s range don’t say what the candidate is asking for.',
      state: {
        candidate: 'Samir Benali',
        position: 'Back-end developer',
        position_range: '€45–50k gross per year',
        current_salary: '€42k gross per year',
        salary_expectations: 'negotiable',
        availability: 'two months’ notice',
      },
      questions: {
        expected_salary: {
          type: 'choice',
          instructions: 'What annual salary is the candidate asking for?',
          criteria: { k42: '€42k', k45: '€45k', k50: '€50k', not_stated: 'The text doesn’t say' },
        },
        current_salary: {
          type: 'choice',
          instructions: 'What is the candidate’s current annual salary?',
          criteria: { not_stated: 'The text doesn’t say', k42: '€42k', k45: '€45k', k50: '€50k' },
        },
        within_range: { type: 'noul', instructions: 'Can we say from the text that the candidate’s expectations fall within the position’s range?' },
      },
    },
  },
  {
    id: 'abs-incident-root-cause',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'moyen',
    // Deux hypothèses, enquête en cours, et le retour arrière DNS n’a pas rétabli le service tout de suite : cause non établie.
    // Durée : 14 h 02 → 14 h 47 = 45 min. 12 clients ont ouvert un ticket, ce qui ne dit pas combien ont été touchés.
    expected: { root_cause: 'not_established', duration: 'min_45', affected_customers: 'not_stated', dns_rolled_back: true },
    fr: {
      name: 'Cause d’incident non établie',
      description: 'Post-mortem provisoire : hypothèses, chiffres voisins, mais pas de conclusion.',
      state:
        'Post-mortem (brouillon) — panne de l’API de paiement, 3 juin.\n\nChronologie : 13 h 55, modification de la configuration DNS par l’équipe infra. 14 h 02, premières erreurs 502. 14 h 15, pic de trafic lié à une campagne d’e-mails envoyée à 14 h. 14 h 40, retour arrière de la modification DNS. 14 h 47, retour à la normale.\n\nImpact : environ 3 200 requêtes en erreur ; 12 clients ont ouvert un ticket au support.\n\nAnalyse : deux hypothèses sont à l’étude, la modification DNS et la saturation due au pic de trafic. Le service ne s’est pas rétabli immédiatement après le retour arrière. L’enquête se poursuit ; aucune conclusion n’est arrêtée.',
      questions: {
        root_cause: {
          type: 'choice',
          instructions: 'Quelle est la cause de la panne ?',
          criteria: {
            dns_change: 'La modification DNS',
            traffic_spike: 'Le pic de trafic',
            not_established: 'La cause n’est pas encore établie',
            db_failover: 'Une bascule de la base de données',
          },
        },
        duration: {
          type: 'choice',
          instructions: 'Combien de temps la panne a-t-elle duré, des premières erreurs au retour à la normale ?',
          criteria: { min_38: '38 minutes', min_45: '45 minutes', min_52: '52 minutes', not_stated: 'Le texte ne permet pas de le dire' },
        },
        affected_customers: {
          type: 'choice',
          instructions: 'Combien de clients ont été touchés par la panne ?',
          criteria: { not_stated: 'Le texte ne le précise pas', c12: '12', c320: '320', c3200: '3 200' },
        },
        dns_rolled_back: { type: 'noul', instructions: 'La modification DNS a-t-elle été annulée ?' },
      },
    },
    en: {
      name: 'Incident cause not established',
      description: 'Draft post-mortem: hypotheses, nearby figures, but no conclusion.',
      state:
        'Post-mortem (draft) — payment API outage, June 3.\n\nTimeline: 1:55 pm, DNS configuration change by the infra team. 2:02 pm, first 502 errors. 2:15 pm, traffic spike from an email campaign sent at 2 pm. 2:40 pm, DNS change rolled back. 2:47 pm, back to normal.\n\nImpact: about 3,200 failed requests; 12 customers opened a support ticket.\n\nAnalysis: two hypotheses are being investigated, the DNS change and saturation caused by the traffic spike. The service did not recover immediately after the rollback. The investigation is ongoing; no conclusion has been reached.',
      questions: {
        root_cause: {
          type: 'choice',
          instructions: 'What caused the outage?',
          criteria: {
            dns_change: 'The DNS change',
            traffic_spike: 'The traffic spike',
            not_established: 'The cause has not been established yet',
            db_failover: 'A database failover',
          },
        },
        duration: {
          type: 'choice',
          instructions: 'How long did the outage last, from the first errors to the return to normal?',
          criteria: { min_38: '38 minutes', min_45: '45 minutes', min_52: '52 minutes', not_stated: 'The text doesn’t make it possible to say' },
        },
        affected_customers: {
          type: 'choice',
          instructions: 'How many customers were affected by the outage?',
          criteria: { not_stated: 'The text doesn’t say', c12: '12', c320: '320', c3200: '3,200' },
        },
        dns_rolled_back: { type: 'noul', instructions: 'Was the DNS change rolled back?' },
      },
    },
  },
  {
    id: 'abs-contract-renewal',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'moyen',
    // Échéance au 31 janvier 2026, préavis de trois mois par recommandé : la résiliation devait arriver fin octobre 2025 au plus tard.
    // Au 15 décembre, aucun courrier : trop tard, le contrat se renouvelle (réponse déductible, pas une abstention).
    // Le prix 2026 dépend d’un indice dont la valeur n’est pas donnée, et le prix 2025 non plus : indéterminable.
    expected: { renews: true, still_in_time: false, price_2026: 'unknown', wanted_to_stop: true },
    fr: {
      name: 'Renouvellement tacite',
      description: 'Le renouvellement se déduit des dates ; le nouveau prix, lui, est incalculable.',
      state:
        'Extrait du contrat de maintenance n° MT-302 :\n« Le présent contrat prend effet le 1er février 2025 pour une durée d’un an. Il se renouvelle tacitement par périodes d’un an, sauf résiliation notifiée par lettre recommandée avec un préavis de trois mois avant l’échéance. Le prix est révisé à chaque renouvellement selon l’indice Syntec. »\n\nNote interne du 15 décembre 2025 : en septembre, le client nous a dit au téléphone qu’il souhaitait arrêter. À ce jour, aucun courrier de sa part n’a été reçu.',
      questions: {
        renews: { type: 'noul', instructions: 'Le contrat MT-302 se renouvellera-t-il le 1er février 2026 ?' },
        still_in_time: { type: 'noul', instructions: 'Au 15 décembre 2025, le client peut-il encore résilier pour l’échéance du 31 janvier 2026 ?' },
        price_2026: {
          type: 'choice',
          instructions: 'Quel sera le prix annuel du contrat à partir de février 2026 ?',
          criteria: {
            same: 'Le même qu’en 2025',
            unknown: 'Impossible à déterminer avec ces informations',
            plus_3: 'Le prix de 2025 augmenté de 3 %',
            free: 'Rien, le contrat est résilié',
          },
        },
        wanted_to_stop: { type: 'noul', instructions: 'Le client a-t-il exprimé le souhait d’arrêter le contrat ?' },
      },
    },
    en: {
      name: 'Automatic renewal',
      description: 'The renewal follows from the dates; the new price, however, can’t be calculated.',
      state:
        'Extract from maintenance contract no. MT-302:\n“This contract takes effect on February 1, 2025 for a period of one year. It renews automatically for one-year periods unless terminated by registered letter with three months’ notice before the end of the term. The price is revised at each renewal according to the Syntec index.”\n\nInternal note of December 15, 2025: in September, the client told us on the phone that they wanted to stop. To date, no letter has been received from them.',
      questions: {
        renews: { type: 'noul', instructions: 'Will contract MT-302 renew on February 1, 2026?' },
        still_in_time: { type: 'noul', instructions: 'As of December 15, 2025, can the client still terminate for the January 31, 2026 end of term?' },
        price_2026: {
          type: 'choice',
          instructions: 'What will the annual price of the contract be from February 2026?',
          criteria: {
            same: 'The same as in 2025',
            unknown: 'Impossible to determine with this information',
            plus_3: 'The 2025 price plus 3%',
            free: 'Nothing, the contract is terminated',
          },
        },
        wanted_to_stop: { type: 'noul', instructions: 'Has the client expressed a wish to stop the contract?' },
      },
    },
  },
  {
    id: 'abs-partial-inventory',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'court',
    // Tours n’est compté qu’à moitié : le total est inconnu, mais au moins 240 + 110 = 350 ≥ 300, ce qui suffit pour la commande.
    // Extrapoler la moitié restante (≈ 220) n’est qu’une estimation : on ne peut pas affirmer que Tours dépasse 200 unités.
    expected: { total_stock: 'impossible', at_least_300: true, tours_over_200: false },
    fr: {
      name: 'Inventaire incomplet',
      description: 'Total inconnu, mais une borne basse suffit pour répondre à la question pratique.',
      state:
        'Inventaire de la référence K-12 au 30 juin. Entrepôt de Rennes : 240 unités. Entrepôt de Tours : comptage interrompu, environ la moitié des rayonnages ont été comptés, soit 110 unités à ce stade. Aucun autre entrepôt ne stocke la référence K-12. Une commande client de 300 unités doit partir le 2 juillet.',
      questions: {
        total_stock: {
          type: 'choice',
          instructions: 'Quel est le stock total de la référence K-12 ?',
          criteria: { impossible: 'Impossible à déterminer', u240: '240 unités', u350: '350 unités', u460: '460 unités' },
        },
        at_least_300: { type: 'noul', instructions: 'Le stock total de K-12 atteint-il au moins 300 unités ?' },
        tours_over_200: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que le stock de Tours dépasse 200 unités ?' },
      },
    },
    en: {
      name: 'Incomplete stocktake',
      description: 'Unknown total, but a lower bound is enough to answer the practical question.',
      state:
        'Stocktake of item K-12 as of June 30. Rennes warehouse: 240 units. Tours warehouse: count interrupted, about half of the shelves have been counted, i.e. 110 units so far. No other warehouse stocks item K-12. A customer order of 300 units is due to ship on July 2.',
      questions: {
        total_stock: {
          type: 'choice',
          instructions: 'What is the total stock of item K-12?',
          criteria: { impossible: 'Impossible to determine', u240: '240 units', u350: '350 units', u460: '460 units' },
        },
        at_least_300: { type: 'noul', instructions: 'Does the total stock of K-12 amount to at least 300 units?' },
        tours_over_200: { type: 'noul', instructions: 'Can we say from the text that the Tours stock exceeds 200 units?' },
      },
    },
  },
  {
    id: 'abs-approval-log',
    category: 'Abstention',
    complexity: 'simple',
    length: 'court',
    // N-102 est approuvée mais antérieure au 1er mars, date à partir de laquelle l’approbateur est enregistré : il est inconnu,
    // et « personne » contredirait le statut. N-101 porte bien le nom de Damien ; N-103 est refusée.
    expected: { n102_approver: 'unknown', n101_damien: true, n103_approved: false },
    fr: {
      name: 'Journal d’approbation lacunaire',
      description: 'Un champ vide qui ne veut pas dire « personne ».',
      state: {
        note: 'Le champ approuve_par n’est renseigné que depuis le 1er mars.',
        notes_de_frais: [
          { id: 'N-101', date: '5 mars', montant_eur: 120, deposee_par: 'Chloé', statut: 'approuvée', approuve_par: 'Damien' },
          { id: 'N-102', date: '20 février', montant_eur: 860, deposee_par: 'Yann', statut: 'approuvée', approuve_par: null },
          { id: 'N-103', date: '10 mars', montant_eur: 45, deposee_par: 'Chloé', statut: 'refusée', approuve_par: null },
        ],
      },
      questions: {
        n102_approver: {
          type: 'choice',
          instructions: 'Qui a approuvé la note de frais N-102 ?',
          criteria: {
            damien: 'Damien',
            unknown: 'Le journal ne permet pas de le savoir',
            yann: 'Yann',
            nobody: 'Personne : elle n’a pas été approuvée',
          },
        },
        n101_damien: { type: 'noul', instructions: 'La note de frais N-101 a-t-elle été approuvée par Damien ?' },
        n103_approved: { type: 'noul', instructions: 'La note de frais N-103 a-t-elle été approuvée ?' },
      },
    },
    en: {
      name: 'Incomplete approval log',
      description: 'An empty field that doesn’t mean “nobody”.',
      state: {
        note: 'The approved_by field has only been filled in since March 1.',
        expense_reports: [
          { id: 'N-101', date: 'March 5', amount_eur: 120, submitted_by: 'Chloé', status: 'approved', approved_by: 'Damien' },
          { id: 'N-102', date: 'February 20', amount_eur: 860, submitted_by: 'Yann', status: 'approved', approved_by: null },
          { id: 'N-103', date: 'March 10', amount_eur: 45, submitted_by: 'Chloé', status: 'rejected', approved_by: null },
        ],
      },
      questions: {
        n102_approver: {
          type: 'choice',
          instructions: 'Who approved expense report N-102?',
          criteria: {
            damien: 'Damien',
            unknown: 'The log doesn’t make it possible to know',
            yann: 'Yann',
            nobody: 'Nobody: it was not approved',
          },
        },
        n101_damien: { type: 'noul', instructions: 'Was expense report N-101 approved by Damien?' },
        n103_approved: { type: 'noul', instructions: 'Was expense report N-103 approved?' },
      },
    },
  },
  {
    id: 'abs-survey-base',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'court',
    // Sans le nombre de répondants, 64 % ne donne aucun effectif (288 = 64 % des 450 salariés, piège).
    // Sans avis : 100 − 64 − 18 = 18 %. Majorité parmi les répondants : oui ; parmi tous les salariés : impossible à dire.
    expected: { satisfied_count: 'impossible', no_opinion: 'p18', majority_respondents: true, majority_staff: false },
    fr: {
      name: 'Pourcentage sans effectif',
      description: 'Un taux sans base ne donne pas de nombre de personnes.',
      state:
        'Résultats de l’enquête interne sur la cantine : 64 % des répondants se disent satisfaits, 18 % insatisfaits, les autres sont sans avis. Le nombre de répondants n’a pas été communiqué. L’entreprise compte 450 salariés.',
      questions: {
        satisfied_count: {
          type: 'choice',
          instructions: 'Combien de personnes se disent satisfaites de la cantine ?',
          criteria: { n288: '288', n64: '64', impossible: 'Impossible à déterminer', n162: '162' },
        },
        no_opinion: {
          type: 'choice',
          instructions: 'Quelle part des répondants est sans avis ?',
          criteria: { p18: '18 %', p36: '36 %', p82: '82 %', not_stated: 'Le texte ne permet pas de le dire' },
        },
        majority_respondents: { type: 'noul', instructions: 'Les satisfaits sont-ils majoritaires parmi les répondants ?' },
        majority_staff: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que la majorité des salariés de l’entreprise sont satisfaits de la cantine ?' },
      },
    },
    en: {
      name: 'Percentage without a base',
      description: 'A rate without a base gives no headcount.',
      state:
        'Results of the internal canteen survey: 64% of respondents say they are satisfied, 18% dissatisfied, and the rest have no opinion. The number of respondents was not disclosed. The company has 450 employees.',
      questions: {
        satisfied_count: {
          type: 'choice',
          instructions: 'How many people say they are satisfied with the canteen?',
          criteria: { n288: '288', n64: '64', impossible: 'Impossible to determine', n162: '162' },
        },
        no_opinion: {
          type: 'choice',
          instructions: 'What share of respondents have no opinion?',
          criteria: { p18: '18%', p36: '36%', p82: '82%', not_stated: 'The text doesn’t make it possible to say' },
        },
        majority_respondents: { type: 'noul', instructions: 'Are satisfied people a majority among respondents?' },
        majority_staff: { type: 'noul', instructions: 'Can we say from the text that a majority of the company’s employees are satisfied with the canteen?' },
      },
    },
  },
  {
    id: 'abs-undecided-thread',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'moyen',
    // Préférences exprimées (Inès pour Beta, Hugo contre Gamma) mais aucune décision : Nadia tranchera après une démo pas encore calée.
    // Le budget (9 000 € HT) et le décideur (Nadia) sont, eux, explicites.
    expected: { vendor: 'none_yet', budget: 'b9000', decider: 'nadia', demo_date: 'not_scheduled' },
    fr: {
      name: 'Discussion sans décision',
      description: 'Des avis, un budget et un décideur, mais pas encore de choix.',
      state: {
        sujet: 'Choix de l’outil de support client',
        messages: [
          {
            jour: 'lundi',
            auteur: 'Nadia (responsable support)',
            texte: 'J’ai contacté trois éditeurs : Alpha, Beta et Gamma. La direction a validé un budget annuel de 9 000 € HT, pas un euro de plus.',
          },
          { jour: 'lundi', auteur: 'Hugo', texte: 'Alpha coûte 8 400 € par an, mais l’intégration avec notre CRM est facturée en plus. Gamma est à 7 200 €.' },
          { jour: 'mardi', auteur: 'Inès', texte: 'Beta me semble le plus simple pour l’équipe. Leur commercial doit nous proposer une démo, mais rien n’est calé.' },
          { jour: 'mardi', auteur: 'Hugo', texte: 'Gamma ne gère pas le chat en direct, pour moi c’est éliminatoire.' },
          { jour: 'mercredi', auteur: 'Nadia', texte: 'Merci à tous. Je trancherai après la démo de Beta. D’ici là, on ne signe rien.' },
        ],
      },
      questions: {
        vendor: {
          type: 'choice',
          instructions: 'Quel outil a été choisi ?',
          criteria: { alpha: 'Alpha', none_yet: 'Aucun outil n’a encore été choisi', beta: 'Beta', gamma: 'Gamma' },
        },
        budget: {
          type: 'choice',
          instructions: 'Quel est le budget annuel maximal pour l’outil ?',
          criteria: { b7200: '7 200 € HT', b8400: '8 400 € HT', b9000: '9 000 € HT', not_stated: 'Le texte ne le précise pas' },
        },
        decider: {
          type: 'choice',
          instructions: 'Qui prendra la décision finale ?',
          criteria: { not_stated: 'Le texte ne le précise pas', ines: 'Inès', hugo: 'Hugo', nadia: 'Nadia' },
        },
        demo_date: {
          type: 'choice',
          instructions: 'Quand aura lieu la démo de Beta ?',
          criteria: { tuesday: 'Mardi', wednesday: 'Mercredi', next_week: 'La semaine prochaine', not_scheduled: 'Elle n’est pas encore planifiée' },
        },
      },
    },
    en: {
      name: 'Thread without a decision',
      description: 'Opinions, a budget and a decision-maker, but no choice yet.',
      state: {
        subject: 'Choosing the customer support tool',
        messages: [
          {
            day: 'Monday',
            author: 'Nadia (support manager)',
            text: 'I contacted three vendors: Alpha, Beta and Gamma. Management has approved an annual budget of €9,000 excl. VAT, not a cent more.',
          },
          { day: 'Monday', author: 'Hugo', text: 'Alpha costs €8,400 a year, but the integration with our CRM is charged on top. Gamma is €7,200.' },
          { day: 'Tuesday', author: 'Inès', text: 'Beta looks like the simplest for the team. Their sales rep is supposed to offer us a demo, but nothing is booked.' },
          { day: 'Tuesday', author: 'Hugo', text: 'Gamma doesn’t support live chat, which is a deal-breaker for me.' },
          { day: 'Wednesday', author: 'Nadia', text: 'Thanks, everyone. I’ll decide after the Beta demo. Until then, we don’t sign anything.' },
        ],
      },
      questions: {
        vendor: {
          type: 'choice',
          instructions: 'Which tool has been chosen?',
          criteria: { alpha: 'Alpha', none_yet: 'No tool has been chosen yet', beta: 'Beta', gamma: 'Gamma' },
        },
        budget: {
          type: 'choice',
          instructions: 'What is the maximum annual budget for the tool?',
          criteria: { b7200: '€7,200 excl. VAT', b8400: '€8,400 excl. VAT', b9000: '€9,000 excl. VAT', not_stated: 'The text doesn’t say' },
        },
        decider: {
          type: 'choice',
          instructions: 'Who will make the final decision?',
          criteria: { not_stated: 'The text doesn’t say', ines: 'Inès', hugo: 'Hugo', nadia: 'Nadia' },
        },
        demo_date: {
          type: 'choice',
          instructions: 'When will the Beta demo take place?',
          criteria: { tuesday: 'Tuesday', wednesday: 'Wednesday', next_week: 'Next week', not_scheduled: 'It hasn’t been scheduled yet' },
        },
      },
    },
  },
  {
    id: 'abs-trip-false-premises',
    category: 'Abstention',
    complexity: 'complexe',
    length: 'court',
    // « Pas de voiture de location » : la question sur l’agence repose sur un présupposé faux. Seul l’horaire de l’aller est donné.
    // Hôtel du 3 au 6 mai : nuits du 3, du 4 et du 5, soit 3 nuits ; rien pour la nuit du 6 au 7 alors que le retour est le 7.
    expected: { car_agency: 'no_car', return_time: 'not_stated', hotel_nights: 'three', night_6_covered: false },
    fr: {
      name: 'Déplacement et présupposés',
      description: 'Une voiture inexistante, un horaire non donné, et une nuit non couverte à déduire.',
      state:
        'Réservation pour Julien Moreau : vol Lyon–Lisbonne le 3 mai à 7 h 40, retour le 7 mai. Hôtel Miradouro réservé du 3 au 6 mai (arrivée le 3, départ le 6, petit-déjeuner inclus). Pas de voiture de location : Julien se déplacera en transports en commun.',
      questions: {
        car_agency: {
          type: 'choice',
          instructions: 'Auprès de quelle agence la voiture de location a-t-elle été réservée ?',
          criteria: { rentix: 'Rentix', no_car: 'Aucune voiture n’a été louée', autoloc: 'Autoloc', not_stated: 'Le texte ne précise pas l’agence' },
        },
        return_time: {
          type: 'choice',
          instructions: 'À quelle heure part le vol retour du 7 mai ?',
          criteria: { t0740: '7 h 40', t1215: '12 h 15', t1830: '18 h 30', not_stated: 'Le texte ne le précise pas' },
        },
        hotel_nights: {
          type: 'choice',
          instructions: 'Combien de nuits d’hôtel ont été réservées ?',
          criteria: { two: 'Deux', three: 'Trois', four: 'Quatre', not_stated: 'Le texte ne le précise pas' },
        },
        night_6_covered: { type: 'noul', instructions: 'Julien a-t-il une chambre réservée pour la nuit du 6 au 7 mai ?' },
      },
    },
    en: {
      name: 'Business trip and presuppositions',
      description: 'A car that doesn’t exist, a time that isn’t given, and an uncovered night to work out.',
      state:
        'Booking for Julien Moreau: Lyon–Lisbon flight on May 3 at 7:40 am, return on May 7. Hotel Miradouro booked from May 3 to May 6 (check-in on the 3rd, check-out on the 6th, breakfast included). No rental car: Julien will use public transport.',
      questions: {
        car_agency: {
          type: 'choice',
          instructions: 'With which agency was the rental car booked?',
          criteria: { rentix: 'Rentix', no_car: 'No car was rented', autoloc: 'Autoloc', not_stated: 'The text doesn’t say which agency' },
        },
        return_time: {
          type: 'choice',
          instructions: 'What time does the return flight on May 7 leave?',
          criteria: { t0740: '7:40 am', t1215: '12:15 pm', t1830: '6:30 pm', not_stated: 'The text doesn’t say' },
        },
        hotel_nights: {
          type: 'choice',
          instructions: 'How many hotel nights have been booked?',
          criteria: { two: 'Two', three: 'Three', four: 'Four', not_stated: 'The text doesn’t say' },
        },
        night_6_covered: { type: 'noul', instructions: 'Does Julien have a room booked for the night of May 6 to 7?' },
      },
    },
  },
  {
    id: 'abs-calibration-launch',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'moyen',
    // Resoumise le 9 avril, validation habituelle en 1 à 5 jours : sortie le 15 plutôt probable, mais un nouveau refus reste possible.
    // Certitude : « incertain » ou « probable ». Faits établis : pas encore validée, refus pour une icône non conforme.
    expected: { on_time: [0.3, 0.9], certainty: [2, 3], approved: false, refusal_reason: 'icon' },
    fr: {
      name: 'Date de sortie sous réserve (calibration)',
      description: 'Sortie conditionnée à une validation en cours : ni acquise, ni compromise.',
      state:
        'Point d’étape du 9 avril — application Trotti.\nLa sortie publique est prévue le 15 avril, « sous réserve de la validation par l’App Store ». L’application a été soumise le 2 avril. Hier, l’équipe a reçu un refus : l’icône n’était pas conforme aux règles de la plateforme. L’icône a été corrigée et l’application resoumise ce matin. D’après la documentation de la plateforme, l’examen prend habituellement entre 1 et 5 jours.',
      questions: {
        on_time: { type: 'noul', instructions: 'L’application sortira-t-elle le 15 avril ?' },
        certainty: {
          type: 'score',
          instructions: 'D’après ce point d’étape, à quel point la sortie le 15 avril est-elle certaine ?',
          criteria: ['Exclue', 'Peu probable', 'Incertaine', 'Probable', 'Acquise'],
        },
        approved: { type: 'noul', instructions: 'L’application a-t-elle été validée par l’App Store ?' },
        refusal_reason: {
          type: 'choice',
          instructions: 'Pourquoi l’application a-t-elle été refusée ?',
          criteria: { privacy: 'Données personnelles', crash: 'Plantage au lancement', not_stated: 'Le texte ne le précise pas', icon: 'Icône non conforme' },
        },
      },
    },
    en: {
      name: 'Release date subject to approval (calibration)',
      description: 'Release depends on a pending review: neither assured nor compromised.',
      state:
        'Status update, April 9 — Trotti app.\nThe public release is planned for April 15, “subject to App Store approval”. The app was submitted on April 2. Yesterday, the team received a rejection: the icon did not comply with the platform’s guidelines. The icon has been fixed and the app resubmitted this morning. According to the platform’s documentation, review usually takes between 1 and 5 days.',
      questions: {
        on_time: { type: 'noul', instructions: 'Will the app be released on April 15?' },
        certainty: {
          type: 'score',
          instructions: 'According to this status update, how certain is the April 15 release?',
          criteria: ['Ruled out', 'Unlikely', 'Uncertain', 'Likely', 'Assured'],
        },
        approved: { type: 'noul', instructions: 'Has the app been approved by the App Store?' },
        refusal_reason: {
          type: 'choice',
          instructions: 'Why was the app rejected?',
          criteria: { privacy: 'Personal data', crash: 'Crash on launch', not_stated: 'The text doesn’t say', icon: 'Non-compliant icon' },
        },
      },
    },
  },
]
