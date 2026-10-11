import type { Pair } from './pair.ts'

// Nombres, quantités et durées : totaux filtrés, pourcentages successifs, conversions d’unités,
// moyennes, vitesses, dates, plannings, stocks et budgets. Chaque réponse se calcule sans ambiguïté.

// ─── Données partagées ───────────────────────────────────────────────────────

type Order = [id: string, customer: string, status: 'paid' | 'refunded' | 'pending', amount: number, day: number, payment: 'card' | 'transfer']
const ORDERS: Order[] = [
  ['O-101', 'Coralis', 'paid', 1240.0, 3, 'card'],
  ['O-102', 'Delmont', 'paid', 860.5, 5, 'transfer'],
  ['O-103', 'Fenwick', 'refunded', 2100.0, 6, 'card'],
  ['O-104', 'Coralis', 'pending', 640.0, 9, 'transfer'],
  ['O-105', 'Ostrel', 'paid', 1515.75, 11, 'card'],
  ['O-106', 'Fenwick', 'paid', 420.0, 12, 'transfer'],
  ['O-107', 'Delmont', 'paid', 1135.2, 16, 'card'],
  ['O-108', 'Coralis', 'paid', 380.4, 18, 'card'],
  ['O-109', 'Ostrel', 'refunded', 290.0, 20, 'transfer'],
  ['O-110', 'Fenwick', 'pending', 980.0, 23, 'transfer'],
  ['O-111', 'Delmont', 'paid', 205.9, 25, 'card'],
  ['O-112', 'Ostrel', 'paid', 310.0, 27, 'card'],
]
const ORDER_STATUS = {
  fr: { paid: 'payée', refunded: 'remboursée', pending: 'en attente', card: 'carte bancaire', transfer: 'virement' },
  en: { paid: 'paid', refunded: 'refunded', pending: 'pending', card: 'card', transfer: 'bank transfer' },
}
const orders = (lang: 'fr' | 'en') =>
  ORDERS.map(([id, customer, status, amount_eur, day, payment]) => ({
    id,
    date: lang === 'fr' ? `${day} février 2026` : `February ${day}, 2026`,
    customer,
    payment_method: ORDER_STATUS[lang][payment],
    status: ORDER_STATUS[lang][status],
    amount_eur,
  }))

type Booking = [id: string, start: string, duration_min: number, cancelled: boolean, fr: string, en: string, organizer: string, attendees: number]
const BOOKINGS: Booking[] = [
  ['B1', '08:30', 90, false, 'Point hebdomadaire de l’équipe produit', 'Product team weekly meeting', 'Lina Ferraz', 8],
  ['B2', '10:00', 45, false, 'Entretien de recrutement', 'Job interview', 'Hugo Lemaire', 3],
  ['B3', '10:30', 60, false, 'Revue de budget', 'Budget review', 'Ada Kowal', 5],
  ['B4', '11:30', 120, false, 'Atelier fournisseurs', 'Supplier workshop', 'Malik Benard', 12],
  ['B5', '14:00', 75, false, 'Formation sécurité', 'Safety training', 'Sofia Reyes', 10],
  ['B6', '15:15', 30, false, 'Appel client', 'Customer call', 'Hugo Lemaire', 2],
  ['B7', '16:00', 50, false, 'Comité de direction', 'Management committee', 'Nadia Castel', 7],
  ['B8', '16:30', 60, true, 'Démonstration commerciale', 'Sales demo', 'Ada Kowal', 6],
]
const bookings = (lang: 'fr' | 'en') =>
  BOOKINGS.map(([id, start, duration_min, cancelled, fr, en, organizer, attendees]) => ({ id, title: lang === 'fr' ? fr : en, organizer, attendees, start, duration_min, status: cancelled ? (lang === 'fr' ? 'annulée' : 'cancelled') : lang === 'fr' ? 'confirmée' : 'confirmed' }))

type Dept = [key: string, fr: string, en: string, budget: number, actual: number, headcount: number, manager: string]
const DEPTS: Dept[] = [
  ['marketing', 'Marketing', 'Marketing', 120000, 131400, 14, 'Élise Garnier'],
  ['it', 'Informatique', 'IT', 250000, 262500, 22, 'Karim Abadi'],
  ['hr', 'Ressources humaines', 'Human resources', 45000, 41200, 6, 'Mona Lefort'],
  ['logistics', 'Logistique', 'Logistics', 180000, 176300, 31, 'Pavel Ronan'],
  ['legal', 'Juridique', 'Legal', 30000, 34800, 3, 'Agathe Seyne'],
  ['finance', 'Finance', 'Finance', 60000, 58900, 9, 'Oscar Lindell'],
  ['production', 'Production', 'Production', 410000, 402700, 58, 'Bruno Tessier'],
  ['purchasing', 'Achats', 'Purchasing', 25000, 25600, 4, 'Yasmine Ould'],
]
const depts = (lang: 'fr' | 'en') => DEPTS.map(([, fr, en, budget_eur, actual_eur, headcount, manager]) => ({ department: lang === 'fr' ? fr : en, manager, headcount, budget_eur, actual_eur }))

type Sale = [id: string, date: string, customer: string, region: 'north' | 'south' | 'east' | 'west', product: string, quantity: number, unit_price: number, status: 'delivered' | 'cancelled' | 'returned']
const SALES: Sale[] = [
  ['V-2601', '2026-01-08', 'Maison Arlan', 'north', 'Orion', 12, 64.9, 'delivered'],
  ['V-2602', '2026-01-15', 'Brisol Design', 'south', 'Vega', 4, 189.0, 'delivered'],
  ['V-2603', '2026-01-22', 'Kestel Hôtels', 'east', 'Orion', 30, 64.9, 'cancelled'],
  ['V-2604', '2026-01-29', 'Tamaris Bureaux', 'west', 'Lyra', 8, 112.5, 'delivered'],
  ['V-2605', '2026-02-03', 'Brisol Design', 'south', 'Orion', 15, 64.9, 'delivered'],
  ['V-2606', '2026-02-10', 'Kestel Hôtels', 'east', 'Vega', 6, 189.0, 'delivered'],
  ['V-2607', '2026-02-12', 'Maison Arlan', 'north', 'Lyra', 10, 112.5, 'returned'],
  ['V-2608', '2026-02-19', 'Tamaris Bureaux', 'west', 'Orion', 20, 64.9, 'delivered'],
  ['V-2609', '2026-02-26', 'Novelle Habitat', 'north', 'Vega', 5, 189.0, 'delivered'],
  ['V-2610', '2026-03-04', 'Kestel Hôtels', 'east', 'Lyra', 9, 112.5, 'delivered'],
  ['V-2611', '2026-03-11', 'Brisol Design', 'south', 'Vega', 3, 189.0, 'cancelled'],
  ['V-2612', '2026-03-17', 'Tamaris Bureaux', 'west', 'Vega', 2, 189.0, 'delivered'],
  ['V-2613', '2026-03-20', 'Novelle Habitat', 'north', 'Orion', 18, 64.9, 'delivered'],
  ['V-2614', '2026-03-25', 'Kestel Hôtels', 'east', 'Orion', 7, 64.9, 'delivered'],
  ['V-2615', '2026-03-30', 'Brisol Design', 'south', 'Lyra', 6, 112.5, 'delivered'],
]
const SALE_WORDS = {
  fr: { north: 'Nord', south: 'Sud', east: 'Est', west: 'Ouest', delivered: 'livrée', cancelled: 'annulée', returned: 'retournée' },
  en: { north: 'North', south: 'South', east: 'East', west: 'West', delivered: 'delivered', cancelled: 'cancelled', returned: 'returned' },
}
const REPS = { north: 'Camille Darnaud', south: 'Théo Valdez', east: 'Iris Moulin', west: 'Bastien Kerlo' }
const sales = (lang: 'fr' | 'en') =>
  SALES.map(([id, date, customer, region, product, quantity, unit_price_eur, status]) => ({
    id,
    date,
    customer,
    region: SALE_WORDS[lang][region],
    sales_rep: REPS[region],
    product,
    quantity,
    unit_price_eur,
    status: SALE_WORDS[lang][status],
  }))

// Mouvements de stock d’un mois : réception (in), expédition (out), retour client remis en stock (return), mise au rebut (scrap).
type Move = [n: number, day: number, sku: string, kind: 'in' | 'out' | 'return' | 'scrap', qty: number]
const MOVES: Move[] = [
  [1, 2, 'A-100', 'out', 60],
  [2, 2, 'B-200', 'out', 25],
  [3, 3, 'C-300', 'out', 70],
  [4, 4, 'D-400', 'out', 45],
  [5, 5, 'A-100', 'out', 75],
  [6, 6, 'B-200', 'return', 4],
  [7, 7, 'C-300', 'in', 40],
  [8, 8, 'D-400', 'scrap', 6],
  [9, 9, 'B-200', 'out', 40],
  [10, 10, 'A-100', 'in', 120],
  [11, 11, 'C-300', 'return', 3],
  [12, 12, 'D-400', 'out', 38],
  [13, 13, 'B-200', 'in', 50],
  [14, 14, 'A-100', 'out', 90],
  [15, 15, 'C-300', 'out', 25],
  [16, 16, 'B-200', 'scrap', 3],
  [17, 17, 'D-400', 'return', 5],
  [18, 18, 'A-100', 'out', 48],
]
const MOVE_WORDS = {
  fr: { in: 'réception fournisseur', out: 'expédition client', return: 'retour client remis en stock', scrap: 'mise au rebut' },
  en: { in: 'supplier receipt', out: 'customer shipment', return: 'customer return put back in stock', scrap: 'scrapped' },
}
const moves = (lang: 'fr' | 'en') =>
  MOVES.map(([n, day, sku, kind, quantity]) => ({ n, date: lang === 'fr' ? `${day} avril 2026` : `April ${day}, 2026`, sku, movement: MOVE_WORDS[lang][kind], quantity }))

// Salariés (taux horaire chargé) et heures déclarées sur trois semaines : la jointure se fait sur employee_id.
type Staff = [id: string, name: string, team: 'support' | 'dev' | 'design', rate: number]
const STAFF: Staff[] = [
  ['E01', 'Aline Morvan', 'support', 24],
  ['E02', 'Bilal Hadj', 'support', 22],
  ['E03', 'Chloé Varenne', 'dev', 38],
  ['E04', 'Dario Fenzi', 'dev', 41],
  ['E05', 'Edwige Lamar', 'design', 33],
  ['E06', 'Farid Oumou', 'support', 26],
  ['E07', 'Gaëlle Tisserand', 'design', 35],
  ['E08', 'Hector Blain', 'dev', 36],
]
const TEAM_WORDS = { fr: { support: 'Support', dev: 'Développement', design: 'Design' }, en: { support: 'Support', dev: 'Development', design: 'Design' } }
const HOURS: [employee_id: string, week: number, hours: number][] = [
  ['E01', 1, 35], ['E02', 1, 38], ['E03', 1, 30], ['E04', 1, 24], ['E05', 1, 32], ['E06', 1, 40], ['E07', 1, 20], ['E08', 1, 35],
  ['E01', 2, 37], ['E02', 2, 36], ['E03', 2, 28], ['E04', 2, 22], ['E05', 2, 30], ['E06', 2, 39], ['E07', 2, 25], ['E08', 2, 33],
  ['E06', 3, 12], ['E02', 3, 8],
]

function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

/**
 * 36 notes de frais de mars 2026, générées avec une graine fixe. Statuts : 26 validées, 7 refusées, 3 en attente.
 * Basile Corre a le plus gros total toutes notes confondues après Esther Moal, mais plusieurs de ses notes
 * sont refusées ou en attente : en ne gardant que les validées, Anouk Ferrand le dépasse.
 */
function expenseLines(lang: 'fr' | 'en') {
  const rnd = seeded(2026)
  const words = {
    fr: { transport: 'transport', lodging: 'hébergement', meals: 'repas', supplies: 'fournitures', approved: 'validée', rejected: 'refusée', pending: 'en attente' },
    en: { transport: 'transport', lodging: 'lodging', meals: 'meals', supplies: 'supplies', approved: 'approved', rejected: 'rejected', pending: 'pending' },
  }[lang]
  const staff = ['Anouk Ferrand', 'Basile Corre', 'Célia Notari', 'Dimitri Lavaux', 'Esther Moal']
  const cats = ['transport', 'lodging', 'meals', 'supplies'] as const
  const ranges = { transport: [18, 240], lodging: [70, 190], meals: [12, 65], supplies: [8, 120] }
  const lines = []
  for (let i = 0; i < 36; i++) {
    const cat = cats[Math.floor(rnd() * 4)]
    const [lo, hi] = ranges[cat]
    const amount_eur = Math.round((lo + rnd() * (hi - lo)) * 100) / 100
    const s = rnd()
    const day = 2 + Math.floor(i * 0.8)
    lines.push({
      id: `NDF-${301 + i}`,
      date: lang === 'fr' ? `${day} mars 2026` : `March ${day}, 2026`,
      employee: staff[Math.floor(rnd() * 5)],
      category: words[cat],
      amount_eur,
      status: words[s < 0.75 ? 'approved' : s < 0.9 ? 'rejected' : 'pending'],
    })
  }
  return lines
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const NUMBERS: Pair[] = [
  {
    id: 'num-paid-orders',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Commandes payées seulement : Coralis 1 240 + 380,40 = 1 620,40 ; Delmont 860,50 + 1 135,20 + 205,90 = 2 201,60 ;
    // Fenwick 420 ; Ostrel 1 515,75 + 310 = 1 825,75. Total payé = 6 067,75 € (> 6 000) sur 8 commandes, moyenne 758,47 € (< 800).
    // Sans filtre, Fenwick serait en tête (3 500 €) grâce à une commande remboursée et une en attente.
    expected: { paid_total_above_6000: true, top_paid_customer: 'delmont', avg_paid_above_800: false },
    fr: {
      name: 'Total des commandes payées',
      description: 'Agrégation filtrée sur le statut ; le client en tête change avec le filtre.',
      state: { period: 'février 2026', currency: 'EUR', orders: orders('fr') },
      questions: {
        paid_total_above_6000: { type: 'noul', instructions: 'Le montant total des commandes payées dépasse-t-il 6 000 € ?' },
        top_paid_customer: {
          type: 'choice',
          instructions: 'Quel client totalise le montant le plus élevé en commandes payées ?',
          criteria: { coralis: 'Coralis', delmont: 'Delmont', fenwick: 'Fenwick', ostrel: 'Ostrel' },
        },
        avg_paid_above_800: { type: 'noul', instructions: 'Le montant moyen d’une commande payée dépasse-t-il 800 € ?' },
      },
    },
    en: {
      name: 'Paid orders total',
      description: 'Aggregation filtered on status; the top customer changes with the filter.',
      state: { period: 'February 2026', currency: 'EUR', orders: orders('en') },
      questions: {
        paid_total_above_6000: { type: 'noul', instructions: 'Does the total amount of paid orders exceed €6,000?' },
        top_paid_customer: {
          type: 'choice',
          instructions: 'Which customer has the highest total amount of paid orders?',
          criteria: { coralis: 'Coralis', delmont: 'Delmont', fenwick: 'Fenwick', ostrel: 'Ostrel' },
        },
        avg_paid_above_800: { type: 'noul', instructions: 'Is the average amount of a paid order above €800?' },
      },
    },
  },
  {
    id: 'num-stacked-discounts',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 80 × 0,75 = 60 ; 60 × 0,90 = 54 € ; remise totale 1 − 54/80 = 32,5 % (< 35 %).
    // 54 € < 60 € : livraison payante, 54 + 4,90 = 58,90 €. Concurrent : 72 × 0,80 = 57,60 €, livraison offerte → moins cher.
    expected: { discount_at_least_35: false, free_shipping: false, amount_paid: 'eur_58_90', cheaper_elsewhere: true },
    fr: {
      name: 'Remises successives',
      description: 'Deux remises qui ne s’additionnent pas, seuil de livraison gratuite.',
      state:
        'Une veste coûte 80 € sur la boutique Altamar. Elle est soldée à −25 %, et le code fidélité de Maëlle retire encore 10 % du prix soldé. La livraison coûte 4,90 €, mais elle est offerte dès 60 € d’achat (montant calculé après toutes les remises). Sur la boutique Sorelle, la même veste coûte 72 € avec −20 % et la livraison y est toujours gratuite.',
      questions: {
        discount_at_least_35: { type: 'noul', instructions: 'Sur Altamar, la remise totale par rapport au prix de 80 € atteint-elle au moins 35 % ?' },
        free_shipping: { type: 'noul', instructions: 'Sur Altamar, Maëlle bénéficie-t-elle de la livraison gratuite ?' },
        amount_paid: {
          type: 'choice',
          instructions: 'Combien Maëlle paiera-t-elle au total sur Altamar, livraison comprise ?',
          criteria: { eur_52_00: '52,00 €', eur_54_00: '54,00 €', eur_56_90: '56,90 €', eur_58_90: '58,90 €' },
        },
        cheaper_elsewhere: { type: 'noul', instructions: 'Livraison comprise, la veste revient-elle moins cher sur Sorelle que sur Altamar ?' },
      },
    },
    en: {
      name: 'Stacked discounts',
      description: 'Two discounts that do not add up, free-shipping threshold.',
      state:
        'A jacket costs €80 on the Altamar store. It is on sale at 25% off, and Maëlle’s loyalty code takes a further 10% off the sale price. Shipping costs €4.90, but it is free on orders of €60 or more (amount calculated after all discounts). On the Sorelle store, the same jacket costs €72 with 20% off, and shipping there is always free.',
      questions: {
        discount_at_least_35: { type: 'noul', instructions: 'On Altamar, is the total discount relative to the €80 price at least 35%?' },
        free_shipping: { type: 'noul', instructions: 'On Altamar, does Maëlle get free shipping?' },
        amount_paid: {
          type: 'choice',
          instructions: 'How much will Maëlle pay in total on Altamar, shipping included?',
          criteria: { eur_52_00: '€52.00', eur_54_00: '€54.00', eur_56_90: '€56.90', eur_58_90: '€58.90' },
        },
        cheaper_elsewhere: { type: 'noul', instructions: 'Shipping included, is the jacket cheaper on Sorelle than on Altamar?' },
      },
    },
  },
  {
    id: 'num-van-payload',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 40 × 25 kg = 1 000 kg ; 60 L × 1,3 kg/L = 78 kg ; + conducteur 85 kg + outillage 45 kg = 1 208 kg > 1 200 kg (1,2 t).
    // Retirer un sac : 1 183 kg ≤ 1 200 → un seul sac suffit. Part des sacs : 1 000 / 1 208 = 82,8 % (> 80 %).
    expected: { within_payload: false, bags_to_remove: 'one', bags_over_80_percent: true },
    fr: {
      name: 'Charge utile d’une camionnette',
      description: 'Conversions litres → kilos et tonnes → kilos, dépassement de 8 kg.',
      state:
        'La camionnette de Rémi a une charge utile de 1,2 t, conducteur compris. Il doit transporter 40 sacs de ciment de 25 kg chacun et 60 litres de peinture (masse volumique : 1,3 kg par litre). Rémi pèse 85 kg et sa caisse à outils, qui reste toujours dans le véhicule, pèse 45 kg.',
      questions: {
        within_payload: { type: 'noul', instructions: 'Le chargement complet, conducteur compris, respecte-t-il la charge utile ?' },
        bags_to_remove: {
          type: 'choice',
          instructions: 'Combien de sacs de ciment Rémi doit-il laisser au minimum pour respecter la charge utile ?',
          criteria: { none: 'Aucun', one: 'Un', two: 'Deux', three: 'Trois' },
        },
        bags_over_80_percent: { type: 'noul', instructions: 'Les sacs de ciment représentent-ils plus de 80 % de la masse totale embarquée (conducteur compris) ?' },
      },
    },
    en: {
      name: 'Van payload',
      description: 'Litres → kilograms and tonnes → kilograms conversions, 8 kg over.',
      state:
        'Rémi’s van has a payload of 1.2 t, driver included. He needs to carry 40 bags of cement weighing 25 kg each and 60 litres of paint (density: 1.3 kg per litre). Rémi weighs 85 kg, and his toolbox, which always stays in the vehicle, weighs 45 kg.',
      questions: {
        within_payload: { type: 'noul', instructions: 'Does the full load, driver included, stay within the payload?' },
        bags_to_remove: {
          type: 'choice',
          instructions: 'What is the minimum number of cement bags Rémi must leave behind to stay within the payload?',
          criteria: { none: 'None', one: 'One', two: 'Two', three: 'Three' },
        },
        bags_over_80_percent: { type: 'noul', instructions: 'Do the cement bags account for more than 80% of the total mass on board (driver included)?' },
      },
    },
  },
  {
    id: 'num-room-bookings',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Fins : B1 10:00, B2 10:45, B3 11:30, B4 13:30, B5 15:15, B6 15:45, B7 16:50 (B8 annulée).
    // Seul chevauchement réel : B2 (10:00–10:45) et B3 (10:30–11:30). B1/B2 et B5/B6 se touchent sans se chevaucher ; B7/B8 : B8 annulée.
    // Réservations confirmées : 90 + 45 + 60 + 120 + 75 + 30 + 50 = 470 min = 7 h 50 (< 8 h).
    // Créneaux libres entre 13 h et 17 h : 13:30–14:00 (30 min), 15:45–16:00 (15 min), 16:50–17:00 (10 min) → pas d’heure libre.
    expected: { has_conflict: true, conflicting_pair: 'b2_b3', booked_over_8h: false, free_hour_afternoon: false },
    fr: {
      name: 'Réservations de salle',
      description: 'Heures de fin à calculer, réservation annulée en piège.',
      state: { room: 'Salle Atlas', date: '12 mars 2026', bookings: bookings('fr') },
      questions: {
        has_conflict: { type: 'noul', instructions: 'Deux réservations confirmées se chevauchent-elles ?' },
        conflicting_pair: {
          type: 'choice',
          instructions: 'Quelle paire de réservations pose un problème de chevauchement ?',
          criteria: { b1_b2: 'B1 et B2', b2_b3: 'B2 et B3', b5_b6: 'B5 et B6', b7_b8: 'B7 et B8' },
        },
        booked_over_8h: { type: 'noul', instructions: 'La durée cumulée des réservations confirmées dépasse-t-elle 8 heures ?' },
        free_hour_afternoon: { type: 'noul', instructions: 'Peut-on caser une réunion d’une heure d’affilée dans la salle entre 13 h et 17 h sans chevaucher une réservation confirmée ?' },
      },
    },
    en: {
      name: 'Room bookings',
      description: 'End times to compute, a cancelled booking as a trap.',
      state: { room: 'Atlas room', date: 'March 12, 2026', bookings: bookings('en') },
      questions: {
        has_conflict: { type: 'noul', instructions: 'Do any two confirmed bookings overlap?' },
        conflicting_pair: {
          type: 'choice',
          instructions: 'Which pair of bookings has an overlap problem?',
          criteria: { b1_b2: 'B1 and B2', b2_b3: 'B2 and B3', b5_b6: 'B5 and B6', b7_b8: 'B7 and B8' },
        },
        booked_over_8h: { type: 'noul', instructions: 'Does the combined duration of confirmed bookings exceed 8 hours?' },
        free_hour_afternoon: { type: 'noul', instructions: 'Can a one-hour meeting fit in the room in a single block between 1:00 pm and 5:00 pm without overlapping a confirmed booking?' },
      },
    },
  },
  {
    id: 'num-late-payment',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 28 janvier + 45 jours : 3 jours → 31 janvier, 28 → 28 février (2026 non bissextile), 14 → 14 mars. Échéance : 14 mars 2026.
    // Paiement le 19 mars : 5 jours de retard (niveau « 4 à 7 jours »). Pénalité : 12 400 × 0,05 % × 5 = 31,00 € (> 25 €).
    expected: { paid_late: true, due_date: 'march_14', days_late: 2, penalty_above_25: true },
    fr: {
      name: 'Retard de paiement',
      description: 'Échéance à 45 jours à travers février, pénalité journalière.',
      state:
        'Facture F-2026-031, émise le 28 janvier 2026, montant 12 400,00 €. Conditions : paiement à 45 jours calendaires à compter de la date de facture ; une échéance tombant un week-end n’est pas décalée. Tout retard entraîne une pénalité de 0,05 % du montant de la facture par jour de retard. Un acompte de 2 000 € avait été demandé à la commande et réglé le 5 janvier ; il n’entre pas dans cette facture. Le virement du client a été reçu le 19 mars 2026.',
      questions: {
        paid_late: { type: 'noul', instructions: 'La facture a-t-elle été payée en retard ?' },
        due_date: {
          type: 'choice',
          instructions: 'Quelle est la date d’échéance de la facture ?',
          criteria: { march_12: '12 mars 2026', march_14: '14 mars 2026', march_16: '16 mars 2026', march_19: '19 mars 2026' },
        },
        days_late: { type: 'score', instructions: 'Avec combien de jours de retard la facture a-t-elle été payée ?', criteria: ['Aucun retard', '1 à 3 jours', '4 à 7 jours', '8 jours ou plus'] },
        penalty_above_25: { type: 'noul', instructions: 'La pénalité de retard dépasse-t-elle 25 € ?' },
      },
    },
    en: {
      name: 'Late payment',
      description: '45-day term running through February, daily penalty.',
      state:
        'Invoice F-2026-031, issued on January 28, 2026, amount €12,400.00. Terms: payment within 45 calendar days of the invoice date; a due date falling on a weekend is not moved. Any delay incurs a penalty of 0.05% of the invoice amount per day of delay. A €2,000 deposit had been requested with the order and paid on January 5; it is not part of this invoice. The customer’s transfer was received on March 19, 2026.',
      questions: {
        paid_late: { type: 'noul', instructions: 'Was the invoice paid late?' },
        due_date: {
          type: 'choice',
          instructions: 'What is the invoice due date?',
          criteria: { march_12: 'March 12, 2026', march_14: 'March 14, 2026', march_16: 'March 16, 2026', march_19: 'March 19, 2026' },
        },
        days_late: { type: 'score', instructions: 'How many days late was the invoice paid?', criteria: ['No delay', '1 to 3 days', '4 to 7 days', '8 days or more'] },
        penalty_above_25: { type: 'noul', instructions: 'Does the late-payment penalty exceed €25?' },
      },
    },
  },
  {
    id: 'num-reorder-point',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Point de commande = 115 × 14 + 300 = 1 910 unités ; stock 1 840 ≤ 1 910 → commander maintenant.
    // Couverture : 1 840 / 115 = 16 jours (2 à 3 semaines) > 14 jours de délai → pas de rupture si l’on commande aujourd’hui.
    expected: { reorder_now: true, reorder_level: 'units_1910', stockout_before_delivery: false, days_of_cover: 2 },
    fr: {
      name: 'Point de commande',
      description: 'Stock de sécurité, délai fournisseur, couverture en jours.',
      state:
        'Entrepôt de Valbonne, référence « gourde isotherme 0,75 L ». Stock disponible ce matin : 1 840 unités. Ventes moyennes : 115 unités par jour, 7 jours sur 7 (le pic du mois dernier était de 160 par jour, sans lendemain). Délai de livraison du fournisseur : 14 jours. Règle de l’entrepôt : on passe commande dès que le stock disponible est inférieur ou égal à la demande attendue pendant le délai de livraison, plus un stock de sécurité de 300 unités.',
      questions: {
        reorder_now: { type: 'noul', instructions: 'Selon la règle de l’entrepôt, faut-il passer commande aujourd’hui ?' },
        reorder_level: {
          type: 'choice',
          instructions: 'À quel niveau de stock la règle déclenche-t-elle une commande ?',
          criteria: { units_1610: '1 610 unités', units_1840: '1 840 unités', units_1910: '1 910 unités', units_2540: '2 540 unités' },
        },
        stockout_before_delivery: { type: 'noul', instructions: 'Au rythme moyen, si la commande est passée aujourd’hui, le stock sera-t-il épuisé avant l’arrivée de la livraison ?' },
        days_of_cover: { type: 'score', instructions: 'Combien de temps le stock actuel dure-t-il au rythme moyen ?', criteria: ['Moins d’une semaine', '1 à 2 semaines', '2 à 3 semaines', 'Plus de 3 semaines'] },
      },
    },
    en: {
      name: 'Reorder point',
      description: 'Safety stock, supplier lead time, days of cover.',
      state:
        'Valbonne warehouse, item “0.75 L insulated bottle”. Stock available this morning: 1,840 units. Average sales: 115 units per day, 7 days a week (last month’s peak was 160 per day, a one-off). Supplier lead time: 14 days. Warehouse rule: place an order as soon as available stock is less than or equal to the expected demand during the lead time, plus a safety stock of 300 units.',
      questions: {
        reorder_now: { type: 'noul', instructions: 'According to the warehouse rule, should an order be placed today?' },
        reorder_level: {
          type: 'choice',
          instructions: 'At what stock level does the rule trigger an order?',
          criteria: { units_1610: '1,610 units', units_1840: '1,840 units', units_1910: '1,910 units', units_2540: '2,540 units' },
        },
        stockout_before_delivery: { type: 'noul', instructions: 'At the average rate, if the order is placed today, will stock run out before the delivery arrives?' },
        days_of_cover: { type: 'score', instructions: 'How long will current stock last at the average rate?', criteria: ['Less than a week', '1 to 2 weeks', '2 to 3 weeks', 'More than 3 weeks'] },
      },
    },
  },
  {
    id: 'num-budget-overrun',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Total budget 1 120 000 €, réalisé 1 133 400 € → dépassement 13 400 € = 1,20 % (< 2 %).
    // Dépassements : Marketing +11 400 (9,5 %), Informatique +12 500 (5,0 %), Juridique +4 800 (16,0 %), Achats +600 (2,4 %).
    // Plus fort en % : Juridique ; plus fort en euros : Informatique. 4 services en dépassement (niveau « 3 ou 4 »).
    expected: { overrun_above_2_percent: false, largest_pct_overrun: 'legal', largest_abs_overrun: 'it', departments_over: 2 },
    fr: {
      name: 'Budget et réalisé',
      description: 'Dépassement relatif ou absolu : deux classements différents.',
      state: {
        fiscal_year: 2025,
        currency: 'EUR',
        notes: ['Exercice clos le 31 décembre 2025.', 'Le réalisé inclut les factures reçues jusqu’au 15 janvier 2026.'],
        departments: depts('fr'),
      },
      questions: {
        overrun_above_2_percent: { type: 'noul', instructions: 'Au total, le réalisé dépasse-t-il le budget de plus de 2 % ?' },
        largest_pct_overrun: {
          type: 'choice',
          instructions: 'Quel service dépasse le plus son budget en pourcentage ?',
          criteria: { marketing: 'Marketing', it: 'Informatique', legal: 'Juridique', purchasing: 'Achats' },
        },
        largest_abs_overrun: {
          type: 'choice',
          instructions: 'Quel service dépasse le plus son budget en euros ?',
          criteria: { marketing: 'Marketing', it: 'Informatique', legal: 'Juridique', purchasing: 'Achats' },
        },
        departments_over: { type: 'score', instructions: 'Nombre de services dont le réalisé dépasse le budget', criteria: ['Aucun', '1 ou 2', '3 ou 4', '5 ou plus'] },
      },
    },
    en: {
      name: 'Budget vs actual',
      description: 'Relative or absolute overrun: two different rankings.',
      state: {
        fiscal_year: 2025,
        currency: 'EUR',
        notes: ['Fiscal year ended December 31, 2025.', 'Actual spending includes invoices received up to January 15, 2026.'],
        departments: depts('en'),
      },
      questions: {
        overrun_above_2_percent: { type: 'noul', instructions: 'Overall, does actual spending exceed the budget by more than 2%?' },
        largest_pct_overrun: {
          type: 'choice',
          instructions: 'Which department exceeds its budget the most in percentage terms?',
          criteria: { marketing: 'Marketing', it: 'IT', legal: 'Legal', purchasing: 'Purchasing' },
        },
        largest_abs_overrun: {
          type: 'choice',
          instructions: 'Which department exceeds its budget the most in euros?',
          criteria: { marketing: 'Marketing', it: 'IT', legal: 'Legal', purchasing: 'Purchasing' },
        },
        departments_over: { type: 'score', instructions: 'Number of departments whose actual spending exceeds the budget', criteria: ['None', '1 or 2', '3 or 4', '5 or more'] },
      },
    },
  },
  {
    id: 'num-weighted-grade',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Moyenne simple : (72 + 81 + 48) / 3 = 67 (> 65). Moyenne pondérée : 72 × 0,2 + 81 × 0,3 + 48 × 0,5 = 14,4 + 24,3 + 24 = 62,7 (< 65).
    // Examen final 48 < 50 : les deux conditions échouent. Note finale minimale : (65 − 38,7) / 0,5 = 52,6 → 53.
    expected: { simple_mean_above_65: true, passes: false, fail_reason: 'both', min_final_score: 'score_53' },
    fr: {
      name: 'Moyenne pondérée',
      description: 'La moyenne simple passe, la moyenne pondérée non.',
      state:
        'Module de statistiques, notes sur 100 de Soren : partiel 72 (coefficient 20 %), projet 81 (coefficient 30 %), examen final 48 (coefficient 50 %). Pour valider le module, il faut à la fois une moyenne pondérée d’au moins 65 et au moins 50 à l’examen final. Les notes sont des nombres entiers.',
      questions: {
        simple_mean_above_65: { type: 'noul', instructions: 'La moyenne simple (non pondérée) des trois notes dépasse-t-elle 65 ?' },
        passes: { type: 'noul', instructions: 'Soren valide-t-il le module ?' },
        fail_reason: {
          type: 'choice',
          instructions: 'Quelle condition de validation n’est pas remplie ?',
          criteria: { weighted_average: 'Seulement la moyenne pondérée', final_minimum: 'Seulement le minimum à l’examen final', both: 'Les deux conditions', none: 'Aucune, le module est validé' },
        },
        min_final_score: {
          type: 'choice',
          instructions: 'Toutes choses égales par ailleurs, quelle note minimale à l’examen final aurait permis de valider le module ?',
          criteria: { score_50: '50', score_53: '53', score_57: '57', score_65: '65' },
        },
      },
    },
    en: {
      name: 'Weighted average',
      description: 'The simple average passes, the weighted average does not.',
      state:
        'Statistics module, Soren’s scores out of 100: midterm 72 (weight 20%), project 81 (weight 30%), final exam 48 (weight 50%). To pass the module, a student needs both a weighted average of at least 65 and at least 50 on the final exam. Scores are whole numbers.',
      questions: {
        simple_mean_above_65: { type: 'noul', instructions: 'Is the simple (unweighted) average of the three scores above 65?' },
        passes: { type: 'noul', instructions: 'Does Soren pass the module?' },
        fail_reason: {
          type: 'choice',
          instructions: 'Which passing condition is not met?',
          criteria: { weighted_average: 'Only the weighted average', final_minimum: 'Only the final exam minimum', both: 'Both conditions', none: 'None, the module is passed' },
        },
        min_final_score: {
          type: 'choice',
          instructions: 'All else being equal, what minimum final exam score would have been enough to pass the module?',
          criteria: { score_50: '50', score_53: '53', score_57: '57', score_65: '65' },
        },
      },
    },
  },
  {
    id: 'num-average-speed',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Tronçon 1 : 45 km à 90 km/h = 30 min ; pause 15 min ; tronçon 2 : 45 km à 30 km/h = 90 min. Total 135 min : 8 h 40 → 10 h 55.
    // Vitesse moyenne de conduite : 90 km / 2 h = 45 km/h (et non 60). Carburant : 90 × 7,5 / 100 = 6,75 L > 6 L.
    expected: { avg_speed_above_50: false, arrival: 't1055', arrives_before_11: true, fuel_enough: false },
    fr: {
      name: 'Vitesse moyenne',
      description: 'La moyenne des vitesses n’est pas la vitesse moyenne.',
      state:
        'Inès part de l’entrepôt à 8 h 40 pour une livraison à 90 km. Les 45 premiers kilomètres se font sur voie rapide à 90 km/h de moyenne. Elle fait ensuite une pause de 15 minutes, puis parcourt les 45 derniers kilomètres en ville, à 30 km/h de moyenne. Sa camionnette consomme 7,5 L aux 100 km et il reste 6 litres dans le réservoir au départ.',
      questions: {
        avg_speed_above_50: { type: 'noul', instructions: 'Sur l’ensemble du trajet, pause exclue, la vitesse moyenne d’Inès dépasse-t-elle 50 km/h ?' },
        arrival: {
          type: 'choice',
          instructions: 'À quelle heure Inès arrive-t-elle ?',
          criteria: { t1025: '10 h 25', t1040: '10 h 40', t1055: '10 h 55', t1110: '11 h 10' },
        },
        arrives_before_11: { type: 'noul', instructions: 'Inès arrive-t-elle avant 11 h ?' },
        fuel_enough: { type: 'noul', instructions: 'Le carburant restant suffit-il pour faire le trajet sans s’arrêter à une station ?' },
      },
    },
    en: {
      name: 'Average speed',
      description: 'The average of the speeds is not the average speed.',
      state:
        'Inès leaves the warehouse at 8:40 am for a delivery 90 km away. The first 45 kilometres are on an expressway at an average of 90 km/h. She then takes a 15-minute break, and covers the last 45 kilometres in town at an average of 30 km/h. Her van uses 7.5 L per 100 km, and there are 6 litres left in the tank when she sets off.',
      questions: {
        avg_speed_above_50: { type: 'noul', instructions: 'Over the whole trip, excluding the break, is Inès’s average speed above 50 km/h?' },
        arrival: {
          type: 'choice',
          instructions: 'What time does Inès arrive?',
          criteria: { t1025: '10:25 am', t1040: '10:40 am', t1055: '10:55 am', t1110: '11:10 am' },
        },
        arrives_before_11: { type: 'noul', instructions: 'Does Inès arrive before 11:00 am?' },
        fuel_enough: { type: 'noul', instructions: 'Is the remaining fuel enough to make the trip without stopping at a fuel station?' },
      },
    },
  },
  {
    id: 'num-timesheet-overtime',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'court',
    // Lundi 9 h 30 − 1 h = 8,5 h ; mardi 9 h 30 − 0 h 45 = 8,75 h ; mercredi 3,5 h ; jeudi 10 h 15 − 1 h = 9,25 h ; vendredi 8 h − 0 h 30 = 7,5 h.
    // Total 37,5 h (< 38 h) ; 2,5 h supplémentaires. Paie : 35 × 18 + 2,5 × 18 × 1,25 = 630 + 56,25 = 686,25 €.
    // Pièges : 675,00 (pas de majoration), 697,50 (majoration à 50 %), 720,00 (40 h).
    expected: { total_above_38h: false, longest_day: 'thursday', weekly_pay: 'eur_686_25' },
    fr: {
      name: 'Feuille de temps',
      description: 'Heures effectives (pauses déduites) et heures supplémentaires majorées.',
      state: {
        employee: 'Yanis Morel',
        week: 'du 9 au 13 mars 2026',
        contract: { weekly_hours: 35, hourly_rate_eur: 18, overtime_premium: 'heures au-delà de 35 h majorées de 25 %' },
        days: [
          { day: 'lundi', start: '08:00', end: '17:30', break_min: 60 },
          { day: 'mardi', start: '08:30', end: '18:00', break_min: 45 },
          { day: 'mercredi', start: '09:00', end: '12:30', break_min: 0 },
          { day: 'jeudi', start: '08:00', end: '18:15', break_min: 60 },
          { day: 'vendredi', start: '08:00', end: '16:00', break_min: 30 },
        ],
      },
      questions: {
        total_above_38h: { type: 'noul', instructions: 'Le temps de travail effectif de la semaine, pauses déduites, dépasse-t-il 38 heures ?' },
        longest_day: {
          type: 'choice',
          instructions: 'Quel jour Yanis a-t-il le plus travaillé, pauses déduites ?',
          criteria: { monday: 'Lundi', tuesday: 'Mardi', thursday: 'Jeudi', friday: 'Vendredi' },
        },
        weekly_pay: {
          type: 'choice',
          instructions: 'Quelle est la rémunération brute de la semaine ?',
          criteria: { eur_675_00: '675,00 €', eur_686_25: '686,25 €', eur_697_50: '697,50 €', eur_720_00: '720,00 €' },
        },
      },
    },
    en: {
      name: 'Timesheet',
      description: 'Actual hours (breaks deducted) and overtime at a premium.',
      state: {
        employee: 'Yanis Morel',
        week: 'March 9 to 13, 2026',
        contract: { weekly_hours: 35, hourly_rate_eur: 18, overtime_premium: 'hours beyond 35 h paid at a 25% premium' },
        days: [
          { day: 'Monday', start: '08:00', end: '17:30', break_min: 60 },
          { day: 'Tuesday', start: '08:30', end: '18:00', break_min: 45 },
          { day: 'Wednesday', start: '09:00', end: '12:30', break_min: 0 },
          { day: 'Thursday', start: '08:00', end: '18:15', break_min: 60 },
          { day: 'Friday', start: '08:00', end: '16:00', break_min: 30 },
        ],
      },
      questions: {
        total_above_38h: { type: 'noul', instructions: 'Does the week’s actual working time, breaks deducted, exceed 38 hours?' },
        longest_day: {
          type: 'choice',
          instructions: 'On which day did Yanis work the most, breaks deducted?',
          criteria: { monday: 'Monday', tuesday: 'Tuesday', thursday: 'Thursday', friday: 'Friday' },
        },
        weekly_pay: {
          type: 'choice',
          instructions: 'What is the gross pay for the week?',
          criteria: { eur_675_00: '€675.00', eur_686_25: '€686.25', eur_697_50: '€697.50', eur_720_00: '€720.00' },
        },
      },
    },
  },
  {
    id: 'num-plan-comparison',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 6 mois : A 6 × 14 = 84 ; B 150 (payé d’avance, non remboursable) ; C 6 × 9 + 60 = 114 → A.
    // 12 mois : A 168 ; B 150 ; C 108 + 60 = 168 → B, et A = C.
    // 24 mois : A 336 ; B 2 × 150 = 300 ; C 216 + 60 = 276 → C.
    expected: { cheapest_6_months: 'plan_a', cheapest_12_months: 'plan_b', cheapest_24_months: 'plan_c', a_equals_c_12_months: true },
    fr: {
      name: 'Comparaison d’abonnements',
      description: 'L’offre la moins chère dépend de la durée.',
      state:
        'Trois offres de stockage en ligne. Offre A : 14 € par mois, sans engagement. Offre B : 150 € par an, payés d’avance pour 12 mois, non remboursables ; renouvelable par période de 12 mois au même prix. Offre C : 9 € par mois, plus des frais de mise en service de 60 € payés une seule fois, sans engagement.',
      questions: {
        cheapest_6_months: {
          type: 'choice',
          instructions: 'Pour un besoin de 6 mois exactement, quelle offre coûte le moins cher ?',
          criteria: { plan_a: 'Offre A', plan_b: 'Offre B', plan_c: 'Offre C' },
        },
        cheapest_12_months: {
          type: 'choice',
          instructions: 'Pour un besoin de 12 mois exactement, quelle offre coûte le moins cher ?',
          criteria: { plan_a: 'Offre A', plan_b: 'Offre B', plan_c: 'Offre C' },
        },
        cheapest_24_months: {
          type: 'choice',
          instructions: 'Pour un besoin de 24 mois exactement, quelle offre coûte le moins cher ?',
          criteria: { plan_a: 'Offre A', plan_b: 'Offre B', plan_c: 'Offre C' },
        },
        a_equals_c_12_months: { type: 'noul', instructions: 'Sur 12 mois, les offres A et C coûtent-elles exactement le même prix ?' },
      },
    },
    en: {
      name: 'Plan comparison',
      description: 'The cheapest plan depends on the duration.',
      state:
        'Three cloud storage plans. Plan A: €14 per month, no commitment. Plan B: €150 per year, paid upfront for 12 months, non-refundable; renewable for further 12-month periods at the same price. Plan C: €9 per month, plus a one-time €60 setup fee, no commitment.',
      questions: {
        cheapest_6_months: {
          type: 'choice',
          instructions: 'For a need of exactly 6 months, which plan is cheapest?',
          criteria: { plan_a: 'Plan A', plan_b: 'Plan B', plan_c: 'Plan C' },
        },
        cheapest_12_months: {
          type: 'choice',
          instructions: 'For a need of exactly 12 months, which plan is cheapest?',
          criteria: { plan_a: 'Plan A', plan_b: 'Plan B', plan_c: 'Plan C' },
        },
        cheapest_24_months: {
          type: 'choice',
          instructions: 'For a need of exactly 24 months, which plan is cheapest?',
          criteria: { plan_a: 'Plan A', plan_b: 'Plan B', plan_c: 'Plan C' },
        },
        a_equals_c_12_months: { type: 'noul', instructions: 'Over 12 months, do plans A and C cost exactly the same?' },
      },
    },
  },
  {
    id: 'num-recipe-scaling',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Facteur 10 / 4 = 2,5. Farine 300 × 2,5 = 750 g > 0,7 kg (700 g) → manque. Lait 2,5 dL × 2,5 = 6,25 dL = 0,625 L ≤ 1 L.
    // Œufs 3 × 2,5 = 7,5 → plus de 7 (8 en arrondissant), 10 disponibles. Beurre 40 × 2,5 = 100 g ≤ 250 g. Seule la farine manque.
    expected: { enough_flour: false, milk_over_half_litre: true, eggs_more_than_7: true, missing: 'flour' },
    fr: {
      name: 'Recette à adapter',
      description: 'Mise à l’échelle avec conversions g/kg et dL/L.',
      state:
        'Recette de crêpes pour 4 personnes : 300 g de farine, 2,5 dL de lait, 3 œufs, 40 g de beurre fondu. Lucie veut en faire pour 10 personnes. Dans ses placards : un paquet de farine entamé contenant 0,7 kg, une bouteille de lait de 1 L pleine, une boîte de 10 œufs et une plaquette de beurre de 250 g.',
      questions: {
        enough_flour: { type: 'noul', instructions: 'Lucie a-t-elle assez de farine pour 10 personnes ?' },
        milk_over_half_litre: { type: 'noul', instructions: 'Pour 10 personnes, faut-il plus d’un demi-litre de lait ?' },
        eggs_more_than_7: { type: 'noul', instructions: 'Pour 10 personnes, faut-il plus de 7 œufs ?' },
        missing: {
          type: 'choice',
          instructions: 'Quel ingrédient manque à Lucie pour 10 personnes ?',
          criteria: { flour: 'La farine', milk: 'Le lait', eggs: 'Les œufs', butter: 'Le beurre', nothing: 'Rien, elle a tout' },
        },
      },
    },
    en: {
      name: 'Scaling a recipe',
      description: 'Scaling with g/kg and dL/L conversions.',
      state:
        'Crêpe recipe for 4 people: 300 g of flour, 2.5 dL of milk, 3 eggs, 40 g of melted butter. Lucie wants to make it for 10 people. In her cupboards: an opened bag of flour containing 0.7 kg, a full 1 L bottle of milk, a box of 10 eggs and a 250 g block of butter.',
      questions: {
        enough_flour: { type: 'noul', instructions: 'Does Lucie have enough flour for 10 people?' },
        milk_over_half_litre: { type: 'noul', instructions: 'For 10 people, is more than half a litre of milk needed?' },
        eggs_more_than_7: { type: 'noul', instructions: 'For 10 people, are more than 7 eggs needed?' },
        missing: {
          type: 'choice',
          instructions: 'Which ingredient is Lucie short of for 10 people?',
          criteria: { flour: 'Flour', milk: 'Milk', eggs: 'Eggs', butter: 'Butter', nothing: 'Nothing, she has everything' },
        },
      },
    },
  },
  {
    id: 'num-meter-readings',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'court',
    // Index cumulés → consommations mensuelles : janvier 430, février 392, mars 366, avril 283, mai 238, juin 213 kWh.
    // Total 14 402 − 12 480 = 1 922 kWh (< 2 000) ; moyenne 320,3 kWh/mois (niveau « 300 à 350 ») ;
    // coût 1 922 × 0,2516 = 483,58 € (> 450 €). Le plus fort index (1er juillet) ne correspond pas au mois le plus consommateur.
    expected: { total_above_2000: false, highest_month: 'january', cost_above_450: true, monthly_average: 2 },
    fr: {
      name: 'Relevés de compteur',
      description: 'Index cumulés : il faut calculer les écarts avant de comparer.',
      state: {
        meter: 'Compteur électrique, logement de la rue des Tilleuls',
        unit: 'kWh',
        price_per_kwh_eur: 0.2516,
        readings: [
          { date: '1er janvier 2026', index: 12480 },
          { date: '1er février 2026', index: 12910 },
          { date: '1er mars 2026', index: 13302 },
          { date: '1er avril 2026', index: 13668 },
          { date: '1er mai 2026', index: 13951 },
          { date: '1er juin 2026', index: 14189 },
          { date: '1er juillet 2026', index: 14402 },
        ],
      },
      questions: {
        total_above_2000: { type: 'noul', instructions: 'La consommation totale de janvier à juin 2026 dépasse-t-elle 2 000 kWh ?' },
        highest_month: {
          type: 'choice',
          instructions: 'Quel mois a été le plus consommateur ?',
          criteria: { january: 'Janvier', march: 'Mars', may: 'Mai', june: 'Juin' },
        },
        cost_above_450: { type: 'noul', instructions: 'Au prix indiqué, le coût de la consommation de janvier à juin dépasse-t-il 450 € ?' },
        monthly_average: {
          type: 'score',
          instructions: 'Consommation mensuelle moyenne de janvier à juin',
          criteria: ['Moins de 250 kWh', '250 à 300 kWh', '300 à 350 kWh', 'Plus de 350 kWh'],
        },
      },
    },
    en: {
      name: 'Meter readings',
      description: 'Cumulative readings: differences must be computed before comparing.',
      state: {
        meter: 'Electricity meter, Linden Street apartment',
        unit: 'kWh',
        price_per_kwh_eur: 0.2516,
        readings: [
          { date: 'January 1, 2026', index: 12480 },
          { date: 'February 1, 2026', index: 12910 },
          { date: 'March 1, 2026', index: 13302 },
          { date: 'April 1, 2026', index: 13668 },
          { date: 'May 1, 2026', index: 13951 },
          { date: 'June 1, 2026', index: 14189 },
          { date: 'July 1, 2026', index: 14402 },
        ],
      },
      questions: {
        total_above_2000: { type: 'noul', instructions: 'Does total consumption from January to June 2026 exceed 2,000 kWh?' },
        highest_month: {
          type: 'choice',
          instructions: 'Which month had the highest consumption?',
          criteria: { january: 'January', march: 'March', may: 'May', june: 'June' },
        },
        cost_above_450: { type: 'noul', instructions: 'At the stated price, does the cost of consumption from January to June exceed €450?' },
        monthly_average: {
          type: 'score',
          instructions: 'Average monthly consumption from January to June',
          criteria: ['Less than 250 kWh', '250 to 300 kWh', '300 to 350 kWh', 'More than 350 kWh'],
        },
      },
    },
  },
  {
    id: 'num-critical-path',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Chemin critique A (5) → C (4) → D (2) = 11 jours ouvrés ; B (3) a 1 jour de marge face à C.
    // Début lundi 2 mars 2026 : jour 10 = vendredi 13 mars, jour 11 = lundi 16 mars → échéance manquée.
    // B à 4 jours : max(4, 4) = 4, fin inchangée. C à 5 jours : 12 jours, fin retardée.
    expected: { total_days: 'days_11', meets_deadline: false, b_delay_shifts_end: false, c_delay_shifts_end: true },
    fr: {
      name: 'Chemin critique',
      description: 'Tâches en parallèle, jours ouvrés, marge d’une tâche.',
      state:
        'Projet de refonte du site de la coopérative Belvent. Équipe disponible du lundi au vendredi, aucun jour férié sur la période. A (analyse) : 5 jours ouvrés, commence le lundi 2 mars 2026. B (développement du back-office) : 3 jours ouvrés, commence quand A est terminée. C (intégration des maquettes) : 4 jours ouvrés, commence aussi quand A est terminée ; B et C sont menées en parallèle par deux personnes différentes. D (recette) : 2 jours ouvrés, commence quand B et C sont toutes deux terminées. Le client attend la livraison au plus tard le vendredi 13 mars 2026 au soir.',
      questions: {
        total_days: {
          type: 'choice',
          instructions: 'Combien de jours ouvrés dure le projet, du début de A à la fin de D ?',
          criteria: { days_9: '9 jours ouvrés', days_10: '10 jours ouvrés', days_11: '11 jours ouvrés', days_14: '14 jours ouvrés' },
        },
        meets_deadline: { type: 'noul', instructions: 'Le projet sera-t-il livré à temps pour l’échéance du client ?' },
        b_delay_shifts_end: { type: 'noul', instructions: 'Si B prenait 4 jours ouvrés au lieu de 3, la date de fin du projet serait-elle retardée ?' },
        c_delay_shifts_end: { type: 'noul', instructions: 'Si C prenait 5 jours ouvrés au lieu de 4, la date de fin du projet serait-elle retardée ?' },
      },
    },
    en: {
      name: 'Critical path',
      description: 'Parallel tasks, working days, slack on one task.',
      state:
        'Website redesign project for the Belvent cooperative. The team works Monday to Friday, with no public holidays in the period. A (analysis): 5 working days, starts on Monday, March 2, 2026. B (back-office development): 3 working days, starts when A is finished. C (mock-up integration): 4 working days, also starts when A is finished; B and C are carried out in parallel by two different people. D (acceptance testing): 2 working days, starts when both B and C are finished. The client expects delivery by the evening of Friday, March 13, 2026 at the latest.',
      questions: {
        total_days: {
          type: 'choice',
          instructions: 'How many working days does the project take, from the start of A to the end of D?',
          criteria: { days_9: '9 working days', days_10: '10 working days', days_11: '11 working days', days_14: '14 working days' },
        },
        meets_deadline: { type: 'noul', instructions: 'Will the project be delivered in time for the client’s deadline?' },
        b_delay_shifts_end: { type: 'noul', instructions: 'If B took 4 working days instead of 3, would the project end date be delayed?' },
        c_delay_shifts_end: { type: 'noul', instructions: 'If C took 5 working days instead of 4, would the project end date be delayed?' },
      },
    },
  },
  {
    id: 'num-quarterly-sales',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'long',
    // Commandes livrées seulement (12 sur 15 ; V-2603 et V-2611 annulées, V-2607 retournée).
    // Par région : Nord 778,80 + 945 + 1 168,20 = 2 892,00 ; Sud 756 + 973,50 + 675 = 2 404,50 ;
    // Est 1 134 + 1 012,50 + 454,30 = 2 600,80 ; Ouest 900 + 1 298 + 378 = 2 576,00 → Nord (sans filtre, Est serait en tête avec 4 547,80).
    // Par mois : janvier 2 434,80 ; février 4 350,50 ; mars 3 688,00 → février.
    // Total livré 10 473,30 € < objectif 10 500 € ; panier moyen 10 473,30 / 12 = 872,775 € (< 900).
    expected: { top_region: 'north', target_reached: false, best_month: 'february', avg_order_above_900: false },
    fr: {
      name: 'Ventes du trimestre',
      description: 'Registre de 15 commandes : agrégations par région et par mois, statuts à filtrer.',
      state: {
        report: 'Ventes de luminaires — premier trimestre 2026',
        notes: [
          'Les montants sont hors taxes. Le chiffre d’affaires d’une commande est égal à quantity × unit_price_eur.',
          'Seules les commandes au statut « livrée » comptent dans le chiffre d’affaires ; les commandes annulées ou retournées en sont exclues.',
          'Objectif du trimestre : 10 500 € de chiffre d’affaires livré, toutes régions confondues.',
          'Le catalogue 2025 affichait la lampe Orion à 59,90 € ; seul le prix indiqué sur chaque commande fait foi.',
        ],
        orders: sales('fr'),
      },
      questions: {
        top_region: {
          type: 'choice',
          instructions: 'Quelle région a réalisé le plus gros chiffre d’affaires livré sur le trimestre ?',
          criteria: { north: 'Nord', south: 'Sud', east: 'Est', west: 'Ouest' },
        },
        target_reached: { type: 'noul', instructions: 'L’objectif de chiffre d’affaires livré du trimestre est-il atteint ?' },
        best_month: {
          type: 'choice',
          instructions: 'Quel mois a généré le plus de chiffre d’affaires livré ?',
          criteria: { january: 'Janvier', february: 'Février', march: 'Mars' },
        },
        avg_order_above_900: { type: 'noul', instructions: 'Le chiffre d’affaires moyen par commande livrée dépasse-t-il 900 € ?' },
      },
    },
    en: {
      name: 'Quarterly sales',
      description: 'Ledger of 15 orders: aggregation by region and by month, statuses to filter.',
      state: {
        report: 'Lighting sales — first quarter of 2026',
        notes: [
          'Amounts exclude tax. An order’s revenue equals quantity × unit_price_eur.',
          'Only orders with the status “delivered” count towards revenue; cancelled or returned orders are excluded.',
          'Quarterly target: €10,500 in delivered revenue, all regions combined.',
          'The 2025 catalogue listed the Orion lamp at €59.90; only the price shown on each order applies.',
        ],
        orders: sales('en'),
      },
      questions: {
        top_region: {
          type: 'choice',
          instructions: 'Which region generated the most delivered revenue over the quarter?',
          criteria: { north: 'North', south: 'South', east: 'East', west: 'West' },
        },
        target_reached: { type: 'noul', instructions: 'Was the quarterly delivered-revenue target reached?' },
        best_month: {
          type: 'choice',
          instructions: 'Which month generated the most delivered revenue?',
          criteria: { january: 'January', february: 'February', march: 'March' },
        },
        avg_order_above_900: { type: 'noul', instructions: 'Is the average revenue per delivered order above €900?' },
      },
    },
  },
  {
    id: 'num-vat-mixed-rates',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Fournitures : 1 440 / 1,20 = 1 200,00 € HT (piège : 1 440 × 0,80 = 1 152). Livres : 316,50 / 1,055 = 300,00 € HT.
    // TVA totale : 240 + 16,50 = 256,50 € (> 250). Total HT : 1 500 € (> 1 480) ; en retirant 20 % et 5,5 % des TTC on trouverait 1 451 € (< 1 480).
    expected: { supplies_ex_vat: 'eur_1200', total_vat_above_250: true, total_ex_vat_above_1480: true },
    fr: {
      name: 'TVA à deux taux',
      description: 'Retrouver le HT à partir du TTC : diviser, pas retrancher le taux.',
      state:
        'Facture de la librairie-papeterie Ombelle pour l’école Jean-Rostand. Fournitures scolaires : 1 440,00 € TTC, TVA à 20 %. Lot de livres : 316,50 € TTC, TVA à 5,5 %. Les montants TTC indiqués incluent déjà la TVA ; aucune remise ne s’applique.',
      questions: {
        supplies_ex_vat: {
          type: 'choice',
          instructions: 'Quel est le montant hors taxes des fournitures scolaires ?',
          criteria: { eur_1152: '1 152,00 €', eur_1200: '1 200,00 €', eur_1420: '1 420,00 €', eur_1728: '1 728,00 €' },
        },
        total_vat_above_250: { type: 'noul', instructions: 'Le montant total de TVA de la facture dépasse-t-il 250 € ?' },
        total_ex_vat_above_1480: { type: 'noul', instructions: 'Le total hors taxes de la facture (fournitures et livres) dépasse-t-il 1 480 € ?' },
      },
    },
    en: {
      name: 'VAT at two rates',
      description: 'Recovering the pre-tax amount from the gross: divide, do not subtract the rate.',
      state:
        'Invoice from the Ombelle bookshop and stationer for Jean-Rostand school. School supplies: €1,440.00 including VAT, at a 20% VAT rate. Batch of books: €316.50 including VAT, at a 5.5% VAT rate. The amounts shown already include VAT; no discount applies.',
      questions: {
        supplies_ex_vat: {
          type: 'choice',
          instructions: 'What is the amount excluding VAT for the school supplies?',
          criteria: { eur_1152: '€1,152.00', eur_1200: '€1,200.00', eur_1420: '€1,420.00', eur_1728: '€1,728.00' },
        },
        total_vat_above_250: { type: 'noul', instructions: 'Does the total VAT on the invoice exceed €250?' },
        total_ex_vat_above_1480: { type: 'noul', instructions: 'Does the invoice total excluding VAT (supplies and books) exceed €1,480?' },
      },
    },
  },
  {
    id: 'num-markup-rate',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Théière : marge 78 − 52 = 26 € ; taux de marque 26 / 78 = 33,3 % (< 35 %) ; taux de marge 26 / 52 = 50 %, le piège.
    // Prix minimal pour 35 % de taux de marque : 52 / (1 − 0,35) = 80,00 € (et non 52 × 1,35 = 70,20 €).
    // Lampe : marge 18 €, taux de marque 18 / 48 = 37,5 % → conforme.
    expected: { teapot_markup_rate: 'pct_33', teapot_compliant: false, teapot_min_price: 'eur_80_00', lamp_compliant: true },
    fr: {
      name: 'Taux de marque',
      description: 'Taux de marque (sur le prix de vente) et taux de marge (sur le coût) à ne pas confondre.',
      state:
        'Boutique Lisière, règle du gérant : chaque article doit dégager un taux de marque d’au moins 35 %, le taux de marque étant la marge divisée par le prix de vente hors taxes. Tous les montants sont hors taxes. Théière en fonte : achetée 52 € au fournisseur, vendue 78 €. Lampe en rotin : achetée 30 €, vendue 48 €.',
      questions: {
        teapot_markup_rate: {
          type: 'choice',
          instructions: 'Quel est le taux de marque de la théière ?',
          criteria: { pct_26: '26 %', pct_33: '33,3 %', pct_50: '50 %', pct_67: '66,7 %' },
        },
        teapot_compliant: { type: 'noul', instructions: 'La théière respecte-t-elle la règle du gérant ?' },
        teapot_min_price: {
          type: 'choice',
          instructions: 'Quel est le prix de vente hors taxes minimal de la théière pour respecter la règle ?',
          criteria: { eur_70_20: '70,20 €', eur_78_00: '78,00 €', eur_80_00: '80,00 €', eur_87_00: '87,00 €' },
        },
        lamp_compliant: { type: 'noul', instructions: 'La lampe en rotin respecte-t-elle la règle du gérant ?' },
      },
    },
    en: {
      name: 'Margin on selling price',
      description: 'Margin rate on the selling price versus markup on cost, not to be confused.',
      state:
        'Lisière shop, the manager’s rule: every item must earn a margin of at least 35% of its selling price, the margin rate being the profit divided by the selling price excluding VAT. All amounts exclude VAT. Cast-iron teapot: bought for €52 from the supplier, sold for €78. Rattan lamp: bought for €30, sold for €48.',
      questions: {
        teapot_markup_rate: {
          type: 'choice',
          instructions: 'What is the teapot’s margin rate, as defined by the manager’s rule?',
          criteria: { pct_26: '26%', pct_33: '33.3%', pct_50: '50%', pct_67: '66.7%' },
        },
        teapot_compliant: { type: 'noul', instructions: 'Does the teapot comply with the manager’s rule?' },
        teapot_min_price: {
          type: 'choice',
          instructions: 'What is the minimum selling price excluding VAT for the teapot to comply with the rule?',
          criteria: { eur_70_20: '€70.20', eur_78_00: '€78.00', eur_80_00: '€80.00', eur_87_00: '€87.00' },
        },
        lamp_compliant: { type: 'noul', instructions: 'Does the rattan lamp comply with the manager’s rule?' },
      },
    },
  },
  {
    id: 'num-percentage-points',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Taux : 2,4 % → 3,0 %, soit +0,6 point de pourcentage et +25 % en relatif (0,6 / 2,4).
    // Commandes : mars 18 000 × 2,4 % = 432 ; avril 15 000 × 3 % = 450 → hausse malgré la baisse des visites.
    // « Le taux a augmenté de 0,6 % » est faux : c’est 0,6 point, soit 25 %.
    expected: { increase_in_points: 'p0_6', relative_increase_above_20: true, orders_fell: false, claim_correct: false },
    fr: {
      name: 'Points de pourcentage',
      description: 'Variation absolue en points contre variation relative en pourcentage.',
      state:
        'Boutique en ligne Ardoise. Mars 2026 : 18 000 visites, taux de conversion de 2,4 % (part des visites qui aboutissent à une commande). Avril 2026 : 15 000 visites, taux de conversion de 3,0 %. Dans son rapport, le directeur commercial écrit : « En avril, notre taux de conversion a augmenté de 0,6 %. »',
      questions: {
        increase_in_points: {
          type: 'choice',
          instructions: 'De combien de points de pourcentage le taux de conversion a-t-il augmenté entre mars et avril ?',
          criteria: { p0_6: '0,6 point', p1_25: '1,25 point', p6: '6 points', p25: '25 points' },
        },
        relative_increase_above_20: { type: 'noul', instructions: 'En valeur relative, le taux de conversion a-t-il augmenté de plus de 20 % ?' },
        orders_fell: { type: 'noul', instructions: 'Le nombre de commandes a-t-il baissé en avril par rapport à mars ?' },
        claim_correct: { type: 'noul', instructions: 'La phrase du directeur commercial décrit-elle correctement l’évolution du taux de conversion ?' },
      },
    },
    en: {
      name: 'Percentage points',
      description: 'Absolute change in points versus relative change in percent.',
      state:
        'Ardoise online shop. March 2026: 18,000 visits, conversion rate of 2.4% (share of visits that lead to an order). April 2026: 15,000 visits, conversion rate of 3.0%. In his report, the sales director writes: “In April, our conversion rate increased by 0.6%.”',
      questions: {
        increase_in_points: {
          type: 'choice',
          instructions: 'By how many percentage points did the conversion rate increase between March and April?',
          criteria: { p0_6: '0.6 points', p1_25: '1.25 points', p6: '6 points', p25: '25 points' },
        },
        relative_increase_above_20: { type: 'noul', instructions: 'In relative terms, did the conversion rate increase by more than 20%?' },
        orders_fell: { type: 'noul', instructions: 'Did the number of orders fall in April compared with March?' },
        claim_correct: { type: 'noul', instructions: 'Does the sales director’s sentence correctly describe the change in the conversion rate?' },
      },
    },
  },
  {
    id: 'num-compound-interest',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // A (composés 4 %) : 10 000 × 1,04⁶ = 12 653,19 € ; B (simples 4,6 %) : 10 000 × (1 + 6 × 0,046) = 12 760 € → B l’emporte sur 6 ans.
    // Intérêts de A sur 6 ans : 2 653,19 € (> 2 600 ; en intérêts simples à 4 % on trouverait 2 400).
    // A sur 18 ans : 1,04¹⁸ = 2,026 → 20 258 €, le capital a doublé. Seuil de 13 000 € : 1,04⁶ = 1,2653, 1,04⁷ = 1,3159 → 7 ans
    // (en intérêts simples à 4 %, on trouverait 8 ans).
    expected: { better_offer_6y: 'offer_b', interest_a_above_2600: true, doubled_after_18y: true, years_to_13000: 'years_7' },
    fr: {
      name: 'Intérêts composés',
      description: 'Intérêts composés contre intérêts simples à taux plus élevé.',
      state:
        'Nadia place 10 000 €. Offre A : 4 % par an, intérêts composés (les intérêts de chaque année sont ajoutés au capital à la fin de l’année). Offre B : 4,6 % par an en intérêts simples (calculés chaque année sur les 10 000 € de départ uniquement). Aucun frais, aucun impôt, aucun retrait ; les intérêts ne sont versés qu’en fin d’année.',
      questions: {
        better_offer_6y: {
          type: 'choice',
          instructions: 'Au bout de 6 ans, quelle offre donne le capital le plus élevé ?',
          criteria: { offer_a: 'L’offre A', offer_b: 'L’offre B', equal: 'Les deux donnent le même capital' },
        },
        interest_a_above_2600: { type: 'noul', instructions: 'Avec l’offre A, les intérêts cumulés au bout de 6 ans dépassent-ils 2 600 € ?' },
        doubled_after_18y: { type: 'noul', instructions: 'Avec l’offre A, le capital aura-t-il au moins doublé au bout de 18 ans ?' },
        years_to_13000: {
          type: 'choice',
          instructions: 'Avec l’offre A, au bout de combien d’années pleines le capital dépasse-t-il 13 000 € pour la première fois ?',
          criteria: { years_6: '6 ans', years_7: '7 ans', years_8: '8 ans', years_9: '9 ans' },
        },
      },
    },
    en: {
      name: 'Compound interest',
      description: 'Compound interest versus simple interest at a higher rate.',
      state:
        'Nadia invests €10,000. Offer A: 4% per year, compound interest (each year’s interest is added to the capital at the end of the year). Offer B: 4.6% per year, simple interest (calculated each year on the initial €10,000 only). No fees, no tax, no withdrawals; interest is only paid at year end.',
      questions: {
        better_offer_6y: {
          type: 'choice',
          instructions: 'After 6 years, which offer gives the higher capital?',
          criteria: { offer_a: 'Offer A', offer_b: 'Offer B', equal: 'Both give the same capital' },
        },
        interest_a_above_2600: { type: 'noul', instructions: 'With offer A, does the cumulative interest after 6 years exceed €2,600?' },
        doubled_after_18y: { type: 'noul', instructions: 'With offer A, will the capital have at least doubled after 18 years?' },
        years_to_13000: {
          type: 'choice',
          instructions: 'With offer A, after how many full years does the capital first exceed €13,000?',
          criteria: { years_6: '6 years', years_7: '7 years', years_8: '8 years', years_9: '9 years' },
        },
      },
    },
  },
  {
    id: 'num-flatshare-split',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Loyer au prorata des chambres (16 + 12 + 12 = 40 m²) : Inès 540, Paolo 405, Yuki 405 ; charges 150 / 3 = 50 chacun.
    // Parts : Inès 590, Paolo 455, Yuki 455. Déjà payé : Inès 36, Paolo 114, Yuki 1 350.
    // Inès doit 590 − 36 = 554 € à Yuki (> 500 ; à parts égales on trouverait 464) ; Paolo 455 − 114 = 341 € ; Yuki récupère 895 € (< 1 000).
    expected: { ines_share: 'eur_590', ines_owes_above_500: true, paolo_transfer: 'eur_341', yuki_gets_above_1000: false },
    fr: {
      name: 'Partage de frais en colocation',
      description: 'Loyer au prorata des surfaces, charges à parts égales, avances à déduire.',
      state:
        'Colocation de la rue Pasteur, mois d’avril. Règle écrite dans le bail interne : le loyer de 1 350 € est réparti au prorata de la surface de chaque chambre (Inès 16 m², Paolo 12 m², Yuki 12 m²) ; les charges communes sont partagées à parts égales. Charges du mois : internet 36 €, électricité 114 €. Ce mois-ci, Yuki a payé tout le loyer au propriétaire, Inès a payé internet et Paolo l’électricité. Chacun rembourse ce qu’il doit directement à Yuki.',
      questions: {
        ines_share: {
          type: 'choice',
          instructions: 'Quelle est la part totale d’Inès (loyer et charges) pour le mois ?',
          criteria: { eur_500: '500 €', eur_540: '540 €', eur_554: '554 €', eur_590: '590 €' },
        },
        ines_owes_above_500: { type: 'noul', instructions: 'Inès doit-elle virer plus de 500 € à Yuki ?' },
        paolo_transfer: {
          type: 'choice',
          instructions: 'Combien Paolo doit-il virer à Yuki ?',
          criteria: { eur_341: '341 €', eur_386: '386 €', eur_405: '405 €', eur_455: '455 €' },
        },
        yuki_gets_above_1000: { type: 'noul', instructions: 'Au total, Yuki doit-elle récupérer plus de 1 000 € auprès de ses colocataires ?' },
      },
    },
    en: {
      name: 'Splitting flatshare costs',
      description: 'Rent pro rata to room size, bills split equally, advances to deduct.',
      state:
        'Flatshare on Pasteur Street, month of April. Rule written in the house agreement: the €1,350 rent is split in proportion to the size of each bedroom (Inès 16 m², Paolo 12 m², Yuki 12 m²); shared bills are split equally. This month’s bills: internet €36, electricity €114. This month, Yuki paid the whole rent to the landlord, Inès paid the internet and Paolo paid the electricity. Everyone pays back what they owe directly to Yuki.',
      questions: {
        ines_share: {
          type: 'choice',
          instructions: 'What is Inès’s total share (rent and bills) for the month?',
          criteria: { eur_500: '€500', eur_540: '€540', eur_554: '€554', eur_590: '€590' },
        },
        ines_owes_above_500: { type: 'noul', instructions: 'Does Inès have to transfer more than €500 to Yuki?' },
        paolo_transfer: {
          type: 'choice',
          instructions: 'How much does Paolo have to transfer to Yuki?',
          criteria: { eur_341: '€341', eur_386: '€386', eur_405: '€405', eur_455: '€455' },
        },
        yuki_gets_above_1000: { type: 'noul', instructions: 'In total, does Yuki get back more than €1,000 from her flatmates?' },
      },
    },
  },
  {
    id: 'num-unit-conversions',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // Drone : 22 m/s × 3,6 = 79,2 km/h (< 90). Écran : 32 × 2,54 = 81,28 cm (> 80). Sirop : 2,5 mL × 3 = 7,5 mL/jour ; 0,15 L = 150 mL → 20 jours.
    expected: { drone_above_90: false, screen_above_80cm: true, syrup_days: 'days_20' },
    fr: {
      name: 'Conversions d’unités',
      description: 'm/s en km/h, pouces en centimètres, litres en millilitres.',
      state:
        'Trois vérifications rapides. Un drone de livraison vole à 22 m/s ; la limite fixée par l’opérateur est de 90 km/h. Un écran est annoncé avec une diagonale de 32 pouces (1 pouce = 2,54 cm). Un flacon de sirop contient 0,15 L ; la posologie est de 2,5 mL trois fois par jour.',
      questions: {
        drone_above_90: { type: 'noul', instructions: 'Le drone vole-t-il au-dessus de la limite de 90 km/h ?' },
        screen_above_80cm: { type: 'noul', instructions: 'La diagonale de l’écran dépasse-t-elle 80 cm ?' },
        syrup_days: {
          type: 'choice',
          instructions: 'Combien de jours complets de traitement le flacon de sirop permet-il ?',
          criteria: { days_2: '2 jours', days_6: '6 jours', days_20: '20 jours', days_60: '60 jours' },
        },
      },
    },
    en: {
      name: 'Unit conversions',
      description: 'm/s to km/h, inches to centimetres, litres to millilitres.',
      state:
        'Three quick checks. A delivery drone flies at 22 m/s; the operator’s limit is 90 km/h. A screen is advertised with a 32-inch diagonal (1 inch = 2.54 cm). A bottle of syrup contains 0.15 L; the dosage is 2.5 mL three times a day.',
      questions: {
        drone_above_90: { type: 'noul', instructions: 'Is the drone flying above the 90 km/h limit?' },
        screen_above_80cm: { type: 'noul', instructions: 'Does the screen’s diagonal exceed 80 cm?' },
        syrup_days: {
          type: 'choice',
          instructions: 'How many full days of treatment does the bottle of syrup provide?',
          criteria: { days_2: '2 days', days_6: '6 days', days_20: '20 days', days_60: '60 days' },
        },
      },
    },
  },
  {
    id: 'num-appliance-energy',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'court',
    // kWh par jour = puissance (W) × heures / 1 000 : radiateur 8, chauffe-eau 7,2, réfrigérateur 3,6, téléviseur 0,6, box 0,288.
    // Le chauffe-eau est le plus puissant, mais le radiateur consomme le plus. Total 19,688 kWh/jour × 30 = 590,64 kWh,
    // soit 147,66 € (< 150). Radiateur à 3 h au lieu de 4 : 2 kWh/jour × 30 × 0,25 = 15 €.
    expected: { top_consumer: 'heater', fridge_above_3kwh: true, monthly_cost_above_150: false, heater_saving: 'eur_15' },
    fr: {
      name: 'Consommation des appareils',
      description: 'Puissance × durée : l’appareil le plus puissant n’est pas le plus gourmand.',
      state: {
        housing: 'Studio de la rue Mercière',
        price_per_kwh_eur: 0.25,
        period: '30 jours, usage identique chaque jour',
        appliances: [
          { name: 'Radiateur électrique', power_w: 2000, hours_per_day: 4 },
          { name: 'Chauffe-eau', power_w: 2400, hours_per_day: 3 },
          { name: 'Réfrigérateur', power_w: 150, hours_per_day: 24 },
          { name: 'Téléviseur', power_w: 120, hours_per_day: 5 },
          { name: 'Box internet', power_w: 12, hours_per_day: 24 },
        ],
      },
      questions: {
        top_consumer: {
          type: 'choice',
          instructions: 'Quel appareil consomme le plus d’énergie sur une journée ?',
          criteria: { heater: 'Le radiateur électrique', water_heater: 'Le chauffe-eau', fridge: 'Le réfrigérateur', router: 'La box internet' },
        },
        fridge_above_3kwh: { type: 'noul', instructions: 'Le réfrigérateur consomme-t-il plus de 3 kWh par jour ?' },
        monthly_cost_above_150: { type: 'noul', instructions: 'Le coût de l’électricité de ces appareils sur les 30 jours dépasse-t-il 150 € ?' },
        heater_saving: {
          type: 'choice',
          instructions: 'Combien économiserait-on sur les 30 jours en faisant fonctionner le radiateur 3 heures par jour au lieu de 4 ?',
          criteria: { eur_0_50: '0,50 €', eur_15: '15 €', eur_60: '60 €', eur_150: '150 €' },
        },
      },
    },
    en: {
      name: 'Appliance consumption',
      description: 'Power × time: the most powerful appliance is not the hungriest.',
      state: {
        housing: 'Studio flat on Mercière Street',
        price_per_kwh_eur: 0.25,
        period: '30 days, same usage every day',
        appliances: [
          { name: 'Electric heater', power_w: 2000, hours_per_day: 4 },
          { name: 'Water heater', power_w: 2400, hours_per_day: 3 },
          { name: 'Fridge', power_w: 150, hours_per_day: 24 },
          { name: 'Television', power_w: 120, hours_per_day: 5 },
          { name: 'Internet router', power_w: 12, hours_per_day: 24 },
        ],
      },
      questions: {
        top_consumer: {
          type: 'choice',
          instructions: 'Which appliance uses the most energy in a day?',
          criteria: { heater: 'The electric heater', water_heater: 'The water heater', fridge: 'The fridge', router: 'The internet router' },
        },
        fridge_above_3kwh: { type: 'noul', instructions: 'Does the fridge use more than 3 kWh per day?' },
        monthly_cost_above_150: { type: 'noul', instructions: 'Does the electricity cost of these appliances over the 30 days exceed €150?' },
        heater_saving: {
          type: 'choice',
          instructions: 'How much would be saved over the 30 days by running the heater 3 hours a day instead of 4?',
          criteria: { eur_0_50: '€0.50', eur_15: '€15', eur_60: '€60', eur_150: '€150' },
        },
      },
    },
  },
  {
    id: 'num-invoice-check',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Ligne 2 : 3 × 68,90 = 206,70 €, facturée 260,70 € (chiffres inversés) ; toutes les autres lignes sont justes.
    // Sous-total facturé 661,55 € → correct 607,55 € ; après remise de 5 % : 577,17 € HT (> 550) ; TTC correct 577,17 + 115,43 = 692,60 € (< 700).
    // Trop-perçu TTC : 54 × 0,95 × 1,20 = 61,56 € (54 € avant remise et TVA, 51,30 € HT après remise, 64,80 € sans la remise).
    expected: { wrong_line: 'line_2', correct_net_above_550: true, correct_total_above_700: false, overcharge: 'eur_61_56' },
    fr: {
      name: 'Facture à vérifier',
      description: 'Une ligne mal multipliée, puis remise et TVA à répercuter sur l’écart.',
      state: {
        invoice: 'Facture FA-8812 — Bureautique Vasseur',
        notes: ['Prix unitaires et totaux de ligne hors taxes.', 'Remise commerciale de 5 % sur le sous-total HT, puis TVA à 20 % sur le montant remisé.'],
        lines: [
          { line: 1, item: 'Ramette papier A4', quantity: 20, unit_price_eur: 4.35, line_total_eur: 87.0 },
          { line: 2, item: 'Cartouche de toner', quantity: 3, unit_price_eur: 68.9, line_total_eur: 260.7 },
          { line: 3, item: 'Classeur à levier', quantity: 45, unit_price_eur: 2.15, line_total_eur: 96.75 },
          { line: 4, item: 'Boîte de stylos', quantity: 12, unit_price_eur: 7.8, line_total_eur: 93.6 },
          { line: 5, item: 'Agrafeuse', quantity: 4, unit_price_eur: 16.25, line_total_eur: 65.0 },
          { line: 6, item: 'Bloc de notes adhésives', quantity: 30, unit_price_eur: 1.95, line_total_eur: 58.5 },
        ],
        subtotal_eur: 661.55,
        discount_eur: 33.08,
        net_eur: 628.47,
        vat_eur: 125.69,
        total_eur: 754.16,
      },
      questions: {
        wrong_line: {
          type: 'choice',
          instructions: 'Quelle ligne de la facture comporte un total erroné ?',
          criteria: { line_1: 'Ligne 1', line_2: 'Ligne 2', line_3: 'Ligne 3', line_4: 'Ligne 4', line_6: 'Ligne 6' },
        },
        correct_net_above_550: { type: 'noul', instructions: 'Une fois l’erreur corrigée, le montant HT après remise dépasse-t-il 550 € ?' },
        correct_total_above_700: { type: 'noul', instructions: 'Une fois l’erreur corrigée, le total TTC dépasse-t-il 700 € ?' },
        overcharge: {
          type: 'choice',
          instructions: 'De combien le total TTC facturé dépasse-t-il le total TTC correct ?',
          criteria: { eur_51_30: '51,30 €', eur_54_00: '54,00 €', eur_61_56: '61,56 €', eur_64_80: '64,80 €' },
        },
      },
    },
    en: {
      name: 'Invoice to check',
      description: 'One line multiplied wrong, then discount and VAT to carry over to the difference.',
      state: {
        invoice: 'Invoice FA-8812 — Vasseur Office Supplies',
        notes: ['Unit prices and line totals exclude VAT.', '5% trade discount on the subtotal excluding VAT, then 20% VAT on the discounted amount.'],
        lines: [
          { line: 1, item: 'Ream of A4 paper', quantity: 20, unit_price_eur: 4.35, line_total_eur: 87.0 },
          { line: 2, item: 'Toner cartridge', quantity: 3, unit_price_eur: 68.9, line_total_eur: 260.7 },
          { line: 3, item: 'Lever arch file', quantity: 45, unit_price_eur: 2.15, line_total_eur: 96.75 },
          { line: 4, item: 'Box of pens', quantity: 12, unit_price_eur: 7.8, line_total_eur: 93.6 },
          { line: 5, item: 'Stapler', quantity: 4, unit_price_eur: 16.25, line_total_eur: 65.0 },
          { line: 6, item: 'Sticky note pad', quantity: 30, unit_price_eur: 1.95, line_total_eur: 58.5 },
        ],
        subtotal_eur: 661.55,
        discount_eur: 33.08,
        net_eur: 628.47,
        vat_eur: 125.69,
        total_eur: 754.16,
      },
      questions: {
        wrong_line: {
          type: 'choice',
          instructions: 'Which invoice line has an incorrect total?',
          criteria: { line_1: 'Line 1', line_2: 'Line 2', line_3: 'Line 3', line_4: 'Line 4', line_6: 'Line 6' },
        },
        correct_net_above_550: { type: 'noul', instructions: 'Once the error is corrected, does the amount excluding VAT after discount exceed €550?' },
        correct_total_above_700: { type: 'noul', instructions: 'Once the error is corrected, does the total including VAT exceed €700?' },
        overcharge: {
          type: 'choice',
          instructions: 'By how much does the invoiced total including VAT exceed the correct total including VAT?',
          criteria: { eur_51_30: '€51.30', eur_54_00: '€54.00', eur_61_56: '€61.56', eur_64_80: '€64.80' },
        },
      },
    },
  },
  {
    id: 'num-stock-movements',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Stocks au 1er avril : A-100 240, B-200 85, C-300 60, D-400 130. Réceptions et retours ajoutent, expéditions et rebuts retirent.
    // Fin de mois : A-100 87, B-200 85 − 25 + 4 − 40 + 50 − 3 = 71, C-300 8, D-400 46. Seul C-300 est sous son seuil (8 < 40).
    // Distracteurs B-200 : 63 (retour compté en sortie), 74 (rebut oublié), 77 (rebut ajouté).
    // C-300 tombe à −10 le 3 avril (expédition de 70 avant la réception du 7). Expéditions : 60 + 25 + 70 + 45 + 75 + 40 + 38 + 90 + 25 + 48 = 516 (< 550).
    expected: { b200_final: 'units_71', below_threshold: 'c300', went_negative: true, shipped_above_550: false },
    fr: {
      name: 'Mouvements de stock',
      description: 'Rejouer 18 mouvements de quatre types, dans l’ordre, à partir du stock initial.',
      state: {
        warehouse: 'Entrepôt de Saint-Priest — avril 2026',
        opening_stock: { 'A-100': 240, 'B-200': 85, 'C-300': 60, 'D-400': 130 },
        reorder_threshold: { 'A-100': 80, 'B-200': 60, 'C-300': 40, 'D-400': 40 },
        notes: ['Les mouvements sont listés dans l’ordre chronologique.', 'Un retour client remis en stock augmente le stock ; une mise au rebut le diminue.'],
        movements: moves('fr'),
      },
      questions: {
        b200_final: {
          type: 'choice',
          instructions: 'Quel est le stock de B-200 à la fin du mois ?',
          criteria: { units_63: '63', units_71: '71', units_74: '74', units_77: '77' },
        },
        below_threshold: {
          type: 'choice',
          instructions: 'Quelle référence termine le mois sous son seuil de réapprovisionnement ?',
          criteria: { a100: 'A-100', b200: 'B-200', c300: 'C-300', d400: 'D-400' },
        },
        went_negative: { type: 'noul', instructions: 'Le stock d’une référence est-il passé sous zéro à un moment du mois ?' },
        shipped_above_550: { type: 'noul', instructions: 'Le total des unités expédiées aux clients sur le mois dépasse-t-il 550 ?' },
      },
    },
    en: {
      name: 'Stock movements',
      description: 'Replaying 18 movements of four kinds, in order, from the opening stock.',
      state: {
        warehouse: 'Saint-Priest warehouse — April 2026',
        opening_stock: { 'A-100': 240, 'B-200': 85, 'C-300': 60, 'D-400': 130 },
        reorder_threshold: { 'A-100': 80, 'B-200': 60, 'C-300': 40, 'D-400': 40 },
        notes: ['Movements are listed in chronological order.', 'A customer return put back in stock increases the stock; a scrapped item decreases it.'],
        movements: moves('en'),
      },
      questions: {
        b200_final: {
          type: 'choice',
          instructions: 'What is the stock of B-200 at the end of the month?',
          criteria: { units_63: '63', units_71: '71', units_74: '74', units_77: '77' },
        },
        below_threshold: {
          type: 'choice',
          instructions: 'Which item ends the month below its reorder threshold?',
          criteria: { a100: 'A-100', b200: 'B-200', c300: 'C-300', d400: 'D-400' },
        },
        went_negative: { type: 'noul', instructions: 'Did any item’s stock fall below zero at some point during the month?' },
        shipped_above_550: { type: 'noul', instructions: 'Does the total number of units shipped to customers over the month exceed 550?' },
      },
    },
  },
  {
    id: 'num-cooking-yield',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 18 kg × (1 − 0,40) = 10,8 kg paré ; × (1 − 0,15) = 9,18 kg cuit ; / 0,12 kg = 76,5 → 76 portions (< 80).
    // Pertes additionnées à tort (55 %) : 67 portions ; cuisson oubliée : 90. Pour 80 portions : 9,6 / 0,85 / 0,6 = 18,82 kg → 19 kg.
    // Coût matière : 18 × 24 = 432 € / 76 portions = 5,68 € (> 5,50).
    expected: { portions: 'p76', enough_for_80: false, kg_for_80: 'kg_19', cost_per_portion_above_5_50: true },
    fr: {
      name: 'Rendement et pertes',
      description: 'Deux pertes successives à enchaîner, pas à additionner.',
      state:
        'Le traiteur Maison Ilda prépare du saumon pour un banquet. Il dispose de 18 kg de saumon entier acheté 24 € le kilo. Le parage (tête, arêtes, peau) fait perdre 40 % du poids entier ; la cuisson fait ensuite perdre 15 % du poids paré. Chaque portion servie pèse 120 g de saumon cuit ; seules les portions complètes sont servies.',
      questions: {
        portions: {
          type: 'choice',
          instructions: 'Combien de portions complètes le traiteur peut-il servir avec ses 18 kg ?',
          criteria: { p67: '67', p76: '76', p85: '85', p90: '90' },
        },
        enough_for_80: { type: 'noul', instructions: 'Les 18 kg suffisent-ils pour servir 80 portions ?' },
        kg_for_80: {
          type: 'choice',
          instructions: 'Combien de kilos entiers de saumon faut-il au minimum pour servir 80 portions ?',
          criteria: { kg_16: '16 kg', kg_19: '19 kg', kg_22: '22 kg', kg_24: '24 kg' },
        },
        cost_per_portion_above_5_50: { type: 'noul', instructions: 'Avec les 18 kg, le coût du saumon par portion servie dépasse-t-il 5,50 € ?' },
      },
    },
    en: {
      name: 'Yield and losses',
      description: 'Two successive losses to chain, not to add up.',
      state:
        'The caterer Maison Ilda is preparing salmon for a banquet. They have 18 kg of whole salmon bought at €24 per kilo. Trimming (head, bones, skin) loses 40% of the whole weight; cooking then loses 15% of the trimmed weight. Each portion served weighs 120 g of cooked salmon; only full portions are served.',
      questions: {
        portions: {
          type: 'choice',
          instructions: 'How many full portions can the caterer serve with the 18 kg?',
          criteria: { p67: '67', p76: '76', p85: '85', p90: '90' },
        },
        enough_for_80: { type: 'noul', instructions: 'Are the 18 kg enough to serve 80 portions?' },
        kg_for_80: {
          type: 'choice',
          instructions: 'What is the minimum whole number of kilos of salmon needed to serve 80 portions?',
          criteria: { kg_16: '16 kg', kg_19: '19 kg', kg_22: '22 kg', kg_24: '24 kg' },
        },
        cost_per_portion_above_5_50: { type: 'noul', instructions: 'With the 18 kg, does the cost of salmon per portion served exceed €5.50?' },
      },
    },
  },
  {
    id: 'num-magnitude-estimates',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Téléchargement : 3,2 × 10⁹ × 8 = 25,6 Gbit / 40 Mbit/s = 640 s = 10 min 40 s (> 10 min ; oublier les bits donne 80 s).
    // 1 000 000 s / 86 400 = 11,6 jours (< 14). Fuite : 86 400 × 365 / 20 mL = 1 576,8 L (> 1 000). Pile : 10⁶ × 0,1 mm = 100 m (< 330 m).
    expected: { download_over_10min: true, million_seconds_over_2_weeks: false, leak_over_1000l: true, stack_taller_than_tower: false },
    fr: {
      name: 'Ordres de grandeur',
      description: 'Quatre estimations « plus ou moins » qui exigent une conversion d’unité.',
      state:
        'Quatre questions de culture numérique posées lors d’un quiz d’entreprise. Conventions : 1 Go = 1 000 000 000 octets, 1 octet = 8 bits, 1 Mbit = 1 000 000 bits ; une année compte 365 jours ; la tour Eiffel mesure 330 m.',
      questions: {
        download_over_10min: { type: 'noul', instructions: 'Télécharger un fichier de 3,2 Go à un débit constant de 40 Mbit/s prend-il plus de 10 minutes ?' },
        million_seconds_over_2_weeks: { type: 'noul', instructions: 'Un million de secondes représentent-elles plus de deux semaines ?' },
        leak_over_1000l: { type: 'noul', instructions: 'Un robinet qui fuit d’une goutte par seconde, à raison de 20 gouttes par millilitre, perd-il plus de 1 000 litres en un an ?' },
        stack_taller_than_tower: { type: 'noul', instructions: 'Une pile d’un million de feuilles de papier de 0,1 mm d’épaisseur serait-elle plus haute que la tour Eiffel ?' },
      },
    },
    en: {
      name: 'Orders of magnitude',
      description: 'Four “more or less” estimates that need a unit conversion.',
      state:
        'Four numeracy questions from a company quiz. Conventions: 1 GB = 1,000,000,000 bytes, 1 byte = 8 bits, 1 Mbit = 1,000,000 bits; a year has 365 days; the Eiffel Tower is 330 m tall.',
      questions: {
        download_over_10min: { type: 'noul', instructions: 'Does downloading a 3.2 GB file at a constant 40 Mbit/s take more than 10 minutes?' },
        million_seconds_over_2_weeks: { type: 'noul', instructions: 'Is one million seconds more than two weeks?' },
        leak_over_1000l: { type: 'noul', instructions: 'Does a tap leaking one drop per second, at 20 drops per millilitre, lose more than 1,000 litres in a year?' },
        stack_taller_than_tower: { type: 'noul', instructions: 'Would a stack of one million sheets of paper, each 0.1 mm thick, be taller than the Eiffel Tower?' },
      },
    },
  },
  {
    id: 'num-car-rental-offers',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 5 jours, 760 km : A 5 × 45 = 225 € ; B 5 × 29 + 760 × 0,18 = 281,80 € ; C 199 € (760 ≤ 1 000 km) → C.
    // 5 jours, 400 km : B 145 + 72 = 217 € < A 225 €. 7 jours, 1 400 km : A 315 € ; B 203 + 252 = 455 € ; C 199 + 400 × 0,30 = 319 € → A.
    expected: { cheapest_trip: 'offer_c', b_above_a: true, b_cheaper_at_400km: true, cheapest_long_trip: 'offer_a' },
    fr: {
      name: 'Comparaison d’offres de location',
      description: 'Trois tarifications différentes ; la meilleure offre change avec le kilométrage.',
      state:
        'Location d’une voiture compacte, carburant non compris. Offre A : 45 € par jour, kilométrage illimité. Offre B : 29 € par jour plus 0,18 € par kilomètre parcouru. Offre C : forfait de 199 € pour une location de 1 à 7 jours, 1 000 km inclus, puis 0,30 € par kilomètre au-delà. Le premier voyage prévu dure 5 jours pour 760 km.',
      questions: {
        cheapest_trip: {
          type: 'choice',
          instructions: 'Pour le voyage de 5 jours et 760 km, quelle offre est la moins chère ?',
          criteria: { offer_a: 'L’offre A', offer_b: 'L’offre B', offer_c: 'L’offre C' },
        },
        b_above_a: { type: 'noul', instructions: 'Pour ce voyage de 5 jours et 760 km, l’offre B coûte-t-elle plus cher que l’offre A ?' },
        b_cheaper_at_400km: { type: 'noul', instructions: 'Pour 5 jours et seulement 400 km, l’offre B serait-elle moins chère que l’offre A ?' },
        cheapest_long_trip: {
          type: 'choice',
          instructions: 'Pour un autre voyage de 7 jours et 1 400 km, quelle offre est la moins chère ?',
          criteria: { offer_a: 'L’offre A', offer_b: 'L’offre B', offer_c: 'L’offre C' },
        },
      },
    },
    en: {
      name: 'Comparing rental offers',
      description: 'Three pricing schemes; the best offer changes with the mileage.',
      state:
        'Rental of a compact car, fuel not included. Offer A: €45 per day, unlimited mileage. Offer B: €29 per day plus €0.18 per kilometre driven. Offer C: flat fee of €199 for a rental of 1 to 7 days, 1,000 km included, then €0.30 per kilometre beyond. The first planned trip lasts 5 days and covers 760 km.',
      questions: {
        cheapest_trip: {
          type: 'choice',
          instructions: 'For the 5-day, 760 km trip, which offer is the cheapest?',
          criteria: { offer_a: 'Offer A', offer_b: 'Offer B', offer_c: 'Offer C' },
        },
        b_above_a: { type: 'noul', instructions: 'For this 5-day, 760 km trip, does offer B cost more than offer A?' },
        b_cheaper_at_400km: { type: 'noul', instructions: 'For 5 days and only 400 km, would offer B be cheaper than offer A?' },
        cheapest_long_trip: {
          type: 'choice',
          instructions: 'For another trip of 7 days and 1,400 km, which offer is the cheapest?',
          criteria: { offer_a: 'Offer A', offer_b: 'Offer B', offer_c: 'Offer C' },
        },
      },
    },
  },
  {
    id: 'num-staff-cost-join',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Jointure heures × taux : coûts par salarié E01 1 728, E02 1 804, E03 2 204, E04 1 886, E05 2 046, E06 2 366, E07 1 575, E08 2 448.
    // Hector (E08) coûte le plus ; Farid (E06) a le plus d’heures (91) et Dario (E04) le taux le plus élevé.
    // Par équipe : développement 6 538 €, support 5 898 € (pourtant 245 h contre 172), design 3 621 €. Total 16 057 € (< 16 500) pour 524 h.
    expected: { top_cost_employee: 'hector', top_cost_team: 'dev', total_above_16500: false, total_hours: 2 },
    fr: {
      name: 'Coût de main-d’œuvre par équipe',
      description: 'Jointure entre une table des salariés et une table des heures, puis agrégation par équipe.',
      state: {
        project: 'Refonte du portail client — semaines 1 à 3',
        notes: ['Coût d’une ligne d’heures = heures × taux horaire chargé du salarié.', 'Les heures sont déclarées par semaine ; un salarié peut ne rien déclarer certaines semaines.'],
        employees: STAFF.map(([employee_id, name, team, hourly_rate_eur]) => ({ employee_id, name, team: TEAM_WORDS.fr[team], hourly_rate_eur })),
        timesheets: HOURS.map(([employee_id, week, hours]) => ({ employee_id, week, hours })),
      },
      questions: {
        top_cost_employee: {
          type: 'choice',
          instructions: 'Quel salarié a coûté le plus cher au projet sur les trois semaines ?',
          criteria: { chloe: 'Chloé Varenne', dario: 'Dario Fenzi', farid: 'Farid Oumou', hector: 'Hector Blain' },
        },
        top_cost_team: {
          type: 'choice',
          instructions: 'Quelle équipe représente le coût total le plus élevé ?',
          criteria: { support: 'Support', dev: 'Développement', design: 'Design' },
        },
        total_above_16500: { type: 'noul', instructions: 'Le coût total de main-d’œuvre du projet dépasse-t-il 16 500 € ?' },
        total_hours: {
          type: 'score',
          instructions: 'Nombre total d’heures déclarées sur le projet',
          criteria: ['Moins de 450 h', '450 à 500 h', '500 à 550 h', 'Plus de 550 h'],
        },
      },
    },
    en: {
      name: 'Labour cost by team',
      description: 'Join between an employee table and a timesheet table, then aggregation by team.',
      state: {
        project: 'Customer portal redesign — weeks 1 to 3',
        notes: ['Cost of a timesheet line = hours × the employee’s loaded hourly rate.', 'Hours are reported per week; an employee may report nothing in some weeks.'],
        employees: STAFF.map(([employee_id, name, team, hourly_rate_eur]) => ({ employee_id, name, team: TEAM_WORDS.en[team], hourly_rate_eur })),
        timesheets: HOURS.map(([employee_id, week, hours]) => ({ employee_id, week, hours })),
      },
      questions: {
        top_cost_employee: {
          type: 'choice',
          instructions: 'Which employee cost the project the most over the three weeks?',
          criteria: { chloe: 'Chloé Varenne', dario: 'Dario Fenzi', farid: 'Farid Oumou', hector: 'Hector Blain' },
        },
        top_cost_team: {
          type: 'choice',
          instructions: 'Which team accounts for the highest total cost?',
          criteria: { support: 'Support', dev: 'Development', design: 'Design' },
        },
        total_above_16500: { type: 'noul', instructions: 'Does the project’s total labour cost exceed €16,500?' },
        total_hours: {
          type: 'score',
          instructions: 'Total number of hours reported on the project',
          criteria: ['Under 450 h', '450 to 500 h', '500 to 550 h', 'Over 550 h'],
        },
      },
    },
  },
  {
    id: 'num-expense-reports',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'long',
    // 36 notes générées (graine 2026) : 26 validées (2 370,40 €), 7 refusées, 3 en attente ; toutes notes confondues 3 047,30 €.
    // Validées par salarié : Anouk 568,78, Basile 524,47, Célia 179,75 (toutes notes : Basile 880,00, Anouk 653,52, Célia 349,79).
    // Transport validé : 110,27 + 237,84 + 119,00 + 216,14 = 683,25 € (> 650 ; 811,26 € avec la note refusée NDF-301).
    expected: { top_of_three: 'anouk', approved_total_above_2500: false, transport_above_650: true, rejected_count: 2 },
    fr: {
      name: 'Notes de frais du mois',
      description: '36 notes de frais : agrégations filtrées sur le statut, par salarié et par catégorie.',
      state: {
        report: 'Notes de frais — service commercial, mars 2026',
        notes: ['Seules les notes au statut « validée » sont remboursées.', 'Montants TTC, en euros.'],
        expenses: expenseLines('fr'),
      },
      questions: {
        top_of_three: {
          type: 'choice',
          instructions: 'Parmi Anouk Ferrand, Basile Corre et Célia Notari, qui se fera rembourser le montant le plus élevé ?',
          criteria: { anouk: 'Anouk Ferrand', basile: 'Basile Corre', celia: 'Célia Notari' },
        },
        approved_total_above_2500: { type: 'noul', instructions: 'Le montant total remboursé pour le mois dépasse-t-il 2 500 € ?' },
        transport_above_650: { type: 'noul', instructions: 'Les frais de transport remboursés dépassent-ils 650 € ?' },
        rejected_count: {
          type: 'score',
          instructions: 'Nombre de notes de frais refusées',
          criteria: ['0 à 2', '3 à 5', '6 à 8', '9 ou plus'],
        },
      },
    },
    en: {
      name: 'Monthly expense reports',
      description: '36 expense claims: aggregations filtered on status, by employee and by category.',
      state: {
        report: 'Expense claims — sales department, March 2026',
        notes: ['Only claims with the status “approved” are reimbursed.', 'Amounts include VAT, in euros.'],
        expenses: expenseLines('en'),
      },
      questions: {
        top_of_three: {
          type: 'choice',
          instructions: 'Among Anouk Ferrand, Basile Corre and Célia Notari, who will be reimbursed the highest amount?',
          criteria: { anouk: 'Anouk Ferrand', basile: 'Basile Corre', celia: 'Célia Notari' },
        },
        approved_total_above_2500: { type: 'noul', instructions: 'Does the total amount reimbursed for the month exceed €2,500?' },
        transport_above_650: { type: 'noul', instructions: 'Do the reimbursed transport expenses exceed €650?' },
        rejected_count: {
          type: 'score',
          instructions: 'Number of rejected expense claims',
          criteria: ['0 to 2', '3 to 5', '6 to 8', '9 or more'],
        },
      },
    },
  },
  {
    id: 'num-profit-sharing',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // Distribuable : 37 500 × 90 % = 33 750 €. Apports 24 000 / 16 000 / 10 000 = 48 % / 32 % / 20 %.
    // Lucas 16 200, Mia 10 800, Noé 6 750 (< 7 000) ; Lucas 16 200 < Mia + Noé 17 550.
    expected: { mia_share: 'eur_10800', noe_above_7000: false, lucas_above_others: false, noe_with_extra_above_9000: true },
    fr: {
      name: 'Partage d’un bénéfice',
      description: 'Réserve à prélever avant la répartition au prorata des apports.',
      state:
        'Trois associés ont créé la brasserie Houblonne avec des apports de 24 000 € (Lucas), 16 000 € (Mia) et 10 000 € (Noé). Le bénéfice de l’année est de 37 500 €. Les statuts imposent de mettre d’abord 10 % du bénéfice en réserve ; le reste est distribué au prorata des apports.',
      questions: {
        mia_share: {
          type: 'choice',
          instructions: 'Combien Mia reçoit-elle ?',
          criteria: { eur_10800: '10 800 €', eur_11250: '11 250 €', eur_12000: '12 000 €', eur_12500: '12 500 €' },
        },
        noe_above_7000: { type: 'noul', instructions: 'Noé reçoit-il plus de 7 000 € ?' },
        lucas_above_others: { type: 'noul', instructions: 'Lucas reçoit-il plus que Mia et Noé réunis ?' },
        noe_with_extra_above_9000: { type: 'noul', instructions: 'Si Noé avait apporté 5 000 € de plus, toutes choses égales par ailleurs, aurait-il reçu plus de 9 000 € ?' },
      },
    },
    en: {
      name: 'Sharing a profit',
      description: 'A reserve to set aside before splitting pro rata to contributions.',
      state:
        'Three partners founded the Houblonne brewery with contributions of €24,000 (Lucas), €16,000 (Mia) and €10,000 (Noé). This year’s profit is €37,500. The articles of association require 10% of the profit to be put into reserve first; the rest is distributed in proportion to the contributions.',
      questions: {
        mia_share: {
          type: 'choice',
          instructions: 'How much does Mia receive?',
          criteria: { eur_10800: '€10,800', eur_11250: '€11,250', eur_12000: '€12,000', eur_12500: '€12,500' },
        },
        noe_above_7000: { type: 'noul', instructions: 'Does Noé receive more than €7,000?' },
        lucas_above_others: { type: 'noul', instructions: 'Does Lucas receive more than Mia and Noé combined?' },
        noe_with_extra_above_9000: { type: 'noul', instructions: 'If Noé had contributed €5,000 more, all else being equal, would he have received more than €9,000?' },
      },
    },
  },
  {
    id: 'num-fuel-cost',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // 540 × 6,4 / 100 = 34,56 L ; réservoir aux trois quarts : 33,75 L < 34,56 → il faut faire le plein.
    // Coût : 34,56 × 1,85 = 63,94 € (distracteurs : 34,56 € = litres pris pour des euros, 156,09 € = 540 / 6,4 × 1,85).
    // Électrique : 540 × 0,17 × 0,22 = 20,20 € ; économie 43,74 € (< 50).
    expected: { refuel_needed: true, fuel_cost: 'eur_63_94', ev_saving_above_50: false },
    fr: {
      name: 'Coût d’un trajet',
      description: 'Consommation aux 100 km, règle de trois et comparaison avec l’électrique.',
      state:
        'Joséphine prépare un trajet de 540 km. Sa voiture consomme 6,4 L aux 100 km, le carburant coûte 1,85 € le litre, et son réservoir de 45 L est rempli aux trois quarts au départ. Une voiture électrique de location consommerait 17 kWh aux 100 km, rechargés à 0,22 € le kWh.',
      questions: {
        refuel_needed: { type: 'noul', instructions: 'Joséphine devra-t-elle remettre du carburant pour faire le trajet ?' },
        fuel_cost: {
          type: 'choice',
          instructions: 'Combien coûte le carburant consommé sur le trajet ?',
          criteria: { eur_34_56: '34,56 €', eur_62_44: '62,44 €', eur_63_94: '63,94 €', eur_156_09: '156,09 €' },
        },
        ev_saving_above_50: { type: 'noul', instructions: 'Faire le trajet en voiture électrique économiserait-il plus de 50 € d’énergie ?' },
      },
    },
    en: {
      name: 'Cost of a trip',
      description: 'Consumption per 100 km, rule of three and comparison with electric.',
      state:
        'Joséphine is planning a 540 km trip. Her car uses 6.4 L per 100 km, fuel costs €1.85 per litre, and her 45 L tank is three-quarters full at departure. A rented electric car would use 17 kWh per 100 km, charged at €0.22 per kWh.',
      questions: {
        refuel_needed: { type: 'noul', instructions: 'Will Joséphine need to add fuel to complete the trip?' },
        fuel_cost: {
          type: 'choice',
          instructions: 'How much does the fuel used on the trip cost?',
          criteria: { eur_34_56: '€34.56', eur_62_44: '€62.44', eur_63_94: '€63.94', eur_156_09: '€156.09' },
        },
        ev_saving_above_50: { type: 'noul', instructions: 'Would making the trip in the electric car save more than €50 in energy?' },
      },
    },
  },
  {
    id: 'num-water-tiers',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 145 m³ : 30 × 2,10 = 63 ; 90 × 3,40 = 306 ; 25 × 4,80 = 120 → 489 € + abonnement 48 € = 537 € (744 € en appliquant 4,80 € à tout).
    // Prix marginal : 4,80 €/m³ ; prix moyen 537 / 145 = 3,70 €/m³ (< 4). Économie pour 25 m³ de moins : 25 × 4,80 = 120 € (> 100 ;
    // au prix moyen on trouverait 92,59 €).
    expected: { annual_bill: 'eur_537', marginal_price: 'eur_4_80', saving_above_100: true, avg_price_above_4: false },
    fr: {
      name: 'Tarif progressif de l’eau',
      description: 'Tarif par tranches : prix moyen et prix marginal diffèrent.',
      state:
        'Tarif annuel de l’eau à Bréhan, appliqué par tranches : les 30 premiers m³ à 2,10 € le m³, du 31ᵉ au 120ᵉ m³ à 3,40 € le m³, au-delà de 120 m³ à 4,80 € le m³. Un abonnement fixe de 48 € par an s’ajoute. Le foyer Kervella a consommé 145 m³ cette année.',
      questions: {
        annual_bill: {
          type: 'choice',
          instructions: 'Quel est le montant de la facture annuelle du foyer Kervella, abonnement compris ?',
          criteria: { eur_489: '489 €', eur_537: '537 €', eur_585: '585 €', eur_744: '744 €' },
        },
        marginal_price: {
          type: 'choice',
          instructions: 'Combien coûterait au foyer un mètre cube supplémentaire consommé cette année ?',
          criteria: { eur_2_10: '2,10 €', eur_3_40: '3,40 €', eur_3_70: '3,70 €', eur_4_80: '4,80 €' },
        },
        saving_above_100: { type: 'noul', instructions: 'Consommer 25 m³ de moins aurait-il fait économiser plus de 100 € au foyer ?' },
        avg_price_above_4: { type: 'noul', instructions: 'Abonnement compris, le prix moyen payé par mètre cube dépasse-t-il 4 € ?' },
      },
    },
    en: {
      name: 'Tiered water pricing',
      description: 'Tiered pricing: the average price and the marginal price differ.',
      state:
        'Annual water tariff in Bréhan, applied in tiers: the first 30 m³ at €2.10 per m³, from the 31st to the 120th m³ at €3.40 per m³, above 120 m³ at €4.80 per m³. A fixed subscription of €48 per year is added. The Kervella household used 145 m³ this year.',
      questions: {
        annual_bill: {
          type: 'choice',
          instructions: 'What is the Kervella household’s annual bill, subscription included?',
          criteria: { eur_489: '€489', eur_537: '€537', eur_585: '€585', eur_744: '€744' },
        },
        marginal_price: {
          type: 'choice',
          instructions: 'How much would one extra cubic metre used this year cost the household?',
          criteria: { eur_2_10: '€2.10', eur_3_40: '€3.40', eur_3_70: '€3.70', eur_4_80: '€4.80' },
        },
        saving_above_100: { type: 'noul', instructions: 'Would using 25 m³ less have saved the household more than €100?' },
        avg_price_above_4: { type: 'noul', instructions: 'Subscription included, is the average price paid per cubic metre above €4?' },
      },
    },
  },
  {
    id: 'num-salary-median',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'moyen',
    // Moyenne des 15 salaires : 55 820 / 15 = 3 721,33 € (> 3 500), tirée par la directrice (14 500 €).
    // Médiane (8ᵉ valeur sur 15 triées) : 2 750 € ; sans la directrice, elle serait de 2 685 €.
    // Au-dessus de la moyenne : 3 900, 4 350, 4 800 et 14 500 → 4 salariés (niveau « 1 à 4 »).
    expected: { mean_above_3500: true, median: 'eur_2750', above_mean: 1 },
    fr: {
      name: 'Salaire moyen et médian',
      description: 'Une valeur extrême tire la moyenne : la médiane raconte autre chose.',
      state: {
        company: 'Menuiserie Arvel — salaires bruts mensuels, avril 2026',
        employees: [
          { name: 'Paul Iribe', role: 'Menuisier', salary_eur: 2340 },
          { name: 'Sarah Gimel', role: 'Assistante commerciale', salary_eur: 2750 },
          { name: 'Ophélie Dantz', role: 'Directrice générale', salary_eur: 14500 },
          { name: 'Marc Ilou', role: 'Apprenti confirmé', salary_eur: 2150 },
          { name: 'Inès Valcourt', role: 'Cheffe d’atelier', salary_eur: 4350 },
          { name: 'Yanis Perreau', role: 'Menuisier', salary_eur: 2280 },
          { name: 'Léa Bontemps', role: 'Comptable', salary_eur: 3040 },
          { name: 'Hugo Sarrail', role: 'Responsable commercial', salary_eur: 4800 },
          { name: 'Zoé Marchal', role: 'Menuisière', salary_eur: 2460 },
          { name: 'Victor Anselme', role: 'Dessinateur', salary_eur: 2880 },
          { name: 'Nina Thoraval', role: 'Menuisière', salary_eur: 2390 },
          { name: 'Gilles Roumi', role: 'Responsable de production', salary_eur: 3900 },
          { name: 'Ambre Lefoll', role: 'Assistante administrative', salary_eur: 2620 },
          { name: 'Rayan Dufresne', role: 'Menuisier', salary_eur: 2210 },
          { name: 'Clara Weiss', role: 'Chargée d’études', salary_eur: 3150 },
        ],
      },
      questions: {
        mean_above_3500: { type: 'noul', instructions: 'Le salaire moyen de l’entreprise dépasse-t-il 3 500 € ?' },
        median: {
          type: 'choice',
          instructions: 'Quel est le salaire médian de l’entreprise ?',
          criteria: { eur_2685: '2 685 €', eur_2750: '2 750 €', eur_2880: '2 880 €', eur_3721: '3 721 €' },
        },
        above_mean: {
          type: 'score',
          instructions: 'Nombre de salariés dont le salaire dépasse le salaire moyen de l’entreprise',
          criteria: ['Aucun', '1 à 4', '5 à 8', '9 ou plus'],
        },
      },
    },
    en: {
      name: 'Mean and median salary',
      description: 'One extreme value pulls the mean up: the median tells another story.',
      state: {
        company: 'Arvel Joinery — gross monthly salaries, April 2026',
        employees: [
          { name: 'Paul Iribe', role: 'Joiner', salary_eur: 2340 },
          { name: 'Sarah Gimel', role: 'Sales assistant', salary_eur: 2750 },
          { name: 'Ophélie Dantz', role: 'Managing director', salary_eur: 14500 },
          { name: 'Marc Ilou', role: 'Senior apprentice', salary_eur: 2150 },
          { name: 'Inès Valcourt', role: 'Workshop manager', salary_eur: 4350 },
          { name: 'Yanis Perreau', role: 'Joiner', salary_eur: 2280 },
          { name: 'Léa Bontemps', role: 'Accountant', salary_eur: 3040 },
          { name: 'Hugo Sarrail', role: 'Sales manager', salary_eur: 4800 },
          { name: 'Zoé Marchal', role: 'Joiner', salary_eur: 2460 },
          { name: 'Victor Anselme', role: 'Draughtsman', salary_eur: 2880 },
          { name: 'Nina Thoraval', role: 'Joiner', salary_eur: 2390 },
          { name: 'Gilles Roumi', role: 'Production manager', salary_eur: 3900 },
          { name: 'Ambre Lefoll', role: 'Administrative assistant', salary_eur: 2620 },
          { name: 'Rayan Dufresne', role: 'Joiner', salary_eur: 2210 },
          { name: 'Clara Weiss', role: 'Design engineer', salary_eur: 3150 },
        ],
      },
      questions: {
        mean_above_3500: { type: 'noul', instructions: 'Is the company’s average salary above €3,500?' },
        median: {
          type: 'choice',
          instructions: 'What is the company’s median salary?',
          criteria: { eur_2685: '€2,685', eur_2750: '€2,750', eur_2880: '€2,880', eur_3721: '€3,721' },
        },
        above_mean: {
          type: 'score',
          instructions: 'Number of employees whose salary is above the company’s average salary',
          criteria: ['None', '1 to 4', '5 to 8', '9 or more'],
        },
      },
    },
  },
]
