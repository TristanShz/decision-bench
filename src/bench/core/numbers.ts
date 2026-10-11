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
]
