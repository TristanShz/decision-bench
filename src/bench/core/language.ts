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

const STEERING_MINUTES = {
  fr: `Compte rendu — comité de pilotage du projet Horizon
Date : 6 novembre
Présents : Claire Dumas (direction des opérations), Gilles Marchand, Rémi Faure, Sonia Petit (cheffe de projet), Antoine Leroy (sécurité), Yasmine Haddad (achats)
Excusé : Laurent Brun (finance)

1. Gouvernance technique
Gilles Marchand a quitté la direction technique le 31 octobre ; Rémi Faure lui a succédé le 2 novembre. L’ancien directeur technique reste disponible jusqu’à la fin de l’année pour assurer la passation, mais toutes les décisions d’architecture relèvent désormais du nouveau. Claire Dumas rappelle que la validation du schéma d’architecture cible était initialement prévue avec Gilles Marchand ; elle se fera finalement avec Rémi Faure, et c’est ce dernier qui signera le document.

2. Calendrier
La mise en production de la nouvelle plateforme est fixée au 3 mars. La recette utilisateurs se déroulera du 1er au 19 février. Sonia Petit précise que la reprise des données historiques n’est pas incluse dans ce lot : elle fera l’objet d’un lot séparé, dont le calendrier sera établi au printemps.

3. Engagements
Sonia Petit s’engage à livrer le plan de migration détaillé le 14 novembre au plus tard. Antoine Leroy aimerait finaliser l’audit de sécurité avant la fin du mois, mais précise qu’il ne peut pas s’y engager tant que le prestataire d’audit n’a pas confirmé ses disponibilités. Yasmine Haddad envisage de relancer l’appel d’offres sur l’hébergement si les deux offres reçues ne sont pas révisées d’ici le 20 novembre.

4. Prestataires et formations
Les prestataires qui interviendront sur le projet doivent avoir suivi la formation RGPD avant tout accès à l’environnement de production ; aucun accès ne sera ouvert sans l’attestation correspondante. Ils devraient également suivre la formation à l’outil de ticketing, mais ce point n’est pas bloquant : un prestataire peut commencer sans l’avoir suivie. Antoine Leroy demande que la liste des comptes prestataires soit revue chaque mois ; la proposition est acceptée.

5. Budget
Le dépassement estimé s’élève à 40 000 €. Un budget complémentaire pourrait être accordé si le comité financier du 20 novembre donne son accord ; Laurent Brun, excusé, n’a pas pu donner d’indication à ce sujet. En l’absence d’accord, le périmètre du lot 1 sera réduit.

6. Risques
Le fournisseur de l’API de paiement a annoncé une maintenance majeure la semaine du 15 février, en pleine fin de recette. Compte tenu de ce risque, le comité décide de décaler la mise en production de deux semaines par rapport à la date fixée au point 2. Les dates de recette restent inchangées.

7. Communication
Le client n’a pas encore été informé du nouveau calendrier : Rémi Faure s’en chargera lors du point hebdomadaire de lundi. D’ici là, il est demandé à chacun de ne communiquer aucune date au client.

8. Divers
La salle Horizon sera réservée tous les jeudis matin pour les ateliers de recette. Yasmine Haddad rappelle que les notes de frais liées aux déplacements à Lille doivent être déposées avant le 5 du mois suivant.

Prochain comité : 4 décembre.`,
  en: `Minutes — Horizon project steering committee
Date: November 6
Present: Claire Dumas (operations), Gilles Marchand, Rémi Faure, Sonia Petit (project manager), Antoine Leroy (security), Yasmine Haddad (procurement)
Apologies: Laurent Brun (finance)

1. Technical governance
Gilles Marchand stepped down as CTO on October 31; Rémi Faure succeeded him on November 2. The former CTO remains available until the end of the year for the handover, but all architecture decisions now rest with the new one. Claire Dumas points out that the sign-off of the target architecture diagram was originally planned with Gilles Marchand; it will in the end be done with Rémi Faure, and it is the latter who will sign the document.

2. Schedule
The go-live of the new platform is set for March 3. User acceptance testing will run from February 1 to February 19. Sonia Petit adds that the migration of historical data is not part of this phase: it will be a separate phase, whose schedule will be set in the spring.

3. Commitments
Sonia Petit commits to delivering the detailed migration plan by November 14 at the latest. Antoine Leroy would like to finish the security audit before the end of the month, but says he cannot commit to it until the audit provider has confirmed its availability. Yasmine Haddad is considering re-running the hosting tender if the two bids received are not revised by November 20.

4. Contractors and training
Contractors working on the project must have completed the GDPR training before any access to the production environment; no access will be opened without the corresponding certificate. They should also complete the ticketing tool training, but this is not blocking: a contractor can start without having done it. Antoine Leroy asks for the list of contractor accounts to be reviewed every month; the proposal is accepted.

5. Budget
The estimated overrun is €40,000. Additional budget could be granted if the finance committee of November 20 approves it; Laurent Brun, who sent apologies, could not give any indication on this. Without approval, the scope of phase 1 will be reduced.

6. Risks
The payment API provider has announced major maintenance during the week of February 15, right at the end of acceptance testing. Given this risk, the committee decides to push the go-live back by two weeks from the date set in item 2. The acceptance testing dates remain unchanged.

7. Communication
The client has not yet been informed of the new schedule: Rémi Faure will do so at Monday’s weekly meeting. Until then, everyone is asked not to give the client any date.

8. Other business
The Horizon room will be booked every Thursday morning for the acceptance testing workshops. Yasmine Haddad reminds everyone that expense claims for trips to Lille must be submitted before the 5th of the following month.

Next committee: December 4.`,
}

const CLAIM_LETTER = {
  fr: `Objet : Votre déclaration de sinistre n° DS-48213 — dégât des eaux du 9 septembre

Madame,

Nous faisons suite à votre déclaration du 11 septembre ainsi qu’au rapport de l’expert, M. Joly, qui s’est rendu à votre domicile le 3 octobre. Nous vous remercions pour votre patience et pour les nombreux documents que vous nous avez transmis.

Certes, l’expert confirme que la fuite provient de l’appartement situé au-dessus du vôtre, occupé par M. Olivier. Toutefois, en application de la convention d’indemnisation entre assureurs, c’est à nous, en tant qu’assureur de votre logement, qu’il revient de vous indemniser directement ; nous exercerons ensuite, le cas échéant, un recours contre l’assureur de M. Olivier. Vous n’avez donc aucune démarche à effectuer auprès de votre voisin.

Recherche de fuite. Les frais de recherche de fuite (190 €) ont été engagés et réglés par M. Olivier ; ils ne figurent donc pas dans votre dossier.

Plafond et peinture. Les travaux de réfection du plafond du séjour (devis de l’entreprise Marin : 2 340 €) et de peinture du couloir (devis : 860 €) sont pris en charge, déduction faite de la franchise contractuelle de 380 €, qui ne s’applique qu’une seule fois par sinistre. Le règlement interviendra par virement sous quinze jours.

Parquet. Vous nous avez également signalé le gonflement du parquet de la chambre. L’expert relève que ce parquet présentait déjà, avant le sinistre, des traces d’humidité anciennes liées à un défaut d’aération, sans lien avec la fuite du 9 septembre. Après examen attentif de votre dossier, nous ne sommes malheureusement pas en mesure de réserver une suite favorable à cette partie de votre demande.

Ordinateur portable. Vous indiquez qu’un ordinateur portable, posé sur le bureau du séjour, a été endommagé par l’eau. Faute de facture d’achat, nous ne pouvons pas, à ce stade, déterminer sa valeur ni, par conséquent, l’indemniser. Il ne s’agit pas d’un refus : si vous nous faites parvenir la facture ou tout autre justificatif d’achat avant le 15 décembre, ce poste sera examiné et indemnisé selon la valeur d’usage prévue au contrat. Passé ce délai, il ne pourra plus être pris en compte.

Relogement. Votre logement étant resté habitable, aucune indemnité de relogement n’est due, ce que vous n’aviez d’ailleurs pas demandé.

Nous mesurons que cette réponse ne vous donne pas entière satisfaction sur tous les points ; nous restons néanmoins à votre disposition pour tout complément d’information. Si vous contestez les conclusions de l’expert, vous pouvez demander une contre-expertise, à vos frais, dans un délai de trente jours à compter de la réception de ce courrier.

Nous vous prions d’agréer, Madame, l’expression de nos salutations distinguées.

Le service Sinistres`,
  en: `Re: Your claim no. DS-48213 — water damage of September 9

Dear Madam,

We are writing further to your claim of September 11 and to the report of the loss adjuster, Mr. Joly, who visited your home on October 3. Thank you for your patience and for the many documents you sent us.

Admittedly, the adjuster confirms that the leak came from the flat above yours, occupied by Mr. Olivier. However, under the compensation agreement between insurers, it is up to us, as the insurer of your home, to compensate you directly; we will then, where appropriate, seek recovery from Mr. Olivier’s insurer. You therefore have nothing to do with regard to your neighbour.

Leak detection. The leak detection costs (€190) were incurred and paid by Mr. Olivier; they are therefore not part of your claim.

Ceiling and paint. The repair of the living-room ceiling (quote from the Marin company: €2,340) and the repainting of the hallway (quote: €860) are covered, minus the contractual deductible of €380, which applies only once per claim. Payment will be made by bank transfer within fifteen days.

Floorboards. You also reported that the bedroom’s wooden floor has swollen. The adjuster notes that this floor already showed, before the incident, old signs of damp caused by poor ventilation, unrelated to the leak of September 9. After careful review of your file, we are unfortunately not in a position to respond favourably to this part of your claim.

Laptop. You state that a laptop, left on the desk in the living room, was damaged by the water. In the absence of a purchase invoice, we cannot, at this stage, determine its value or, consequently, compensate you for it. This is not a refusal: if you send us the invoice or any other proof of purchase before December 15, this item will be reviewed and compensated at the depreciated value set out in the policy. After that date, it can no longer be taken into account.

Alternative accommodation. As your home remained habitable, no alternative accommodation allowance is due, which, in any case, you had not requested.

We appreciate that this reply does not fully satisfy you on every point; we nevertheless remain at your disposal for any further information. If you dispute the adjuster’s conclusions, you may request a second assessment, at your own expense, within thirty days of receiving this letter.

Yours faithfully,

Claims Department`,
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
  {
    id: 'lang-double-negation',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Deux négations s’annulent : « ne nie pas avoir reçu » ⇒ il l’a reçu ; « aucun… sans l’accord » ⇒ le dossier 14 clôturé avait l’accord ;
    // « rien n’interdit » ⇒ permis ; « pas un seul n’a échappé » ⇒ tous les serveurs ont été mis à jour.
    expected: { garnier_received: true, client_14_agreed: true, interns_forbidden: false, server_skipped: false },
    fr: {
      name: 'Double négation',
      description: 'Négations qui s’annulent : « ne pas nier », « aucun… sans », « rien n’interdit », « pas un seul… n’a échappé ».',
      state:
        '1. « Je ne nie pas avoir reçu votre courrier du 4 mars, mais j’en conteste le contenu. » (M. Garnier)\n2. Aucun dossier n’est clôturé sans l’accord écrit du client. Le dossier 14 a été clôturé hier.\n3. Rien n’interdit aux stagiaires de s’inscrire à la formation.\n4. Pas un seul des cinq serveurs n’a échappé à la mise à jour de cette nuit.',
      questions: {
        garnier_received: { type: 'noul', instructions: 'M. Garnier a-t-il reçu le courrier du 4 mars ?' },
        client_14_agreed: { type: 'noul', instructions: 'Le client du dossier 14 a-t-il donné son accord écrit ?' },
        interns_forbidden: { type: 'noul', instructions: 'Les stagiaires ont-ils l’interdiction de s’inscrire à la formation ?' },
        server_skipped: { type: 'noul', instructions: 'L’un des cinq serveurs a-t-il échappé à la mise à jour de cette nuit ?' },
      },
    },
    en: {
      name: 'Double negation',
      description: 'Negations that cancel out: “not deny”, “no… without”, “nothing prevents”, “not a single one… escaped”.',
      state:
        '1. “I do not deny having received your letter of March 4, but I dispute its content.” (Mr. Garnier)\n2. No file is closed without the client’s written consent. File 14 was closed yesterday.\n3. Nothing prevents interns from signing up for the training.\n4. Not a single one of the five servers escaped last night’s update.',
      questions: {
        garnier_received: { type: 'noul', instructions: 'Did Mr. Garnier receive the letter of March 4?' },
        client_14_agreed: { type: 'noul', instructions: 'Did the client of file 14 give written consent?' },
        interns_forbidden: { type: 'noul', instructions: 'Are interns forbidden from signing up for the training?' },
        server_skipped: { type: 'noul', instructions: 'Did one of the five servers escape last night’s update?' },
      },
    },
  },
  {
    id: 'lang-not-all-scope',
    category: 'Comprehension',
    complexity: 'simple',
    length: 'court',
    // « Pas tous » restreint sans exclure : Sami (trois ans) remplit la condition nécessaire et suffisante.
    // 1 200 € > 1 000 € : passage par la comptabilité, une semaine. Iris est l’exception du vendredi.
    expected: { sami_remote: true, refund_48h: false, iris_friday: true },
    fr: {
      name: 'Portée de « pas tous »',
      description: '« Tous… ne… pas », « pas tous », « sauf » dans un règlement intérieur.',
      state:
        'Règlement intérieur (extraits) :\n– Tous les employés n’ont pas droit au télétravail : y ont droit ceux qui ont au moins un an d’ancienneté, et eux seuls.\n– Les remboursements de frais ne sont pas tous traités sous 48 h : ceux de plus de 1 000 € passent par la comptabilité, qui met une semaine.\n– Les salles de réunion ne sont pas réservables le vendredi, sauf la salle Iris.',
      questions: {
        sami_remote: { type: 'noul', instructions: 'Sami, trois ans d’ancienneté, a-t-il droit au télétravail ?' },
        refund_48h: { type: 'noul', instructions: 'Un remboursement de frais de 1 200 € sera-t-il traité sous 48 h ?' },
        iris_friday: { type: 'noul', instructions: 'Peut-on réserver la salle Iris un vendredi ?' },
      },
    },
    en: {
      name: 'Scope of “not all”',
      description: '“Not all”, “not every”, “except” in company rules.',
      state:
        'Company rules (extracts):\n– Not all employees are entitled to remote work: those with at least one year’s seniority are, and only they are.\n– Not all expense refunds are processed within 48 hours: those over €1,000 go through accounting, which takes a week.\n– Meeting rooms cannot be booked on Fridays, except the Iris room.',
      questions: {
        sami_remote: { type: 'noul', instructions: 'Is Sami, with three years’ seniority, entitled to remote work?' },
        refund_48h: { type: 'noul', instructions: 'Will a €1,200 expense refund be processed within 48 hours?' },
        iris_friday: { type: 'noul', instructions: 'Can the Iris room be booked on a Friday?' },
      },
    },
  },
  {
    id: 'lang-presupposition',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Les présupposés survivent à la négation : « ne regrette pas d’avoir refusé » ⇒ elle a refusé ; « n’a pas arrêté de » ⇒ il le fait encore.
    // « Découvrir que » est factif (la sauvegarde a bien échoué) ; « croire que » ne l’est pas : on ignore si le contrat est signé.
    expected: { claire_accepted: false, vega_signed: 'unknown', backup_failed: true, malik_weekends: true },
    fr: {
      name: 'Présupposés',
      description: 'Ce qu’une phrase tient pour acquis, même sous la négation ; verbes factifs ou non.',
      state:
        'Notes de réunion :\n– Claire ne regrette pas d’avoir refusé le poste à Lyon.\n– Hugo croit que le contrat Vega est signé.\n– Nina a découvert que la sauvegarde de mardi avait échoué.\n– Malik n’a toujours pas arrêté de travailler le week-end.',
      questions: {
        claire_accepted: { type: 'noul', instructions: 'Claire a-t-elle accepté le poste à Lyon ?' },
        vega_signed: {
          type: 'choice',
          instructions: 'Le contrat Vega est-il signé ?',
          criteria: { yes: 'Oui', no: 'Non', unknown: 'Les notes ne permettent pas de le savoir' },
        },
        backup_failed: { type: 'noul', instructions: 'La sauvegarde de mardi a-t-elle échoué ?' },
        malik_weekends: { type: 'noul', instructions: 'Malik travaille-t-il encore le week-end ?' },
      },
    },
    en: {
      name: 'Presuppositions',
      description: 'What a sentence takes for granted, even under negation; factive and non-factive verbs.',
      state:
        'Meeting notes:\n– Claire does not regret turning down the job in Lyon.\n– Hugo believes the Vega contract is signed.\n– Nina discovered that Tuesday’s backup had failed.\n– Malik still hasn’t stopped working weekends.',
      questions: {
        claire_accepted: { type: 'noul', instructions: 'Did Claire accept the job in Lyon?' },
        vega_signed: {
          type: 'choice',
          instructions: 'Is the Vega contract signed?',
          criteria: { yes: 'Yes', no: 'No', unknown: 'The notes do not say' },
        },
        backup_failed: { type: 'noul', instructions: 'Did Tuesday’s backup fail?' },
        malik_weekends: { type: 'noul', instructions: 'Does Malik still work weekends?' },
      },
    },
  },
  {
    id: 'lang-necessary-sufficient',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Le master est nécessaire, pas suffisant ; la moyenne > 14 est suffisante pour un étudiant de master.
    // Chloé a exactement 14 : « inférieure ou égale à 14 » ⇒ entretien. Tout boursier est forcément en master (condition nécessaire).
    expected: { ana_granted: true, chloe_outcome: 'interview', master_sufficient: false, holder_in_master: true },
    fr: {
      name: 'Condition nécessaire ou suffisante',
      description: 'Règlement de bourse : ce qui est exigé, ce qui suffit, et le cas limite.',
      state:
        'Règlement de la bourse Horizon : seuls les étudiants inscrits en master peuvent prétendre à la bourse. Pour un étudiant de master, une moyenne strictement supérieure à 14/20 suffit pour l’obtenir. Les étudiants de master dont la moyenne est inférieure ou égale à 14/20 sont convoqués à un entretien, à l’issue duquel le jury décide.\n\nDossiers reçus : Ana, master 1, moyenne 15,2. Bilal, licence 3, moyenne 17,5. Chloé, master 2, moyenne 14.',
      questions: {
        ana_granted: { type: 'noul', instructions: 'Ana obtient-elle la bourse ?' },
        chloe_outcome: {
          type: 'choice',
          instructions: 'Qu’en est-il du dossier de Chloé ?',
          criteria: { granted: 'Elle obtient la bourse', interview: 'Elle est convoquée à un entretien', ineligible: 'Elle n’est pas éligible', refused: 'Sa demande est refusée' },
        },
        master_sufficient: { type: 'noul', instructions: 'D’après le règlement, être inscrit en master suffit-il pour obtenir la bourse ?' },
        holder_in_master: { type: 'noul', instructions: 'Un étudiant qui a obtenu la bourse Horizon est-il forcément inscrit en master ?' },
      },
    },
    en: {
      name: 'Necessary or sufficient condition',
      description: 'Scholarship rules: what is required, what is enough, and the borderline case.',
      state:
        'Horizon scholarship rules: only students enrolled in a master’s programme can apply for the scholarship. For a master’s student, an average strictly above 14/20 is enough to obtain it. Master’s students whose average is less than or equal to 14/20 are invited to an interview, after which the panel decides.\n\nApplications received: Ana, first-year master’s, average 15.2. Bilal, third-year bachelor’s, average 17.5. Chloé, second-year master’s, average 14.',
      questions: {
        ana_granted: { type: 'noul', instructions: 'Does Ana obtain the scholarship?' },
        chloe_outcome: {
          type: 'choice',
          instructions: 'What happens with Chloé’s application?',
          criteria: { granted: 'She obtains the scholarship', interview: 'She is invited to an interview', ineligible: 'She is not eligible', refused: 'Her application is rejected' },
        },
        master_sufficient: { type: 'noul', instructions: 'According to the rules, is being enrolled in a master’s programme enough to obtain the scholarship?' },
        holder_in_master: { type: 'noul', instructions: 'Is a student who has obtained the Horizon scholarship necessarily enrolled in a master’s programme?' },
      },
    },
  },
  {
    id: 'lang-comparatives',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Ordre : Gamma < Alpha < Bêta ≤ Delta < Epsilon. « Pas moins cher » autorise l’égalité : Delta peut coûter autant que Bêta,
    // on ne peut donc pas affirmer qu’il est plus cher. Delta ≥ Bêta > Alpha, donc Delta est bien plus cher qu’Alpha.
    expected: { cheapest: 'gamma', second_cheapest: 'alpha', delta_above_alpha: true, delta_above_beta: false },
    fr: {
      name: 'Comparatifs et superlatifs',
      description: 'Classer cinq devis à partir de comparaisons partielles, dont « pas moins cher ».',
      state:
        'Comparatif des devis de rénovation : le devis Alpha est moins cher que le devis Bêta, mais plus cher que le devis Gamma. Le devis Delta n’est pas moins cher que le devis Bêta. Aucun devis n’est aussi cher que le devis Epsilon.',
      questions: {
        cheapest: {
          type: 'choice',
          instructions: 'Quel est le devis le moins cher ?',
          criteria: { alpha: 'Alpha', beta: 'Bêta', gamma: 'Gamma', delta: 'Delta', epsilon: 'Epsilon' },
        },
        second_cheapest: {
          type: 'choice',
          instructions: 'Quel est le deuxième devis le moins cher ?',
          criteria: { alpha: 'Alpha', beta: 'Bêta', gamma: 'Gamma', delta: 'Delta', epsilon: 'Epsilon' },
        },
        delta_above_alpha: { type: 'noul', instructions: 'Le devis Delta est-il plus cher que le devis Alpha ?' },
        delta_above_beta: { type: 'noul', instructions: 'Le texte permet-il d’affirmer que le devis Delta est plus cher que le devis Bêta ?' },
      },
    },
    en: {
      name: 'Comparatives and superlatives',
      description: 'Ranking five quotes from partial comparisons, including “not cheaper”.',
      state:
        'Renovation quote comparison: the Alpha quote is cheaper than the Beta quote, but more expensive than the Gamma quote. The Delta quote is not cheaper than the Beta quote. No quote is as expensive as the Epsilon quote.',
      questions: {
        cheapest: {
          type: 'choice',
          instructions: 'Which quote is the cheapest?',
          criteria: { alpha: 'Alpha', beta: 'Beta', gamma: 'Gamma', delta: 'Delta', epsilon: 'Epsilon' },
        },
        second_cheapest: {
          type: 'choice',
          instructions: 'Which quote is the second cheapest?',
          criteria: { alpha: 'Alpha', beta: 'Beta', gamma: 'Gamma', delta: 'Delta', epsilon: 'Epsilon' },
        },
        delta_above_alpha: { type: 'noul', instructions: 'Is the Delta quote more expensive than the Alpha quote?' },
        delta_above_beta: { type: 'noul', instructions: 'Does the text allow us to state that the Delta quote is more expensive than the Beta quote?' },
      },
    },
  },
  {
    id: 'lang-coordination-scope',
    category: 'Comprehension',
    complexity: 'simple',
    length: 'court',
    // Coordination ambiguë levée par la précision qui suit : l’âge vaut pour les cadres comme pour les techniciens,
    // mais « en chêne » ne porte que sur les tables.
    expected: { manager_50: false, technician_58: true, pine_chair: true, pine_table: false },
    fr: {
      name: 'Coordination ambiguë',
      description: 'À quoi se rapporte le complément ? Ambiguïté levée par le contexte.',
      state:
        'Note RH : « Les cadres et les techniciens de plus de 55 ans peuvent demander une préretraite. » Précision de la DRH : la condition d’âge vaut pour les deux catégories.\n\nAffiche du magasin : « Remise de 10 % sur les chaises et les tables en chêne. » Précision du vendeur : toutes les chaises sont concernées, quel que soit le bois ; pour les tables, seules celles en chêne.',
      questions: {
        manager_50: { type: 'noul', instructions: 'Un cadre de 50 ans peut-il demander une préretraite ?' },
        technician_58: { type: 'noul', instructions: 'Un technicien de 58 ans peut-il demander une préretraite ?' },
        pine_chair: { type: 'noul', instructions: 'Une chaise en pin bénéficie-t-elle de la remise ?' },
        pine_table: { type: 'noul', instructions: 'Une table en pin bénéficie-t-elle de la remise ?' },
      },
    },
    en: {
      name: 'Ambiguous coordination',
      description: 'What does the modifier attach to? Ambiguity resolved by context.',
      state:
        'HR memo: “Managers and technicians over 55 may apply for early retirement.” HR clarification: the age condition applies to both categories.\n\nShop poster: “10% off chairs and tables made of oak.” Clarification from the salesperson: all chairs qualify, whatever the wood; for tables, only oak ones.',
      questions: {
        manager_50: { type: 'noul', instructions: 'Can a 50-year-old manager apply for early retirement?' },
        technician_58: { type: 'noul', instructions: 'Can a 58-year-old technician apply for early retirement?' },
        pine_chair: { type: 'noul', instructions: 'Does a pine chair get the discount?' },
        pine_table: { type: 'noul', instructions: 'Does a pine table get the discount?' },
      },
    },
  },
  {
    id: 'lang-indirect-speech-acts',
    category: 'Comprehension',
    complexity: 'simple',
    length: 'court',
    // Actes de langage indirects : u1 est une demande déguisée en question, u2 une offre, u3 un reproche ironique (40 minutes de retard),
    // u4 une vraie demande d’information (répondre « oui » ne suffirait pas, mais le visiteur ne demande aucune tâche).
    expected: { u1: 'request', u2: 'offer', u3: 'reproach', u4: 'information' },
    fr: {
      name: 'Actes de langage indirects',
      description: 'Ce que le locuteur cherche vraiment à obtenir, derrière la forme de la phrase.',
      state: {
        u1: 'La directrice, à son assistant, à 10 h : « Serait-il possible d’avoir le rapport avant midi ? »',
        u2: 'Un collègue, à Inès qui prépare sa soutenance : « Tu veux que je relise ta présentation ce soir ? »',
        u3: 'Le responsable, à Tom qui entre à 9 h 40 dans une réunion commencée à 9 h : « Ah, tu as fini par trouver la salle ! »',
        u4: 'Un visiteur, à l’hôtesse d’accueil du musée : « Savez-vous à quelle heure le musée ferme ce soir ? »',
      },
      questions: {
        u1: {
          type: 'choice',
          instructions: 'Que cherche avant tout à faire la locutrice de `u1` ?',
          criteria: { ability: 'Savoir si c’est faisable', request: 'Demander à l’interlocuteur d’accomplir une tâche', offer: 'Proposer son aide', reproach: 'Faire un reproche', information: 'Obtenir une information' },
        },
        u2: {
          type: 'choice',
          instructions: 'Que cherche avant tout à faire le locuteur de `u2` ?',
          criteria: { ability: 'Savoir si c’est faisable', request: 'Demander à l’interlocuteur d’accomplir une tâche', offer: 'Proposer son aide', reproach: 'Faire un reproche', information: 'Obtenir une information' },
        },
        u3: {
          type: 'choice',
          instructions: 'Que cherche avant tout à faire le locuteur de `u3` ?',
          criteria: { ability: 'Savoir si c’est faisable', request: 'Demander à l’interlocuteur d’accomplir une tâche', offer: 'Proposer son aide', reproach: 'Faire un reproche', information: 'Obtenir une information' },
        },
        u4: {
          type: 'choice',
          instructions: 'Que cherche avant tout à faire le locuteur de `u4` ?',
          criteria: { ability: 'Savoir si c’est faisable', request: 'Demander à l’interlocuteur d’accomplir une tâche', offer: 'Proposer son aide', reproach: 'Faire un reproche', information: 'Obtenir une information' },
        },
      },
    },
    en: {
      name: 'Indirect speech acts',
      description: 'What the speaker really wants, behind the form of the sentence.',
      state: {
        u1: 'The director, to her assistant, at 10 am: “Would it be possible to have the report before noon?”',
        u2: 'A colleague, to Inès, who is preparing her thesis defence: “Do you want me to look over your presentation tonight?”',
        u3: 'The manager, to Tom, who walks in at 9:40 am to a meeting that started at 9: “Ah, so you found the room in the end!”',
        u4: 'A visitor, to the museum receptionist: “Do you know what time the museum closes tonight?”',
      },
      questions: {
        u1: {
          type: 'choice',
          instructions: 'What is the speaker of `u1` mainly trying to do?',
          criteria: { ability: 'Find out whether it is feasible', request: 'Ask the listener to carry out a task', offer: 'Offer help', reproach: 'Reproach the listener', information: 'Obtain a piece of information' },
        },
        u2: {
          type: 'choice',
          instructions: 'What is the speaker of `u2` mainly trying to do?',
          criteria: { ability: 'Find out whether it is feasible', request: 'Ask the listener to carry out a task', offer: 'Offer help', reproach: 'Reproach the listener', information: 'Obtain a piece of information' },
        },
        u3: {
          type: 'choice',
          instructions: 'What is the speaker of `u3` mainly trying to do?',
          criteria: { ability: 'Find out whether it is feasible', request: 'Ask the listener to carry out a task', offer: 'Offer help', reproach: 'Reproach the listener', information: 'Obtain a piece of information' },
        },
        u4: {
          type: 'choice',
          instructions: 'What is the speaker of `u4` mainly trying to do?',
          criteria: { ability: 'Find out whether it is feasible', request: 'Ask the listener to carry out a task', offer: 'Offer help', reproach: 'Reproach the listener', information: 'Obtain a piece of information' },
        },
      },
    },
  },
  {
    id: 'lang-concession',
    category: 'Comprehension',
    complexity: 'simple',
    length: 'court',
    // Dans « certes… mais » et « cela dit », c’est ce qui suit qui porte la conclusion : Anne recommande Pragma
    // et soutient Durand, tout en reconnaissant que Nordis est moins cher et que Durand manque d’expérience.
    expected: { supplier: 'pragma', nordis_cheaper: true, durand_second_interview: true, durand_experienced: false },
    fr: {
      name: 'Concession',
      description: '« Certes… mais », « cela dit » : ce qui est concédé et ce qui est conclu.',
      state:
        'Avis d’Anne sur le fournisseur : « Certes, Nordis est 15 % moins cher que Pragma, mais ses délais de livraison sont incompatibles avec notre calendrier. Je recommande donc Pragma. »\n\nAvis d’Anne sur le candidat : « M. Durand n’a pas l’expérience demandée ; cela dit, son test technique est le meilleur que nous ayons vu, et je suis favorable à un second entretien. »',
      questions: {
        supplier: {
          type: 'choice',
          instructions: 'Quel fournisseur Anne recommande-t-elle ?',
          criteria: { nordis: 'Nordis', either: 'Indifféremment l’un ou l’autre', pragma: 'Pragma', undecided: 'Elle ne se prononce pas' },
        },
        nordis_cheaper: { type: 'noul', instructions: 'Selon Anne, Nordis est-il moins cher que Pragma ?' },
        durand_second_interview: { type: 'noul', instructions: 'Anne est-elle favorable à un second entretien pour M. Durand ?' },
        durand_experienced: { type: 'noul', instructions: 'Selon Anne, M. Durand a-t-il l’expérience demandée ?' },
      },
    },
    en: {
      name: 'Concession',
      description: '“Admittedly… but”, “that said”: what is conceded and what is concluded.',
      state:
        'Anne’s view on the supplier: “Admittedly, Nordis is 15% cheaper than Pragma, but its delivery times are incompatible with our schedule. I therefore recommend Pragma.”\n\nAnne’s view on the candidate: “Mr. Durand does not have the required experience; that said, his technical test is the best we have seen, and I am in favour of a second interview.”',
      questions: {
        supplier: {
          type: 'choice',
          instructions: 'Which supplier does Anne recommend?',
          criteria: { nordis: 'Nordis', either: 'Either one', pragma: 'Pragma', undecided: 'She does not take a position' },
        },
        nordis_cheaper: { type: 'noul', instructions: 'According to Anne, is Nordis cheaper than Pragma?' },
        durand_second_interview: { type: 'noul', instructions: 'Is Anne in favour of a second interview for Mr. Durand?' },
        durand_experienced: { type: 'noul', instructions: 'According to Anne, does Mr. Durand have the required experience?' },
      },
    },
  },
  {
    id: 'lang-litotes-euphemisms',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // « Se séparer de » est un euphémisme de licenciement ; « n’est pas sans savoir » = sait ; « je ne suis pas ravi » = mécontent ;
    // « quelques ajustements de calendrier » masque huit mois de retard (mars → novembre) : retard important.
    expected: { lambert: 'dismissal', costa_knows: true, author_satisfied: false, delay: 2 },
    fr: {
      name: 'Litotes et euphémismes',
      description: 'Dire moins pour signifier plus, ou adoucir une mauvaise nouvelle.',
      state:
        'Extraits de courriels internes :\n1. « Après mûre réflexion, nous avons décidé de nous séparer de M. Lambert. »\n2. « Mme Costa n’est pas sans savoir que la date limite de dépôt est vendredi. »\n3. « Je ne vous cache pas que je ne suis pas ravi du résultat. »\n4. « Le projet a connu quelques ajustements de calendrier : livraison prévue en mars, effectuée en novembre. »',
      questions: {
        lambert: {
          type: 'choice',
          instructions: 'Que signifie l’extrait 1 pour M. Lambert ?',
          criteria: {
            team_change: 'Il change d’équipe',
            dismissal: 'L’entreprise met fin à son contrat',
            office_move: 'Il change de bureau',
            leave: 'Il part en congé',
          },
        },
        costa_knows: { type: 'noul', instructions: 'D’après l’extrait 2, Mme Costa sait-elle que la date limite est vendredi ?' },
        author_satisfied: { type: 'noul', instructions: 'L’auteur de l’extrait 3 est-il satisfait du résultat ?' },
        delay: { type: 'score', instructions: 'Retard du projet décrit dans l’extrait 4', criteria: ['Aucun retard', 'Léger retard', 'Retard important'] },
      },
    },
    en: {
      name: 'Litotes and euphemisms',
      description: 'Saying less to mean more, or softening bad news.',
      state:
        'Extracts from internal emails:\n1. “After careful consideration, we have decided to part ways with Mr. Lambert.”\n2. “Ms. Costa is not unaware that the submission deadline is Friday.”\n3. “I won’t hide from you that I am not thrilled with the result.”\n4. “The project went through a few schedule adjustments: delivery planned for March, completed in November.”',
      questions: {
        lambert: {
          type: 'choice',
          instructions: 'What does extract 1 mean for Mr. Lambert?',
          criteria: {
            team_change: 'He is moving to another team',
            dismissal: 'The company is ending his contract',
            office_move: 'He is moving to another office',
            leave: 'He is going on leave',
          },
        },
        costa_knows: { type: 'noul', instructions: 'According to extract 2, does Ms. Costa know that the deadline is Friday?' },
        author_satisfied: { type: 'noul', instructions: 'Is the author of extract 3 satisfied with the result?' },
        delay: { type: 'score', instructions: 'Project delay described in extract 4', criteria: ['No delay', 'Slight delay', 'Significant delay'] },
      },
    },
  },
  {
    id: 'lang-workplace-sarcasm',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'moyen',
    // Karim est sarcastique deux fois (« merveilleuse façon », « en faire une tradition ») : il veut arrêter les déploiements du vendredi soir.
    // Le « merci » à Théo est ironique : une erreur trouvée en trente secondes a échappé à sa relecture. Le merci à Bastien est sincère.
    expected: { karim_pleased: false, theo_review: 'superficial', bastien_thanks_sincere: true, karim_friday: 'stop' },
    fr: {
      name: 'Sarcasme au bureau',
      description: 'Fil de discussion après un incident : remerciements ironiques et sincères.',
      state:
        '#prod — lundi, 9 h 02\nKarim : Super, le déploiement de vendredi 18 h a encore cassé la facturation. Quelle merveilleuse façon de commencer la semaine.\nNadia : Oui, et merci à Théo pour sa relecture particulièrement approfondie du script de migration : il nous a fallu trente secondes pour trouver l’erreur.\nSophie : Plus sérieusement, merci Bastien d’avoir passé la nuit à restaurer la base. Sans toi, on serait encore à l’arrêt.\nKarim : Excellente idée, ces déploiements du vendredi soir. On devrait en faire une tradition.',
      questions: {
        karim_pleased: { type: 'noul', instructions: 'Karim est-il content de la façon dont la semaine commence ?' },
        theo_review: {
          type: 'choice',
          instructions: 'Selon Nadia, comment Théo a-t-il relu le script de migration ?',
          criteria: { thorough: 'De façon approfondie', superficial: 'Superficiellement', not_reviewed: 'Il n’était pas chargé de le relire' },
        },
        bastien_thanks_sincere: { type: 'noul', instructions: 'Les remerciements de Sophie à Bastien sont-ils sincères ?' },
        karim_friday: {
          type: 'choice',
          instructions: 'Que pense réellement Karim des déploiements du vendredi soir ?',
          criteria: { continue: 'Il faut continuer', more: 'Il faut en faire davantage', stop: 'Il faut arrêter', indifferent: 'Cela lui est égal' },
        },
      },
    },
    en: {
      name: 'Sarcasm at work',
      description: 'Chat thread after an incident: ironic and sincere thanks.',
      state:
        '#prod — Monday, 9:02 am\nKarim: Great, Friday’s 6 pm deployment broke billing again. What a wonderful way to start the week.\nNadia: Yes, and thanks to Théo for his particularly thorough review of the migration script: it took us thirty seconds to find the bug.\nSophie: On a serious note, thank you Bastien for spending the night restoring the database. Without you, we would still be down.\nKarim: Excellent idea, these Friday evening deployments. We should make it a tradition.',
      questions: {
        karim_pleased: { type: 'noul', instructions: 'Is Karim happy with the way the week is starting?' },
        theo_review: {
          type: 'choice',
          instructions: 'According to Nadia, how did Théo review the migration script?',
          criteria: { thorough: 'Thoroughly', superficial: 'Superficially', not_reviewed: 'He was not in charge of reviewing it' },
        },
        bastien_thanks_sincere: { type: 'noul', instructions: 'Are Sophie’s thanks to Bastien sincere?' },
        karim_friday: {
          type: 'choice',
          instructions: 'What does Karim really think of Friday evening deployments?',
          criteria: { continue: 'They should continue', more: 'There should be more of them', stop: 'They should stop', indifferent: 'He doesn’t care' },
        },
      },
    },
  },
  {
    id: 'lang-false-belief',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'moyen',
    // Le contrat est en reprographie (Marc l’y a laissé). Paul n’a jamais été prévenu : il cherchera dans le classeur bleu.
    // Anne croit Paul prévenu, donc l’imagine chercher dans le tiroir. Lucie croit le contrat dans le tiroir : elle se trompe.
    expected: { actual_location: 'copy_room', paul_looks: 'blue_folder', anne_expects: 'drawer', lucie_knows: false },
    fr: {
      name: 'Qui sait quoi',
      description: 'Un document déplacé deux fois : croyances de chacun et réalité.',
      state:
        'Lundi matin, Paul range le contrat Ferrand dans le classeur bleu de son bureau, puis part en rendez-vous. Pendant son absence, Anne déplace le contrat dans le tiroir de la salle de réunion et demande à Lucie, l’assistante de Paul, de le prévenir. Lucie oublie de le faire, mais Anne reste persuadée que Paul est au courant. Un peu plus tard, Marc prend le contrat dans le tiroir pour le numériser et le laisse dans la salle de reprographie ; il n’en parle à personne. Paul revient en fin de journée et veut relire le contrat.',
      questions: {
        actual_location: {
          type: 'choice',
          instructions: 'Où se trouve réellement le contrat quand Paul revient ?',
          criteria: { blue_folder: 'Dans le classeur bleu', drawer: 'Dans le tiroir de la salle de réunion', copy_room: 'Dans la salle de reprographie', unknown: 'On ne peut pas le savoir' },
        },
        paul_looks: {
          type: 'choice',
          instructions: 'Où Paul va-t-il chercher le contrat en premier ?',
          criteria: { blue_folder: 'Dans le classeur bleu', drawer: 'Dans le tiroir de la salle de réunion', copy_room: 'Dans la salle de reprographie', unknown: 'On ne peut pas le savoir' },
        },
        anne_expects: {
          type: 'choice',
          instructions: 'Où Anne pense-t-elle que Paul ira chercher le contrat ?',
          criteria: { blue_folder: 'Dans le classeur bleu', drawer: 'Dans le tiroir de la salle de réunion', copy_room: 'Dans la salle de reprographie', unknown: 'On ne peut pas le savoir' },
        },
        lucie_knows: { type: 'noul', instructions: 'Lucie sait-elle où se trouve le contrat quand Paul revient ?' },
      },
    },
    en: {
      name: 'Who knows what',
      description: 'A document moved twice: each person’s beliefs and reality.',
      state:
        'On Monday morning, Paul puts the Ferrand contract in the blue binder in his office, then leaves for a meeting. While he is away, Anne moves the contract to the drawer in the meeting room and asks Lucie, Paul’s assistant, to let him know. Lucie forgets to do so, but Anne remains convinced that Paul knows. A little later, Marc takes the contract from the drawer to scan it and leaves it in the copy room; he tells no one. Paul comes back at the end of the day and wants to reread the contract.',
      questions: {
        actual_location: {
          type: 'choice',
          instructions: 'Where is the contract actually located when Paul comes back?',
          criteria: { blue_folder: 'In the blue binder', drawer: 'In the meeting room drawer', copy_room: 'In the copy room', unknown: 'There is no way to know' },
        },
        paul_looks: {
          type: 'choice',
          instructions: 'Where will Paul look for the contract first?',
          criteria: { blue_folder: 'In the blue binder', drawer: 'In the meeting room drawer', copy_room: 'In the copy room', unknown: 'There is no way to know' },
        },
        anne_expects: {
          type: 'choice',
          instructions: 'Where does Anne think Paul will look for the contract?',
          criteria: { blue_folder: 'In the blue binder', drawer: 'In the meeting room drawer', copy_room: 'In the copy room', unknown: 'There is no way to know' },
        },
        lucie_knows: { type: 'noul', instructions: 'Does Lucie know where the contract is when Paul comes back?' },
      },
    },
  },
  {
    id: 'lang-implicit-negation',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'court',
    // Négation implicite : « faute de quorum » ⇒ pas de quorum ; « sans l’intervention de Noé, le serveur serait tombé » ⇒ Noé est intervenu
    // et le serveur n’est pas tombé ; « a failli rater » ⇒ il ne l’a pas raté ; « personne n’a manqué de remarquer » ⇒ tout le monde l’a remarquée.
    expected: { quorum_reached: false, server_crashed: false, noe_intervened: true, caught_plane: true, everyone_noticed: true },
    fr: {
      name: 'Négation implicite',
      description: '« Faute de », « sans », « a failli », « n’a pas manqué de ».',
      state:
        '1. Faute de quorum, l’assemblée générale n’a pas pu voter.\n2. Sans l’intervention de Noé, le serveur serait tombé en panne.\n3. Victor a failli rater son avion.\n4. Personne n’a manqué de remarquer la faute dans le slogan.',
      questions: {
        quorum_reached: { type: 'noul', instructions: 'Le quorum a-t-il été atteint ?' },
        server_crashed: { type: 'noul', instructions: 'Le serveur est-il tombé en panne ?' },
        noe_intervened: { type: 'noul', instructions: 'Noé est-il intervenu ?' },
        caught_plane: { type: 'noul', instructions: 'Victor a-t-il pris son avion ?' },
        everyone_noticed: { type: 'noul', instructions: 'Tout le monde a-t-il remarqué la faute dans le slogan ?' },
      },
    },
    en: {
      name: 'Implicit negation',
      description: '“For lack of”, “without”, “nearly”, “no one failed to”.',
      state:
        '1. For lack of a quorum, the general meeting was unable to vote.\n2. Without Noé’s intervention, the server would have crashed.\n3. Victor nearly missed his plane.\n4. No one failed to notice the typo in the slogan.',
      questions: {
        quorum_reached: { type: 'noul', instructions: 'Was the quorum reached?' },
        server_crashed: { type: 'noul', instructions: 'Did the server crash?' },
        noe_intervened: { type: 'noul', instructions: 'Did Noé intervene?' },
        caught_plane: { type: 'noul', instructions: 'Did Victor catch his plane?' },
        everyone_noticed: { type: 'noul', instructions: 'Did everyone notice the typo in the slogan?' },
      },
    },
  },
  {
    id: 'lang-nli-hard',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'moyen',
    // a : trois projets sur cinq en retard, c’est la majorité ⇒ implication. b : nier n’est pas prouver ⇒ neutre.
    // c : modus tollens ⇒ contradiction. d : affirmation du conséquent, Inès peut avoir eu un certificat autrement ⇒ neutre.
    // e : « cesser de travailler pour » présuppose d’y avoir travaillé ⇒ implication.
    expected: { pair_a: 'entailment', pair_b: 'neutral', pair_c: 'contradiction', pair_d: 'neutral', pair_e: 'entailment' },
    fr: {
      name: 'Inférence en langue naturelle (difficile)',
      description: 'Implication, contradiction ou neutralité : proportions, démentis, conditionnels, présupposés.',
      state: {
        pair_a: { A: 'Seuls deux des cinq projets ont été livrés à temps.', B: 'La plupart des projets n’ont pas été livrés à temps.' },
        pair_b: { A: 'Le directeur a nié avoir signé la lettre.', B: 'Le directeur n’a pas signé la lettre.' },
        pair_c: {
          A: 'Tous les participants qui ont terminé le test ont reçu un certificat. Lucas n’a pas reçu de certificat.',
          B: 'Lucas a terminé le test.',
        },
        pair_d: {
          A: 'Tous les participants qui ont terminé le test ont reçu un certificat. Inès a reçu un certificat.',
          B: 'Inès a terminé le test.',
        },
        pair_e: { A: 'Nadia a cessé de travailler pour Orbis en 2022.', B: 'Nadia a travaillé pour Orbis.' },
      },
      questions: {
        pair_a: { type: 'choice', instructions: 'Relation entre A et B dans `pair_a`', criteria: NLI.fr },
        pair_b: { type: 'choice', instructions: 'Relation entre A et B dans `pair_b`', criteria: NLI.fr },
        pair_c: { type: 'choice', instructions: 'Relation entre A et B dans `pair_c`', criteria: NLI.fr },
        pair_d: { type: 'choice', instructions: 'Relation entre A et B dans `pair_d`', criteria: NLI.fr },
        pair_e: { type: 'choice', instructions: 'Relation entre A et B dans `pair_e`', criteria: NLI.fr },
      },
    },
    en: {
      name: 'Natural language inference (hard)',
      description: 'Entailment, contradiction or neutrality: proportions, denials, conditionals, presuppositions.',
      state: {
        pair_a: { A: 'Only two of the five projects were delivered on time.', B: 'Most of the projects were not delivered on time.' },
        pair_b: { A: 'The director denied having signed the letter.', B: 'The director did not sign the letter.' },
        pair_c: {
          A: 'All participants who completed the test received a certificate. Lucas did not receive a certificate.',
          B: 'Lucas completed the test.',
        },
        pair_d: {
          A: 'All participants who completed the test received a certificate. Inès received a certificate.',
          B: 'Inès completed the test.',
        },
        pair_e: { A: 'Nadia stopped working for Orbis in 2022.', B: 'Nadia worked for Orbis.' },
      },
      questions: {
        pair_a: { type: 'choice', instructions: 'Relation between A and B in `pair_a`', criteria: NLI.en },
        pair_b: { type: 'choice', instructions: 'Relation between A and B in `pair_b`', criteria: NLI.en },
        pair_c: { type: 'choice', instructions: 'Relation between A and B in `pair_c`', criteria: NLI.en },
        pair_d: { type: 'choice', instructions: 'Relation between A and B in `pair_d`', criteria: NLI.en },
        pair_e: { type: 'choice', instructions: 'Relation between A and B in `pair_e`', criteria: NLI.en },
      },
    },
  },
  {
    id: 'lang-calibration-should',
    category: 'Calibration',
    complexity: 'complexe',
    length: 'court',
    // « Devrait normalement » exprime une probabilité élevée sans garantie, nuancée par la mise en garde : probabilité plutôt haute.
    expected: { delivered_thursday: [0.5, 0.95], guaranteed: false },
    fr: {
      name: '« Devrait » (calibration)',
      description: 'Modalité épistémique : probable, pas certain.',
      state:
        'Suivi de commande : « Votre colis a été remis au transporteur. Il devrait normalement être livré jeudi. Les délais peuvent varier en période de forte activité. »',
      questions: {
        delivered_thursday: { type: 'noul', instructions: 'Le colis sera-t-il livré jeudi ?' },
        guaranteed: { type: 'noul', instructions: 'La livraison jeudi est-elle garantie ?' },
      },
    },
    en: {
      name: '“Should” (calibration)',
      description: 'Epistemic modality: likely, not certain.',
      state:
        'Order tracking: “Your parcel has been handed over to the carrier. It should normally be delivered on Thursday. Delivery times may vary during busy periods.”',
      questions: {
        delivered_thursday: { type: 'noul', instructions: 'Will the parcel be delivered on Thursday?' },
        guaranteed: { type: 'noul', instructions: 'Is delivery on Thursday guaranteed?' },
      },
    },
  },
  {
    id: 'lang-steering-minutes',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'long',
    // « Ce dernier » renvoie au nouveau directeur technique, Rémi Faure. Seule Sonia s’engage ferme (Antoine « aimerait », Yasmine « envisage »).
    // La formation RGPD est obligatoire (« doivent »), celle au ticketing seulement recommandée (« devraient », non bloquante).
    // Point 6 : 3 mars + deux semaines = 17 mars. Le client n’a pas encore été informé (point 7).
    expected: { architecture_signer: 'remi', firm_commitment: 'sonia', contractor_access: true, go_live: 'march_17', client_informed: false },
    fr: {
      name: 'Compte rendu de comité de pilotage',
      description: 'Chaînes de références, engagements et intentions, modalité, décision modifiée plus loin dans le texte.',
      state: STEERING_MINUTES.fr,
      questions: {
        architecture_signer: {
          type: 'choice',
          instructions: 'Qui signera le schéma d’architecture cible ?',
          criteria: { gilles: 'Gilles Marchand', claire: 'Claire Dumas', remi: 'Rémi Faure', sonia: 'Sonia Petit' },
        },
        firm_commitment: {
          type: 'choice',
          instructions: 'Parmi Sonia Petit, Antoine Leroy et Yasmine Haddad, qui a pris un engagement ferme sur une échéance ?',
          criteria: {
            sonia: 'Sonia Petit uniquement',
            sonia_antoine: 'Sonia Petit et Antoine Leroy',
            all_three: 'Tous les trois',
            nobody: 'Aucun des trois',
          },
        },
        contractor_access: {
          type: 'noul',
          instructions: 'Un prestataire qui a suivi la formation RGPD, mais pas celle à l’outil de ticketing, peut-il obtenir un accès à l’environnement de production ?',
        },
        go_live: {
          type: 'choice',
          instructions: 'À quelle date la mise en production est-elle désormais prévue ?',
          criteria: { march_3: 'Le 3 mars', march_10: 'Le 10 mars', march_17: 'Le 17 mars', undetermined: 'Pas encore fixée' },
        },
        client_informed: { type: 'noul', instructions: 'Au moment du comité, le client sait-il que la mise en production est décalée ?' },
      },
    },
    en: {
      name: 'Steering committee minutes',
      description: 'Reference chains, commitments and intentions, modality, a decision changed later in the text.',
      state: STEERING_MINUTES.en,
      questions: {
        architecture_signer: {
          type: 'choice',
          instructions: 'Who will sign the target architecture diagram?',
          criteria: { gilles: 'Gilles Marchand', claire: 'Claire Dumas', remi: 'Rémi Faure', sonia: 'Sonia Petit' },
        },
        firm_commitment: {
          type: 'choice',
          instructions: 'Among Sonia Petit, Antoine Leroy and Yasmine Haddad, who made a firm commitment to a deadline?',
          criteria: {
            sonia: 'Sonia Petit only',
            sonia_antoine: 'Sonia Petit and Antoine Leroy',
            all_three: 'All three',
            nobody: 'None of them',
          },
        },
        contractor_access: {
          type: 'noul',
          instructions: 'Can a contractor who has completed the GDPR training, but not the ticketing tool training, be given access to the production environment?',
        },
        go_live: {
          type: 'choice',
          instructions: 'On what date is the go-live now planned?',
          criteria: { march_3: 'March 3', march_10: 'March 10', march_17: 'March 17', undetermined: 'Not set yet' },
        },
        client_informed: { type: 'noul', instructions: 'At the time of the committee, does the client know that the go-live has been pushed back?' },
      },
    },
  },
  {
    id: 'lang-claim-letter',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'long',
    // Plafond et peinture : 2 340 + 860 − 380 (franchise appliquée une seule fois) = 2 820 €. Les 190 € de recherche de fuite
    // ont été réglés par le voisin, l’ordinateur est en attente de justificatif : ni l’un ni l’autre n’est versé maintenant.
    // « Pas en mesure de réserver une suite favorable » est un refus poli ; « certes » concède que la fuite vient de chez M. Olivier.
    expected: { leak_from_neighbour: true, payout: 'eur_2820', floor_covered: false, laptop: 'pending' },
    fr: {
      name: 'Courrier d’assureur',
      description: 'Concession, refus euphémisé, « faute de » et condition, montant à recalculer.',
      state: CLAIM_LETTER.fr,
      questions: {
        leak_from_neighbour: { type: 'noul', instructions: 'Le courrier reconnaît-il que la fuite provient de chez M. Olivier ?' },
        payout: {
          type: 'choice',
          instructions: 'Quel montant l’assureur s’engage-t-il à verser dès maintenant ?',
          criteria: { eur_1960: '1 960 €', eur_2440: '2 440 €', eur_2820: '2 820 €', eur_3010: '3 010 €', eur_3200: '3 200 €' },
        },
        floor_covered: { type: 'noul', instructions: 'Le parquet de la chambre est-il pris en charge ?' },
        laptop: {
          type: 'choice',
          instructions: 'Qu’en est-il de l’ordinateur portable ?',
          criteria: {
            covered: 'Il est indemnisé dès maintenant',
            refused: 'Il est définitivement refusé',
            pending: 'Il sera examiné si un justificatif d’achat est envoyé avant le 15 décembre',
            neighbour: 'Il faut s’adresser à l’assureur de M. Olivier',
          },
        },
      },
    },
    en: {
      name: 'Insurer’s letter',
      description: 'Concession, euphemistic refusal, “in the absence of” and a condition, an amount to recompute.',
      state: CLAIM_LETTER.en,
      questions: {
        leak_from_neighbour: { type: 'noul', instructions: 'Does the letter acknowledge that the leak came from Mr. Olivier’s flat?' },
        payout: {
          type: 'choice',
          instructions: 'What amount does the insurer commit to paying now?',
          criteria: { eur_1960: '€1,960', eur_2440: '€2,440', eur_2820: '€2,820', eur_3010: '€3,010', eur_3200: '€3,200' },
        },
        floor_covered: { type: 'noul', instructions: 'Is the bedroom floor covered?' },
        laptop: {
          type: 'choice',
          instructions: 'What about the laptop?',
          criteria: {
            covered: 'It is compensated now',
            refused: 'It is definitively refused',
            pending: 'It will be reviewed if proof of purchase is sent before December 15',
            neighbour: 'Mr. Olivier’s insurer must be contacted',
          },
        },
      },
    },
  },
]
