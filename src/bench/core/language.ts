import type { Pair } from './pair.ts'

// Compréhension fine qui survit à la traduction : portée de la négation, quantificateurs, conditionnels et
// contrefactuels, prudence et rumeurs, discours rapporté, résolution des pronoms, ordre temporel, implicature,
// contradictions, corrections en cours de message, ironie et calibration. Chaque piège fonctionne à l’identique
// en français et en anglais (aucun indice de genre grammatical, aucun jeu de mots propre à une langue).

// ─── Textes longs ────────────────────────────────────────────────────────────

const DELIVERY_EMAIL = {
  fr: `De : Mathilde Roux
À : équipe logistique
Objet : Livraison Delcourt — point d’étape

Bonjour à tous,

Petit récapitulatif après mon appel avec Delcourt ce matin.

1. Leur acheteur, M. Faure, m’a dit que leur entrepôt de Lille fermerait pour inventaire la semaine du 18. Il n’en est pas certain : il attend la confirmation de son directeur. Si c’est confirmé, nous livrerons à Arras à la place.

2. La commande passe de 40 à 60 palettes. Pardon, je me suis trompée : de 40 à 50. Les 60, c’était la commande de Brunet.

3. Kevin pensait que le transporteur pouvait prendre les 50 palettes en un seul voyage. J’ai vérifié avec Lucas : ce n’est pas le cas, le camion en prend 36 au maximum. Il faudra donc deux voyages.

4. Delcourt nous a reproché le retard du mois dernier. Je leur ai rappelé, poliment, que ce retard venait de leur propre changement d’adresse de dernière minute. Ils n’ont pas insisté.

5. Pour la facturation, rien ne change, sauf si la commande dépasse 55 palettes, auquel cas le tarif dégressif s’appliquerait.

Je n’ai pas encore de réponse sur l’entrepôt : M. Faure doit me rappeler lundi.

Bonne journée,
Mathilde`,
  en: `From: Mathilde Roux
To: logistics team
Subject: Delcourt delivery — status update

Hi all,

Quick recap after my call with Delcourt this morning.

1. Their buyer, Mr. Faure, told me that their Lille warehouse would close for stocktaking the week of the 18th. He isn’t certain: he is waiting for confirmation from his director. If it is confirmed, we will deliver to Arras instead.

2. The order goes from 40 to 60 pallets. Sorry, my mistake: from 40 to 50. The 60 was Brunet’s order.

3. Kevin thought the carrier could take the 50 pallets in a single trip. I checked with Lucas: that’s not the case, the truck takes 36 at most. So it will take two trips.

4. Delcourt complained to us about last month’s delay. I politely reminded them that the delay was caused by their own last-minute change of address. They didn’t push the point.

5. For invoicing, nothing changes, unless the order exceeds 55 pallets, in which case the volume discount would apply.

I don’t have an answer about the warehouse yet: Mr. Faure is supposed to call me back on Monday.

Have a good day,
Mathilde`,
}

const MISSED_TRAIN = {
  fr: `Quand Inès est arrivée à la gare de Nantes, le train de 18 h 05 était déjà parti. Elle avait pourtant quitté le bureau à l’heure, mais elle s’était arrêtée à la pharmacie, qui se trouvait sur le chemin, et la file d’attente était longue. Sur le quai, elle a croisé Agnès, une ancienne collègue, qui lui a proposé de la raccompagner en voiture ; Inès a accepté.

Une fois revenue chez elle, elle a appelé sa sœur pour la prévenir qu’elle n’arriverait pas ce soir-là, puis elle a réservé un billet pour le lendemain matin. Ce n’est qu’à ce moment-là qu’elle s’est souvenue qu’elle avait laissé son badge sur son bureau en partant. Elle a donc écrit au gardien, qui lui a répondu qu’il le mettrait de côté.

Le lendemain, elle est passée récupérer son badge avant de reprendre le train.`,
  en: `When Inès got to Nantes station, the 6:05 pm train had already left. She had left the office on time, but she had stopped at the pharmacy, which was on the way, and the queue had been long. On the platform, she ran into Agnès, a former colleague, who offered to drive her home; Inès accepted.

Once back home, she called her sister to let her know she wouldn’t be arriving that evening, then she booked a ticket for the next morning. Only at that point did she remember that she had left her badge on her desk when she left. So she wrote to the caretaker, who replied that he would put it aside.

The next day, she went to pick up her badge before taking the train again.`,
}

// ─── Options partagées ───────────────────────────────────────────────────────

const NLI = {
  fr: {
    entailment: 'Si A est vrai, B est forcément vrai',
    contradiction: 'A et B ne peuvent pas être vrais en même temps',
    neutral: 'Si A est vrai, B peut être vrai ou faux',
  },
  en: {
    entailment: 'If A is true, B is necessarily true',
    contradiction: 'A and B cannot both be true',
    neutral: 'If A is true, B may be true or false',
  },
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const LANGUAGE: Pair[] = [
  {
    id: 'lang-quantifiers',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // « Seuls » restreint la garantie aux inscrits avant le 10 mai : Nora, inscrite le 12, n’en a pas.
    // « Pas tous, mais au moins trois » : ni zéro, ni tous, et au moins trois.
    expected: { all_engineers_registered: false, nora_guaranteed: false, julien_registered: false, engineers_count: 'three_or_more_not_all' },
    fr: {
      name: 'Quantificateurs',
      description: '« Aucun », « pas tous », « au moins », « seuls », « sauf ».',
      state:
        'Bilan des inscriptions au séminaire : aucun des stagiaires de l’équipe marketing ne s’est inscrit. Les ingénieurs ne se sont pas tous inscrits, mais au moins trois d’entre eux l’ont fait. Seules les personnes inscrites avant le 10 mai ont une place garantie ; Nora, ingénieure, s’est inscrite le 12 mai. Tous les commerciaux se sont inscrits, sauf Julien.',
      questions: {
        all_engineers_registered: { type: 'noul', instructions: 'Tous les ingénieurs se sont-ils inscrits ?' },
        nora_guaranteed: { type: 'noul', instructions: 'Nora a-t-elle une place garantie ?' },
        julien_registered: { type: 'noul', instructions: 'Julien, commercial, s’est-il inscrit ?' },
        engineers_count: {
          type: 'choice',
          instructions: 'Combien d’ingénieurs se sont inscrits ?',
          criteria: { none: 'Aucun', one_or_two: 'Un ou deux', three_or_more_not_all: 'Au moins trois, mais pas tous', all: 'Tous' },
        },
      },
    },
    en: {
      name: 'Quantifiers',
      description: '“None”, “not all”, “at least”, “only”, “except”.',
      state:
        'Seminar registration summary: none of the marketing team’s interns has registered. Not all of the engineers have registered, but at least three of them have. Only people who registered before May 10 have a guaranteed seat; Nora, an engineer, registered on May 12. All the sales reps have registered, except Julien.',
      questions: {
        all_engineers_registered: { type: 'noul', instructions: 'Have all the engineers registered?' },
        nora_guaranteed: { type: 'noul', instructions: 'Does Nora have a guaranteed seat?' },
        julien_registered: { type: 'noul', instructions: 'Has Julien, a sales rep, registered?' },
        engineers_count: {
          type: 'choice',
          instructions: 'How many engineers have registered?',
          criteria: { none: 'None', one_or_two: 'One or two', three_or_more_not_all: 'At least three, but not all', all: 'All of them' },
        },
      },
    },
  },
  {
    id: 'lang-counterfactual',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Contrefactuels : « si nous avions su… nous n’aurions pas imprimé » ⇒ elles ont été imprimées, et l’équipe ne savait pas.
    // « Si Bruno n’avait pas relu… nous aurions payé » ⇒ l’express n’a pas été payé. Le sort des brochures dépend du salon.
    expected: { brochures_printed: true, knew_in_advance: false, paid_express: false, brochures_fate: 'depends_on_show' },
    fr: {
      name: 'Contrefactuels',
      description: 'Irréel du passé et condition sur l’avenir.',
      state:
        'Message de Claire à son équipe : « Si nous avions su que le client changerait d’avis, nous n’aurions pas imprimé les 5 000 brochures. Si le salon de mars est maintenu, nous les distribuerons là-bas ; sinon, elles partiront au recyclage. Et si Bruno n’avait pas relu le devis, nous aurions en plus payé la livraison express. »',
      questions: {
        brochures_printed: { type: 'noul', instructions: 'Les 5 000 brochures ont-elles été imprimées ?' },
        knew_in_advance: { type: 'noul', instructions: 'Au moment de l’impression, l’équipe savait-elle que le client allait changer d’avis ?' },
        paid_express: { type: 'noul', instructions: 'L’équipe a-t-elle payé la livraison express ?' },
        brochures_fate: {
          type: 'choice',
          instructions: 'Que vont devenir les brochures ?',
          criteria: {
            distributed: 'Elles seront distribuées au salon de mars',
            recycled: 'Elles partiront au recyclage',
            depends_on_show: 'Cela dépend du maintien du salon de mars',
            returned: 'Elles seront renvoyées au client',
          },
        },
      },
    },
    en: {
      name: 'Counterfactuals',
      description: 'Past counterfactuals and a condition on the future.',
      state:
        'Message from Claire to her team: “If we had known the client would change their mind, we would not have printed the 5,000 brochures. If the March trade show goes ahead, we will hand them out there; otherwise, they will be recycled. And if Bruno had not reviewed the quote, we would also have paid for express delivery.”',
      questions: {
        brochures_printed: { type: 'noul', instructions: 'Were the 5,000 brochures printed?' },
        knew_in_advance: { type: 'noul', instructions: 'At the time of printing, did the team know the client was going to change their mind?' },
        paid_express: { type: 'noul', instructions: 'Did the team pay for express delivery?' },
        brochures_fate: {
          type: 'choice',
          instructions: 'What will happen to the brochures?',
          criteria: {
            distributed: 'They will be handed out at the March trade show',
            recycled: 'They will be recycled',
            depends_on_show: 'It depends on whether the March trade show goes ahead',
            returned: 'They will be sent back to the client',
          },
        },
      },
    },
  },
  {
    id: 'lang-hedged-news',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // « Envisagerait », selon des sources : rien d’officiel. Valmont refuse de commenter, ce qui n’est pas un démenti ;
    // c’est Orbis qui dément avoir reçu une offre. Certitude : rumeur contredite par la cible, donc « peu probable » ou « incertain ».
    expected: { acquisition_announced: false, valmont_denied: false, certainty: [1, 2] },
    fr: {
      name: 'Rumeur et prudence',
      description: 'Conditionnel journalistique, « sans commentaire » n’est pas un démenti.',
      state:
        'Selon deux sources proches du dossier, le groupe Valmont envisagerait de racheter la start-up Orbis. Interrogé, un porte-parole de Valmont s’est refusé à tout commentaire. Orbis, de son côté, a démenti avoir reçu la moindre offre. L’action Orbis a bondi de 12 % à l’ouverture.',
      questions: {
        acquisition_announced: { type: 'noul', instructions: 'Le rachat d’Orbis par Valmont a-t-il été officiellement annoncé ?' },
        valmont_denied: { type: 'noul', instructions: 'Valmont a-t-il démenti vouloir racheter Orbis ?' },
        certainty: {
          type: 'score',
          instructions: 'D’après cet article, à quel point le rachat est-il certain ?',
          criteria: ['Exclu', 'Peu probable', 'Incertain', 'Probable', 'Confirmé'],
        },
      },
    },
    en: {
      name: 'Rumour and hedging',
      description: 'Hedged reporting; “no comment” is not a denial.',
      state:
        'According to two sources close to the matter, the Valmont group is reportedly considering buying the start-up Orbis. When asked, a Valmont spokesperson declined to comment. Orbis, for its part, denied having received any offer. Orbis shares jumped 12% at the open.',
      questions: {
        acquisition_announced: { type: 'noul', instructions: 'Has Valmont’s acquisition of Orbis been officially announced?' },
        valmont_denied: { type: 'noul', instructions: 'Did Valmont deny wanting to buy Orbis?' },
        certainty: {
          type: 'score',
          instructions: 'According to this article, how certain is the acquisition?',
          criteria: ['Ruled out', 'Unlikely', 'Uncertain', 'Likely', 'Confirmed'],
        },
      },
    },
  },
  {
    id: 'lang-reported-speech',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // C’est Thomas qui rapporte les propos de Karine ; Karine dit n’avoir parlé que d’une validation « probable ».
    // La validation exige une signature qui n’a pas eu lieu : le budget n’est pas validé.
    expected: { budget_approved: false, claim_source: 'thomas', karine_certainty: 2, disagreement: 'what_karine_said' },
    fr: {
      name: 'Discours rapporté',
      description: 'Qui affirme quoi : propos rapportés, puis rectifiés.',
      state:
        'Lors de l’entretien, Thomas a affirmé que Karine lui avait dit que le budget du projet était validé. Interrogée ensuite, Karine a répondu qu’elle avait seulement dit qu’il serait « probablement » validé. La validation d’un budget nécessite la signature du directeur financier, qui n’a encore signé aucun document.',
      questions: {
        budget_approved: { type: 'noul', instructions: 'Le budget du projet est-il validé ?' },
        claim_source: {
          type: 'choice',
          instructions: 'Qui affirme que Karine a dit que le budget était validé ?',
          criteria: { thomas: 'Thomas', karine: 'Karine', cfo: 'Le directeur financier', nobody: 'Personne' },
        },
        karine_certainty: {
          type: 'score',
          instructions: 'Selon sa propre version, quel degré de certitude Karine a-t-elle exprimé sur la validation du budget ?',
          criteria: ['Certaine qu’il ne le serait pas', 'Doute', 'Le juge probable', 'Certaine qu’il l’est'],
        },
        disagreement: {
          type: 'choice',
          instructions: 'Sur quoi Thomas et Karine sont-ils en désaccord ?',
          criteria: {
            what_karine_said: 'Ce que Karine a dit à Thomas',
            budget_amount: 'Le montant du budget',
            cfo_signature: 'La nécessité de la signature du directeur financier',
            project_date: 'Le calendrier du projet',
          },
        },
      },
    },
    en: {
      name: 'Reported speech',
      description: 'Who claims what: reported words, then corrected.',
      state:
        'During the interview, Thomas stated that Karine had told him the project budget was approved. Asked afterwards, Karine replied that she had only said it would “probably” be approved. Approving a budget requires the CFO’s signature, and the CFO has not signed any document yet.',
      questions: {
        budget_approved: { type: 'noul', instructions: 'Is the project budget approved?' },
        claim_source: {
          type: 'choice',
          instructions: 'Who claims that Karine said the budget was approved?',
          criteria: { thomas: 'Thomas', karine: 'Karine', cfo: 'The CFO', nobody: 'Nobody' },
        },
        karine_certainty: {
          type: 'score',
          instructions: 'According to her own account, how certain did Karine say she was about the budget being approved?',
          criteria: ['Sure it would not be', 'Doubtful', 'Thought it likely', 'Sure it is'],
        },
        disagreement: {
          type: 'choice',
          instructions: 'What do Thomas and Karine disagree about?',
          criteria: {
            what_karine_said: 'What Karine told Thomas',
            budget_amount: 'The budget amount',
            cfo_signature: 'Whether the CFO’s signature is required',
            project_date: 'The project timeline',
          },
        },
      },
    },
  },
  {
    id: 'lang-pronouns',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Pronoms résolus par le sens, jamais par le genre : les deux candidats ont toujours le même genre dans les deux langues.
    // 1. On s’excuse de son propre oubli. 2. On refuse de servir un client ivre. 3. On prête sa voiture à celui dont la voiture est au garage.
    // 4. On ne peut pas joindre quelqu’un dont le téléphone est éteint.
    expected: { s1: 'sophie', s2: 'customer', s3: 'leo', s4: 'emma' },
    fr: {
      name: 'Résolution des pronoms',
      description: 'Quatre pronoms ambigus en surface, résolus par le sens.',
      state:
        '1. Sophie a appelé Nadia pour s’excuser : elle avait oublié leur rendez-vous.\n2. Le barman a refusé de servir le client parce qu’il était déjà ivre.\n3. Hugo a prêté sa voiture à Léo parce que la sienne était au garage.\n4. Julie n’a pas pu joindre Emma, car elle avait éteint son téléphone.',
      questions: {
        s1: { type: 'choice', instructions: 'Phrase 1 : qui avait oublié le rendez-vous ?', criteria: { sophie: 'Sophie', nadia: 'Nadia' } },
        s2: { type: 'choice', instructions: 'Phrase 2 : qui était déjà ivre ?', criteria: { bartender: 'Le barman', customer: 'Le client' } },
        s3: { type: 'choice', instructions: 'Phrase 3 : la voiture de qui était au garage ?', criteria: { hugo: 'Hugo', leo: 'Léo' } },
        s4: { type: 'choice', instructions: 'Phrase 4 : qui avait éteint son téléphone ?', criteria: { julie: 'Julie', emma: 'Emma' } },
      },
    },
    en: {
      name: 'Pronoun resolution',
      description: 'Four superficially ambiguous pronouns, resolved by meaning.',
      state:
        '1. Sophie called Nadia to apologize: she had forgotten their appointment.\n2. The bartender refused to serve the customer because he was already drunk.\n3. Hugo lent his car to Léo because his was at the garage.\n4. Julie couldn’t reach Emma because she had switched off her phone.',
      questions: {
        s1: { type: 'choice', instructions: 'Sentence 1: who had forgotten the appointment?', criteria: { sophie: 'Sophie', nadia: 'Nadia' } },
        s2: { type: 'choice', instructions: 'Sentence 2: who was already drunk?', criteria: { bartender: 'The bartender', customer: 'The customer' } },
        s3: { type: 'choice', instructions: 'Sentence 3: whose car was at the garage?', criteria: { hugo: 'Hugo', leo: 'Léo' } },
        s4: { type: 'choice', instructions: 'Sentence 4: who had switched off her phone?', criteria: { julie: 'Julie', emma: 'Emma' } },
      },
    },
  },
  {
    id: 'lang-temporal-order',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Récit non chronologique : le badge a été oublié en quittant le bureau (premier événement), même s’il n’est mentionné qu’à la fin.
    // L’appel à la sœur précède la réservation ; la récupération du badge a lieu le lendemain, avant le train.
    expected: { pharmacy_before_station: true, booked_before_call: false, badge_left: 'leaving_office', badge_before_train: true },
    fr: {
      name: 'Ordre des événements',
      description: 'Récit raconté dans le désordre : retrouver la chronologie.',
      state: MISSED_TRAIN.fr,
      questions: {
        pharmacy_before_station: { type: 'noul', instructions: 'Inès est-elle passée à la pharmacie avant d’arriver à la gare ?' },
        booked_before_call: { type: 'noul', instructions: 'Inès a-t-elle réservé son billet avant d’appeler sa sœur ?' },
        badge_left: {
          type: 'choice',
          instructions: 'À quel moment Inès a-t-elle laissé son badge sur son bureau ?',
          criteria: {
            leaving_office: 'En quittant le bureau, avant la pharmacie',
            at_station: 'Sur le quai de la gare',
            after_booking: 'Après avoir réservé son billet',
            next_morning: 'Le lendemain matin',
          },
        },
        badge_before_train: { type: 'noul', instructions: 'Le lendemain, Inès a-t-elle récupéré son badge avant de prendre le train ?' },
      },
    },
    en: {
      name: 'Order of events',
      description: 'A story told out of order: recover the timeline.',
      state: MISSED_TRAIN.en,
      questions: {
        pharmacy_before_station: { type: 'noul', instructions: 'Did Inès stop at the pharmacy before getting to the station?' },
        booked_before_call: { type: 'noul', instructions: 'Did Inès book her ticket before calling her sister?' },
        badge_left: {
          type: 'choice',
          instructions: 'When did Inès leave her badge on her desk?',
          criteria: {
            leaving_office: 'When leaving the office, before the pharmacy',
            at_station: 'On the station platform',
            after_booking: 'After booking her ticket',
            next_morning: 'The next morning',
          },
        },
        badge_before_train: { type: 'noul', instructions: 'The next day, did Inès pick up her badge before taking the train?' },
      },
    },
  },
  {
    id: 'lang-implicature',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Implicatures : Léa décline sans dire « non » ; Marc, qui a froid, demande indirectement de fermer la fenêtre ;
    // une lettre de référence qui ne vante que la ponctualité et la tenue est une recommandation faible.
    expected: { lea_attends: false, lea_reply: 'declines', marc_intent: 'close_window', strong_recommendation: false },
    fr: {
      name: 'Implicature',
      description: 'Refus poli, demande indirecte, éloge qui n’en est pas un.',
      state: {
        invitation: 'Paul : Tu viens à mon pot de départ vendredi soir ?',
        reply: 'Léa : Oh, vendredi… J’ai promis à mes parents de les conduire à l’aéroport ce soir-là. Mais je passerai te dire au revoir jeudi !',
        office: 'Marc, en se frottant les bras, à Julie, assise près de la fenêtre ouverte : Il ne fait pas un peu froid, ici ?',
        reference_letter:
          'Lettre de référence pour un poste d’ingénieur logiciel (texte intégral) : « M. Bertin a toujours été ponctuel et toujours soigneusement vêtu. »',
      },
      questions: {
        lea_attends: { type: 'noul', instructions: 'Léa viendra-t-elle au pot de départ vendredi soir ?' },
        lea_reply: {
          type: 'choice',
          instructions: 'Comment Léa répond-elle à l’invitation de Paul ?',
          criteria: { accepts: 'Elle accepte', declines: 'Elle décline', undecided: 'Elle n’a pas encore décidé', ignores: 'Elle ne répond pas à la question' },
        },
        marc_intent: {
          type: 'choice',
          instructions: 'Que veut Marc avant tout ?',
          criteria: {
            information: 'Savoir si Julie a froid',
            close_window: 'Que Julie ferme la fenêtre',
            complain_heating: 'Faire réparer le chauffage',
            small_talk: 'Simplement faire la conversation',
          },
        },
        strong_recommendation: { type: 'noul', instructions: 'Cette lettre recommande-t-elle chaleureusement M. Bertin pour le poste ?' },
      },
    },
    en: {
      name: 'Implicature',
      description: 'Polite refusal, indirect request, praise that isn’t.',
      state: {
        invitation: 'Paul: Are you coming to my farewell drinks on Friday evening?',
        reply: 'Léa: Oh, Friday… I promised my parents I’d drive them to the airport that evening. But I’ll drop by to say goodbye on Thursday!',
        office: 'Marc, rubbing his arms, to Julie, who is sitting next to the open window: Isn’t it a bit cold in here?',
        reference_letter:
          'Reference letter for a software engineer position (full text): “Mr. Bertin has always been punctual and always neatly dressed.”',
      },
      questions: {
        lea_attends: { type: 'noul', instructions: 'Will Léa come to the farewell drinks on Friday evening?' },
        lea_reply: {
          type: 'choice',
          instructions: 'How does Léa respond to Paul’s invitation?',
          criteria: { accepts: 'She accepts', declines: 'She declines', undecided: 'She hasn’t decided yet', ignores: 'She doesn’t answer the question' },
        },
        marc_intent: {
          type: 'choice',
          instructions: 'What does Marc mainly want?',
          criteria: {
            information: 'To find out whether Julie is cold',
            close_window: 'For Julie to close the window',
            complain_heating: 'To get the heating fixed',
            small_talk: 'Just to make conversation',
          },
        },
        strong_recommendation: { type: 'noul', instructions: 'Does this letter warmly recommend Mr. Bertin for the position?' },
      },
    },
  },
  {
    id: 'lang-contradiction',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'moyen',
    // b : 8 h 15 est le matin ⇒ implication. c : n’avoir rien vu n’empêche pas d’avoir entendu ⇒ neutre.
    // d : Anna > Ben > Carla ⇒ contradiction. e : double négation ⇒ implication. f : « pas tous » ⇒ « certains non » ⇒ implication.
    expected: { pair_b: 'entailment', pair_c: 'neutral', pair_d: 'contradiction', pair_e: 'entailment', pair_f: 'entailment' },
    fr: {
      name: 'Contradictions',
      description: 'Implication, contradiction ou neutralité entre deux énoncés.',
      state: {
        pair_b: { A: 'Tous les vols du matin ont été annulés.', B: 'Le vol de 8 h 15 a été annulé.' },
        pair_c: { A: 'Aucun des trois témoins n’a vu le conducteur.', B: 'L’un des témoins a entendu le choc.' },
        pair_d: { A: 'Anna est plus âgée que Ben, et Ben est plus âgé que Carla.', B: 'Carla est plus âgée qu’Anna.' },
        pair_e: { A: 'Il est faux que le contrat n’ait pas été signé.', B: 'Le contrat a été signé.' },
        pair_f: { A: 'Les invités ne sont pas tous venus.', B: 'Certains invités ne sont pas venus.' },
      },
      questions: {
        pair_b: { type: 'choice', instructions: 'Relation entre A et B dans `pair_b`', criteria: NLI.fr },
        pair_c: { type: 'choice', instructions: 'Relation entre A et B dans `pair_c`', criteria: NLI.fr },
        pair_d: { type: 'choice', instructions: 'Relation entre A et B dans `pair_d`', criteria: NLI.fr },
        pair_e: { type: 'choice', instructions: 'Relation entre A et B dans `pair_e`', criteria: NLI.fr },
        pair_f: { type: 'choice', instructions: 'Relation entre A et B dans `pair_f`', criteria: NLI.fr },
      },
    },
    en: {
      name: 'Contradictions',
      description: 'Entailment, contradiction or neutrality between two statements.',
      state: {
        pair_b: { A: 'All morning flights have been cancelled.', B: 'The 8:15 am flight has been cancelled.' },
        pair_c: { A: 'None of the three witnesses saw the driver.', B: 'One of the witnesses heard the crash.' },
        pair_d: { A: 'Anna is older than Ben, and Ben is older than Carla.', B: 'Carla is older than Anna.' },
        pair_e: { A: 'It is false that the contract has not been signed.', B: 'The contract has been signed.' },
        pair_f: { A: 'Not all the guests came.', B: 'Some guests did not come.' },
      },
      questions: {
        pair_b: { type: 'choice', instructions: 'Relation between A and B in `pair_b`', criteria: NLI.en },
        pair_c: { type: 'choice', instructions: 'Relation between A and B in `pair_c`', criteria: NLI.en },
        pair_d: { type: 'choice', instructions: 'Relation between A and B in `pair_d`', criteria: NLI.en },
        pair_e: { type: 'choice', instructions: 'Relation between A and B in `pair_e`', criteria: NLI.en },
        pair_f: { type: 'choice', instructions: 'Relation between A and B in `pair_f`', criteria: NLI.en },
      },
    },
  },
  {
    id: 'lang-self-correction',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Seules comptent les informations corrigées : jeudi (l’heure reste 10 h), Sarah, salle Borée.
    expected: { day: 'thursday', presenter: 'sarah', room: 'boreas' },
    fr: {
      name: 'Correction en cours de message',
      description: 'Jour, intervenant et salle corrigés dans le même message.',
      state:
        'Salut l’équipe, la démo client est mardi à 10 h en salle Atlas. Pardon, je voulais dire jeudi, pas mardi — l’heure ne change pas. Prévoyez vos ordinateurs. Ah, et finalement Romain ne pourra pas présenter, c’est Sarah qui s’en charge. Oubliez la salle Atlas, elle est réservée ce jour-là : on sera en salle Borée.',
      questions: {
        day: {
          type: 'choice',
          instructions: 'Quel jour a lieu la démo client ?',
          criteria: { monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi', friday: 'Vendredi' },
        },
        presenter: {
          type: 'choice',
          instructions: 'Qui présente la démo ?',
          criteria: { romain: 'Romain', sarah: 'Sarah', both: 'Romain et Sarah', unknown: 'Pas encore décidé' },
        },
        room: { type: 'choice', instructions: 'Dans quelle salle a lieu la démo ?', criteria: { atlas: 'Salle Atlas', boreas: 'Salle Borée', unknown: 'Pas encore décidé' } },
      },
    },
    en: {
      name: 'Correction mid-message',
      description: 'Day, presenter and room corrected within the same message.',
      state:
        'Hi team, the client demo is on Tuesday at 10 am in the Atlas room. Sorry, I meant Thursday, not Tuesday — the time stays the same. Bring your laptops. Oh, and in the end Romain won’t be able to present, Sarah is taking over. Forget the Atlas room, it’s booked that day: we’ll be in the Boreas room.',
      questions: {
        day: {
          type: 'choice',
          instructions: 'On which day is the client demo?',
          criteria: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' },
        },
        presenter: {
          type: 'choice',
          instructions: 'Who is presenting the demo?',
          criteria: { romain: 'Romain', sarah: 'Sarah', both: 'Romain and Sarah', unknown: 'Not decided yet' },
        },
        room: { type: 'choice', instructions: 'Which room is the demo in?', criteria: { atlas: 'Atlas room', boreas: 'Boreas room', unknown: 'Not decided yet' } },
      },
    },
  },
  {
    id: 'lang-irony-review',
    category: 'Sentiment',
    complexity: 'complexe',
    length: 'court',
    // Éloges sincères (chambre, personnel), ironie sur le wifi (il ne marchait pas : le client a lu faute de connexion),
    // petit-déjeuner tiède (« correct, sans plus ») : neutre, au pire légèrement négatif.
    expected: { wifi_worked: false, staff_praise_sincere: true, breakfast: [0, 1], main_complaint: 'wifi' },
    fr: {
      name: 'Ironie dans un avis',
      description: 'Éloges sincères et éloge ironique dans le même avis.',
      state:
        'Hôtel Beau-Rivage, trois nuits. La chambre était impeccable et le personnel de la réception vraiment adorable. Quant au wifi, je le remercie : grâce à lui, j’ai enfin terminé le roman qui traînait sur ma table de nuit depuis des mois. Petit-déjeuner correct, sans plus.',
      questions: {
        wifi_worked: { type: 'noul', instructions: 'Selon le client, le wifi fonctionnait-il correctement ?' },
        staff_praise_sincere: { type: 'noul', instructions: 'L’éloge du personnel de la réception est-il sincère ?' },
        breakfast: { type: 'score', instructions: 'Avis du client sur le petit-déjeuner', criteria: ['Négatif', 'Neutre', 'Positif'] },
        main_complaint: {
          type: 'choice',
          instructions: 'Quel est le principal reproche du client ?',
          criteria: { room: 'La chambre', staff: 'Le personnel', wifi: 'Le wifi', breakfast: 'Le petit-déjeuner', none: 'Aucun reproche' },
        },
      },
    },
    en: {
      name: 'Irony in a review',
      description: 'Sincere praise and ironic praise in the same review.',
      state:
        'Hotel Beau-Rivage, three nights. The room was spotless and the front desk staff were truly lovely. As for the wifi, I’m grateful to it: thanks to it, I finally finished the novel that had been sitting on my nightstand for months. Breakfast was fine, nothing more.',
      questions: {
        wifi_worked: { type: 'noul', instructions: 'According to the guest, did the wifi work properly?' },
        staff_praise_sincere: { type: 'noul', instructions: 'Is the praise for the front desk staff sincere?' },
        breakfast: { type: 'score', instructions: 'The guest’s opinion of the breakfast', criteria: ['Negative', 'Neutral', 'Positive'] },
        main_complaint: {
          type: 'choice',
          instructions: 'What is the guest’s main complaint?',
          criteria: { room: 'The room', staff: 'The staff', wifi: 'The wifi', breakfast: 'The breakfast', none: 'No complaint' },
        },
      },
    },
  },
  {
    id: 'lang-calibration-hedged-reply',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'court',
    // Double négation prudente suivie d’une mise en garde : ni oui ni non, plutôt non. Probabilité basse à intermédiaire.
    expected: { will_come: [0.1, 0.5], firm_refusal: false },
    fr: {
      name: 'Réponse évasive (calibration)',
      description: '« Je ne dis pas que je ne viendrai pas » : ni oui, ni non.',
      state: 'Message d’Hélène : « Je ne dis pas que je ne viendrai pas samedi, mais ne comptez pas trop sur moi. »',
      questions: {
        will_come: { type: 'noul', instructions: 'Hélène viendra-t-elle samedi ?' },
        firm_refusal: { type: 'noul', instructions: 'Hélène a-t-elle fermement refusé de venir ?' },
      },
    },
    en: {
      name: 'Evasive reply (calibration)',
      description: '“I’m not saying I won’t come”: neither yes nor no.',
      state: 'Message from Hélène: “I’m not saying I won’t come on Saturday, but don’t count on me too much.”',
      questions: {
        will_come: { type: 'noul', instructions: 'Will Hélène come on Saturday?' },
        firm_refusal: { type: 'noul', instructions: 'Did Hélène firmly refuse to come?' },
      },
    },
  },
  {
    id: 'lang-calibration-conflicting',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'court',
    // Un ouï-dire contre un planning du matin, aucune annonce officielle : l’issue est réellement incertaine.
    expected: { will_happen: [0.2, 0.8], officially_cancelled: false },
    fr: {
      name: 'Informations contradictoires (calibration)',
      description: 'Ouï-dire contre planning : probabilité intermédiaire attendue.',
      state:
        'Deux collègues parlent du séminaire prévu demain. Ahmed : « Il est annulé, je l’ai entendu à la cafétéria. » Clara : « Bizarre, ce matin, le planning l’affichait toujours. » Aucune annonce officielle n’a été faite.',
      questions: {
        will_happen: { type: 'noul', instructions: 'Le séminaire aura-t-il lieu demain ?' },
        officially_cancelled: { type: 'noul', instructions: 'Le séminaire a-t-il été officiellement annulé ?' },
      },
    },
    en: {
      name: 'Conflicting information (calibration)',
      description: 'Hearsay versus schedule: an intermediate probability is expected.',
      state:
        'Two colleagues are talking about the seminar planned for tomorrow. Ahmed: “It’s cancelled, I heard it in the cafeteria.” Clara: “Strange, this morning the schedule was still showing it.” No official announcement has been made.',
      questions: {
        will_happen: { type: 'noul', instructions: 'Will the seminar take place tomorrow?' },
        officially_cancelled: { type: 'noul', instructions: 'Has the seminar been officially cancelled?' },
      },
    },
  },
  {
    id: 'lang-only-scope',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // « Seuls les managers » ne vaut qu’au-delà de 500 € : un employé peut approuver 300 € (R5).
    // « Que des dépenses de moins de 50 € » interdit 120 € au stagiaire (R4). R3 est une auto-approbation.
    expected: { r1_ok: true, r3_ok: false, r4_ok: false, r5_ok: true },
    fr: {
      name: 'Portée de « seul » et « ne… que »',
      description: 'Règles d’approbation de dépenses : à quoi s’applique la restriction ?',
      state: {
        rules: [
          'Seuls les managers peuvent approuver les dépenses de plus de 500 €.',
          'Les stagiaires ne peuvent approuver que les dépenses de moins de 50 €.',
          'Aucune dépense ne peut être approuvée par la personne qui l’a engagée.',
          'Il n’existe aucune autre règle d’approbation.',
        ],
        approvals: [
          { id: 'R1', amount_eur: 800, spent_by: 'Lucie', approved_by: 'Marc', approver_role: 'manager' },
          { id: 'R2', amount_eur: 30, spent_by: 'Tom', approved_by: 'Inès', approver_role: 'stagiaire' },
          { id: 'R3', amount_eur: 200, spent_by: 'Paul', approved_by: 'Paul', approver_role: 'manager' },
          { id: 'R4', amount_eur: 120, spent_by: 'Lucie', approved_by: 'Inès', approver_role: 'stagiaire' },
          { id: 'R5', amount_eur: 300, spent_by: 'Tom', approved_by: 'Yanis', approver_role: 'employé' },
        ],
      },
      questions: {
        r1_ok: { type: 'noul', instructions: 'L’approbation R1 respecte-t-elle toutes les règles ?' },
        r3_ok: { type: 'noul', instructions: 'L’approbation R3 respecte-t-elle toutes les règles ?' },
        r4_ok: { type: 'noul', instructions: 'L’approbation R4 respecte-t-elle toutes les règles ?' },
        r5_ok: { type: 'noul', instructions: 'L’approbation R5 respecte-t-elle toutes les règles ?' },
      },
    },
    en: {
      name: 'Scope of “only”',
      description: 'Expense approval rules: what does the restriction apply to?',
      state: {
        rules: [
          'Only managers can approve expenses over €500.',
          'Interns can only approve expenses under €50.',
          'No expense may be approved by the person who incurred it.',
          'There are no other approval rules.',
        ],
        approvals: [
          { id: 'R1', amount_eur: 800, spent_by: 'Lucie', approved_by: 'Marc', approver_role: 'manager' },
          { id: 'R2', amount_eur: 30, spent_by: 'Tom', approved_by: 'Inès', approver_role: 'intern' },
          { id: 'R3', amount_eur: 200, spent_by: 'Paul', approved_by: 'Paul', approver_role: 'manager' },
          { id: 'R4', amount_eur: 120, spent_by: 'Lucie', approved_by: 'Inès', approver_role: 'intern' },
          { id: 'R5', amount_eur: 300, spent_by: 'Tom', approved_by: 'Yanis', approver_role: 'employee' },
        ],
      },
      questions: {
        r1_ok: { type: 'noul', instructions: 'Does approval R1 comply with all the rules?' },
        r3_ok: { type: 'noul', instructions: 'Does approval R3 comply with all the rules?' },
        r4_ok: { type: 'noul', instructions: 'Does approval R4 comply with all the rules?' },
        r5_ok: { type: 'noul', instructions: 'Does approval R5 comply with all the rules?' },
      },
    },
  },
  {
    id: 'lang-unless-only-if',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // « Que si » pose une condition nécessaire, pas suffisante : l’emballage d’origine ne garantit rien (cf. Malik).
    // « Sauf si » : la panne de Zoé précède l’intervention, elle relève donc de l’exception.
    expected: { yann_refundable: false, zoe_exception: true, malik_refundable: false, packaging_sufficient: false },
    fr: {
      name: '« Que si » et « sauf si »',
      description: 'Condition nécessaire, exception et cas concrets.',
      state:
        'Garantie : un appareil n’est remboursé que s’il est rapporté dans son emballage d’origine. Un appareil ouvert par un réparateur non agréé n’est pas remboursé, sauf si la panne est survenue avant cette intervention.\n\nYann rapporte son grille-pain sans l’emballage d’origine ; personne ne l’a jamais ouvert.\nZoé rapporte sa bouilloire dans son emballage d’origine ; elle est tombée en panne, puis Zoé l’a fait ouvrir par un réparateur non agréé.\nMalik rapporte son mixeur dans son emballage d’origine ; il l’a fait ouvrir par un réparateur non agréé, et la panne est apparue la semaine suivante.',
      questions: {
        yann_refundable: { type: 'noul', instructions: 'Yann peut-il être remboursé ?' },
        zoe_exception: { type: 'noul', instructions: 'Zoé relève-t-elle de l’exception prévue pour les appareils ouverts par un réparateur non agréé ?' },
        malik_refundable: { type: 'noul', instructions: 'Malik peut-il être remboursé ?' },
        packaging_sufficient: { type: 'noul', instructions: 'D’après la garantie, rapporter l’appareil dans son emballage d’origine suffit-il à être remboursé ?' },
      },
    },
    en: {
      name: '“Only if” and “unless”',
      description: 'Necessary condition, exception and concrete cases.',
      state:
        'Warranty: an appliance is refunded only if it is returned in its original packaging. An appliance opened by a non-approved repairer is not refunded, unless the fault occurred before that intervention.\n\nYann returns his toaster without the original packaging; nobody has ever opened it.\nZoé returns her kettle in its original packaging; it broke down, then Zoé had it opened by a non-approved repairer.\nMalik returns his blender in its original packaging; he had it opened by a non-approved repairer, and the fault appeared the following week.',
      questions: {
        yann_refundable: { type: 'noul', instructions: 'Can Yann be refunded?' },
        zoe_exception: { type: 'noul', instructions: 'Does Zoé fall under the exception for appliances opened by a non-approved repairer?' },
        malik_refundable: { type: 'noul', instructions: 'Can Malik be refunded?' },
        packaging_sufficient: { type: 'noul', instructions: 'According to the warranty, is returning the appliance in its original packaging enough to be refunded?' },
      },
    },
  },
  {
    id: 'lang-delivery-email',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'moyen',
    // 60 palettes est corrigé en 50 (le 60 concernait Brunet) ; 50 ≤ 55, donc pas de tarif dégressif.
    // La fermeture de Lille n’est pas confirmée : le site de livraison reste indéterminé. 50 palettes à 36 par camion : deux voyages.
    expected: { pallets: 'fifty', delivery_site: 'undetermined', trips: 'two', discount_applies: false, delay_cause: 'delcourt' },
    fr: {
      name: 'E-mail de suivi de livraison',
      description: 'Correction, condition non réalisée, croyance démentie, discours rapporté.',
      state: DELIVERY_EMAIL.fr,
      questions: {
        pallets: {
          type: 'choice',
          instructions: 'Combien de palettes comporte désormais la commande Delcourt ?',
          criteria: { thirty_six: '36', forty: '40', fifty: '50', sixty: '60' },
        },
        delivery_site: {
          type: 'choice',
          instructions: 'Où la commande Delcourt sera-t-elle livrée ?',
          criteria: { lille: 'À Lille', arras: 'À Arras', undetermined: 'Pas encore déterminé' },
        },
        trips: { type: 'choice', instructions: 'Combien de voyages faudra-t-il pour livrer la commande ?', criteria: { one: 'Un', two: 'Deux', three: 'Trois' } },
        discount_applies: { type: 'noul', instructions: 'Le tarif dégressif s’applique-t-il à la commande Delcourt ?' },
        delay_cause: {
          type: 'choice',
          instructions: 'Selon Mathilde, qui est à l’origine du retard du mois dernier ?',
          criteria: { delcourt: 'Delcourt', carrier: 'Le transporteur', mathilde_team: 'L’équipe de Mathilde', unknown: 'On ne sait pas' },
        },
      },
    },
    en: {
      name: 'Delivery follow-up email',
      description: 'Correction, unmet condition, refuted belief, reported speech.',
      state: DELIVERY_EMAIL.en,
      questions: {
        pallets: {
          type: 'choice',
          instructions: 'How many pallets does the Delcourt order now include?',
          criteria: { thirty_six: '36', forty: '40', fifty: '50', sixty: '60' },
        },
        delivery_site: {
          type: 'choice',
          instructions: 'Where will the Delcourt order be delivered?',
          criteria: { lille: 'To Lille', arras: 'To Arras', undetermined: 'Not determined yet' },
        },
        trips: { type: 'choice', instructions: 'How many trips will it take to deliver the order?', criteria: { one: 'One', two: 'Two', three: 'Three' } },
        discount_applies: { type: 'noul', instructions: 'Does the volume discount apply to the Delcourt order?' },
        delay_cause: {
          type: 'choice',
          instructions: 'According to Mathilde, who caused last month’s delay?',
          criteria: { delcourt: 'Delcourt', carrier: 'The carrier', mathilde_team: 'Mathilde’s team', unknown: 'Unknown' },
        },
      },
    },
  },
]
