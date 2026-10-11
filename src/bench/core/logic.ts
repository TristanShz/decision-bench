import type { Pair } from './pair.ts'

// Logique en plusieurs étapes appliquée à des situations concrètes : affectations sous contraintes, créneaux,
// chemin critique, syllogismes et contraposée, sophismes (affirmation du conséquent, négation de l’antécédent),
// ensembles et diagrammes de Venn, chaînes de comparaisons, témoignages dont un seul est faux, conditions
// nécessaires et suffisantes, diagnostic par élimination, tournée, tournoi, principe des tiroirs, corrélation
// et causalité. Chaque solution a été vérifiée par un solveur en force brute : quand plusieurs configurations
// restent compatibles avec l’énoncé, la bonne réponse est « on ne peut pas le déterminer ».

// ─── Options partagées ───────────────────────────────────────────────────────

const YES_NO_UNKNOWN = {
  fr: { yes: 'Oui, c’est certain', no: 'Non, c’est exclu', undetermined: 'On ne peut pas le déterminer' },
  en: { yes: 'Yes, certainly', no: 'No, that is ruled out', undetermined: 'It cannot be determined' },
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const LOGIC: Pair[] = [
  {
    id: 'logic-office-assignment',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Arnaud au 2 ou au 3. Au 2 : Chloé au 3 ou au 4, et les deux bureaux restants (1 et 4, ou 1 et 3) ne sont pas voisins.
    // Donc Arnaud 3, Chloé 4 ; Bérénice et David se partagent 1 et 2, David pas au 2 : David 1, Bérénice 2.
    expected: { office_1: 'david', office_3: 'arnaud', chloe_in_4: true, berenice_chloe_neighbors: false },
    fr: {
      name: 'Affectation de bureaux',
      description: 'Quatre personnes, quatre bureaux alignés, cinq contraintes, une seule solution.',
      state:
        'Quatre nouveaux arrivants, Arnaud, Bérénice, Chloé et David, doivent occuper les bureaux 1 à 4, alignés dans cet ordre le long d’un couloir, un bureau par personne. Contraintes : Bérénice et David occupent des bureaux voisins. Arnaud ne veut pas d’un bureau situé à une extrémité du couloir. Le bureau de Chloé porte un numéro plus élevé que celui d’Arnaud. David ne peut pas prendre le bureau 2. Le bureau 4 ne convient pas à Bérénice.',
      questions: {
        office_1: {
          type: 'choice',
          instructions: 'Qui occupe le bureau 1 ?',
          criteria: { arnaud: 'Arnaud', berenice: 'Bérénice', chloe: 'Chloé', david: 'David' },
        },
        office_3: {
          type: 'choice',
          instructions: 'Qui occupe le bureau 3 ?',
          criteria: { berenice: 'Bérénice', arnaud: 'Arnaud', david: 'David', chloe: 'Chloé' },
        },
        chloe_in_4: { type: 'noul', instructions: 'Chloé occupe-t-elle le bureau 4 ?' },
        berenice_chloe_neighbors: { type: 'noul', instructions: 'Bérénice et Chloé occupent-elles des bureaux voisins ?' },
      },
    },
    en: {
      name: 'Office assignment',
      description: 'Four people, four offices in a row, five constraints, a single solution.',
      state:
        'Four new hires, Arnaud, Bérénice, Chloé and David, must take offices 1 to 4, which run in that order along a corridor, one office per person. Constraints: Bérénice and David have neighboring offices. Arnaud does not want an office at either end of the corridor. Chloé’s office has a higher number than Arnaud’s. David cannot take office 2. Office 4 is not suitable for Bérénice.',
      questions: {
        office_1: {
          type: 'choice',
          instructions: 'Who is in office 1?',
          criteria: { arnaud: 'Arnaud', berenice: 'Bérénice', chloe: 'Chloé', david: 'David' },
        },
        office_3: {
          type: 'choice',
          instructions: 'Who is in office 3?',
          criteria: { berenice: 'Bérénice', arnaud: 'Arnaud', david: 'David', chloe: 'Chloé' },
        },
        chloe_in_4: { type: 'noul', instructions: 'Is Chloé in office 4?' },
        berenice_chloe_neighbors: { type: 'noul', instructions: 'Do Bérénice and Chloé have neighboring offices?' },
      },
    },
  },
  {
    id: 'logic-meeting-slots',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Informatique l’après-midi ; recrutement puis marketing dans la même demi-journée ; sécurité ni à 9 h ni après le budget,
    // budget pas à 15 h. Seule solution : recrutement 9 h, marketing 10 h, sécurité 11 h, budget 14 h, informatique 15 h.
    expected: { at_9: 'recruitment', at_15: 'it', security_afternoon: false, budget_before_it: true },
    fr: {
      name: 'Ordre des présentations',
      description: 'Cinq présentations à placer sur cinq créneaux sous contraintes.',
      state:
        'Cinq présentations doivent être placées sur cinq créneaux d’une même journée : 9 h, 10 h et 11 h le matin, 14 h et 15 h l’après-midi, une présentation par créneau. La présentation sécurité a lieu avant la présentation budget. La présentation marketing occupe le créneau qui suit immédiatement celui de la présentation recrutement, dans la même demi-journée. La présentation informatique a lieu l’après-midi. Le budget n’est pas présenté à 15 h. La sécurité n’est pas présentée à 9 h.',
      questions: {
        at_9: {
          type: 'choice',
          instructions: 'Quelle présentation a lieu à 9 h ?',
          criteria: { budget: 'Budget', security: 'Sécurité', recruitment: 'Recrutement', marketing: 'Marketing', it: 'Informatique' },
        },
        at_15: {
          type: 'choice',
          instructions: 'Quelle présentation a lieu à 15 h ?',
          criteria: { budget: 'Budget', security: 'Sécurité', recruitment: 'Recrutement', marketing: 'Marketing', it: 'Informatique' },
        },
        security_afternoon: { type: 'noul', instructions: 'La présentation sécurité a-t-elle lieu l’après-midi ?' },
        budget_before_it: { type: 'noul', instructions: 'Le budget est-il présenté avant l’informatique ?' },
      },
    },
    en: {
      name: 'Presentation order',
      description: 'Five presentations to fit into five slots under constraints.',
      state:
        'Five presentations must be placed in five slots on the same day: 9:00, 10:00 and 11:00 am in the morning, 2:00 and 3:00 pm in the afternoon, one presentation per slot. The security presentation takes place before the budget presentation. The marketing presentation takes the slot immediately after the recruitment presentation, in the same half-day. The IT presentation takes place in the afternoon. The budget is not presented at 3:00 pm. Security is not presented at 9:00 am.',
      questions: {
        at_9: {
          type: 'choice',
          instructions: 'Which presentation takes place at 9:00 am?',
          criteria: { budget: 'Budget', security: 'Security', recruitment: 'Recruitment', marketing: 'Marketing', it: 'IT' },
        },
        at_15: {
          type: 'choice',
          instructions: 'Which presentation takes place at 3:00 pm?',
          criteria: { budget: 'Budget', security: 'Security', recruitment: 'Recruitment', marketing: 'Marketing', it: 'IT' },
        },
        security_afternoon: { type: 'noul', instructions: 'Does the security presentation take place in the afternoon?' },
        budget_before_it: { type: 'noul', instructions: 'Is the budget presented before IT?' },
      },
    },
  },
  {
    id: 'logic-critical-path',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Fins au plus tôt : vider 3, peindre 5, câblage 7, moquette 6, mobilier 7, postes max(7, 6) + 2 = 9 jours.
    // Chemin critique vider → câblage → postes. Peinture : marge de 1 jour (moquette finirait au jour 7, sans retarder les postes).
    // Câblage critique : 1 jour de plus repousse la fin. Mobilier : fin au jour 7, 2 jours de plus ⇒ jour 9, pas de retard.
    expected: { total: 'd9', painting_slack: 's1', cabling_delay: true, furniture_delay: false },
    fr: {
      name: 'Chemin critique',
      description: 'Durée minimale d’un déménagement et marges des tâches.',
      state:
        'Planning du déménagement des bureaux. Les tâches indépendantes peuvent se dérouler en parallèle ; le déménagement est terminé quand toutes les tâches sont finies.\n- Vider les anciens locaux : 3 jours, en premier.\n- Peindre : 2 jours, après « Vider ».\n- Refaire le câblage : 4 jours, après « Vider ».\n- Poser la moquette : 1 jour, après « Peindre ».\n- Monter le mobilier : 2 jours, après « Peindre ».\n- Installer les postes de travail : 2 jours, après « Refaire le câblage » et « Poser la moquette ».',
      questions: {
        total: {
          type: 'choice',
          instructions: 'Quelle est la durée minimale du déménagement ?',
          criteria: { d8: '8 jours', d9: '9 jours', d10: '10 jours', d14: '14 jours' },
        },
        painting_slack: {
          type: 'choice',
          instructions: 'De combien de jours au plus la peinture peut-elle prendre du retard sans retarder la fin du déménagement ?',
          criteria: { s0: 'Aucun', s1: '1 jour', s2: '2 jours', s3: '3 jours' },
        },
        cabling_delay: { type: 'noul', instructions: 'Si le câblage prend un jour de plus que prévu, la fin du déménagement est-elle retardée ?' },
        furniture_delay: { type: 'noul', instructions: 'Si le montage du mobilier prend deux jours de plus que prévu, la fin du déménagement est-elle retardée ?' },
      },
    },
    en: {
      name: 'Critical path',
      description: 'Minimum duration of an office move and task slack.',
      state:
        'Office move schedule. Independent tasks can run in parallel; the move is complete when every task is finished.\n- Clear out the old premises: 3 days, first.\n- Paint: 2 days, after “Clear out”.\n- Redo the cabling: 4 days, after “Clear out”.\n- Lay the carpet: 1 day, after “Paint”.\n- Assemble the furniture: 2 days, after “Paint”.\n- Set up the workstations: 2 days, after “Redo the cabling” and “Lay the carpet”.',
      questions: {
        total: {
          type: 'choice',
          instructions: 'What is the minimum duration of the move?',
          criteria: { d8: '8 days', d9: '9 days', d10: '10 days', d14: '14 days' },
        },
        painting_slack: {
          type: 'choice',
          instructions: 'By how many days at most can the painting run late without delaying the end of the move?',
          criteria: { s0: 'None', s1: '1 day', s2: '2 days', s3: '3 days' },
        },
        cabling_delay: { type: 'noul', instructions: 'If the cabling takes one day longer than planned, is the end of the move delayed?' },
        furniture_delay: { type: 'noul', instructions: 'If assembling the furniture takes two days longer than planned, is the end of the move delayed?' },
      },
    },
  },
  {
    id: 'logic-syllogism-access',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Accès ⇒ formation ; prestataire ⇒ pas de formation ; donc (contraposée) Yann n’a pas accès.
    // Sonia est formée, mais la formation est nécessaire, pas suffisante : son accès est indéterminé.
    // Les techniciens non formés n’ont pas accès : il en existe, donc au moins un technicien n’a pas accès.
    expected: { yann_access: false, sonia_access: 'undetermined', some_technician_without_access: true, trained_means_access: false },
    fr: {
      name: 'Syllogismes d’accès',
      description: 'Condition nécessaire, contraposée et quantificateurs.',
      state:
        'Règlement du site : toute personne ayant accès à la salle serveurs a suivi la formation sécurité. Aucun prestataire n’a suivi cette formation. Certains techniciens ne l’ont pas suivie. Yann est prestataire. Sonia, technicienne, a suivi la formation sécurité.',
      questions: {
        yann_access: { type: 'noul', instructions: 'Yann peut-il avoir accès à la salle serveurs ?' },
        sonia_access: { type: 'choice', instructions: 'Sonia a-t-elle accès à la salle serveurs ?', criteria: YES_NO_UNKNOWN.fr },
        some_technician_without_access: { type: 'noul', instructions: 'Est-il certain qu’au moins un technicien n’a pas accès à la salle serveurs ?' },
        trained_means_access: { type: 'noul', instructions: 'Est-il certain que toute personne ayant suivi la formation a accès à la salle serveurs ?' },
      },
    },
    en: {
      name: 'Access syllogisms',
      description: 'Necessary condition, contrapositive and quantifiers.',
      state:
        'Site rules: everyone who has access to the server room has taken the security training. No contractor has taken this training. Some technicians have not taken it. Yann is a contractor. Sonia, a technician, has taken the security training.',
      questions: {
        yann_access: { type: 'noul', instructions: 'Can Yann have access to the server room?' },
        sonia_access: { type: 'choice', instructions: 'Does Sonia have access to the server room?', criteria: YES_NO_UNKNOWN.en },
        some_technician_without_access: { type: 'noul', instructions: 'Is it certain that at least one technician has no access to the server room?' },
        trained_means_access: { type: 'noul', instructions: 'Is it certain that everyone who has taken the training has access to the server room?' },
      },
    },
  },
  {
    id: 'logic-fallacies',
    category: 'Logic',
    complexity: 'complexe',
    length: 'moyen',
    // Règle : 4.2 installée ⇒ plantage. 1 : affirmation du conséquent (invalide). 2 : modus tollens (valide).
    // 3 : négation de l’antécédent (invalide, le plantage peut avoir une autre cause). 4 : modus ponens (valide).
    expected: { argument_1: false, argument_2: true, argument_3: false, argument_4: true },
    fr: {
      name: 'Sophismes d’un post-mortem',
      description: 'Affirmation du conséquent, négation de l’antécédent, modus ponens et tollens.',
      state:
        'Extrait d’un compte rendu d’incident. Fait établi par l’éditeur : si la mise à jour 4.2 est installée sur un poste, le module d’export y plante au démarrage. (Le module peut aussi planter pour d’autres raisons.)\n\nRaisonnements notés dans le compte rendu :\n1. Le module plante au démarrage sur le poste de Léa, donc la 4.2 y est installée.\n2. Le module ne plante pas sur le poste de Marc, donc la 4.2 n’y est pas installée.\n3. La 4.2 n’est pas installée sur le poste de Hugo, donc le module n’y plantera pas.\n4. La 4.2 est installée sur le serveur de test, donc le module y plantera au démarrage.',
      questions: {
        argument_1: { type: 'noul', instructions: 'Le raisonnement 1 est-il logiquement valide (sa conclusion découle-t-elle nécessairement du fait établi et du constat) ?' },
        argument_2: { type: 'noul', instructions: 'Le raisonnement 2 est-il logiquement valide (sa conclusion découle-t-elle nécessairement du fait établi et du constat) ?' },
        argument_3: { type: 'noul', instructions: 'Le raisonnement 3 est-il logiquement valide (sa conclusion découle-t-elle nécessairement du fait établi et du constat) ?' },
        argument_4: { type: 'noul', instructions: 'Le raisonnement 4 est-il logiquement valide (sa conclusion découle-t-elle nécessairement du fait établi et du constat) ?' },
      },
    },
    en: {
      name: 'Post-mortem fallacies',
      description: 'Affirming the consequent, denying the antecedent, modus ponens and tollens.',
      state:
        'Excerpt from an incident report. Fact established by the vendor: if update 4.2 is installed on a machine, the export module crashes on startup there. (The module can also crash for other reasons.)\n\nLines of reasoning recorded in the report:\n1. The module crashes on startup on Léa’s machine, so 4.2 is installed there.\n2. The module does not crash on Marc’s machine, so 4.2 is not installed there.\n3. 4.2 is not installed on Hugo’s machine, so the module will not crash there.\n4. 4.2 is installed on the test server, so the module will crash on startup there.',
      questions: {
        argument_1: { type: 'noul', instructions: 'Is reasoning 1 logically valid (does its conclusion necessarily follow from the established fact and the observation)?' },
        argument_2: { type: 'noul', instructions: 'Is reasoning 2 logically valid (does its conclusion necessarily follow from the established fact and the observation)?' },
        argument_3: { type: 'noul', instructions: 'Is reasoning 3 logically valid (does its conclusion necessarily follow from the established fact and the observation)?' },
        argument_4: { type: 'noul', instructions: 'Is reasoning 4 logically valid (does its conclusion necessarily follow from the established fact and the observation)?' },
      },
    },
  },
  {
    id: 'logic-venn-services',
    category: 'Logic',
    complexity: 'simple',
    length: 'court',
    // Union = 120 + 80 + 50 − 40 − 20 − 15 + 10 = 185, donc 15 n’utilisent aucun service.
    // Cantine seule = 120 − 40 − 20 + 10 = 70. Exactement deux = (40 − 10) + (20 − 10) + (15 − 10) = 45.
    expected: { none: 'n15', canteen_only: 'c70', exactly_two: 'e45' },
    fr: {
      name: 'Trois services, un diagramme de Venn',
      description: 'Inclusion-exclusion sur trois ensembles.',
      state:
        'Enquête auprès des 200 salariés du site. 120 utilisent la cantine, 80 la salle de sport et 50 la navette. 40 utilisent à la fois la cantine et la salle de sport, 20 la cantine et la navette, 15 la salle de sport et la navette ; 10 utilisent les trois services. Les chiffres « à la fois » incluent les personnes qui utilisent les trois services.',
      questions: {
        none: {
          type: 'choice',
          instructions: 'Combien de salariés n’utilisent aucun des trois services ?',
          criteria: { n5: '5', n15: '15', n25: '25', n35: '35' },
        },
        canteen_only: {
          type: 'choice',
          instructions: 'Combien de salariés utilisent la cantine et aucun autre service ?',
          criteria: { c50: '50', c60: '60', c80: '80', c70: '70' },
        },
        exactly_two: {
          type: 'choice',
          instructions: 'Combien de salariés utilisent exactement deux des trois services ?',
          criteria: { e75: '75', e45: '45', e55: '55', e35: '35' },
        },
      },
    },
    en: {
      name: 'Three services, one Venn diagram',
      description: 'Inclusion-exclusion over three sets.',
      state:
        'Survey of the site’s 200 employees. 120 use the canteen, 80 the gym and 50 the shuttle. 40 use both the canteen and the gym, 20 the canteen and the shuttle, 15 the gym and the shuttle; 10 use all three services. The “both” figures include the people who use all three services.',
      questions: {
        none: {
          type: 'choice',
          instructions: 'How many employees use none of the three services?',
          criteria: { n5: '5', n15: '15', n25: '25', n35: '35' },
        },
        canteen_only: {
          type: 'choice',
          instructions: 'How many employees use the canteen and no other service?',
          criteria: { c50: '50', c60: '60', c80: '80', c70: '70' },
        },
        exactly_two: {
          type: 'choice',
          instructions: 'How many employees use exactly two of the three services?',
          criteria: { e75: '75', e45: '45', e55: '55', e35: '35' },
        },
      },
    },
  },
  {
    id: 'logic-venn-bounds',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // 30 + 25 = 55 > 50 : au moins 5 personnes parlent les deux langues (au plus 25). Le nombre exact n’est pas déterminé.
    // Tous les hispanophones peuvent parler anglais (25 ≤ 30, 20 personnes ne parlent alors aucune des deux langues).
    expected: { min_both: 'm5', nobody_both_possible: false, exact_both: 'undetermined', all_spanish_speak_english_possible: true },
    fr: {
      name: 'Bornes d’un diagramme de Venn',
      description: 'Effectifs partiels : minimum certain, valeur exacte inconnue.',
      state:
        'Sur les 50 participants d’un séminaire international, 30 parlent anglais et 25 parlent espagnol. Certains participants ne parlent peut-être aucune de ces deux langues. On ne dispose d’aucune autre information.',
      questions: {
        min_both: {
          type: 'choice',
          instructions: 'Combien de participants, au minimum, parlent à la fois anglais et espagnol ?',
          criteria: { m0: '0', m5: '5', m20: '20', m25: '25' },
        },
        nobody_both_possible: { type: 'noul', instructions: 'Est-il possible qu’aucun participant ne parle les deux langues ?' },
        exact_both: {
          type: 'choice',
          instructions: 'Combien de participants parlent exactement les deux langues ?',
          criteria: { e5: '5', undetermined: 'On ne peut pas le déterminer', e25: '25', e55: '55' },
        },
        all_spanish_speak_english_possible: { type: 'noul', instructions: 'Est-il possible que tous les participants hispanophones parlent aussi anglais ?' },
      },
    },
    en: {
      name: 'Venn diagram bounds',
      description: 'Partial counts: a certain minimum, an unknown exact value.',
      state:
        'Of the 50 participants at an international seminar, 30 speak English and 25 speak Spanish. Some participants may speak neither of these two languages. No other information is available.',
      questions: {
        min_both: {
          type: 'choice',
          instructions: 'At a minimum, how many participants speak both English and Spanish?',
          criteria: { m0: '0', m5: '5', m20: '20', m25: '25' },
        },
        nobody_both_possible: { type: 'noul', instructions: 'Is it possible that no participant speaks both languages?' },
        exact_both: {
          type: 'choice',
          instructions: 'Exactly how many participants speak both languages?',
          criteria: { e5: '5', undetermined: 'It cannot be determined', e25: '25', e55: '55' },
        },
        all_spanish_speak_english_possible: { type: 'noul', instructions: 'Is it possible that all the Spanish-speaking participants also speak English?' },
      },
    },
  },
  {
    id: 'logic-weight-chain',
    category: 'Logic',
    complexity: 'simple',
    length: 'court',
    // A > B > D > C et E > B : deux ordres compatibles (E > A ou A > E). Le plus lourd est indéterminé, C est le plus léger,
    // E est forcément plus lourd que D (E > B > D), mais A n’est pas forcément plus lourd que E.
    expected: { heaviest: 'undetermined', lightest: 'c', e_heavier_than_d: true, a_heavier_than_e: false },
    fr: {
      name: 'Chaîne de comparaisons',
      description: 'Ordre partiel entre cinq colis.',
      state:
        'Cinq colis, A, B, C, D et E, ont tous des poids différents. A est plus lourd que B. B est plus lourd que D. C est plus léger que D. E est plus lourd que B.',
      questions: {
        heaviest: {
          type: 'choice',
          instructions: 'Quel colis est le plus lourd ?',
          criteria: { a: 'A', b: 'B', e: 'E', undetermined: 'On ne peut pas le déterminer' },
        },
        lightest: {
          type: 'choice',
          instructions: 'Quel colis est le plus léger ?',
          criteria: { d: 'D', c: 'C', b: 'B', undetermined: 'On ne peut pas le déterminer' },
        },
        e_heavier_than_d: { type: 'noul', instructions: 'Est-il certain que E est plus lourd que D ?' },
        a_heavier_than_e: { type: 'noul', instructions: 'Est-il certain que A est plus lourd que E ?' },
      },
    },
    en: {
      name: 'Chain of comparisons',
      description: 'Partial order among five parcels.',
      state:
        'Five parcels, A, B, C, D and E, all have different weights. A is heavier than B. B is heavier than D. C is lighter than D. E is heavier than B.',
      questions: {
        heaviest: {
          type: 'choice',
          instructions: 'Which parcel is the heaviest?',
          criteria: { a: 'A', b: 'B', e: 'E', undetermined: 'It cannot be determined' },
        },
        lightest: {
          type: 'choice',
          instructions: 'Which parcel is the lightest?',
          criteria: { d: 'D', c: 'C', b: 'B', undetermined: 'It cannot be determined' },
        },
        e_heavier_than_d: { type: 'noul', instructions: 'Is it certain that E is heavier than D?' },
        a_heavier_than_e: { type: 'noul', instructions: 'Is it certain that A is heavier than E?' },
      },
    },
  },
  {
    id: 'logic-one-liar',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // On teste chaque responsable possible. Alix : 2 fausses (Alix, Bastien). Bastien : seule la déclaration de Bastien est
    // fausse. Céline : 2 fausses. Dorian : 2 fausses (Alix, Dorian). Donc Bastien, qui est aussi le seul à mentir.
    expected: { culprit: 'bastien', liar: 'bastien', celine_truthful: true },
    fr: {
      name: 'Un seul témoignage faux',
      description: 'Quatre déclarations, une seule fausse : qui a laissé la porte ouverte ?',
      state:
        'Ce matin, la porte de la salle serveurs a été trouvée ouverte. Une seule personne l’a laissée ouverte, et c’est l’une des quatre personnes suivantes. Interrogées, elles déclarent :\n- Alix : « C’est Bastien. »\n- Bastien : « C’est Dorian. »\n- Céline : « Ce n’est pas moi. »\n- Dorian : « Bastien ment. »\nOn sait qu’exactement une de ces quatre déclarations est fausse.',
      questions: {
        culprit: {
          type: 'choice',
          instructions: 'Qui a laissé la porte ouverte ?',
          criteria: { alix: 'Alix', celine: 'Céline', bastien: 'Bastien', dorian: 'Dorian' },
        },
        liar: {
          type: 'choice',
          instructions: 'Qui a fait la déclaration fausse ?',
          criteria: { dorian: 'Dorian', alix: 'Alix', celine: 'Céline', bastien: 'Bastien' },
        },
        celine_truthful: { type: 'noul', instructions: 'La déclaration de Céline est-elle vraie ?' },
      },
    },
    en: {
      name: 'A single false statement',
      description: 'Four statements, only one false: who left the door open?',
      state:
        'This morning, the server room door was found open. A single person left it open, and it is one of the following four people. When questioned, they state:\n- Alix: “It was Bastien.”\n- Bastien: “It was Dorian.”\n- Céline: “It wasn’t me.”\n- Dorian: “Bastien is lying.”\nWe know that exactly one of these four statements is false.',
      questions: {
        culprit: {
          type: 'choice',
          instructions: 'Who left the door open?',
          criteria: { alix: 'Alix', celine: 'Céline', bastien: 'Bastien', dorian: 'Dorian' },
        },
        liar: {
          type: 'choice',
          instructions: 'Who made the false statement?',
          criteria: { dorian: 'Dorian', alix: 'Alix', celine: 'Céline', bastien: 'Bastien' },
        },
        celine_truthful: { type: 'noul', instructions: 'Is Céline’s statement true?' },
      },
    },
  },
  {
    id: 'logic-necessary-sufficient',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Paiement validé : condition nécessaire de l’expédition. Premium + paiement validé : condition suffisante du départ le jour même.
    // 1041 (standard, payée) : aucune règle ne tranche. 1042 expédiée ⇒ payée. 1043 non payée ⇒ jamais expédiée.
    // 1044 partie le jour même : la condition suffisante n’est pas nécessaire, le statut premium n’est pas certain.
    expected: { order_1041_same_day: 'undetermined', order_1042_paid: true, order_1043_can_ship: false, order_1044_premium: false },
    fr: {
      name: 'Conditions nécessaires et suffisantes',
      description: 'Règles d’expédition d’un entrepôt appliquées à quatre commandes.',
      state:
        'Règles de l’entrepôt, appliquées sans exception : une commande n’est expédiée que si son paiement a été validé. Toute commande d’un client premium dont le paiement est validé part le jour même. Une commande qui part le jour même est évidemment expédiée.\n\nCommande 1041 : paiement validé, client standard.\nCommande 1042 : expédiée hier.\nCommande 1043 : paiement refusé, jamais validé.\nCommande 1044 : partie le jour même.',
      questions: {
        order_1041_same_day: { type: 'choice', instructions: 'La commande 1041 partira-t-elle le jour même ?', criteria: YES_NO_UNKNOWN.fr },
        order_1042_paid: { type: 'noul', instructions: 'Est-il certain que le paiement de la commande 1042 a été validé ?' },
        order_1043_can_ship: { type: 'noul', instructions: 'La commande 1043 peut-elle avoir été expédiée ?' },
        order_1044_premium: { type: 'noul', instructions: 'Est-il certain que la commande 1044 vient d’un client premium ?' },
      },
    },
    en: {
      name: 'Necessary and sufficient conditions',
      description: 'A warehouse’s shipping rules applied to four orders.',
      state:
        'Warehouse rules, applied without exception: an order is shipped only if its payment has been validated. Every order from a premium customer whose payment is validated goes out the same day. An order that goes out the same day is of course shipped.\n\nOrder 1041: payment validated, standard customer.\nOrder 1042: shipped yesterday.\nOrder 1043: payment declined, never validated.\nOrder 1044: went out the same day.',
      questions: {
        order_1041_same_day: { type: 'choice', instructions: 'Will order 1041 go out the same day?', criteria: YES_NO_UNKNOWN.en },
        order_1042_paid: { type: 'noul', instructions: 'Is it certain that the payment for order 1042 was validated?' },
        order_1043_can_ship: { type: 'noul', instructions: 'Can order 1043 have been shipped?' },
        order_1044_premium: { type: 'noul', instructions: 'Is it certain that order 1044 comes from a premium customer?' },
      },
    },
  },
  {
    id: 'logic-network-diagnosis',
    category: 'Logic',
    complexity: 'simple',
    length: 'court',
    // PC1 fonctionne : ni R ni S1 en panne. L’imprimante fonctionne : ni S2. Reste W, qui explique la panne des portables.
    // PC2 dépend de S2 et R, qui fonctionnent. Sans les deux autres constats, R, S1 et W resteraient possibles.
    expected: { faulty: 'w', pc2_works: true, replacing_w_fixes: true, laptops_alone_enough: false },
    fr: {
      name: 'Diagnostic par élimination',
      description: 'Une seule panne dans un réseau en arbre, trois constats.',
      state:
        'Réseau de l’agence : le routeur R alimente deux switchs, S1 et S2. Sur S1 sont branchés le poste fixe PC1 et la borne Wi-Fi W, à laquelle se connectent tous les ordinateurs portables. Sur S2 sont branchés l’imprimante et le poste fixe PC2. Un équipement en panne coupe tous ceux qui en dépendent. Un seul équipement réseau (R, S1, S2 ou W) est en panne ; les postes, les portables et l’imprimante sont en bon état.\n\nConstats : PC1 a accès au réseau ; aucun portable n’y a accès ; l’imprimante fonctionne normalement.',
      questions: {
        faulty: {
          type: 'choice',
          instructions: 'Quel équipement est en panne ?',
          criteria: { r: 'Le routeur R', s1: 'Le switch S1', s2: 'Le switch S2', w: 'La borne Wi-Fi W' },
        },
        pc2_works: { type: 'noul', instructions: 'PC2 devrait-il avoir accès au réseau ?' },
        replacing_w_fixes: { type: 'noul', instructions: 'Remplacer la borne W devrait-il rendre l’accès au réseau aux portables ?' },
        laptops_alone_enough: { type: 'noul', instructions: 'Si l’on avait seulement constaté que les portables n’ont pas accès au réseau, aurait-on pu identifier l’équipement en panne ?' },
      },
    },
    en: {
      name: 'Diagnosis by elimination',
      description: 'A single fault in a tree-shaped network, three observations.',
      state:
        'Branch office network: router R feeds two switches, S1 and S2. Plugged into S1 are the desktop PC1 and the Wi-Fi access point W, to which all the laptops connect. Plugged into S2 are the printer and the desktop PC2. A faulty device cuts off everything that depends on it. Exactly one network device (R, S1, S2 or W) is faulty; the desktops, laptops and printer are in working order.\n\nObservations: PC1 has network access; none of the laptops has access; the printer works normally.',
      questions: {
        faulty: {
          type: 'choice',
          instructions: 'Which device is faulty?',
          criteria: { r: 'Router R', s1: 'Switch S1', s2: 'Switch S2', w: 'Wi-Fi access point W' },
        },
        pc2_works: { type: 'noul', instructions: 'Should PC2 have network access?' },
        replacing_w_fixes: { type: 'noul', instructions: 'Should replacing access point W restore network access for the laptops?' },
        laptops_alone_enough: { type: 'noul', instructions: 'If we had only observed that the laptops have no network access, could we have identified the faulty device?' },
      },
    },
  },
  {
    id: 'logic-delivery-route',
    category: 'Logic',
    complexity: 'complexe',
    length: 'moyen',
    // Seul ordre faisable : A (arrivée 8 h 20, départ 8 h 35), B (arrivée 8 h 50, attente jusqu’à 9 h 00, départ 9 h 15),
    // C (arrivée 9 h 35, départ 9 h 50), retour 10 h 15. A–C–B arrive chez B à 10 h 05 (trop tard) ; commencer par B ou C
    // fait arriver chez A après 9 h.
    expected: { first_client: 'a', c_before_b_possible: false, return_time: 't1015', must_wait: true },
    fr: {
      name: 'Tournée sous contraintes',
      description: 'Trois livraisons avec horaires d’ouverture : un seul ordre possible.',
      state:
        'Un livreur part du dépôt à 8 h 00. Il doit livrer trois clients, A, B et C, une seule fois chacun, puis revenir au dépôt. Chaque livraison prend 15 minutes sur place.\n\nTemps de trajet, en minutes : dépôt–A 20, dépôt–B 30, dépôt–C 25, A–B 15, A–C 35, B–C 20 (identiques dans les deux sens).\n\nHoraires : A doit être atteint au plus tard à 9 h 00. B n’accepte les livraisons qu’entre 9 h 00 et 10 h 00 (arrivée au plus tard à 10 h 00 ; si le livreur arrive en avance, il attend l’ouverture). C ouvre à 9 h 30 et ferme à 11 h 00 (même règle).',
      questions: {
        first_client: {
          type: 'choice',
          instructions: 'Quel client le livreur doit-il livrer en premier ?',
          criteria: { a: 'A', b: 'B', c: 'C' },
        },
        c_before_b_possible: { type: 'noul', instructions: 'Le livreur peut-il livrer C avant B en respectant tous les horaires ?' },
        return_time: {
          type: 'choice',
          instructions: 'À quelle heure le livreur sera-t-il de retour au dépôt ?',
          criteria: { t0950: '9 h 50', t1015: '10 h 15', t1050: '10 h 50', t1100: '11 h 00' },
        },
        must_wait: { type: 'noul', instructions: 'Le livreur devra-t-il attendre l’ouverture d’un client ?' },
      },
    },
    en: {
      name: 'Constrained delivery round',
      description: 'Three deliveries with opening hours: only one possible order.',
      state:
        'A driver leaves the depot at 8:00 am. They must deliver to three customers, A, B and C, once each, then return to the depot. Each delivery takes 15 minutes on site.\n\nTravel times, in minutes: depot–A 20, depot–B 30, depot–C 25, A–B 15, A–C 35, B–C 20 (the same in both directions).\n\nHours: A must be reached by 9:00 am at the latest. B only accepts deliveries between 9:00 and 10:00 am (arrival by 10:00 am at the latest; if the driver arrives early, they wait for opening time). C opens at 9:30 am and closes at 11:00 am (same rule).',
      questions: {
        first_client: {
          type: 'choice',
          instructions: 'Which customer must the driver deliver to first?',
          criteria: { a: 'A', b: 'B', c: 'C' },
        },
        c_before_b_possible: { type: 'noul', instructions: 'Can the driver deliver to C before B while meeting all the time constraints?' },
        return_time: {
          type: 'choice',
          instructions: 'What time will the driver be back at the depot?',
          criteria: { t0950: '9:50 am', t1015: '10:15 am', t1050: '10:50 am', t1100: '11:00 am' },
        },
        must_wait: { type: 'noul', instructions: 'Will the driver have to wait for a customer to open?' },
      },
    },
  },
  {
    id: 'logic-tournament',
    category: 'Logic',
    complexity: 'complexe',
    length: 'moyen',
    // 6 matchs, 16 points distribués sur 18 possibles : 2 nuls. Logistique perd tout. Compta 7 = 2 victoires + 1 nul,
    // IT 5 = 1 victoire + 2 nuls, RH 4 = 1 victoire + 1 nul. Seule répartition : Compta bat RH et Logistique, nul contre IT ;
    // RH–IT nul ; RH et IT battent Logistique.
    expected: { rh_vs_it: 'draw', compta_lost: false, draws: 'd2', it_won: true },
    fr: {
      name: 'Tournoi à reconstituer',
      description: 'Retrouver les résultats d’un mini-championnat à partir des points.',
      state:
        'Tournoi de pétanque inter-services : quatre équipes (Compta, RH, IT et Logistique) se sont rencontrées une fois chacune, soit six matchs. Une victoire rapporte 3 points, un match nul 1 point, une défaite 0 point.\n\nClassement final : Compta 7 points, IT 5 points, RH 4 points, Logistique 0 point.',
      questions: {
        rh_vs_it: {
          type: 'choice',
          instructions: 'Quel a été le résultat du match RH contre IT ?',
          criteria: { rh: 'Victoire de RH', it: 'Victoire d’IT', draw: 'Match nul', undetermined: 'On ne peut pas le déterminer' },
        },
        compta_lost: { type: 'noul', instructions: 'L’équipe Compta a-t-elle perdu au moins un match ?' },
        draws: {
          type: 'choice',
          instructions: 'Combien de matchs nuls y a-t-il eu dans le tournoi ?',
          criteria: { d0: '0', d1: '1', d2: '2', d3: '3' },
        },
        it_won: { type: 'noul', instructions: 'L’équipe IT a-t-elle gagné au moins un match ?' },
      },
    },
    en: {
      name: 'Reconstructing a tournament',
      description: 'Recover the results of a mini league from the points.',
      state:
        'Inter-department pétanque tournament: four teams (Accounting, HR, IT and Logistics) each played one another once, six matches in all. A win earns 3 points, a draw 1 point, a loss 0 points.\n\nFinal standings: Accounting 7 points, IT 5 points, HR 4 points, Logistics 0 points.',
      questions: {
        rh_vs_it: {
          type: 'choice',
          instructions: 'What was the result of the HR vs IT match?',
          criteria: { rh: 'HR won', it: 'IT won', draw: 'A draw', undetermined: 'It cannot be determined' },
        },
        compta_lost: { type: 'noul', instructions: 'Did the Accounting team lose at least one match?' },
        draws: {
          type: 'choice',
          instructions: 'How many draws were there in the tournament?',
          criteria: { d0: '0', d1: '1', d2: '2', d3: '3' },
        },
        it_won: { type: 'noul', instructions: 'Did the IT team win at least one match?' },
      },
    },
  },
  {
    id: 'logic-oncall-rota',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Hugo ni lundi ni vendredi (Gaël le suit) ; Farid mardi, mercredi ou jeudi, après Inès ; Emma et Inès non consécutives.
    // Le solveur ne trouve qu’une solution : Inès lundi, Farid mardi, Emma mercredi, Hugo jeudi, Gaël vendredi.
    expected: { wednesday: 'emma', friday: 'gael', emma_before_farid: false, hugo_thursday: true },
    fr: {
      name: 'Planning d’astreinte',
      description: 'Cinq personnes, cinq jours, six contraintes.',
      state:
        'Cinq personnes, Emma, Farid, Gaël, Hugo et Inès, assurent chacune une journée d’astreinte, du lundi au vendredi d’une même semaine. Farid n’est d’astreinte ni le lundi ni le vendredi. Les journées d’Emma et d’Inès ne sont pas consécutives. Gaël est d’astreinte le lendemain de Hugo. Inès est d’astreinte avant Farid dans la semaine. Emma n’est pas d’astreinte le vendredi. Hugo n’est pas d’astreinte le lundi.',
      questions: {
        wednesday: {
          type: 'choice',
          instructions: 'Qui est d’astreinte le mercredi ?',
          criteria: { farid: 'Farid', gael: 'Gaël', emma: 'Emma', hugo: 'Hugo', ines: 'Inès' },
        },
        friday: {
          type: 'choice',
          instructions: 'Qui est d’astreinte le vendredi ?',
          criteria: { emma: 'Emma', hugo: 'Hugo', ines: 'Inès', gael: 'Gaël' },
        },
        emma_before_farid: { type: 'noul', instructions: 'Emma est-elle d’astreinte avant Farid dans la semaine ?' },
        hugo_thursday: { type: 'noul', instructions: 'Hugo est-il d’astreinte le jeudi ?' },
      },
    },
    en: {
      name: 'On-call rota',
      description: 'Five people, five days, six constraints.',
      state:
        'Five people, Emma, Farid, Gaël, Hugo and Inès, each cover one on-call day, Monday to Friday of the same week. Farid is on call neither on Monday nor on Friday. Emma’s and Inès’s days are not consecutive. Gaël is on call the day after Hugo. Inès is on call earlier in the week than Farid. Emma is not on call on Friday. Hugo is not on call on Monday.',
      questions: {
        wednesday: {
          type: 'choice',
          instructions: 'Who is on call on Wednesday?',
          criteria: { farid: 'Farid', gael: 'Gaël', emma: 'Emma', hugo: 'Hugo', ines: 'Inès' },
        },
        friday: {
          type: 'choice',
          instructions: 'Who is on call on Friday?',
          criteria: { emma: 'Emma', hugo: 'Hugo', ines: 'Inès', gael: 'Gaël' },
        },
        emma_before_farid: { type: 'noul', instructions: 'Is Emma on call earlier in the week than Farid?' },
        hugo_thursday: { type: 'noul', instructions: 'Is Hugo on call on Thursday?' },
      },
    },
  },
  {
    id: 'logic-supplier-grid',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Toner le mardi, ni par Alpha (pas le mardi) ni par Corail : c’est Bertin, mardi. Corail ne livre pas le lundi : mercredi ;
    // Alpha : lundi. Le papier n’arrive pas le mercredi, donc Corail livre le café et Alpha le papier.
    expected: { tuesday: 'bertin', corail_product: 'coffee', coffee_day: 'wed', bertin_paper: false },
    fr: {
      name: 'Grille fournisseurs',
      description: 'Trois fournisseurs, trois produits, trois jours.',
      state:
        'Trois fournisseurs, Alpha, Bertin et Corail, livrent chacun un produit différent (papier, café, toner), chacun un jour différent (lundi, mardi, mercredi). Le toner arrive le mardi. Alpha ne livre pas le mardi. Corail ne livre pas le toner. Corail ne livre pas le lundi. Le papier n’arrive pas le mercredi. Alpha ne livre pas le café. Bertin ne livre pas le lundi.',
      questions: {
        tuesday: {
          type: 'choice',
          instructions: 'Quel fournisseur livre le mardi ?',
          criteria: { alpha: 'Alpha', bertin: 'Bertin', corail: 'Corail' },
        },
        corail_product: {
          type: 'choice',
          instructions: 'Quel produit Corail livre-t-il ?',
          criteria: { paper: 'Le papier', toner: 'Le toner', coffee: 'Le café' },
        },
        coffee_day: {
          type: 'choice',
          instructions: 'Quel jour le café arrive-t-il ?',
          criteria: { wed: 'Mercredi', mon: 'Lundi', tue: 'Mardi' },
        },
        bertin_paper: { type: 'noul', instructions: 'Bertin livre-t-il le papier ?' },
      },
    },
    en: {
      name: 'Supplier grid',
      description: 'Three suppliers, three products, three days.',
      state:
        'Three suppliers, Alpha, Bertin and Corail, each deliver a different product (paper, coffee, toner), each on a different day (Monday, Tuesday, Wednesday). The toner arrives on Tuesday. Alpha does not deliver on Tuesday. Corail does not deliver the toner. Corail does not deliver on Monday. The paper does not arrive on Wednesday. Alpha does not deliver the coffee. Bertin does not deliver on Monday.',
      questions: {
        tuesday: {
          type: 'choice',
          instructions: 'Which supplier delivers on Tuesday?',
          criteria: { alpha: 'Alpha', bertin: 'Bertin', corail: 'Corail' },
        },
        corail_product: {
          type: 'choice',
          instructions: 'Which product does Corail deliver?',
          criteria: { paper: 'The paper', toner: 'The toner', coffee: 'The coffee' },
        },
        coffee_day: {
          type: 'choice',
          instructions: 'On which day does the coffee arrive?',
          criteria: { wed: 'Wednesday', mon: 'Monday', tue: 'Tuesday' },
        },
        bertin_paper: { type: 'noul', instructions: 'Does Bertin deliver the paper?' },
      },
    },
  },
  {
    id: 'logic-rooms-partial',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Deux solutions : Support 1, Design 2, Data 3, Juridique 4, ou Support 1, Juridique 2, Data 3, Design 4.
    // Certain : Support en 1, Data en 3 (donc voisine de Design dans les deux cas). Indéterminé : la salle de Design.
    expected: { room_1: 'support', data_room: 'r3', design_room: 'undetermined', data_next_to_design: true },
    fr: {
      name: 'Salles : ce qui est certain',
      description: 'Contraintes qui laissent deux solutions : distinguer le certain du possible.',
      state:
        'Quatre équipes, Design, Data, Juridique et Support, se répartissent les salles 1 à 4, alignées dans cet ordre le long d’un couloir, une salle par équipe. La salle du Support a un numéro inférieur à celle de Data. Design occupe une salle de numéro pair. Le Juridique ne veut pas de la salle 1. Les salles de Design et du Juridique ne sont pas voisines.',
      questions: {
        room_1: {
          type: 'choice',
          instructions: 'Quelle équipe occupe la salle 1 ?',
          criteria: { design: 'Design', data: 'Data', support: 'Support', undetermined: 'On ne peut pas le déterminer' },
        },
        data_room: {
          type: 'choice',
          instructions: 'Quelle salle occupe l’équipe Data ?',
          criteria: { r2: 'La salle 2', r3: 'La salle 3', r4: 'La salle 4', undetermined: 'On ne peut pas le déterminer' },
        },
        design_room: {
          type: 'choice',
          instructions: 'Quelle salle occupe l’équipe Design ?',
          criteria: { r2: 'La salle 2', undetermined: 'On ne peut pas le déterminer', r4: 'La salle 4', r3: 'La salle 3' },
        },
        data_next_to_design: { type: 'noul', instructions: 'Est-il certain que les salles de Data et de Design sont voisines ?' },
      },
    },
    en: {
      name: 'Rooms: what is certain',
      description: 'Constraints that leave two solutions: telling the certain from the possible.',
      state:
        'Four teams, Design, Data, Legal and Support, share rooms 1 to 4, which run in that order along a corridor, one room per team. Support’s room has a lower number than Data’s. Design is in an even-numbered room. Legal does not want room 1. Design’s and Legal’s rooms are not next to each other.',
      questions: {
        room_1: {
          type: 'choice',
          instructions: 'Which team is in room 1?',
          criteria: { design: 'Design', data: 'Data', support: 'Support', undetermined: 'It cannot be determined' },
        },
        data_room: {
          type: 'choice',
          instructions: 'Which room is the Data team in?',
          criteria: { r2: 'Room 2', r3: 'Room 3', r4: 'Room 4', undetermined: 'It cannot be determined' },
        },
        design_room: {
          type: 'choice',
          instructions: 'Which room is the Design team in?',
          criteria: { r2: 'Room 2', undetermined: 'It cannot be determined', r4: 'Room 4', r3: 'Room 3' },
        },
        data_next_to_design: { type: 'noul', instructions: 'Is it certain that the Data and Design rooms are next to each other?' },
      },
    },
  },
  {
    id: 'logic-wason-expenses',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Tâche de Wason : seule une note de plus de 100 € non signée viole la règle. Il faut retourner la note 1 (150 €,
    // est-elle signée ?) et la note 4 (non signée, dépasse-t-elle 100 € ?). La note 3, signée, ne peut rien violer.
    expected: { notes_to_check: 'n1_n4', check_note_3: false, check_note_4: true },
    fr: {
      name: 'Notes de frais à vérifier',
      description: 'Tâche de sélection de Wason appliquée à un contrôle de conformité.',
      state:
        'Règle de l’entreprise : toute note de frais de plus de 100 € doit porter la signature d’un manager. Quatre notes sont posées sur un bureau ; de chacune, on ne voit qu’une face, soit le montant, soit la case de signature.\n- Note 1 : montant de 150 €.\n- Note 2 : montant de 60 €.\n- Note 3 : signée par un manager.\n- Note 4 : non signée.\nUn contrôleur veut vérifier que la règle est respectée en retournant le moins de notes possible.',
      questions: {
        notes_to_check: {
          type: 'choice',
          instructions: 'Quelles notes doit-il retourner, et seulement celles-là ?',
          criteria: { n1: 'La note 1 seulement', n1_n3: 'Les notes 1 et 3', n1_n4: 'Les notes 1 et 4', n1_n3_n4: 'Les notes 1, 3 et 4', all: 'Les quatre notes' },
        },
        check_note_3: { type: 'noul', instructions: 'Est-il utile de retourner la note 3 ?' },
        check_note_4: { type: 'noul', instructions: 'Est-il utile de retourner la note 4 ?' },
      },
    },
    en: {
      name: 'Expense claims to check',
      description: 'The Wason selection task applied to a compliance check.',
      state:
        'Company rule: every expense claim over €100 must bear a manager’s signature. Four claims are lying on a desk; only one side of each is visible, either the amount or the signature box.\n- Claim 1: amount of €150.\n- Claim 2: amount of €60.\n- Claim 3: signed by a manager.\n- Claim 4: not signed.\nAn auditor wants to check that the rule is respected by turning over as few claims as possible.',
      questions: {
        notes_to_check: {
          type: 'choice',
          instructions: 'Which claims must the auditor turn over, and only those?',
          criteria: { n1: 'Claim 1 only', n1_n3: 'Claims 1 and 3', n1_n4: 'Claims 1 and 4', n1_n3_n4: 'Claims 1, 3 and 4', all: 'All four claims' },
        },
        check_note_3: { type: 'noul', instructions: 'Is it useful to turn over claim 3?' },
        check_note_4: { type: 'noul', instructions: 'Is it useful to turn over claim 4?' },
      },
    },
  },
  {
    id: 'logic-deploy-order',
    category: 'Logic',
    complexity: 'complexe',
    length: 'moyen',
    // Front exige API, Auth, BDD (via API) et Cache : 4 services avant lui, donc 5e au plus tôt. Mail peut passer après Front
    // (BDD, Auth, Cache, API, Front, Mail). Cache n’a aucune dépendance mais Front en dépend : jamais en dernier.
    // Par vagues de deux : {BDD, Cache}, {Auth}, {API, Mail}, {Front} ; la chaîne BDD → Auth → API → Front impose 4 vagues.
    expected: { front_earliest: 'p5', mail_before_front_required: false, api_third_possible: true, min_waves: 'w4' },
    fr: {
      name: 'Ordre de déploiement',
      description: 'Dépendances entre six services : positions possibles et nombre de vagues.',
      state:
        'Six services doivent être mis en production, un par un. Un service ne peut être déployé qu’après tous ceux dont il dépend.\n- Base de données : aucune dépendance.\n- Cache : aucune dépendance.\n- Authentification : dépend de la base de données.\n- API : dépend de l’authentification et de la base de données.\n- Mail : dépend de l’authentification.\n- Front : dépend de l’API et du cache.',
      questions: {
        front_earliest: {
          type: 'choice',
          instructions: 'Au plus tôt, en quelle position le Front peut-il être déployé ?',
          criteria: { p3: '3e', p4: '4e', p5: '5e', p6: '6e' },
        },
        mail_before_front_required: { type: 'noul', instructions: 'Le service Mail doit-il obligatoirement être déployé avant le Front ?' },
        api_third_possible: { type: 'noul', instructions: 'L’API peut-elle être le troisième service déployé ?' },
        min_waves: {
          type: 'choice',
          instructions: 'Si l’on peut déployer jusqu’à deux services en même temps par vague (en respectant les dépendances d’une vague à l’autre), combien de vagues faut-il au minimum ?',
          criteria: { w3: '3', w4: '4', w5: '5', w6: '6' },
        },
      },
    },
    en: {
      name: 'Deployment order',
      description: 'Dependencies among six services: possible positions and number of waves.',
      state:
        'Six services must be released to production, one at a time. A service can only be deployed after every service it depends on.\n- Database: no dependencies.\n- Cache: no dependencies.\n- Authentication: depends on the database.\n- API: depends on authentication and the database.\n- Mail: depends on authentication.\n- Front end: depends on the API and the cache.',
      questions: {
        front_earliest: {
          type: 'choice',
          instructions: 'At the earliest, in which position can the front end be deployed?',
          criteria: { p3: '3rd', p4: '4th', p5: '5th', p6: '6th' },
        },
        mail_before_front_required: { type: 'noul', instructions: 'Must the Mail service be deployed before the front end?' },
        api_third_possible: { type: 'noul', instructions: 'Can the API be the third service deployed?' },
        min_waves: {
          type: 'choice',
          instructions: 'If up to two services can be deployed at the same time per wave (respecting dependencies from one wave to the next), what is the minimum number of waves?',
          criteria: { w3: '3', w4: '4', w5: '5', w6: '6' },
        },
      },
    },
  },
  {
    id: 'logic-pigeonhole-badges',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Pire cas : 3 badges de couleurs différentes, le 4e forme une paire. 3 bleus garantis : 5 rouges + 4 verts + 3 bleus = 12.
    // Une de chaque couleur : 7 bleus + 5 rouges + 1 vert = 13.
    expected: { two_same_color: 'n4', three_blue: 'n12', one_of_each: 'n13' },
    fr: {
      name: 'Principe des tiroirs',
      description: 'Combien en tirer pour être certain ?',
      state:
        'Une boîte opaque contient 16 badges visiteurs : 5 rouges, 7 bleus et 4 verts. L’accueil tire des badges au hasard, sans regarder, et ne les remet pas dans la boîte.',
      questions: {
        two_same_color: {
          type: 'choice',
          instructions: 'Combien de badges faut-il tirer, au minimum, pour être certain d’en avoir deux de la même couleur ?',
          criteria: { n2: '2', n3: '3', n4: '4', n6: '6' },
        },
        three_blue: {
          type: 'choice',
          instructions: 'Combien de badges faut-il tirer, au minimum, pour être certain d’avoir trois badges bleus ?',
          criteria: { n12: '12', n3: '3', n7: '7', n14: '14' },
        },
        one_of_each: {
          type: 'choice',
          instructions: 'Combien de badges faut-il tirer, au minimum, pour être certain d’avoir au moins un badge de chaque couleur ?',
          criteria: { n3: '3', n9: '9', n12: '12', n13: '13' },
        },
      },
    },
    en: {
      name: 'Pigeonhole principle',
      description: 'How many to draw to be certain?',
      state:
        'An opaque box holds 16 visitor badges: 5 red, 7 blue and 4 green. Reception draws badges at random, without looking, and does not put them back in the box.',
      questions: {
        two_same_color: {
          type: 'choice',
          instructions: 'What is the minimum number of badges to draw to be certain of having two of the same color?',
          criteria: { n2: '2', n3: '3', n4: '4', n6: '6' },
        },
        three_blue: {
          type: 'choice',
          instructions: 'What is the minimum number of badges to draw to be certain of having three blue badges?',
          criteria: { n12: '12', n3: '3', n7: '7', n14: '14' },
        },
        one_of_each: {
          type: 'choice',
          instructions: 'What is the minimum number of badges to draw to be certain of having at least one badge of each color?',
          criteria: { n3: '3', n9: '9', n12: '12', n13: '13' },
        },
      },
    },
  },
  {
    id: 'logic-correlation-report',
    category: 'Logic',
    complexity: 'complexe',
    length: 'moyen',
    // Étude observationnelle : les agences volontaires étaient déjà mieux dotées en personnel (facteur de confusion).
    // L’écart moyen est un fait constaté ; la causalité et l’effet d’un déploiement général ne sont pas établis.
    expected: { proves_causation: false, higher_average: true, confounder: 'staffing', guaranteed_gain: false },
    fr: {
      name: 'Corrélation ou causalité',
      description: 'Un rapport interne confond association et effet causal.',
      state:
        'Extrait du rapport trimestriel : « Les 14 agences qui ont adopté le nouveau logiciel de relation client affichent une satisfaction moyenne de 82/100, contre 70/100 pour les 26 autres agences. Le logiciel améliore donc la satisfaction de 12 points, et son déploiement dans toutes les agences fera progresser la satisfaction d’autant. » Note méthodologique en annexe : « Les agences ont choisi librement d’adopter le logiciel. Celles qui l’ont adopté sont aussi celles qui comptaient le plus d’employés par client avant le lancement. Les questionnaires de satisfaction sont identiques dans toutes les agences. »',
      questions: {
        proves_causation: { type: 'noul', instructions: 'Ces données prouvent-elles que le logiciel est la cause de la meilleure satisfaction ?' },
        higher_average: { type: 'noul', instructions: 'Les agences équipées ont-elles, en moyenne, une satisfaction plus élevée que les autres ?' },
        confounder: {
          type: 'choice',
          instructions: 'Quel élément de l’annexe pourrait expliquer l’écart sans que le logiciel en soit la cause ?',
          criteria: {
            questionnaire: 'Le questionnaire de satisfaction',
            staffing: 'Le nombre d’employés par client',
            agency_count: 'Le nombre d’agences équipées',
            none: 'Aucun',
          },
        },
        guaranteed_gain: { type: 'noul', instructions: 'Est-il certain qu’un déploiement dans toutes les agences augmenterait la satisfaction de 12 points ?' },
      },
    },
    en: {
      name: 'Correlation or causation',
      description: 'An internal report mistakes an association for a causal effect.',
      state:
        'Excerpt from the quarterly report: “The 14 branches that adopted the new customer relationship software show an average satisfaction of 82/100, against 70/100 for the other 26 branches. The software therefore improves satisfaction by 12 points, and rolling it out to every branch will raise satisfaction by the same amount.” Methodological note in the appendix: “Branches chose freely whether to adopt the software. Those that adopted it are also the ones that had the most staff per customer before the launch. The satisfaction questionnaires are identical in every branch.”',
      questions: {
        proves_causation: { type: 'noul', instructions: 'Do these data prove that the software is the cause of the higher satisfaction?' },
        higher_average: { type: 'noul', instructions: 'Do the equipped branches have, on average, higher satisfaction than the others?' },
        confounder: {
          type: 'choice',
          instructions: 'Which item in the appendix could explain the gap without the software being its cause?',
          criteria: {
            questionnaire: 'The satisfaction questionnaire',
            staffing: 'The number of staff per customer',
            agency_count: 'The number of equipped branches',
            none: 'None',
          },
        },
        guaranteed_gain: { type: 'noul', instructions: 'Is it certain that rolling it out to every branch would raise satisfaction by 12 points?' },
      },
    },
  },
  {
    id: 'logic-alert-rules',
    category: 'Logic',
    complexity: 'complexe',
    length: 'court',
    // Maintenance ⇒ pas d’appel ⇒ pas d’alerte (contraposée de 2) ⇒ ni forte charge (1) ni échec de sauvegarde (4).
    // Astreinte appelée : la cause peut être la charge ou la sauvegarde, indéterminé. Sauvegarde échouée ⇒ alerte ⇒ appel.
    expected: { maintenance_backup_not_failed: true, maintenance_high_load: false, call_means_high_load: 'undetermined', failed_backup_call: true },
    fr: {
      name: 'Enchaînement de règles',
      description: 'Chaîne d’implications et contraposées dans une supervision.',
      state:
        'Règles de supervision, appliquées sans exception : (1) une forte charge déclenche toujours une alerte ; (2) toute alerte entraîne l’appel de la personne d’astreinte ; (3) pendant une maintenance, la personne d’astreinte n’est jamais appelée ; (4) si la sauvegarde nocturne échoue, une alerte est déclenchée.',
      questions: {
        maintenance_backup_not_failed: { type: 'noul', instructions: 'Une nuit de maintenance, est-il certain que la sauvegarde nocturne n’a pas échoué ?' },
        maintenance_high_load: { type: 'noul', instructions: 'Le système peut-il avoir été en forte charge pendant une maintenance ?' },
        call_means_high_load: {
          type: 'choice',
          instructions: 'Cette nuit, la personne d’astreinte a été appelée. Le système était-il en forte charge ?',
          criteria: YES_NO_UNKNOWN.fr,
        },
        failed_backup_call: { type: 'noul', instructions: 'Si la sauvegarde nocturne a échoué, est-il certain que la personne d’astreinte a été appelée ?' },
      },
    },
    en: {
      name: 'Chained rules',
      description: 'A chain of implications and contrapositives in monitoring.',
      state:
        'Monitoring rules, applied without exception: (1) high load always triggers an alert; (2) every alert leads to the on-call person being called; (3) during maintenance, the on-call person is never called; (4) if the nightly backup fails, an alert is triggered.',
      questions: {
        maintenance_backup_not_failed: { type: 'noul', instructions: 'On a maintenance night, is it certain that the nightly backup did not fail?' },
        maintenance_high_load: { type: 'noul', instructions: 'Can the system have been under high load during maintenance?' },
        call_means_high_load: {
          type: 'choice',
          instructions: 'Tonight, the on-call person was called. Was the system under high load?',
          criteria: YES_NO_UNKNOWN.en,
        },
        failed_backup_call: { type: 'noul', instructions: 'If the nightly backup failed, is it certain that the on-call person was called?' },
      },
    },
  },
]
