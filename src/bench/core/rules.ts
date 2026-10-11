import type { Pair } from './pair.ts'

// Raisonnement sur des règles : appliquer une politique à plusieurs conditions (seuils, exceptions, règles qui interagissent).

// ─── Textes longs ────────────────────────────────────────────────────────────

const TRAVEL_POLICY = {
  fr: `Politique de déplacements professionnels — Groupe Valmorin (version du 1er janvier 2026)

1. Champ d’application
La présente politique s’applique à tous les salariés du groupe, quel que soit leur contrat, pour tout déplacement effectué à la demande de l’entreprise. Les stagiaires y sont soumis dans les mêmes conditions.

2. Autorisation préalable
Tout déplacement à l’étranger doit être autorisé par écrit par le responsable hiérarchique direct AVANT toute réservation (transport ou hébergement). Une autorisation obtenue après la réservation ne régularise pas le déplacement : les frais restent à la charge du salarié, sauf dérogation écrite de la direction financière. Les déplacements en France ne nécessitent pas d’autorisation préalable.

3. Avion
3.1. La classe économique est la règle.
3.2. La classe affaires est autorisée pour tout vol direct dont la durée programmée est strictement supérieure à 6 heures.
3.3. Par dérogation, les membres du comité de direction peuvent voyager en classe affaires sur tout vol direct dont la durée programmée est strictement supérieure à 4 heures.
3.4. Pour un trajet avec correspondance, chaque vol est apprécié séparément ; les durées ne s’additionnent pas.
3.5. Seule la durée programmée figurant sur le billet est prise en compte, jamais la durée réelle du vol.

4. Train
4.1. La seconde classe est la règle.
4.2. La première classe est autorisée pour tout trajet dont la durée programmée est d’au moins 3 heures.

5. Hébergement
5.1. Le plafond de remboursement est de 150 € par nuit, petit-déjeuner compris.
5.2. Il est porté à 220 € par nuit dans les villes suivantes : Paris, Londres, New York, Genève, Zurich, Tokyo.
5.3. La part dépassant le plafond reste à la charge du salarié ; la nuit n’est pas refusée pour autant.

6. Repas et indemnités
6.1. Une indemnité forfaitaire de 35 € par jour est versée pour les déplacements à l’étranger ; elle couvre les déjeuners et les dîners.
6.2. Aucun justificatif n’est demandé pour l’indemnité forfaitaire.

7. Location de voiture
7.1. La catégorie « compacte » est la règle. Une catégorie supérieure n’est autorisée qu’à partir de trois passagers.
7.2. Le carburant est remboursé sur justificatif ; les amendes ne sont jamais remboursées.

8. Remboursement
Les notes de frais sont transmises dans les 30 jours suivant le retour, accompagnées des justificatifs originaux. Le remboursement intervient avec la paie du mois suivant.`,
  en: `Business travel policy — Valmorin Group (version of January 1, 2026)

1. Scope
This policy applies to all group employees, whatever their contract, for any trip made at the company’s request. Interns are subject to it under the same conditions.

2. Prior approval
Any trip abroad must be approved in writing by the employee’s direct manager BEFORE any booking (transport or accommodation). Approval obtained after the booking does not regularize the trip: the costs remain payable by the employee, unless the finance department grants a written exemption. Domestic trips do not require prior approval.

3. Air travel
3.1. Economy class is the rule.
3.2. Business class is allowed on any direct flight whose scheduled duration is strictly longer than 6 hours.
3.3. As an exception, members of the executive committee may fly business class on any direct flight whose scheduled duration is strictly longer than 4 hours.
3.4. For a journey with a connection, each flight is assessed separately; durations are not added together.
3.5. Only the scheduled duration printed on the ticket is taken into account, never the actual flight time.

4. Rail travel
4.1. Second class is the rule.
4.2. First class is allowed on any journey whose scheduled duration is at least 3 hours.

5. Accommodation
5.1. The reimbursement cap is €150 per night, breakfast included.
5.2. It is raised to €220 per night in the following cities: Paris, London, New York, Geneva, Zurich, Tokyo.
5.3. Any amount above the cap is paid by the employee; the night itself is not refused.

6. Meals and allowances
6.1. A flat allowance of €35 per day is paid for trips abroad; it covers lunches and dinners.
6.2. No receipt is required for the flat allowance.

7. Car rental
7.1. The "compact" category is the rule. A higher category is only allowed from three passengers upward.
7.2. Fuel is reimbursed against receipts; fines are never reimbursed.

8. Reimbursement
Expense reports must be submitted within 30 days of returning, with the original receipts. Reimbursement is paid with the following month’s salary.`,
}

const TRAVEL_REQUESTS = {
  fr: `Demandes à contrôler :
— Camille Ferrand, responsable commerciale (hors comité de direction) : mission à Dakar. Vol direct Paris → Dakar, durée programmée 6 h 00, réservé en classe affaires. Autorisation écrite de son responsable reçue le 4 septembre ; billet et hôtel réservés le 2 septembre. Hôtel : 3 nuits à 190 € la nuit, petit-déjeuner compris.
— Julien Marchetti, directeur des opérations, membre du comité de direction : mission au Caire. Vol direct Paris → Le Caire, durée programmée 4 h 35, réservé en classe affaires. Autorisation écrite reçue le 1er septembre, réservation le 3 septembre.
— Inès Dubreuil, technicienne : intervention à Marseille. Train Lille → Marseille, durée programmée 3 h 00 exactement, réservé en première classe.`,
  en: `Requests to review:
— Camille Ferrand, sales manager (not on the executive committee): assignment in Dakar. Direct flight Paris → Dakar, scheduled duration 6 h 00, booked in business class. Written approval from her manager received on September 4; flight and hotel booked on September 2. Hotel: 3 nights at €190 per night, breakfast included.
— Julien Marchetti, chief operations officer, member of the executive committee: assignment in Cairo. Direct flight Paris → Cairo, scheduled duration 4 h 35, booked in business class. Written approval received on September 1, booking made on September 3.
— Inès Dubreuil, technician: on-site job in Marseille. Train Lille → Marseille, scheduled duration exactly 3 h 00, booked in first class.`,
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const RULES: Pair[] = [
  {
    id: 'rules-client-dinner',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Un invité n’est pas nommé : le plafond « client » ne s’applique pas, on revient au plafond dîner de 45 € par convive.
    // Hors alcool : 201 − 36 = 165 € ; plafond 3 × 45 = 135 € → 135 €. Délai : du 2 septembre au 30 octobre = 58 jours ≤ 60.
    expected: { client_rate: false, on_time: true, reimbursed: 'eur_135' },
    fr: {
      name: 'Note de frais : dîner client',
      description: 'Plafonds par convive, alcool déduit, invité non identifié.',
      state: {
        policy:
          'Repas en déplacement : plafond de 30 € par convive pour un déjeuner et de 45 € pour un dîner, salarié compris. Repas avec des clients : plafond porté à 70 € par convive, à condition d’indiquer le nom et la société de chaque invité ; si une seule de ces informations manque, le plafond standard s’applique. L’alcool n’est jamais remboursé : il est retiré de la note avant l’application du plafond. Au-delà de 15 €, un ticket détaillé est exigé. Toute note soumise plus de 60 jours après la dépense est refusée.',
        claim:
          'Dîner du 2 septembre à Lyon, soumis le 30 octobre par Léa Garnier. Convives : Léa Garnier ; Bruno Sorel (Brakton Industries) ; un collègue de M. Sorel chez Brakton Industries. Total de la note : 201 €, dont 36 € de vin. Ticket détaillé joint.',
      },
      questions: {
        client_rate: { type: 'noul', instructions: 'Le plafond « repas avec des clients » s’applique-t-il à cette note ?' },
        on_time: { type: 'noul', instructions: 'La note a-t-elle été soumise dans le délai prévu ?' },
        reimbursed: {
          type: 'choice',
          instructions: 'Quel montant sera remboursé à Léa ?',
          criteria: { eur_0: '0 €', eur_135: '135 €', eur_165: '165 €', eur_201: '201 €', eur_210: '210 €' },
        },
      },
    },
    en: {
      name: 'Expense claim: client dinner',
      description: 'Per-person caps, alcohol deducted, unidentified guest.',
      state: {
        policy:
          'Meals while traveling: cap of €30 per attendee for lunch and €45 for dinner, employee included. Meals with clients: cap raised to €70 per attendee, provided the name and company of every guest are given; if any of this information is missing, the standard cap applies. Alcohol is never reimbursed: it is removed from the bill before the cap is applied. Above €15, an itemized receipt is required. Any claim submitted more than 60 days after the expense is rejected.',
        claim:
          'Dinner on September 2 in Lyon, submitted on October 30 by Léa Garnier. Attendees: Léa Garnier; Bruno Sorel (Brakton Industries); a colleague of Mr. Sorel at Brakton Industries. Bill total: €201, including €36 of wine. Itemized receipt attached.',
      },
      questions: {
        client_rate: { type: 'noul', instructions: 'Does the "meals with clients" cap apply to this claim?' },
        on_time: { type: 'noul', instructions: 'Was the claim submitted within the allowed time?' },
        reimbursed: {
          type: 'choice',
          instructions: 'How much will Léa be reimbursed?',
          criteria: { eur_0: '€0', eur_135: '€135', eur_165: '€165', eur_201: '€201', eur_210: '€210' },
        },
      },
    },
  },
  {
    id: 'rules-leave-carryover',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Ancienneté au 1er janvier 2026 : embauche le 1er février 2021 → 4 ans et 11 mois, pas de jour supplémentaire.
    // 2025 : 11 jours non pris, dont 4 à cause de l’arrêt maladie (reportables en plus du plafond) ; restent 7, plafonnés à 5 → 9 reportés, 2 perdus.
    // Congé du 23 mars au 3 avril : seuls 23–27 et 30–31 mars (7 jours) tombent avant l’expiration du 31 mars → 7 des 9 jours utilisés.
    expected: { seniority_bonus: false, carried_days: 'd9', days_lost: true, uses_all_carried: false },
    fr: {
      name: 'Congés : report et ancienneté',
      description: 'Plafond de report, exception maladie, date d’expiration.',
      state: {
        policy:
          'Chaque salarié a droit à 25 jours ouvrés de congés par année civile. Ancienneté : 1 jour supplémentaire à partir de 5 ans complets, 2 jours à partir de 10 ans complets ; l’ancienneté s’apprécie au 1er janvier de l’année concernée. Les jours non pris en fin d’année sont reportables dans la limite de 5 jours ; le reste est perdu. Exception : les jours de congé posés puis annulés à cause d’un arrêt maladie sont reportables en plus de cette limite. Tous les jours reportés doivent être pris au plus tard le 31 mars de l’année suivante ; ceux qui ne le sont pas sont perdus. Toute demande de congé doit être déposée au moins 15 jours à l’avance dans l’outil RH ; le responsable répond sous 5 jours ouvrés.',
        employee:
          'Thomas Bérard, embauché le 1er février 2021. En 2025, il avait droit à 25 jours et en a pris 14. Parmi les 11 jours restants, 4 correspondent à un congé posé en août puis annulé en raison d’un arrêt maladie ; les 7 autres n’ont simplement pas été posés. Il n’a pris aucun congé entre le 1er janvier et le 22 mars 2026.',
        request: 'Congé du lundi 23 mars au vendredi 3 avril 2026, soit 10 jours ouvrés (aucun jour férié sur la période).',
      },
      questions: {
        seniority_bonus: { type: 'noul', instructions: 'Thomas a-t-il droit à un jour supplémentaire d’ancienneté pour 2026 ?' },
        carried_days: {
          type: 'choice',
          instructions: 'Combien de jours de 2025 sont reportés sur 2026 ?',
          criteria: { d4: '4 jours', d5: '5 jours', d7: '7 jours', d9: '9 jours', d11: '11 jours' },
        },
        days_lost: { type: 'noul', instructions: 'Thomas perd-il des jours de 2025 dès le passage à 2026 ?' },
        uses_all_carried: { type: 'noul', instructions: 'Cette demande permet-elle à Thomas d’utiliser tous ses jours reportés avant leur expiration ?' },
      },
    },
    en: {
      name: 'Leave: carry-over and seniority',
      description: 'Carry-over cap, sick-leave exception, expiry date.',
      state: {
        policy:
          'Each employee is entitled to 25 working days of leave per calendar year. Seniority: 1 extra day from 5 full years of service, 2 days from 10 full years; seniority is assessed on January 1 of the year concerned. Days not taken by the end of the year can be carried over up to a limit of 5 days; the rest is lost. Exception: leave days that were booked and then cancelled because of sick leave can be carried over on top of this limit. All carried-over days must be taken by March 31 of the following year at the latest; any that are not are lost. Every leave request must be submitted at least 15 days in advance in the HR tool; the manager replies within 5 working days.',
        employee:
          'Thomas Bérard, hired on February 1, 2021. In 2025, he was entitled to 25 days and took 14. Of the 11 remaining days, 4 correspond to leave booked for August and then cancelled because of sick leave; the other 7 were simply never booked. He took no leave between January 1 and March 22, 2026.',
        request: 'Leave from Monday, March 23 to Friday, April 3, 2026, i.e. 10 working days (no public holidays in the period).',
      },
      questions: {
        seniority_bonus: { type: 'noul', instructions: 'Is Thomas entitled to an extra seniority day for 2026?' },
        carried_days: {
          type: 'choice',
          instructions: 'How many days from 2025 are carried over to 2026?',
          criteria: { d4: '4 days', d5: '5 days', d7: '7 days', d9: '9 days', d11: '11 days' },
        },
        days_lost: { type: 'noul', instructions: 'Does Thomas lose any 2025 days as soon as 2026 begins?' },
        uses_all_carried: { type: 'noul', instructions: 'Does this request let Thomas use all his carried-over days before they expire?' },
      },
    },
  },
  {
    id: 'rules-shipping-tiers',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Commande A : 64 − 5 = 59 € < 60 € → pas de gratuité ; 2,0 kg est dans la première tranche (jusqu’à 2 kg inclus) → 4,90 €.
    // Commande B : 10,4 kg → tranche 3 (14,90 €) + supplément îles 12 € ; gratuité exclue pour les îles → 26,90 €.
    expected: { a_free: false, a_tier: 0, a_cost: 'eur_4_90', b_cost: 'eur_26_90' },
    fr: {
      name: 'Frais de port par tranches',
      description: 'Seuil de gratuité après remise, tranche à la limite, supplément îles.',
      state: {
        rules:
          'Livraison standard : 4,90 € jusqu’à 2 kg inclus ; 8,90 € au-delà de 2 kg et jusqu’à 10 kg inclus ; 14,90 € au-delà de 10 kg. Livraison offerte si le montant des articles, après réductions, atteint au moins 60 €. Livraisons vers les îles : supplément de 12 €, et la livraison n’est jamais offerte.',
        orders: [
          { id: 'A', items_total: '64,00 €', coupon: '−5,00 €', weight: '2,0 kg', destination: 'Bordeaux (continent)' },
          { id: 'B', items_total: '75,00 €', coupon: 'aucun', weight: '10,4 kg', destination: 'Ajaccio (île)' },
        ],
      },
      questions: {
        a_free: { type: 'noul', instructions: 'La livraison de la commande A est-elle offerte ?' },
        a_tier: { type: 'score', instructions: 'Dans quelle tranche de poids tombe la commande A ?', criteria: ['Jusqu’à 2 kg', 'Plus de 2 kg et jusqu’à 10 kg', 'Plus de 10 kg'] },
        a_cost: {
          type: 'choice',
          instructions: 'Quels sont les frais de port de la commande A ?',
          criteria: { eur_0: '0 €', eur_4_90: '4,90 €', eur_8_90: '8,90 €', eur_16_90: '16,90 €' },
        },
        b_cost: {
          type: 'choice',
          instructions: 'Quels sont les frais de port de la commande B ?',
          criteria: { eur_0: '0 €', eur_12: '12,00 €', eur_14_90: '14,90 €', eur_20_90: '20,90 €', eur_26_90: '26,90 €' },
        },
      },
    },
    en: {
      name: 'Tiered shipping costs',
      description: 'Free-shipping threshold after discount, boundary tier, island surcharge.',
      state: {
        rules:
          'Standard delivery: €4.90 up to and including 2 kg; €8.90 above 2 kg and up to and including 10 kg; €14.90 above 10 kg. Free delivery if the item total, after discounts, is at least €60. Deliveries to islands: €12 surcharge, and delivery is never free.',
        orders: [
          { id: 'A', items_total: '€64.00', coupon: '−€5.00', weight: '2.0 kg', destination: 'Bordeaux (mainland)' },
          { id: 'B', items_total: '€75.00', coupon: 'none', weight: '10.4 kg', destination: 'Ajaccio (island)' },
        ],
      },
      questions: {
        a_free: { type: 'noul', instructions: 'Is delivery free for order A?' },
        a_tier: { type: 'score', instructions: 'Which weight tier does order A fall into?', criteria: ['Up to 2 kg', 'Over 2 kg and up to 10 kg', 'Over 10 kg'] },
        a_cost: {
          type: 'choice',
          instructions: 'What is the shipping cost of order A?',
          criteria: { eur_0: '€0', eur_4_90: '€4.90', eur_8_90: '€8.90', eur_16_90: '€16.90' },
        },
        b_cost: {
          type: 'choice',
          instructions: 'What is the shipping cost of order B?',
          criteria: { eur_0: '€0', eur_12: '€12.00', eur_14_90: '€14.90', eur_20_90: '€20.90', eur_26_90: '€26.90' },
        },
      },
    },
  },
  {
    id: 'rules-sla-credit',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Maintenance annoncée 48 h avant (< 72 h) → non exclue ; incident client → exclu. Indisponibilité : 38 + 90 = 128 min.
    // Septembre : 30 × 1 440 = 43 200 min ; disponibilité = 1 − 128 / 43 200 ≈ 99,70 % → tranche 10 % → 2 400 × 10 % = 240 €.
    // Sans la maintenance, 38 min → 99,91 % : aucun crédit (piège). Réclamation le 25 octobre : dans les 30 jours après le 30 septembre.
    expected: { maintenance_excluded: false, credit_tier: 1, credit_amount: 'eur_240', claim_on_time: true },
    fr: {
      name: 'Crédit SLA',
      description: 'Exclusions, préavis de maintenance et paliers de disponibilité.',
      state: {
        sla: 'Engagement de disponibilité mensuelle : 99,9 %. Crédit sur la facture du mois concerné : 10 % si la disponibilité est inférieure à 99,9 % mais d’au moins 99,0 % ; 25 % si elle est inférieure à 99,0 % mais d’au moins 95,0 % ; 50 % en dessous de 95,0 %. Sont exclues du calcul : les maintenances planifiées annoncées au moins 72 heures à l’avance, et les interruptions causées par le client. La demande de crédit doit être faite dans les 30 jours suivant la fin du mois concerné. Les crédits ne sont pas convertibles en espèces et sont plafonnés à 50 % de la facture mensuelle. Le fournisseur publie chaque mois un rapport de disponibilité sur son portail client.',
        customer: 'Orvane SAS, abonnement de 2 400 € HT par mois.',
        month: 'Septembre 2026 (30 jours)',
        incidents: [
          { date: '9 septembre', duration_min: 38, cause: 'Panne d’un équipement réseau du fournisseur' },
          { date: '17 septembre', duration_min: 90, cause: 'Maintenance planifiée, annoncée par e-mail 48 heures avant' },
          { date: '24 septembre', duration_min: 25, cause: 'Mauvaise configuration du pare-feu par l’équipe d’Orvane' },
        ],
        claim_date: '25 octobre 2026',
      },
      questions: {
        maintenance_excluded: { type: 'noul', instructions: 'La maintenance du 17 septembre est-elle exclue du calcul ?' },
        credit_tier: { type: 'score', instructions: 'Quel palier de crédit s’applique pour septembre ?', criteria: ['Aucun crédit', '10 %', '25 %', '50 %'] },
        credit_amount: {
          type: 'choice',
          instructions: 'Quel est le montant du crédit dû à Orvane ?',
          criteria: { eur_0: '0 €', eur_240: '240 €', eur_600: '600 €', eur_1200: '1 200 €' },
        },
        claim_on_time: { type: 'noul', instructions: 'La demande de crédit a-t-elle été faite dans les délais ?' },
      },
    },
    en: {
      name: 'SLA credit',
      description: 'Exclusions, maintenance notice and availability tiers.',
      state: {
        sla: 'Monthly availability commitment: 99.9%. Credit on the invoice for the month concerned: 10% if availability is below 99.9% but at least 99.0%; 25% if it is below 99.0% but at least 95.0%; 50% below 95.0%. Excluded from the calculation: planned maintenance announced at least 72 hours in advance, and interruptions caused by the customer. The credit request must be made within 30 days after the end of the month concerned. Credits cannot be converted into cash and are capped at 50% of the monthly invoice. The provider publishes a monthly availability report on its customer portal.',
        customer: 'Orvane SAS, subscription of €2,400 excl. VAT per month.',
        month: 'September 2026 (30 days)',
        incidents: [
          { date: 'September 9', duration_min: 38, cause: 'Failure of a provider network device' },
          { date: 'September 17', duration_min: 90, cause: 'Planned maintenance, announced by email 48 hours in advance' },
          { date: 'September 24', duration_min: 25, cause: 'Firewall misconfiguration by Orvane’s team' },
        ],
        claim_date: 'October 25, 2026',
      },
      questions: {
        maintenance_excluded: { type: 'noul', instructions: 'Is the September 17 maintenance excluded from the calculation?' },
        credit_tier: { type: 'score', instructions: 'Which credit tier applies for September?', criteria: ['No credit', '10%', '25%', '50%'] },
        credit_amount: {
          type: 'choice',
          instructions: 'How much credit is Orvane owed?',
          criteria: { eur_0: '€0', eur_240: '€240', eur_600: '€600', eur_1200: '€1,200' },
        },
        claim_on_time: { type: 'noul', instructions: 'Was the credit request made on time?' },
      },
    },
  },
  {
    id: 'rules-loyalty-tier',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Fenêtre : 12 octobre 2025 – 11 octobre 2026 ; le séjour d’août 2025 est exclu. 4 séjours dans la fenêtre.
    // Chambres : 240 + 180 + 210 + 190 = 820 € × 10 = 8 200 ; restaurant : 60 + 40 + 30 = 130 € × 5 = 650 → 8 850 points de statut.
    // Les bonus (1 500) ne comptent pas → Gold (≥ 5 000, < 10 000). Il manque 10 000 − 8 850 = 1 150 points pour Platinum.
    expected: { tier: 2, stays_met: true, points_to_platinum: 'pts_1150' },
    fr: {
      name: 'Statut de fidélité',
      description: 'Fenêtre glissante, points bonus exclus, double condition.',
      state: {
        program:
          'Le statut dépend des points de statut gagnés sur les 12 derniers mois glissants : Silver à partir de 2 000 points, Gold à partir de 5 000, Platinum à partir de 10 000 ET au moins 4 séjours sur la même période. Points de statut : 10 points par euro dépensé en chambre, 5 points par euro dépensé au restaurant de l’hôtel. Les points bonus des promotions s’ajoutent au solde utilisable pour des nuits gratuites mais ne comptent jamais pour le statut.',
        today: '11 octobre 2026',
        member: 'Alexandre Moreau',
        stays: [
          { date: '14 août 2025', room: '300 €', restaurant: '0 €', bonus_points: 0 },
          { date: '20 novembre 2025', room: '240 €', restaurant: '60 €', bonus_points: 1000 },
          { date: '5 février 2026', room: '180 €', restaurant: '0 €', bonus_points: 0 },
          { date: '18 juin 2026', room: '210 €', restaurant: '40 €', bonus_points: 500 },
          { date: '2 septembre 2026', room: '190 €', restaurant: '30 €', bonus_points: 0 },
        ],
      },
      questions: {
        tier: { type: 'score', instructions: 'Quel est aujourd’hui le statut d’Alexandre ?', criteria: ['Membre (aucun statut)', 'Silver', 'Gold', 'Platinum'] },
        stays_met: { type: 'noul', instructions: 'La condition de nombre de séjours pour Platinum est-elle remplie ?' },
        points_to_platinum: {
          type: 'choice',
          instructions: 'Combien de points de statut manque-t-il à Alexandre pour atteindre Platinum ?',
          criteria: { none_needed: 'Aucun, il est déjà Platinum', pts_1150: '1 150 points', pts_1800: '1 800 points', pts_4150: '4 150 points' },
        },
      },
    },
    en: {
      name: 'Loyalty status',
      description: 'Rolling window, bonus points excluded, double condition.',
      state: {
        program:
          'Status depends on the status points earned over the last 12 rolling months: Silver from 2,000 points, Gold from 5,000, Platinum from 10,000 AND at least 4 stays over the same period. Status points: 10 points per euro spent on the room, 5 points per euro spent at the hotel restaurant. Bonus points from promotions are added to the balance usable for free nights but never count toward status.',
        today: 'October 11, 2026',
        member: 'Alexandre Moreau',
        stays: [
          { date: 'August 14, 2025', room: '€300', restaurant: '€0', bonus_points: 0 },
          { date: 'November 20, 2025', room: '€240', restaurant: '€60', bonus_points: 1000 },
          { date: 'February 5, 2026', room: '€180', restaurant: '€0', bonus_points: 0 },
          { date: 'June 18, 2026', room: '€210', restaurant: '€40', bonus_points: 500 },
          { date: 'September 2, 2026', room: '€190', restaurant: '€30', bonus_points: 0 },
        ],
      },
      questions: {
        tier: { type: 'score', instructions: 'What is Alexandre’s status today?', criteria: ['Member (no status)', 'Silver', 'Gold', 'Platinum'] },
        stays_met: { type: 'noul', instructions: 'Is the number-of-stays condition for Platinum met?' },
        points_to_platinum: {
          type: 'choice',
          instructions: 'How many status points does Alexandre still need to reach Platinum?',
          criteria: { none_needed: 'None, he is already Platinum', pts_1150: '1,150 points', pts_1800: '1,800 points', pts_4150: '4,150 points' },
        },
      },
    },
  },
  {
    id: 'rules-discount-stacking',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Un seul code. OCTO15 : 15 % sur les articles non soldés seulement → 15 % × 80 = 12 €. HELLO10 : 10 €. OCTO15 est meilleur.
    // Total : (130 − 12) × 0,95 = 118 × 0,95 = 112,10 € < 115 € → pas de cadeau.
    expected: { both_codes: false, best_code: 'octo15', final_total: 'eur_112_10', free_gift: false },
    fr: {
      name: 'Cumul de réductions',
      description: 'Un seul code, articles soldés exclus, remise fidélité en dernier.',
      state: {
        rules:
          'Un seul code promo par commande. Les codes en pourcentage ne s’appliquent pas aux articles déjà soldés. La remise fidélité de 5 % est cumulable avec tout code ; elle s’applique en dernier, sur le montant obtenu après le code. Un cadeau est offert pour toute commande dont le montant final, après toutes les réductions, atteint au moins 115 €.',
        cart: [
          { item: 'Veste en laine', price: '80,00 €', on_sale: false },
          { item: 'Bottines', price: '50,00 €', on_sale: true },
        ],
        codes: { OCTO15: '−15 % sur les articles', HELLO10: '−10 € dès 100 € d’articles' },
        customer: 'Titulaire de la carte fidélité ; souhaite utiliser OCTO15 et HELLO10.',
      },
      questions: {
        both_codes: { type: 'noul', instructions: 'Le client peut-il utiliser OCTO15 et HELLO10 sur la même commande ?' },
        best_code: {
          type: 'choice',
          instructions: 'Quel code lui fait économiser le plus ?',
          criteria: { octo15: 'OCTO15', hello10: 'HELLO10', same: 'Les deux font économiser autant' },
        },
        final_total: {
          type: 'choice',
          instructions: 'Quel est le montant final avec le meilleur code et la remise fidélité ?',
          criteria: { eur_104_98: '104,98 €', eur_112_10: '112,10 €', eur_114_00: '114,00 €', eur_118_00: '118,00 €' },
        },
        free_gift: { type: 'noul', instructions: 'Le client recevra-t-il le cadeau ?' },
      },
    },
    en: {
      name: 'Discount stacking',
      description: 'One code only, sale items excluded, loyalty discount last.',
      state: {
        rules:
          'Only one promo code per order. Percentage codes do not apply to items already on sale. The 5% loyalty discount can be combined with any code; it is applied last, to the amount obtained after the code. A free gift is included with any order whose final amount, after all discounts, is at least €115.',
        cart: [
          { item: 'Wool jacket', price: '€80.00', on_sale: false },
          { item: 'Ankle boots', price: '€50.00', on_sale: true },
        ],
        codes: { OCTO15: '15% off items', HELLO10: '€10 off from €100 of items' },
        customer: 'Loyalty card holder; wants to use OCTO15 and HELLO10.',
      },
      questions: {
        both_codes: { type: 'noul', instructions: 'Can the customer use OCTO15 and HELLO10 on the same order?' },
        best_code: {
          type: 'choice',
          instructions: 'Which code saves the customer the most?',
          criteria: { octo15: 'OCTO15', hello10: 'HELLO10', same: 'Both save the same amount' },
        },
        final_total: {
          type: 'choice',
          instructions: 'What is the final amount with the best code and the loyalty discount?',
          criteria: { eur_104_98: '€104.98', eur_112_10: '€112.10', eur_114_00: '€114.00', eur_118_00: '€118.00' },
        },
        free_gift: { type: 'noul', instructions: 'Will the customer receive the free gift?' },
      },
    },
  },
  {
    id: 'rules-water-damage',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Absence du 1er juin au 14 août ; rupture le 10 août → logement inoccupé depuis environ 70 jours (> 60), eau non coupée → non couvert.
    // Si l’eau avait été coupée : déclaration 6 jours ouvrés après la découverte (> 5) → franchise 600 € → 2 150 − 600 = 1 550 €.
    expected: { covered: false, reason: 'vacancy', payout_if_shut_off: 'eur_1550' },
    fr: {
      name: 'Assurance habitation : dégât des eaux',
      description: 'Clause d’inoccupation et franchise majorée.',
      state: {
        clause:
          'Les dégâts des eaux dus à une fuite ou à une rupture soudaine de canalisation sont couverts. Sont exclus : les infiltrations lentes et le défaut d’entretien. Si, au moment du sinistre, le logement était inoccupé depuis plus de 60 jours consécutifs, les dégâts des eaux ne sont couverts que si l’arrivée d’eau générale avait été coupée. Franchise : 300 € par sinistre, portée à 600 € si le sinistre est déclaré plus de 5 jours ouvrés après sa découverte.',
        claim:
          'Mme Lefort a quitté son logement le 1er juin et n’y est revenue que le 14 août, date à laquelle elle a découvert les dégâts. Selon le plombier, un raccord a cédé brutalement vers le 10 août. L’arrivée d’eau générale n’avait pas été coupée. Le sinistre a été déclaré 6 jours ouvrés après la découverte. Montant des dommages : 2 150 €.',
      },
      questions: {
        covered: { type: 'noul', instructions: 'Le sinistre est-il couvert ?' },
        reason: {
          type: 'choice',
          instructions: 'Quel élément est déterminant pour la décision ?',
          criteria: { gradual: 'Infiltration lente', maintenance: 'Défaut d’entretien', vacancy: 'Inoccupation prolongée', late_claim: 'Déclaration tardive', none: 'Aucun, le sinistre est couvert' },
        },
        payout_if_shut_off: {
          type: 'choice',
          instructions: 'Si l’arrivée d’eau générale avait été coupée, combien l’assureur aurait-il versé ?',
          criteria: { eur_0: '0 €', eur_1550: '1 550 €', eur_1850: '1 850 €', eur_2150: '2 150 €' },
        },
      },
    },
    en: {
      name: 'Home insurance: water damage',
      description: 'Vacancy clause and increased deductible.',
      state: {
        clause:
          'Water damage caused by a sudden leak or pipe burst is covered. Excluded: slow seepage and lack of maintenance. If, at the time of the loss, the home had been unoccupied for more than 60 consecutive days, water damage is only covered if the main water supply had been shut off. Deductible: €300 per claim, raised to €600 if the loss is reported more than 5 business days after it was discovered.',
        claim:
          'Ms. Lefort left her home on June 1 and only came back on August 14, when she discovered the damage. According to the plumber, a fitting gave way suddenly around August 10. The main water supply had not been shut off. The loss was reported 6 business days after it was discovered. Amount of damage: €2,150.',
      },
      questions: {
        covered: { type: 'noul', instructions: 'Is the loss covered?' },
        reason: {
          type: 'choice',
          instructions: 'Which factor decides the outcome?',
          criteria: { gradual: 'Slow seepage', maintenance: 'Lack of maintenance', vacancy: 'Prolonged vacancy', late_claim: 'Late reporting', none: 'None, the loss is covered' },
        },
        payout_if_shut_off: {
          type: 'choice',
          instructions: 'If the main water supply had been shut off, how much would the insurer have paid?',
          criteria: { eur_0: '€0', eur_1550: '€1,550', eur_1850: '€1,850', eur_2150: '€2,150' },
        },
      },
    },
  },
  {
    id: 'rules-access-control',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // r1 : admin, lecture hors service autorisée, mais 21 h 15 est hors plage et Sophie n’est pas d’astreinte → refus (horaires).
    // r2 : prestataire → jamais d’accès aux documents confidentiels, même de son service.
    // r3 : lecture d’un document confidentiel de son propre service à 20 h 00, borne incluse → autorisé.
    expected: { r1_allowed: false, r1_reason: 'hours', r2_allowed: false, r3_allowed: true },
    fr: {
      name: 'Contrôle d’accès',
      description: 'Rôles, service, prestataires et plage horaire.',
      state: {
        rules: [
          'Un document confidentiel ne peut être lu que par les membres du service propriétaire, ou par un administrateur de n’importe quel service.',
          'Modifier un document exige le rôle « éditeur » ou « administrateur » ET l’appartenance au service propriétaire.',
          'Les prestataires externes n’ont jamais accès aux documents confidentiels, quel que soit leur rôle.',
          'Les documents confidentiels ne sont accessibles que de 7 h 00 à 20 h 00, bornes incluses ; seul un administrateur d’astreinte peut y accéder en dehors de cette plage.',
        ],
        requests: [
          { id: 'r1', user: 'Sophie', role: 'administrateur', department: 'Finance', contractor: false, on_call: false, action: 'lecture', document: 'Grille salariale (confidentiel, service RH)', time: '21 h 15' },
          { id: 'r2', user: 'Marc', role: 'éditeur', department: 'Juridique', contractor: true, on_call: false, action: 'lecture', document: 'Contrat cadre (confidentiel, service Juridique)', time: '10 h 00' },
          { id: 'r3', user: 'Yanis', role: 'lecteur', department: 'Marketing', contractor: false, on_call: false, action: 'lecture', document: 'Plan de lancement (confidentiel, service Marketing)', time: '20 h 00' },
        ],
      },
      questions: {
        r1_allowed: { type: 'noul', instructions: 'La requête r1 doit-elle être autorisée ?' },
        r1_reason: {
          type: 'choice',
          instructions: 'Quelle règle décide du sort de la requête r1 ?',
          criteria: { department: 'Appartenance au service', role: 'Rôle insuffisant', contractor: 'Prestataire externe', hours: 'Plage horaire', none: 'Aucune, la requête est autorisée' },
        },
        r2_allowed: { type: 'noul', instructions: 'La requête r2 doit-elle être autorisée ?' },
        r3_allowed: { type: 'noul', instructions: 'La requête r3 doit-elle être autorisée ?' },
      },
    },
    en: {
      name: 'Access control',
      description: 'Roles, department, contractors and time window.',
      state: {
        rules: [
          'A confidential document can only be read by members of the owning department, or by an administrator from any department.',
          'Editing a document requires the "editor" or "administrator" role AND membership of the owning department.',
          'External contractors never have access to confidential documents, whatever their role.',
          'Confidential documents are only accessible from 7:00 to 20:00, both included; only an on-call administrator can access them outside this window.',
        ],
        requests: [
          { id: 'r1', user: 'Sophie', role: 'administrator', department: 'Finance', contractor: false, on_call: false, action: 'read', document: 'Salary grid (confidential, HR department)', time: '21:15' },
          { id: 'r2', user: 'Marc', role: 'editor', department: 'Legal', contractor: true, on_call: false, action: 'read', document: 'Framework contract (confidential, Legal department)', time: '10:00' },
          { id: 'r3', user: 'Yanis', role: 'reader', department: 'Marketing', contractor: false, on_call: false, action: 'read', document: 'Launch plan (confidential, Marketing department)', time: '20:00' },
        ],
      },
      questions: {
        r1_allowed: { type: 'noul', instructions: 'Should request r1 be allowed?' },
        r1_reason: {
          type: 'choice',
          instructions: 'Which rule decides the outcome of request r1?',
          criteria: { department: 'Department membership', role: 'Insufficient role', contractor: 'External contractor', hours: 'Time window', none: 'None, the request is allowed' },
        },
        r2_allowed: { type: 'noul', instructions: 'Should request r2 be allowed?' },
        r3_allowed: { type: 'noul', instructions: 'Should request r3 be allowed?' },
      },
    },
  },
  {
    id: 'rules-late-rent',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Locataire A : exonération déjà accordée le 14 mars 2026, moins de 12 mois avant → pas de nouvelle exonération.
    // Retard du 11 au 28 septembre : 40 + 2 × 17 ou 18 jours = 74 ou 76 € selon le décompte ; plafond 10 % × 700 = 70 € → 70 € dans tous les cas.
    // Locataire B : payé le 10, dernier jour sans frais.
    expected: { a_waiver: false, a_fee: 'eur_70', b_fee_due: false },
    fr: {
      name: 'Frais de retard de loyer',
      description: 'Délai de grâce, plafond et exonération limitée.',
      state: {
        lease:
          'Le loyer est exigible le 5 du mois. Aucun frais si le paiement est reçu au plus tard le 10. À partir du 11 : forfait de 40 € plus 2 € par jour de retard compté à partir du 11. Le total des frais de retard est plafonné à 10 % du loyer mensuel. Exonération : si le prélèvement automatique a échoué à cause d’une erreur de la banque, attestée par écrit, les frais sont annulés ; cette exonération ne peut être accordée qu’une fois par période de 12 mois.',
        month: 'Septembre 2026',
        tenants: [
          { id: 'A', rent: '700 €', paid_on: '28 septembre', note: 'Prélèvement rejeté par erreur de la banque, attestation fournie. Exonération déjà accordée le 14 mars 2026.' },
          { id: 'B', rent: '1 200 €', paid_on: '10 septembre', note: 'Virement manuel.' },
        ],
      },
      questions: {
        a_waiver: { type: 'noul', instructions: 'Le locataire A bénéficie-t-il de l’exonération ce mois-ci ?' },
        a_fee: {
          type: 'choice',
          instructions: 'Quel montant de frais de retard le locataire A doit-il payer ?',
          criteria: { eur_0: '0 €', eur_40: '40 €', eur_70: '70 €', eur_76: '76 €', eur_120: '120 €' },
        },
        b_fee_due: { type: 'noul', instructions: 'Le locataire B doit-il des frais de retard ?' },
      },
    },
    en: {
      name: 'Late rent fees',
      description: 'Grace period, cap and limited waiver.',
      state: {
        lease:
          'Rent is due on the 5th of the month. No fee if payment is received by the 10th at the latest. From the 11th: flat fee of €40 plus €2 per day late, counted from the 11th. Total late fees are capped at 10% of the monthly rent. Waiver: if the direct debit failed because of a bank error, confirmed in writing, the fees are cancelled; this waiver can only be granted once per 12-month period.',
        month: 'September 2026',
        tenants: [
          { id: 'A', rent: '€700', paid_on: 'September 28', note: 'Direct debit rejected due to a bank error, letter provided. Waiver already granted on March 14, 2026.' },
          { id: 'B', rent: '€1,200', paid_on: 'September 10', note: 'Manual transfer.' },
        ],
      },
      questions: {
        a_waiver: { type: 'noul', instructions: 'Does tenant A get the waiver this month?' },
        a_fee: {
          type: 'choice',
          instructions: 'How much in late fees must tenant A pay?',
          criteria: { eur_0: '€0', eur_40: '€40', eur_70: '€70', eur_76: '€76', eur_120: '€120' },
        },
        b_fee_due: { type: 'noul', instructions: 'Does tenant B owe late fees?' },
      },
    },
  },
  {
    id: 'rules-sports-grant',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Âge au 1er septembre 2026 : Emma (née le 2 septembre 2008) a encore 17 ans → éligible ; Noah (né le 3 septembre 2020) a 5 ans → non.
    // Quotient 620 : > 600 donc 50 € (et non 80 €). Lina : 50 € plafonnés à sa cotisation de 45 € → 45 €. Emma : 50 € (cotisation 120 €).
    // Résidence depuis le 15 septembre 2025, demande le 28 septembre 2026 → plus de 12 mois. Total : 50 + 45 = 95 €.
    expected: { emma_eligible: true, noah_eligible: false, lina_amount: 'eur_45', total: 'eur_95' },
    fr: {
      name: 'Aide municipale au sport',
      description: 'Âge à une date donnée, quotient, plafond par la cotisation.',
      state: {
        rules:
          'Aide pour la saison 2026-2027. L’enfant doit avoir au moins 6 ans et moins de 18 ans au 1er septembre 2026. La famille doit résider dans la commune depuis au moins 12 mois à la date de la demande. Montant : 80 € si le quotient familial est inférieur ou égal à 600, 50 € s’il est compris entre 601 et 900 ; aucune aide au-delà de 900. L’aide ne peut pas dépasser le montant de la cotisation du club.',
        family: { arrival_in_town: '15 septembre 2025', application_date: '28 septembre 2026', family_quotient: 620 },
        children: [
          { name: 'Emma', born: '2 septembre 2008', club_fee: '120 €' },
          { name: 'Lina', born: '10 mars 2014', club_fee: '45 €' },
          { name: 'Noah', born: '3 septembre 2020', club_fee: '90 €' },
        ],
      },
      questions: {
        emma_eligible: { type: 'noul', instructions: 'Emma remplit-elle la condition d’âge ?' },
        noah_eligible: { type: 'noul', instructions: 'Noah remplit-il la condition d’âge ?' },
        lina_amount: {
          type: 'choice',
          instructions: 'Quel montant d’aide Lina recevra-t-elle ?',
          criteria: { eur_0: '0 €', eur_45: '45 €', eur_50: '50 €', eur_80: '80 €' },
        },
        total: {
          type: 'choice',
          instructions: 'Quel est le montant total d’aide versé à la famille ?',
          criteria: { eur_0: '0 €', eur_95: '95 €', eur_100: '100 €', eur_145: '145 €', eur_160: '160 €' },
        },
      },
    },
    en: {
      name: 'Municipal sports grant',
      description: 'Age on a given date, income bracket, cap at the club fee.',
      state: {
        rules:
          'Grant for the 2026-2027 season. The child must be at least 6 and under 18 years old on September 1, 2026. The family must have lived in the town for at least 12 months on the application date. Amount: €80 if the family quotient is 600 or less, €50 if it is between 601 and 900; no grant above 900. The grant cannot exceed the club membership fee.',
        family: { arrival_in_town: 'September 15, 2025', application_date: 'September 28, 2026', family_quotient: 620 },
        children: [
          { name: 'Emma', born: 'September 2, 2008', club_fee: '€120' },
          { name: 'Lina', born: 'March 10, 2014', club_fee: '€45' },
          { name: 'Noah', born: 'September 3, 2020', club_fee: '€90' },
        ],
      },
      questions: {
        emma_eligible: { type: 'noul', instructions: 'Does Emma meet the age requirement?' },
        noah_eligible: { type: 'noul', instructions: 'Does Noah meet the age requirement?' },
        lina_amount: {
          type: 'choice',
          instructions: 'How much will Lina receive?',
          criteria: { eur_0: '€0', eur_45: '€45', eur_50: '€50', eur_80: '€80' },
        },
        total: {
          type: 'choice',
          instructions: 'What is the total grant paid to the family?',
          criteria: { eur_0: '€0', eur_95: '€95', eur_100: '€100', eur_145: '€145', eur_160: '€160' },
        },
      },
    },
  },
  {
    id: 'rules-overtime-pay',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Lundi–samedi : 9 + 8 + 8 + 9 + 7 + 4 = 45 h ; dimanche 3 h à part. Total 48 h, maximum non dépassé (48 inclus).
    // Heures sup : 36e à 43e = 8 h à +25 % ; 44e et 45e = 2 h à +50 %.
    // Paie : 35 × 16 = 560 ; 8 × 20 = 160 ; 2 × 24 = 48 ; dimanche 3 × 32 = 96 → 864 €.
    expected: { max_exceeded: false, hours_at_50: 'h2', weekly_pay: 'eur_864' },
    fr: {
      name: 'Heures supplémentaires',
      description: 'Paliers de majoration, dimanche à part, durée maximale.',
      state: {
        rules:
          'Durée de référence : 35 heures du lundi au samedi. Les heures effectuées du lundi au samedi au-delà de 35 h sont majorées de 25 % de la 36e à la 43e heure incluse, puis de 50 % à partir de la 44e heure. Les heures du dimanche sont majorées de 100 % et ne sont pas comptées dans le calcul des heures supplémentaires. Durée maximale : 48 heures par semaine, dimanche compris.',
        employee: { name: 'Karim Haddad', hourly_rate: '16,00 €' },
        week: { monday: 9, tuesday: 8, wednesday: 8, thursday: 9, friday: 7, saturday: 4, sunday: 3 },
      },
      questions: {
        max_exceeded: { type: 'noul', instructions: 'La durée maximale hebdomadaire a-t-elle été dépassée ?' },
        hours_at_50: {
          type: 'choice',
          instructions: 'Combien d’heures sont majorées de 50 % ?',
          criteria: { h0: '0 heure', h2: '2 heures', h5: '5 heures', h10: '10 heures' },
        },
        weekly_pay: {
          type: 'choice',
          instructions: 'Quel est le salaire brut de Karim pour cette semaine ?',
          criteria: { eur_816: '816 €', eur_840: '840 €', eur_856: '856 €', eur_864: '864 €' },
        },
      },
    },
    en: {
      name: 'Overtime pay',
      description: 'Premium tiers, Sunday counted separately, weekly maximum.',
      state: {
        rules:
          'Standard working time: 35 hours from Monday to Saturday. Hours worked from Monday to Saturday beyond 35 are paid at a 25% premium from the 36th to the 43rd hour inclusive, then at a 50% premium from the 44th hour. Sunday hours are paid at a 100% premium and are not counted when calculating overtime. Maximum working time: 48 hours per week, Sunday included.',
        employee: { name: 'Karim Haddad', hourly_rate: '€16.00' },
        week: { monday: 9, tuesday: 8, wednesday: 8, thursday: 9, friday: 7, saturday: 4, sunday: 3 },
      },
      questions: {
        max_exceeded: { type: 'noul', instructions: 'Was the weekly maximum working time exceeded?' },
        hours_at_50: {
          type: 'choice',
          instructions: 'How many hours are paid at a 50% premium?',
          criteria: { h0: '0 hours', h2: '2 hours', h5: '5 hours', h10: '10 hours' },
        },
        weekly_pay: {
          type: 'choice',
          instructions: 'What is Karim’s gross pay for this week?',
          criteria: { eur_816: '€816', eur_840: '€840', eur_856: '€856', eur_864: '€864' },
        },
      },
    },
  },
  {
    id: 'rules-subscription-refund',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // A : annuel 1 200 € payé le 1er mars, résiliation le 18 juillet → juillet est dû ; mois non commencés : août à février = 7 × 100 € = 700 €, moins 20 % → 560 €.
    // B : mensuel → aucun remboursement. C : achat le 4 juillet, résiliation le 15 → 11 jours ≤ 14 → remboursement intégral.
    expected: { a_full_refund: false, a_refund: 'eur_560', b_refund: false, c_full_refund: true },
    fr: {
      name: 'Résiliation d’abonnement',
      description: 'Rétractation, prorata de mois non commencés et frais de résiliation.',
      state: {
        terms:
          'Toute résiliation dans les 14 jours suivant l’achat donne droit au remboursement intégral. Au-delà, pour les abonnements annuels payés d’avance : remboursement des mois entiers non commencés, diminué de frais de résiliation égaux à 20 % de ce montant ; le mois en cours reste dû. Les abonnements mensuels ne sont jamais remboursés au-delà des 14 jours : ils courent jusqu’à la fin du mois payé.',
        customers: [
          { id: 'A', plan: 'annuel, 1 200 € payés d’avance', purchased: '1er mars 2026', cancelled: '18 juillet 2026' },
          { id: 'B', plan: 'mensuel, 49 € par mois', purchased: '3 janvier 2026', cancelled: '18 juillet 2026' },
          { id: 'C', plan: 'annuel, 1 200 € payés d’avance', purchased: '4 juillet 2026', cancelled: '15 juillet 2026' },
        ],
      },
      questions: {
        a_full_refund: { type: 'noul', instructions: 'Le client A a-t-il droit au remboursement intégral ?' },
        a_refund: {
          type: 'choice',
          instructions: 'Combien le client A sera-t-il remboursé ?',
          criteria: { eur_0: '0 €', eur_560: '560 €', eur_640: '640 €', eur_700: '700 €', eur_1200: '1 200 €' },
        },
        b_refund: { type: 'noul', instructions: 'Le client B sera-t-il remboursé d’une partie de son abonnement ?' },
        c_full_refund: { type: 'noul', instructions: 'Le client C a-t-il droit au remboursement intégral ?' },
      },
    },
    en: {
      name: 'Subscription cancellation',
      description: 'Cooling-off period, unstarted months and cancellation fee.',
      state: {
        terms:
          'Any cancellation within 14 days of purchase gives the right to a full refund. After that, for annual plans paid upfront: refund of the full months not yet started, minus a cancellation fee equal to 20% of that amount; the current month remains payable. Monthly plans are never refunded after the 14 days: they run until the end of the paid month.',
        customers: [
          { id: 'A', plan: 'annual, €1,200 paid upfront', purchased: 'March 1, 2026', cancelled: 'July 18, 2026' },
          { id: 'B', plan: 'monthly, €49 per month', purchased: 'January 3, 2026', cancelled: 'July 18, 2026' },
          { id: 'C', plan: 'annual, €1,200 paid upfront', purchased: 'July 4, 2026', cancelled: 'July 15, 2026' },
        ],
      },
      questions: {
        a_full_refund: { type: 'noul', instructions: 'Is customer A entitled to a full refund?' },
        a_refund: {
          type: 'choice',
          instructions: 'How much will customer A be refunded?',
          criteria: { eur_0: '€0', eur_560: '€560', eur_640: '€640', eur_700: '€700', eur_1200: '€1,200' },
        },
        b_refund: { type: 'noul', instructions: 'Will customer B get part of the subscription refunded?' },
        c_full_refund: { type: 'noul', instructions: 'Is customer C entitled to a full refund?' },
      },
    },
  },
  {
    id: 'rules-travel-policy',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'long',
    // Camille : 6 h 00 n’est pas strictement supérieur à 6 h → pas de classe affaires ; réservation (2 sept.) avant l’autorisation (4 sept.) → non conforme.
    // Hôtel à Dakar, hors liste : plafond 150 € → 3 × 150 = 450 € remboursés (le dépassement reste à sa charge, la nuit n’est pas refusée).
    // Julien : comité de direction, vol direct de 4 h 35 > 4 h → affaires autorisée. Inès : 3 h 00 ≥ 3 h → première classe autorisée.
    expected: { camille_business: false, camille_approval_ok: false, camille_hotel: 'eur_450', julien_business: true, ines_first_class: true },
    fr: {
      name: 'Politique de déplacements',
      description: 'Plusieurs demandes à contrôler contre une politique détaillée.',
      state: `${TRAVEL_POLICY.fr}\n\n${TRAVEL_REQUESTS.fr}`,
      questions: {
        camille_business: { type: 'noul', instructions: 'Camille a-t-elle droit à la classe affaires sur son vol ?' },
        camille_approval_ok: { type: 'noul', instructions: 'Le déplacement de Camille respecte-t-il la règle d’autorisation préalable ?' },
        camille_hotel: {
          type: 'choice',
          instructions: 'Hors toute autre règle, quel montant d’hôtel serait remboursé à Camille au titre du plafond d’hébergement ?',
          criteria: { eur_0: '0 €', eur_450: '450 €', eur_570: '570 €', eur_660: '660 €' },
        },
        julien_business: { type: 'noul', instructions: 'Julien a-t-il droit à la classe affaires sur son vol ?' },
        ines_first_class: { type: 'noul', instructions: 'Inès a-t-elle droit à la première classe ?' },
      },
    },
    en: {
      name: 'Travel policy',
      description: 'Several requests to check against a detailed policy.',
      state: `${TRAVEL_POLICY.en}\n\n${TRAVEL_REQUESTS.en}`,
      questions: {
        camille_business: { type: 'noul', instructions: 'Is Camille entitled to business class on her flight?' },
        camille_approval_ok: { type: 'noul', instructions: 'Does Camille’s trip comply with the prior approval rule?' },
        camille_hotel: {
          type: 'choice',
          instructions: 'Leaving all other rules aside, how much of the hotel would be reimbursed to Camille under the accommodation cap?',
          criteria: { eur_0: '€0', eur_450: '€450', eur_570: '€570', eur_660: '€660' },
        },
        julien_business: { type: 'noul', instructions: 'Is Julien entitled to business class on his flight?' },
        ines_first_class: { type: 'noul', instructions: 'Is Inès entitled to first class?' },
      },
    },
  },
  {
    id: 'rules-warranty',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Achat le 20 novembre 2024, demande le 5 octobre 2026 → dans la garantie légale de 2 ans (jusqu’au 20 novembre 2026).
    // Enregistrement le 28 décembre 2024 = 38 jours après l’achat (> 30) → pas d’extension, mais inutile pour l’écran.
    // Batterie : garantie 12 mois seulement → expirée depuis novembre 2025.
    expected: { screen_covered: true, battery_covered: false, extension_active: false, battery_reason: 'battery_limit' },
    fr: {
      name: 'Garantie d’un ordinateur portable',
      description: 'Garantie légale, extension conditionnelle, exception batterie.',
      state: {
        warranty:
          'Garantie de 2 ans à compter de la date d’achat, pièces et main-d’œuvre. Exception : la batterie n’est garantie que 12 mois. La garantie est étendue à 3 ans (batterie exceptée) si le produit est enregistré en ligne dans les 30 jours suivant l’achat. Exclusions : casse accidentelle et oxydation.',
        purchase: { date: '20 novembre 2024', registered_online: '28 décembre 2024' },
        claim: {
          date: '5 octobre 2026',
          issues: [
            'Des lignes verticales sont apparues sur l’écran ; aucune trace de choc ni d’oxydation selon le technicien.',
            'La batterie ne tient plus que 40 minutes.',
          ],
        },
      },
      questions: {
        screen_covered: { type: 'noul', instructions: 'La réparation de l’écran est-elle couverte ?' },
        battery_covered: { type: 'noul', instructions: 'Le remplacement de la batterie est-il couvert ?' },
        extension_active: { type: 'noul', instructions: 'L’extension de garantie à 3 ans est-elle active ?' },
        battery_reason: {
          type: 'choice',
          instructions: 'Qu’est-ce qui détermine la décision pour la batterie ?',
          criteria: {
            battery_limit: 'La durée de garantie propre à la batterie',
            expired: 'La garantie de 2 ans est expirée',
            not_registered: 'L’enregistrement en ligne a été fait trop tard',
            accidental: 'Casse accidentelle ou oxydation',
            none: 'Rien, la batterie est couverte',
          },
        },
      },
    },
    en: {
      name: 'Laptop warranty',
      description: 'Statutory warranty, conditional extension, battery exception.',
      state: {
        warranty:
          '2-year warranty from the date of purchase, parts and labor. Exception: the battery is only covered for 12 months. The warranty is extended to 3 years (battery excepted) if the product is registered online within 30 days of purchase. Exclusions: accidental damage and oxidation.',
        purchase: { date: 'November 20, 2024', registered_online: 'December 28, 2024' },
        claim: {
          date: 'October 5, 2026',
          issues: ['Vertical lines have appeared on the screen; no sign of impact or oxidation according to the technician.', 'The battery now only lasts 40 minutes.'],
        },
      },
      questions: {
        screen_covered: { type: 'noul', instructions: 'Is the screen repair covered?' },
        battery_covered: { type: 'noul', instructions: 'Is the battery replacement covered?' },
        extension_active: { type: 'noul', instructions: 'Is the 3-year warranty extension active?' },
        battery_reason: {
          type: 'choice',
          instructions: 'What determines the decision for the battery?',
          criteria: {
            battery_limit: 'The battery’s own warranty period',
            expired: 'The 2-year warranty has expired',
            not_registered: 'Online registration was done too late',
            accidental: 'Accidental damage or oxidation',
            none: 'Nothing, the battery is covered',
          },
        },
      },
    },
  },
]
