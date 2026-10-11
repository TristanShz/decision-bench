import type { BenchSuite } from '../../types'

// Cas rédigés directement en français (aucune traduction) et distincts de la suite « mixed »,
// pour que les deux mesures restent indépendantes.

// ─── Textes longs ────────────────────────────────────────────────────────────

const BAIL = `CONTRAT DE LOCATION — LOGEMENT NON MEUBLÉ (extraits)
Soumis au titre Ier bis de la loi n° 89-462 du 6 juillet 1989.

I. DÉSIGNATION DES PARTIES
Le présent contrat est conclu entre Mme Hélène Garnier, demeurant 4 allée des Tilleuls, 33000 Bordeaux (« le bailleur »), et M. Lucas Perrin (« le locataire »).

II. OBJET DU CONTRAT
Logement situé 27 rue Sainte-Catherine, 33000 Bordeaux, au 3e étage avec ascenseur. Type : T2. Surface habitable : 46 m². La commune de Bordeaux est située dans une zone d'urbanisation continue de plus de 50 000 habitants où il existe un déséquilibre marqué entre l'offre et la demande de logements (« zone tendue »), au sens de l'article 17 de la loi du 6 juillet 1989.
Locaux accessoires : une cave en sous-sol (lot n° 12). Aucune place de stationnement.

III. DATE DE PRISE D'EFFET ET DURÉE
Le contrat prend effet le 1er octobre 2026 pour une durée de trois ans. À défaut de congé, il est reconduit tacitement pour la même durée.

IV. CONDITIONS FINANCIÈRES
Loyer mensuel hors charges : 780 €. Provision sur charges : 60 € par mois, avec régularisation annuelle. Le loyer et la provision sont payables d'avance, le 5 de chaque mois, par virement.
Révision du loyer : le loyer est révisé chaque année à la date anniversaire du contrat, en fonction de la variation de l'indice de référence des loyers (IRL) publié par l'INSEE. Trimestre de référence : 2e trimestre.
Dépôt de garantie : 780 €, soit un mois de loyer hors charges. Il sera restitué dans un délai d'un mois à compter de la remise des clés si l'état des lieux de sortie est conforme à l'état des lieux d'entrée, et de deux mois dans le cas contraire.

V. CONGÉ
Le locataire peut donner congé à tout moment, par lettre recommandée avec accusé de réception, par acte de commissaire de justice ou par remise en main propre contre émargement. Le délai de préavis est de trois mois. Il est réduit à un mois lorsque le logement est situé dans une zone tendue, ainsi que dans les autres cas prévus par la loi (premier emploi, mutation, perte d'emploi, état de santé, bénéficiaires du RSA ou de l'AAH).
Le bailleur ne peut donner congé qu'à l'échéance du contrat, avec un préavis de six mois, et uniquement pour reprendre le logement, pour le vendre ou pour un motif légitime et sérieux.

VI. OBLIGATIONS DU LOCATAIRE
Le locataire s'engage à : payer le loyer et les charges aux termes convenus ; user paisiblement des locaux ; répondre des dégradations survenues pendant la durée du contrat ; prendre à sa charge l'entretien courant et les menues réparations ; souscrire une assurance contre les risques locatifs et en justifier chaque année ; ne pas transformer les locaux sans l'accord écrit du bailleur.
Le locataire ne peut ni céder le contrat, ni sous-louer le logement, sauf accord écrit du bailleur, y compris sur le prix du loyer de la sous-location.

VII. CLAUSE RÉSOLUTOIRE
Le contrat sera résilié de plein droit deux mois après un commandement de payer demeuré infructueux, en cas de défaut de paiement du loyer, des charges ou du dépôt de garantie. Il le sera également en cas de défaut d'assurance, un mois après un commandement demeuré infructueux.

VIII. ANIMAUX
La détention d'animaux familiers est autorisée, à condition qu'ils ne causent aucun dégât à l'immeuble ni aucun trouble de jouissance aux autres occupants.

IX. ANNEXES
Sont annexés au présent contrat : le dossier de diagnostic technique (diagnostic de performance énergétique classe D, état des risques, constat de risque d'exposition au plomb), l'état des lieux d'entrée, la notice d'information et l'extrait du règlement de copropriété.`

const AG_COPRO = `PROCÈS-VERBAL DE L'ASSEMBLÉE GÉNÉRALE ORDINAIRE
Résidence Les Platanes — 18 avenue Jean-Jaurès, 38000 Grenoble
Mercredi 14 mai 2026, 18 h 30, salle polyvalente de la résidence

Copropriétaires présents ou représentés : 31 sur 42, totalisant 7 940 tantièmes sur 10 000.
Le syndic, Cabinet Alpes Gestion, est représenté par M. Bertrand Coste.

Résolution n° 1 — Élection du président de séance
Mme Danielle Roux se porte candidate.
Vote : adoptée à l'unanimité des présents et représentés.

Résolution n° 2 — Approbation des comptes de l'exercice 2025
Les comptes font apparaître un total de dépenses de 84 312 €, pour un budget voté de 86 000 €. M. Faure demande des précisions sur la facture de dératisation ; le syndic indique qu'il s'agit d'une intervention d'urgence en novembre.
Vote (article 24) : pour 7 210, contre 0, abstentions 730. Résolution adoptée.

Résolution n° 3 — Quitus au syndic pour sa gestion 2025
Vote (article 24) : pour 6 480, contre 920, abstentions 540. Résolution adoptée.

Résolution n° 4 — Désignation du syndic
Le conseil syndical a mis en concurrence trois cabinets. Il recommande le renouvellement du Cabinet Alpes Gestion pour 18 mois, aux honoraires de 9 800 € HT par an, inchangés.
Vote (article 25) : pour 5 960, contre 1 420, abstentions 560. La majorité de 5 001 tantièmes étant atteinte, le Cabinet Alpes Gestion est renouvelé dans ses fonctions.

Résolution n° 5 — Ravalement des façades
Trois devis ont été présentés. Le conseil syndical recommande celui de l'entreprise Façades Dauphinoises pour 212 000 € TTC, honoraires de maîtrise d'œuvre compris. Plusieurs copropriétaires s'inquiètent du montant ; le syndic rappelle que la commune a adressé une injonction de ravalement en janvier.
Premier vote (article 25) : pour 4 820, contre 2 310, abstentions 810. La majorité de l'article 25 n'est pas atteinte, mais le projet a recueilli au moins le tiers des voix de tous les copropriétaires. En application de l'article 25-1, il est procédé immédiatement à un second vote à la majorité de l'article 24.
Second vote (article 24) : pour 5 110, contre 2 230, abstentions 600. Résolution adoptée. Les appels de fonds seront échelonnés en quatre fois, à compter du 1er septembre 2026.

Résolution n° 6 — Installation d'une infrastructure de recharge pour véhicules électriques dans le parking souterrain
Devis de l'entreprise Borne & Co : 38 500 € TTC.
Vote (article 24) : pour 3 120, contre 4 610, abstentions 210. Résolution rejetée.

Résolution n° 7 — Remplacement du système d'interphonie
Le devis présenté ne comprend pas le remplacement des combinés dans les logements. L'assemblée demande au syndic de produire deux devis complémentaires.
La résolution est ajournée à la prochaine assemblée générale.

Résolution n° 8 — Budget prévisionnel de l'exercice 2027
Le syndic propose un budget de 88 000 €, en hausse en raison de la revalorisation du contrat d'entretien de l'ascenseur.
Vote (article 24) : pour 6 900, contre 410, abstentions 630. Résolution adoptée.

Questions diverses
Mme Benali signale des infiltrations au plafond du garage, côté rampe d'accès. Le syndic fera intervenir l'entreprise d'étanchéité avant l'été. Aucune décision ne peut être prise sur ce point, qui n'était pas inscrit à l'ordre du jour.

L'ordre du jour étant épuisé, la séance est levée à 21 h 05.`

/** Relevé bancaire synthétique déterministe : 3 mois d'opérations, avec un paiement débité deux fois et un prélèvement rejeté. */
function syntheticStatement() {
  const merchants: [string, number, number][] = [
    ['CB CARREFOUR MARKET', 18, 140],
    ['CB BOULANGERIE DU MARCHE', 3, 14],
    ['CB SNCF CONNECT', 25, 120],
    ['CB AMAZON EU SARL', 9, 90],
    ['CB PHARMACIE CENTRALE', 6, 45],
    ['CB TOTALENERGIES', 40, 85],
    ['CB MONOPRIX', 8, 60],
    ['CB CINEMA PATHE', 11, 28],
  ]
  let seed = 23
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const ops: { date: string; libelle: string; montant: number }[] = []
  const day = (m: number, d: number) => `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  for (const m of [1, 2, 3]) {
    ops.push({ date: day(m, 2), libelle: 'PRLV SEPA LOYER SCI DES LILAS', montant: -890 })
    ops.push({ date: day(m, 5), libelle: 'PRLV SEPA FREE MOBILE', montant: -19.99 })
    if (m === 2) ops.push({ date: day(m, 12), libelle: 'REJET PRLV SEPA EDF CLIENTS PARTICULIERS', montant: 74.5 })
    ops.push({ date: day(m, 10), libelle: 'PRLV SEPA EDF CLIENTS PARTICULIERS', montant: -74.5 })
    ops.push({ date: day(m, 28), libelle: 'VIR SEPA ACME SAS SALAIRE', montant: 2415.32 })
    for (let i = 0; i < 40; i++) {
      const [libelle, lo, hi] = merchants[Math.floor(rnd() * merchants.length)]
      const d = 1 + Math.floor(rnd() * 28)
      ops.push({ date: day(m, d), libelle: `${libelle} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`, montant: -Math.round((lo + rnd() * (hi - lo)) * 100) / 100 })
    }
    if (m === 3) {
      ops.push({ date: day(m, 14), libelle: 'CB FNAC PARIS 14/03', montant: -349.99 })
      ops.push({ date: day(m, 14), libelle: 'CB FNAC PARIS 14/03', montant: -349.99 })
    }
  }
  return ops.sort((a, b) => a.date.localeCompare(b.date))
}

// ─── Suite ───────────────────────────────────────────────────────────────────

export const suite: BenchSuite = {
  id: 'fr',
  name: 'Français',
  description: 'Cas rédigés en français : litote, ironie, négation, registre, dates et montants au format français, droit du logement, copropriété, relevé bancaire.',
  lang: 'fr',
  version: '1',
  cases: [
    {
      id: 'avis-restaurant',
      name: 'Avis de restaurant',
      description: 'Avis positif avec une réserve mineure.',
      category: 'Sentiment',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Service un peu lent, mais les plats étaient délicieux et la terrasse vraiment agréable. On reviendra sans hésiter !',
        questions: {
          is_positive: { type: 'noul', instructions: 'L’avis est-il globalement positif ?' },
          will_return: { type: 'noul', instructions: 'Le client compte-t-il revenir ?' },
          sentiment: { type: 'score', instructions: 'Sentiment global de l’avis', criteria: ['Très négatif', 'Négatif', 'Neutre', 'Positif', 'Très positif'] },
        },
      },
      expected: { is_positive: true, will_return: true, sentiment: [3, 4] },
    },
    {
      id: 'litote',
      name: 'Litote',
      description: '« Ce n’est pas mauvais du tout » : négation qui exprime un compliment.',
      category: 'Sentiment',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Franchement, il n’est pas mauvais du tout, ton gratin. Tu me donneras la recette ?',
        questions: {
          is_compliment: { type: 'noul', instructions: 'La personne fait-elle un compliment sur le plat ?' },
          sentiment: { type: 'score', instructions: 'Avis réel sur le plat', criteria: ['Très négatif', 'Négatif', 'Neutre', 'Positif', 'Très positif'] },
        },
      },
      expected: { is_compliment: true, sentiment: [3, 4] },
    },
    {
      id: 'ironie-transport',
      name: 'Ironie',
      description: 'Félicitations ironiques après un retard de train.',
      category: 'Sentiment',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Encore 45 minutes de retard ce matin, et toujours aucune annonce en gare. Bravo, quelle ponctualité légendaire, je ne m’en lasse pas !',
        questions: {
          is_ironic: { type: 'noul', instructions: 'Le message est-il ironique ?' },
          is_satisfied: { type: 'noul', instructions: 'L’auteur est-il satisfait du service ?' },
          complaint: {
            type: 'choice',
            instructions: 'De quoi l’auteur se plaint-il principalement ?',
            criteria: { retard: 'Retards', prix: 'Prix des billets', proprete: 'Propreté', personnel: 'Comportement du personnel', aucune: 'Aucune plainte' },
          },
        },
      },
      expected: { is_ironic: true, is_satisfied: false, complaint: 'retard' },
    },
    {
      id: 'calibration-mouais',
      name: 'Réponse ambiguë (calibration)',
      description: '« Mouais, ça ira » : on attend une probabilité intermédiaire.',
      category: 'Calibration',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Mouais, ça ira.',
        questions: {
          is_satisfied: { type: 'noul', instructions: 'Le client est-il satisfait ?' },
        },
      },
      expected: { is_satisfied: [0.15, 0.85] },
    },
    {
      id: 'negation-restrictive',
      name: 'Négation restrictive',
      description: '« Ne… que » : une restriction, pas une négation totale.',
      category: 'Compréhension',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Bonjour, je n’ai reçu que deux colis sur les trois annoncés dans le mail de confirmation. Pouvez-vous vérifier ?',
        questions: {
          received_nothing: { type: 'noul', instructions: 'Le client n’a-t-il reçu aucun colis ?' },
          received_all: { type: 'noul', instructions: 'Le client a-t-il reçu tous ses colis ?' },
          received_count: { type: 'choice', instructions: 'Combien de colis le client a-t-il reçus ?', criteria: { zero: 'Aucun', un: 'Un', deux: 'Deux', trois: 'Trois' } },
        },
      },
      expected: { received_nothing: false, received_all: false, received_count: 'deux' },
    },
    {
      id: 'double-negation',
      name: 'Double négation',
      description: '« Il n’est pas impossible que… » : une possibilité, pas une certitude.',
      category: 'Compréhension',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Message de la direction : il n’est pas impossible que le séminaire de jeudi soit reporté. Nous vous confirmerons demain.',
        questions: {
          is_certain: { type: 'noul', instructions: 'Le report du séminaire est-il certain ?' },
          is_possible: { type: 'noul', instructions: 'Le séminaire pourrait-il être reporté ?' },
          status: {
            type: 'choice',
            instructions: 'Quel est le statut du séminaire ?',
            criteria: { maintenu: 'Confirmé, aucun changement', reporte: 'Reporté de façon certaine', incertain: 'Pas encore décidé', annule: 'Annulé' },
          },
        },
      },
      expected: { is_certain: false, is_possible: true, status: 'incertain' },
    },
    {
      id: 'registre',
      name: 'Registre de langue',
      description: 'Message familier et argotique.',
      category: 'Classification',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Wesh, t’as capté pour demain ? Ramène les enceintes, on gère le reste, ça va être ouf.',
        questions: {
          is_formal: { type: 'noul', instructions: 'Le message est-il rédigé dans un registre soutenu ?' },
          uses_slang: { type: 'noul', instructions: 'Le message contient-il de l’argot ?' },
          register: { type: 'score', instructions: 'Registre de langue du message', criteria: ['Très soutenu', 'Soutenu', 'Courant', 'Familier', 'Argotique'] },
        },
      },
      expected: { is_formal: false, uses_slang: true, register: [3, 4] },
    },
    {
      id: 'reponse-inadaptee',
      name: 'Réponse au mauvais ton',
      description: 'Réponse en tutoiement familier à un client qui vouvoie.',
      category: 'Support',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: {
          message_client:
            'Madame, Monsieur, je constate que mon abonnement a été prélevé deux fois ce mois-ci. Je vous saurais gré de bien vouloir procéder au remboursement du second prélèvement. Veuillez agréer mes salutations distinguées.',
          reponse_proposee: 'Salut ! T’inquiète, on s’en occupe direct 😉 Bisous',
        },
        questions: {
          tone_appropriate: { type: 'noul', instructions: 'Le ton de `reponse_proposee` est-il adapté à `message_client` ?' },
          mentions_refund: { type: 'noul', instructions: '`reponse_proposee` mentionne-t-elle explicitement le remboursement ?' },
          request_type: {
            type: 'choice',
            instructions: 'Que demande `message_client` ?',
            criteria: { remboursement: 'Un remboursement', resiliation: 'Une résiliation', information: 'Une information', reclamation_produit: 'Une réclamation sur un produit' },
          },
        },
      },
      expected: { tone_appropriate: false, mentions_refund: false, request_type: 'remboursement' },
    },
    {
      id: 'routage-assistant',
      name: 'Routage d’assistant vocal',
      description: 'Choice à 6 outils, demande familière sans horaire.',
      category: 'Routage',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state: { message: 'Mets-moi un truc calme pour bosser, genre du piano.', appareil: 'enceinte du salon' },
        questions: {
          tool: {
            type: 'choice',
            instructions: 'Quelle fonction doit traiter `message` ?',
            criteria: {
              meteo: 'Météo et prévisions',
              rappel: 'Créer un rappel ou une alarme',
              musique: 'Lancer de la musique ou une radio',
              agenda: 'Consulter les événements de l’agenda',
              domotique: 'Lumières, chauffage, volets',
              aucune: 'Conversation sans action',
            },
          },
          has_explicit_time: { type: 'noul', instructions: '`message` précise-t-il une date ou une heure ?' },
        },
      },
      expected: { tool: 'musique', has_explicit_time: false },
    },
    {
      id: 'moderation-insulte',
      name: 'Modération : insulte',
      description: 'Insulte directe, sans menace ni spam.',
      category: 'Modération',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Espèce de gros nul, t’as rien compris au film, retourne jouer aux billes.',
        questions: {
          is_toxic: { type: 'noul', instructions: 'Le message est-il insultant ou harcelant envers quelqu’un ?' },
          is_threat: { type: 'noul', instructions: 'Le message contient-il une menace ?' },
          is_spam: { type: 'noul', instructions: 'Le message est-il de la publicité ou du spam ?' },
          category: {
            type: 'choice',
            instructions: 'Catégorie de modération principale',
            criteria: { ok: 'Contenu acceptable', spam: 'Publicité, arnaque', harcelement: 'Insultes ou attaques personnelles', menace: 'Menace de violence ou d’intimidation' },
          },
        },
      },
      expected: { is_toxic: true, is_threat: false, is_spam: false, category: 'harcelement' },
    },
    {
      id: 'moderation-menace-implicite',
      name: 'Modération : menace implicite',
      description: 'Intimidation sans aucun mot grossier.',
      category: 'Modération',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Je sais où se trouve votre magasin et à quelle heure vous fermez. Vous feriez mieux de retirer cet avis avant ce soir.',
        questions: {
          is_threat: { type: 'noul', instructions: 'Le message contient-il une menace ou une intimidation ?' },
          has_insult: { type: 'noul', instructions: 'Le message contient-il des insultes ou des mots grossiers ?' },
          category: {
            type: 'choice',
            instructions: 'Catégorie de modération principale',
            criteria: { ok: 'Contenu acceptable', spam: 'Publicité, arnaque', harcelement: 'Insultes ou attaques personnelles', menace: 'Menace de violence ou d’intimidation' },
          },
        },
      },
      expected: { is_threat: true, has_insult: false, category: 'menace' },
    },
    {
      id: 'moderation-critique',
      name: 'Modération : critique légitime',
      description: 'Critique sévère mais acceptable : piège à faux positifs.',
      category: 'Modération',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Cette mise à jour est une catastrophe : l’appli plante à chaque ouverture depuis hier. Visiblement personne ne l’a testée sur Android. Je mets une étoile en attendant un correctif.',
        questions: {
          is_toxic: { type: 'noul', instructions: 'Le message est-il insultant ou harcelant envers quelqu’un ?' },
          should_remove: { type: 'noul', instructions: 'Ce message doit-il être supprimé par la modération ?' },
          category: {
            type: 'choice',
            instructions: 'Catégorie de modération principale',
            criteria: { ok: 'Contenu acceptable', spam: 'Publicité, arnaque', harcelement: 'Insultes ou attaques personnelles', menace: 'Menace de violence ou d’intimidation' },
          },
        },
      },
      expected: { is_toxic: false, should_remove: false, category: 'ok' },
    },
    {
      id: 'date-format',
      name: 'Date au format français',
      description: '04/05 se lit 4 mai, pas 5 avril.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Rappel : votre rendez-vous chez le dentiste est fixé au 04/05 à 9 h 30, cabinet du Dr Lemaire, 12 place Bellecour, Lyon.',
        questions: {
          month: { type: 'choice', instructions: 'Quel mois a lieu le rendez-vous ?', criteria: { avril: 'Avril', mai: 'Mai' } },
          is_morning: { type: 'noul', instructions: 'Le rendez-vous a-t-il lieu le matin ?' },
        },
      },
      expected: { month: 'mai', is_morning: true },
    },
    {
      id: 'montants-format',
      name: 'Montants au format français',
      description: 'Espace des milliers et virgule décimale, soustraction.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Devis n° 2026-118 — Rénovation salle de bains. Total TTC : 1 234,50 €. Acompte versé à la signature : 300,00 €. Le solde est payable à la fin du chantier.',
        questions: {
          total_over_1000: { type: 'noul', instructions: 'Le total TTC dépasse-t-il 1 000 € ?' },
          balance_over_1000: { type: 'noul', instructions: 'Le solde restant à payer dépasse-t-il 1 000 € ?' },
          balance: {
            type: 'choice',
            instructions: 'Quel est le solde restant à payer ?',
            criteria: { s93450: '934,50 €', s1234: '1 234,50 €', s1534: '1 534,50 €', s300: '300,00 €' },
          },
        },
      },
      // 1 234,50 − 300,00 = 934,50 €.
      expected: { total_over_1000: true, balance_over_1000: false, balance: 's93450' },
    },
    {
      id: 'remises-successives',
      name: 'Remises successives',
      description: '−30 % puis −10 % ne font pas −40 %.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Un manteau affiché 120 € est soldé à −30 %. En caisse, une remise supplémentaire de 10 % s’applique sur le prix soldé.',
        questions: {
          final_price: {
            type: 'choice',
            instructions: 'Combien le client paie-t-il le manteau ?',
            criteria: { p72: '72,00 €', p7560: '75,60 €', p78: '78,00 €', p84: '84,00 €' },
          },
          is_40_percent_off: { type: 'noul', instructions: 'La remise totale est-elle de 40 % ?' },
        },
      },
      // 120 × 0,7 = 84 € ; 84 × 0,9 = 75,60 € (remise totale de 37 %).
      expected: { final_price: 'p7560', is_40_percent_off: false },
    },
    {
      id: 'deduction-teletravail',
      name: 'Déduction logique',
      description: 'Contraposée et cas indécidable.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Aucun salarié en télétravail n’a accès au parking de l’entreprise. Julie a accès au parking. Thomas n’a pas accès au parking.',
        questions: {
          julie_remote: { type: 'noul', instructions: 'Julie est-elle en télétravail ?' },
          thomas_remote: {
            type: 'choice',
            instructions: 'D’après ces seules affirmations, Thomas est-il en télétravail ?',
            criteria: { oui: 'Thomas est certainement en télétravail', non: 'Thomas n’est certainement pas en télétravail', indetermine: 'On ne peut pas le savoir' },
          },
        },
      },
      expected: { julie_remote: false, thomas_remote: 'indetermine' },
    },
    {
      id: 'triage-medical-benin',
      name: 'Triage médical (bénin)',
      description: 'Rhume d’enfant sans signe de gravité : ne pas sur-trier.',
      category: 'Support',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Enfant de 6 ans, nez qui coule et légère toux depuis deux jours. Pas de fièvre, il mange bien et joue normalement.',
        questions: {
          call_emergency: { type: 'noul', instructions: 'Faut-il appeler immédiatement les secours (15 / 112) ?' },
          priority: {
            type: 'score',
            instructions: 'Niveau de priorité de prise en charge',
            criteria: ['Surveillance à domicile', 'Consultation non urgente', 'Consultation dans la journée', 'Urgences dans l’heure', 'Urgence vitale immédiate'],
          },
        },
      },
      expected: { call_emergency: false, priority: [0, 1] },
    },
    {
      id: 'demande-rgpd',
      name: 'Demande RGPD',
      description: 'Identifier le droit exercé dans un courrier.',
      category: 'Juridique',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state:
          'Madame, Monsieur, en application de l’article 17 du RGPD, je vous demande de supprimer l’ensemble des données personnelles me concernant que vous détenez, y compris dans vos fichiers de prospection. Vous trouverez ci-joint une copie de ma pièce d’identité. Je vous remercie de me confirmer la suppression par écrit. Cordialement, Nadia Haddad',
        questions: {
          right: {
            type: 'choice',
            instructions: 'Quel droit la personne exerce-t-elle ?',
            criteria: { acces: 'Droit d’accès', rectification: 'Droit de rectification', effacement: 'Droit à l’effacement', opposition: 'Droit d’opposition', portabilite: 'Droit à la portabilité' },
          },
          identity_attached: { type: 'noul', instructions: 'Un justificatif d’identité est-il joint ?' },
          wants_copy_of_data: { type: 'noul', instructions: 'La personne demande-t-elle une copie de ses données ?' },
        },
      },
      expected: { right: 'effacement', identity_attached: true, wants_copy_of_data: false },
    },
    {
      id: 'verif-citation-loi-1905',
      name: 'Vérification de citation',
      description: 'La source contredit la date avancée.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: {
          source:
            'La loi du 9 décembre 1905 concernant la séparation des Églises et de l’État affirme la liberté de conscience et garantit le libre exercice des cultes. Elle met fin au régime du Concordat de 1801, sauf en Alsace-Moselle, alors allemande.',
          affirmation: 'La loi de séparation des Églises et de l’État a été votée en 1801.',
        },
        questions: {
          supported: { type: 'noul', instructions: '`affirmation` est-elle confirmée par `source` ?' },
          support_level: {
            type: 'score',
            instructions: 'Dans quelle mesure `source` soutient-elle `affirmation` ?',
            criteria: ['La source contredit l’affirmation', 'La source n’aborde pas le sujet', 'La source soutient partiellement l’affirmation', 'La source soutient entièrement l’affirmation'],
          },
        },
      },
      expected: { supported: false, support_level: 0 },
    },
    {
      id: 'doublon-adresse',
      name: 'Déduplication d’adresses',
      description: 'Abréviations françaises : même adresse, puis homonyme dans une autre ville.',
      category: 'Données structurées',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: { adresse: '12 bis rue Victor-Hugo, 69002 Lyon' },
        questions: {
          same_as_a: {
            type: 'noul',
            instructions: { candidat: '12B r. V.-Hugo, 69002 Lyon', question: '`adresse` et `candidat` désignent-elles le même lieu ?' },
          },
          same_as_b: {
            type: 'noul',
            instructions: { candidat: '12 bis rue Victor-Hugo, 92240 Malakoff', question: '`adresse` et `candidat` désignent-elles le même lieu ?' },
          },
        },
      },
      expected: { same_as_a: true, same_as_b: false },
    },
    {
      id: 'annonce-immobiliere',
      name: 'Annonce immobilière : 10 questions',
      description: 'Abréviations du métier (CC, T3, DPE), beaucoup de questions.',
      category: 'Extraction',
      complexity: 'simple',
      length: 'moyen',
      lang: 'fr',
      request: {
        state:
          'À louer — Lyon 7e, quartier Jean-Macé. T3 de 68 m² au 4e étage sans ascenseur, séjour lumineux, deux chambres, cuisine équipée. Balcon de 5 m², cave. Loyer 1 050 € CC. DPE : E. Libre au 1er septembre. Animaux non acceptés. Location sans frais d’agence, directement auprès du propriétaire.',
        questions: {
          has_elevator: { type: 'noul', instructions: 'L’immeuble a-t-il un ascenseur ?' },
          charges_included: { type: 'noul', instructions: 'Les charges sont-elles comprises dans le loyer annoncé ?' },
          has_balcony: { type: 'noul', instructions: 'Le logement a-t-il un balcon ?' },
          mentions_parking: { type: 'noul', instructions: 'L’annonce mentionne-t-elle une place de parking ?' },
          pets_allowed: { type: 'noul', instructions: 'Les animaux sont-ils acceptés ?' },
          agency_fees: { type: 'noul', instructions: 'Y a-t-il des frais d’agence ?' },
          over_70m2: { type: 'noul', instructions: 'La surface dépasse-t-elle 70 m² ?' },
          bedrooms_two: { type: 'noul', instructions: 'Le logement a-t-il deux chambres ?' },
          energy_class: { type: 'choice', instructions: 'Classe énergétique (DPE) du logement', criteria: { A: null, B: null, C: null, D: null, E: null, F: null, G: null } },
          rooms: { type: 'choice', instructions: 'Nombre de pièces principales', criteria: { T1: '1 pièce', T2: '2 pièces', T3: '3 pièces', T4: '4 pièces' } },
        },
      },
      expected: {
        has_elevator: false,
        charges_included: true,
        has_balcony: true,
        mentions_parking: false,
        pets_allowed: false,
        agency_fees: false,
        over_70m2: false,
        bedrooms_two: true,
        energy_class: 'E',
        rooms: 'T3',
      },
    },
    {
      id: 'offre-parrainage',
      name: 'Conditions d’une offre',
      description: 'Appliquer des conditions cumulatives à une situation.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'moyen',
      lang: 'fr',
      request: {
        state: {
          conditions:
            'Offre de parrainage valable du 1er avril au 30 juin 2026. Le parrain et le filleul reçoivent chacun une prime de 50 € si le filleul : (1) ouvre un compte pendant la période de l’offre ; (2) effectue au moins 3 paiements par carte dans les 60 jours suivant l’ouverture ; (3) n’a jamais été titulaire d’un compte dans notre banque. La prime du parrain n’est versée que si celle du filleul l’est aussi. Offre non cumulable avec l’offre de bienvenue en cours.',
          situation:
            'Camille a ouvert un compte le 12 mai 2026, parrainée par son frère, déjà client. Elle a payé 5 fois par carte dans le mois. Elle avait déjà eu un compte dans cette banque entre 2019 et 2021, clôturé lors d’un déménagement. Elle n’a pas demandé l’offre de bienvenue.',
        },
        questions: {
          eligible: { type: 'noul', instructions: 'Camille a-t-elle droit à la prime de parrainage ?' },
          reason: {
            type: 'choice',
            instructions: 'Quelle condition n’est pas remplie ?',
            criteria: { date: 'Date d’ouverture', paiements: 'Nombre de paiements par carte', ancien_client: 'Jamais client auparavant', cumul: 'Cumul avec l’offre de bienvenue', aucune: 'Toutes les conditions sont remplies' },
          },
          sponsor_bonus: { type: 'noul', instructions: 'Le frère de Camille reçoit-il une prime ?' },
        },
      },
      expected: { eligible: false, reason: 'ancien_client', sponsor_bonus: false },
    },
    {
      id: 'mail-resiliation',
      name: 'Demande de résiliation',
      description: 'E-mail client de taille moyenne : motif, demandes annexes, ton.',
      category: 'Support',
      complexity: 'simple',
      length: 'moyen',
      lang: 'fr',
      request: {
        state: `Objet : Résiliation de ma ligne fixe et de mon accès internet

Bonjour,

Je suis client chez vous depuis 2018 (contrat n° FX-2291-0457) et j’en ai toujours été satisfait. Je pars m’installer au Canada pour raisons professionnelles à la fin du mois de juillet, je souhaite donc résilier mon abonnement internet et ma ligne fixe à compter du 31 juillet.

Pourriez-vous m’indiquer :
– s’il y a des frais de résiliation, sachant que je ne suis plus engagé depuis longtemps ;
– comment vous renvoyer la box et le décodeur TV (point relais, envoi postal ?) ;
– si ma dernière facture sera bien calculée au prorata.

Merci de ne pas me rappeler par téléphone, je serai difficilement joignable : une réponse par e-mail me convient parfaitement.

Bien cordialement,
Antoine Mercier`,
        questions: {
          intent: {
            type: 'choice',
            instructions: 'Quel est l’objet principal de l’e-mail ?',
            criteria: { resiliation: 'Résilier l’abonnement', reclamation: 'Se plaindre d’un problème', changement_offre: 'Changer d’offre', information: 'Simple demande d’information' },
          },
          reason: {
            type: 'choice',
            instructions: 'Pour quelle raison le client part-il ?',
            criteria: { demenagement: 'Déménagement', prix: 'Prix trop élevé', qualite: 'Mauvaise qualité de service', concurrent: 'Offre d’un concurrent' },
          },
          asks_equipment_return: { type: 'noul', instructions: 'Le client demande-t-il comment renvoyer son matériel ?' },
          wants_phone_call: { type: 'noul', instructions: 'Le client souhaite-t-il être rappelé par téléphone ?' },
          is_unhappy: { type: 'noul', instructions: 'Le client est-il mécontent du service ?' },
        },
      },
      expected: { intent: 'resiliation', reason: 'demenagement', asks_equipment_return: true, wants_phone_call: false, is_unhappy: false },
    },
    {
      id: 'bail-habitation',
      name: 'Bail d’habitation',
      description: 'Contrat long : préavis réduit en zone tendue, charges, sous-location.',
      category: 'Juridique',
      complexity: 'complexe',
      length: 'long',
      lang: 'fr',
      request: {
        state: BAIL,
        questions: {
          tenant_notice: {
            type: 'choice',
            instructions: 'Quel préavis s’applique si le locataire donne congé de ce logement ?',
            criteria: { un_mois: 'Un mois', deux_mois: 'Deux mois', trois_mois: 'Trois mois', six_mois: 'Six mois' },
          },
          monthly_total: {
            type: 'choice',
            instructions: 'Combien le locataire paie-t-il chaque mois, charges comprises ?',
            criteria: { m720: '720 €', m780: '780 €', m840: '840 €', m900: '900 €' },
          },
          deposit_above_rent: { type: 'noul', instructions: 'Le dépôt de garantie dépasse-t-il un mois de loyer hors charges ?' },
          free_sublet: { type: 'noul', instructions: 'Le locataire peut-il sous-louer sans l’accord du bailleur ?' },
          pets_allowed: { type: 'noul', instructions: 'Le locataire peut-il avoir un animal de compagnie ?' },
          rent_can_change: { type: 'noul', instructions: 'Le loyer peut-il évoluer en cours de bail ?' },
          landlord_any_time: { type: 'noul', instructions: 'Le bailleur peut-il donner congé à tout moment ?' },
        },
      },
      // Préavis de 3 mois réduit à 1 mois : le logement est en zone tendue (article II). 780 + 60 = 840 €.
      expected: {
        tenant_notice: 'un_mois',
        monthly_total: 'm840',
        deposit_above_rent: false,
        free_sublet: false,
        pets_allowed: true,
        rent_can_change: true,
        landlord_any_time: false,
      },
    },
    {
      id: 'ag-copropriete',
      name: 'Procès-verbal d’AG de copropriété',
      description: 'Document long : résolutions adoptées, rejetées, ajournées, second vote.',
      category: 'Extraction',
      complexity: 'complexe',
      length: 'long',
      lang: 'fr',
      request: {
        state: AG_COPRO,
        questions: {
          facade_adopted: { type: 'noul', instructions: 'Le ravalement des façades a-t-il finalement été voté ?' },
          ev_charging: {
            type: 'choice',
            instructions: 'Quel est le sort de la résolution sur les bornes de recharge ?',
            criteria: { adoptee: 'Adoptée', rejetee: 'Rejetée', ajournee: 'Ajournée' },
          },
          intercom: {
            type: 'choice',
            instructions: 'Quel est le sort de la résolution sur l’interphonie ?',
            criteria: { adoptee: 'Adoptée', rejetee: 'Rejetée', ajournee: 'Ajournée' },
          },
          syndic_changed: { type: 'noul', instructions: 'L’assemblée a-t-elle changé de syndic ?' },
          budget_up: { type: 'noul', instructions: 'Le budget prévisionnel 2027 est-il supérieur aux dépenses réelles de 2025 ?' },
          leak_decided: { type: 'noul', instructions: 'Une décision a-t-elle été votée sur les infiltrations du garage ?' },
        },
      },
      // Budget 2027 : 88 000 € > dépenses 2025 : 84 312 €.
      expected: { facade_adopted: true, ev_charging: 'rejetee', intercom: 'ajournee', syndic_changed: false, budget_up: true, leak_decided: false },
    },
    {
      id: 'releve-bancaire',
      name: 'Relevé bancaire (contexte long)',
      description: '3 mois d’opérations en JSON : débit en double et prélèvement rejeté.',
      category: 'Contexte long',
      complexity: 'complexe',
      length: 'très long',
      lang: 'fr',
      request: {
        state: { releve: syntheticStatement() },
        questions: {
          has_duplicate: { type: 'noul', instructions: '`releve` contient-il un paiement par carte débité deux fois (même libellé, même montant, même date) ?' },
          duplicate_merchant: {
            type: 'choice',
            instructions: 'Chez quel commerçant a eu lieu le paiement débité deux fois ?',
            criteria: { carrefour: 'Carrefour Market', fnac: 'Fnac', sncf: 'SNCF Connect', amazon: 'Amazon', monoprix: 'Monoprix' },
          },
          rejected_debit: { type: 'noul', instructions: 'Un prélèvement a-t-il été rejeté dans `releve` ?' },
          salary_each_month: { type: 'noul', instructions: 'Un salaire a-t-il été versé chaque mois couvert par `releve` ?' },
        },
      },
      // syntheticStatement : seul le paiement FNAC du 14/03 est en double ; rejet EDF en février ; salaire le 28 de chaque mois.
      expected: { has_duplicate: true, duplicate_merchant: 'fnac', rejected_debit: true, salary_each_month: true },
    },
  ],
}
