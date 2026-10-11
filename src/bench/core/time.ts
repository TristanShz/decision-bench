import type { Pair } from './pair.ts'

// Dates et heures : jours de la semaine à partir d’un ancrage, jours ouvrés et jours fériés, délais de
// rétractation et de préavis, années bissextiles, fins de mois, durées qui passent minuit, fuseaux horaires
// et heure d’été, rotations d’astreinte, âges et ancienneté, semaines ISO, plannings et délais de réponse.
// Tout ce qu’il faut savoir (jours fériés, décalages horaires, dates de changement d’heure) est donné dans
// l’énoncé ; chaque réponse se calcule sans connaissance externe.

// ─── Données partagées ───────────────────────────────────────────────────────

const WEEKDAYS = {
  fr: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
}

// Planning de l’équipe de nuit et de jour d’un service, du lundi 2 au dimanche 15 mars 2026 (14 jours).
// Un caractère par jour : M matin, S soir, N nuit, J journée longue, - repos.
type ShiftCode = 'M' | 'S' | 'N' | 'J'
const ROSTER: [nurse: string, days: string][] = [
  ['Aurore', 'MMMSS--NNN--JJ'],
  ['Basile', 'JJ-JJ-M-MMSS--'],
  ['Coline', '-NN--MMM-SMM--'],
  ['Damien', '---MMMMMM-NN--'],
  ['Elsa', 'NN--NNNNN---SS'],
]
const SHIFT_LABELS: Record<'fr' | 'en', Record<ShiftCode, string>> = {
  fr: { M: 'matin', S: 'soir', N: 'nuit', J: 'journée longue' },
  en: { M: 'morning', S: 'evening', N: 'night', J: 'long day' },
}
const roster = (lang: 'fr' | 'en') => {
  const out: { date: string; nurse: string; shift: string }[] = []
  for (let day = 0; day < 14; day++) {
    const weekday = WEEKDAYS[lang][day % 7]
    const date = lang === 'fr' ? `${weekday} ${day + 2} mars 2026` : `${weekday}, March ${day + 2}, 2026`
    for (const [nurse, days] of ROSTER) {
      const code = days[day]
      if (code !== '-') out.push({ date, nurse, shift: SHIFT_LABELS[lang][code as ShiftCode] })
    }
  }
  return out
}

// Tickets d’assistance : création et première réponse, en heure de Paris (fin avril – début mai 2026).
type Ticket = [id: string, created: [month: number, day: number, h: number, m: number], answered: [month: number, day: number, h: number, m: number], agent: string, customer: string, fr: string, en: string]
const TICKETS: Ticket[] = [
  ['T-301', [4, 28, 9, 15], [4, 28, 11, 40], 'Yanis', 'Brasserie Olmo', 'Le terminal de paiement affiche « connexion refusée » depuis ce matin.', 'The payment terminal has shown “connection refused” since this morning.'],
  ['T-302', [4, 28, 16, 30], [4, 29, 10, 10], 'Léna', 'Atelier Vasseur', 'Impossible d’exporter les factures de mars au format PDF.', 'Unable to export the March invoices as PDF.'],
  ['T-303', [4, 29, 8, 5], [4, 29, 13, 20], 'Yanis', 'Pharmacie des Tilleuls', 'Les étiquettes de prix ne s’impriment plus sur la nouvelle imprimante.', 'Price labels no longer print on the new printer.'],
  ['T-304', [4, 29, 14, 0], [4, 29, 17, 55], 'Marc', 'Garage Rivet', 'Un client a été débité deux fois pour la même réparation.', 'A customer was charged twice for the same repair.'],
  ['T-305', [4, 30, 17, 0], [5, 4, 10, 0], 'Marc', 'Librairie Kermel', 'Le module de fidélité ne crédite plus les points.', 'The loyalty module no longer credits points.'],
  ['T-306', [4, 30, 11, 30], [4, 30, 16, 45], 'Léna', 'Hôtel Sablon', 'Les réservations du site n’arrivent plus dans le planning.', 'Website bookings no longer reach the schedule.'],
  ['T-307', [5, 2, 10, 20], [5, 4, 13, 30], 'Léna', 'Boulangerie Ferrand', 'La caisse redémarre toute seule plusieurs fois par jour.', 'The till restarts by itself several times a day.'],
  ['T-308', [5, 4, 15, 10], [5, 5, 9, 50], 'Marc', 'Cave Amarante', 'Demande d’ajout d’un deuxième utilisateur sur le compte.', 'Request to add a second user to the account.'],
  ['T-309', [5, 5, 12, 0], [5, 5, 15, 30], 'Yanis', 'Fleurs Opaline', 'Le rapport de ventes hebdomadaire est vide.', 'The weekly sales report is empty.'],
  ['T-310', [5, 6, 17, 20], [5, 7, 12, 45], 'Yanis', 'Optique Delorme', 'La synchronisation du stock avec la boutique en ligne a échoué.', 'Stock synchronisation with the online shop failed.'],
  ['T-311', [5, 7, 16, 0], [5, 11, 9, 30], 'Marc', 'Restaurant Akari', 'Question sur la clôture de caisse en fin de mois.', 'Question about the end-of-month till closing.'],
  ['T-312', [5, 6, 9, 0], [5, 6, 12, 59], 'Léna', 'Studio Pélican', 'Le mot de passe administrateur a expiré et le lien de réinitialisation ne marche pas.', 'The admin password has expired and the reset link does not work.'],
  ['T-313', [5, 8, 10, 0], [5, 11, 13, 10], 'Léna', 'Épicerie Nomade', 'Les tickets de caisse n’indiquent plus le taux de TVA.', 'Receipts no longer show the VAT rate.'],
]
const MONTHS = { fr: ['', 'janvier', 'février', 'mars', 'avril', 'mai'], en: ['', 'January', 'February', 'March', 'April', 'May'] }
const stamp = (lang: 'fr' | 'en', [month, day, h, m]: [number, number, number, number]) => {
  const weekday = WEEKDAYS[lang][(new Date(Date.UTC(2026, month - 1, day)).getUTCDay() + 6) % 7]
  if (lang === 'fr') return `${weekday} ${day} ${MONTHS.fr[month]} 2026, ${h} h ${String(m).padStart(2, '0')}`
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${weekday}, ${MONTHS.en[month]} ${day}, 2026, ${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}
const tickets = (lang: 'fr' | 'en') =>
  TICKETS.map(([id, created, answered, agent, customer, fr, en]) => ({
    id,
    customer,
    subject: lang === 'fr' ? fr : en,
    created_at: stamp(lang, created),
    first_response_at: stamp(lang, answered),
    agent,
  }))

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const TIME: Pair[] = [
  {
    id: 'time-weekday-anchor',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Ancrage : mardi 3 mars 2026. 31 mars = 3 + 28 jours → mardi. 15 avril = 31 mars + 15 jours (2 semaines + 1) → mercredi.
    // 1er mai = 15 avril + 16 jours (2 semaines + 2) → vendredi. 28 février = 3 mars − 3 jours (février 2026 a 28 jours) → samedi.
    expected: { march_31: 'tuesday', april_15: 'wednesday', may_1_friday: true, feb_28: 'saturday' },
    fr: {
      name: 'Jour de la semaine d’une date',
      description: 'Jours de la semaine à retrouver à partir d’une seule date de référence, en avant et en arrière.',
      state:
        'Le 3 mars 2026 est un mardi. L’année 2026 n’est pas bissextile : février compte 28 jours, mars 31 jours, avril 30 jours. Le club de randonnée de Laure organise des sorties le 28 février, le 31 mars, le 15 avril et le 1er mai 2026.',
      questions: {
        march_31: {
          type: 'choice',
          instructions: 'Quel jour de la semaine tombe le 31 mars 2026 ?',
          criteria: { monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi' },
        },
        april_15: {
          type: 'choice',
          instructions: 'Quel jour de la semaine tombe le 15 avril 2026 ?',
          criteria: { tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi' },
        },
        may_1_friday: { type: 'noul', instructions: 'La sortie du 1er mai 2026 tombe-t-elle un vendredi ?' },
        feb_28: {
          type: 'choice',
          instructions: 'Quel jour de la semaine tombe le 28 février 2026 ?',
          criteria: { friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche' },
        },
      },
    },
    en: {
      name: 'Day of the week of a date',
      description: 'Days of the week to work out from a single reference date, forwards and backwards.',
      state:
        'March 3, 2026 is a Tuesday. 2026 is not a leap year: February has 28 days, March 31 days, April 30 days. Laure’s hiking club is organising outings on February 28, March 31, April 15 and May 1, 2026.',
      questions: {
        march_31: {
          type: 'choice',
          instructions: 'What day of the week is March 31, 2026?',
          criteria: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday' },
        },
        april_15: {
          type: 'choice',
          instructions: 'What day of the week is April 15, 2026?',
          criteria: { tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday' },
        },
        may_1_friday: { type: 'noul', instructions: 'Does the May 1, 2026 outing fall on a Friday?' },
        feb_28: {
          type: 'choice',
          instructions: 'What day of the week is February 28, 2026?',
          criteria: { friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
        },
      },
    },
  },
  {
    id: 'time-business-days-holidays',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Commande le jeudi 30 avril ; jours ouvrés comptés à partir du lendemain, hors week-ends et fériés (1er, 8, 14 mai).
    // Express (5 j) : lun. 4, mar. 5, mer. 6, jeu. 7, (ven. 8 férié), lun. 11 → lundi 11 mai, donc pas avant le samedi 9.
    // Sans les fériés on obtiendrait le jeudi 7 mai. Standard (10 j) : … lun. 11 (5), mar. 12, mer. 13, (jeu. 14 férié),
    // ven. 15, lun. 18, mar. 19 → mardi 19 mai, soit la veille du salon du 20 mai : à temps.
    expected: { express_date: 'may_11', express_before_weekend: false, standard_date: 'may_19', standard_in_time: true },
    fr: {
      name: 'Livraison en jours ouvrés',
      description: 'Délais en jours ouvrés avec trois jours fériés en mai ; le premier jour compté est le lendemain de la commande.',
      state:
        'Nadège commande des présentoirs le jeudi 30 avril 2026. Le fournisseur livre en 5 jours ouvrés (express) ou en 10 jours ouvrés (standard). Les jours ouvrés vont du lundi au vendredi, hors jours fériés ; le décompte commence le premier jour ouvré qui suit la commande, et la livraison a lieu le dernier jour du décompte. Jours fériés de la période : vendredi 1er mai, vendredi 8 mai, jeudi 14 mai et lundi 25 mai 2026. Nadège tient un stand au salon du mercredi 20 mai et doit recevoir les présentoirs au plus tard la veille.',
      questions: {
        express_date: {
          type: 'choice',
          instructions: 'À quelle date la livraison express arrive-t-elle ?',
          criteria: { may_7: 'Jeudi 7 mai', may_8: 'Vendredi 8 mai', may_11: 'Lundi 11 mai', may_12: 'Mardi 12 mai' },
        },
        express_before_weekend: { type: 'noul', instructions: 'Avec l’express, Nadège reçoit-elle les présentoirs avant le samedi 9 mai ?' },
        standard_date: {
          type: 'choice',
          instructions: 'À quelle date la livraison standard arrive-t-elle ?',
          criteria: { may_14: 'Jeudi 14 mai', may_15: 'Vendredi 15 mai', may_18: 'Lundi 18 mai', may_19: 'Mardi 19 mai', may_20: 'Mercredi 20 mai' },
        },
        standard_in_time: { type: 'noul', instructions: 'La livraison standard suffit-elle pour que Nadège ait ses présentoirs à temps pour le salon ?' },
      },
    },
    en: {
      name: 'Delivery in business days',
      description: 'Lead times in business days with three public holidays in May; the first day counted is the day after the order.',
      state:
        'Nadège orders display stands on Thursday, April 30, 2026. The supplier delivers in 5 business days (express) or 10 business days (standard). Business days are Monday to Friday, excluding public holidays; the count starts on the first business day after the order, and delivery takes place on the last day of the count. Public holidays in the period: Friday, May 1; Friday, May 8; Thursday, May 14; and Monday, May 25, 2026. Nadège has a booth at the trade fair on Wednesday, May 20 and must receive the stands by the day before at the latest.',
      questions: {
        express_date: {
          type: 'choice',
          instructions: 'On what date does the express delivery arrive?',
          criteria: { may_7: 'Thursday, May 7', may_8: 'Friday, May 8', may_11: 'Monday, May 11', may_12: 'Tuesday, May 12' },
        },
        express_before_weekend: { type: 'noul', instructions: 'With express, does Nadège receive the stands before Saturday, May 9?' },
        standard_date: {
          type: 'choice',
          instructions: 'On what date does the standard delivery arrive?',
          criteria: { may_14: 'Thursday, May 14', may_15: 'Friday, May 15', may_18: 'Monday, May 18', may_19: 'Tuesday, May 19', may_20: 'Wednesday, May 20' },
        },
        standard_in_time: { type: 'noul', instructions: 'Is standard delivery enough for Nadège to have her stands in time for the fair?' },
      },
    },
  },
  {
    id: 'time-withdrawal-period',
    category: 'Rules',
    complexity: 'complexe',
    length: 'court',
    // Délai de 14 jours à compter du lendemain de la réception : le 14ᵉ jour = réception + 14.
    // Réception ven. 11 déc. → 14ᵉ jour ven. 25 déc. (férié) → sam. 26, dim. 27 → prolongé au lundi 28 décembre.
    // Envoi le dim. 27 déc. : dans le délai. Réception lun. 14 déc. → 14ᵉ jour lun. 28 déc. (ouvrable) → envoi le 29 : trop tard.
    // Réception ven. 18 déc. → 14ᵉ jour ven. 1er janv. (férié) → sam. 2, dim. 3 → lundi 4 janvier 2027.
    expected: { last_day_ines: 'dec_28', ines_sunday_ok: true, paul_in_time: false, last_day_sacha: 'jan_4' },
    fr: {
      name: 'Délai de rétractation',
      description: 'Délai de 14 jours qui part du lendemain et se prolonge quand il expire un week-end ou un jour férié.',
      state:
        'Conditions de vente de la boutique en ligne Lumen : « Vous disposez de 14 jours pour vous rétracter. Le délai commence le lendemain de la réception du colis (le lendemain est le 1er jour). S’il expire un samedi, un dimanche ou un jour férié, il est prolongé jusqu’au premier jour ouvrable suivant. Le formulaire doit être envoyé au plus tard le dernier jour du délai. » Jours fériés de la période : vendredi 25 décembre 2026 et vendredi 1er janvier 2027. Inès a reçu son colis le vendredi 11 décembre 2026, Paul le lundi 14 décembre 2026 et Sacha le vendredi 18 décembre 2026.',
      questions: {
        last_day_ines: {
          type: 'choice',
          instructions: 'Quel est le dernier jour pour qu’Inès se rétracte ?',
          criteria: { dec_24: 'Jeudi 24 décembre', dec_25: 'Vendredi 25 décembre', dec_26: 'Samedi 26 décembre', dec_28: 'Lundi 28 décembre' },
        },
        ines_sunday_ok: { type: 'noul', instructions: 'Si Inès envoie son formulaire le dimanche 27 décembre, sa rétractation est-elle dans les délais ?' },
        paul_in_time: { type: 'noul', instructions: 'Paul envoie son formulaire le mardi 29 décembre. Est-il dans les délais ?' },
        last_day_sacha: {
          type: 'choice',
          instructions: 'Quel est le dernier jour pour que Sacha se rétracte ?',
          criteria: { dec_31: 'Jeudi 31 décembre', jan_1: 'Vendredi 1er janvier', jan_2: 'Samedi 2 janvier', jan_4: 'Lundi 4 janvier', jan_5: 'Mardi 5 janvier' },
        },
      },
    },
    en: {
      name: 'Withdrawal period',
      description: 'A 14-day period that starts the next day and is extended when it ends on a weekend or a public holiday.',
      state:
        'Terms of sale of the Lumen online store: “You have 14 days to withdraw from your purchase. The period starts on the day after you receive the parcel (that day is day 1). If it ends on a Saturday, a Sunday or a public holiday, it is extended to the next business day. The form must be sent on the last day of the period at the latest.” Public holidays in the period: Friday, December 25, 2026 and Friday, January 1, 2027. Inès received her parcel on Friday, December 11, 2026, Paul on Monday, December 14, 2026, and Sacha on Friday, December 18, 2026.',
      questions: {
        last_day_ines: {
          type: 'choice',
          instructions: 'What is the last day for Inès to withdraw?',
          criteria: { dec_24: 'Thursday, December 24', dec_25: 'Friday, December 25', dec_26: 'Saturday, December 26', dec_28: 'Monday, December 28' },
        },
        ines_sunday_ok: { type: 'noul', instructions: 'If Inès sends her form on Sunday, December 27, is her withdrawal on time?' },
        paul_in_time: { type: 'noul', instructions: 'Paul sends his form on Tuesday, December 29. Is he on time?' },
        last_day_sacha: {
          type: 'choice',
          instructions: 'What is the last day for Sacha to withdraw?',
          criteria: { dec_31: 'Thursday, December 31', jan_1: 'Friday, January 1', jan_2: 'Saturday, January 2', jan_4: 'Monday, January 4', jan_5: 'Tuesday, January 5' },
        },
      },
    },
  },
  {
    id: 'time-leap-years',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // 2100 : divisible par 100 mais pas par 400 → non bissextile. 2400 : divisible par 400 → bissextile.
    // 2028 bissextile : du 15 février au 15 mars 2028 = 14 jours restants de février (15 → 29) + 15 = 29 jours.
    expected: { leap_2100: false, days_feb_mar_2028: 'd29', leap_2400: true },
    fr: {
      name: 'Années bissextiles',
      description: 'Règle complète des années bissextiles, avec l’exception des siècles.',
      state:
        'Règle du calendrier grégorien : une année est bissextile si elle est divisible par 4, sauf si elle est divisible par 100 ; les années divisibles par 400 sont toutefois bissextiles. Une année bissextile compte un 29 février. Le service d’archives de Gaspard doit programmer des échéances jusqu’en 2400.',
      questions: {
        leap_2100: { type: 'noul', instructions: 'L’année 2100 est-elle bissextile ?' },
        days_feb_mar_2028: {
          type: 'choice',
          instructions: 'Combien de jours séparent le 15 février 2028 du 15 mars 2028 ?',
          criteria: { d28: '28 jours', d29: '29 jours', d30: '30 jours' },
        },
        leap_2400: { type: 'noul', instructions: 'L’année 2400 est-elle bissextile ?' },
      },
    },
    en: {
      name: 'Leap years',
      description: 'The full leap-year rule, with the century exception.',
      state:
        'Gregorian calendar rule: a year is a leap year if it is divisible by 4, unless it is divisible by 100; years divisible by 400 are leap years nonetheless. A leap year has a February 29. Gaspard’s records department has to schedule deadlines up to the year 2400.',
      questions: {
        leap_2100: { type: 'noul', instructions: 'Is 2100 a leap year?' },
        days_feb_mar_2028: {
          type: 'choice',
          instructions: 'How many days are there between February 15, 2028 and March 15, 2028?',
          criteria: { d28: '28 days', d29: '29 days', d30: '30 days' },
        },
        leap_2400: { type: 'noul', instructions: 'Is 2400 a leap year?' },
      },
    },
  },
  {
    id: 'time-month-end-rent',
    category: 'Rules',
    complexity: 'complexe',
    length: 'court',
    // Échéance = même quantième que la date de départ (31), sinon dernier jour du mois, toujours calculée depuis le 31 janvier.
    // Février 2026 → 28 février ; mars → 31 mars (pas 28 : on ne repart pas de l’échéance précédente).
    // Échéances le 31 en 2026 : janvier, mars, mai, juillet, août, octobre, décembre → 7.
    // Bail du 31 janvier 2028 : février 2028 a 29 jours → échéance le 29 février, pas le 28.
    expected: { feb_due: 'feb_28', mar_due: 'mar_31', count_31: 'seven', feb_2028_on_28: false },
    fr: {
      name: 'Loyer échu en fin de mois',
      description: 'Ajout d’un mois à un 31 : dernier jour du mois quand le quantième n’existe pas, sans dérive d’un mois à l’autre.',
      state:
        'Le bail de Yohan a pris effet le samedi 31 janvier 2026 ; le loyer est dû chaque mois. Clause du bail : « L’échéance de chaque mois tombe le même quantième que la date de prise d’effet ; si ce jour n’existe pas dans le mois, l’échéance est le dernier jour du mois. Chaque échéance se calcule à partir de la date de prise d’effet, et non de l’échéance précédente. » La première échéance est le 31 janvier 2026. L’année 2026 n’est pas bissextile ; 2028 l’est. Le bail de sa sœur, rédigé avec la même clause, prendra effet le 31 janvier 2028.',
      questions: {
        feb_due: {
          type: 'choice',
          instructions: 'Quelle est l’échéance de février 2026 ?',
          criteria: { feb_28: '28 février', mar_1: '1er mars', mar_3: '3 mars' },
        },
        mar_due: {
          type: 'choice',
          instructions: 'Quelle est l’échéance de mars 2026 ?',
          criteria: { mar_28: '28 mars', mar_30: '30 mars', mar_31: '31 mars' },
        },
        count_31: {
          type: 'choice',
          instructions: 'Combien des douze échéances de 2026 (janvier à décembre) tombent un 31 ?',
          criteria: { five: 'Cinq', six: 'Six', seven: 'Sept', twelve: 'Douze' },
        },
        feb_2028_on_28: { type: 'noul', instructions: 'Pour le bail de la sœur, l’échéance de février 2028 tombe-t-elle le 28 février ?' },
      },
    },
    en: {
      name: 'Month-end rent due date',
      description: 'Adding a month to the 31st: last day of the month when the day does not exist, with no drift from month to month.',
      state:
        'Yohan’s lease took effect on Saturday, January 31, 2026; rent is due every month. Lease clause: “Each month’s due date falls on the same day of the month as the effective date; if that day does not exist in the month, the due date is the last day of the month. Each due date is calculated from the effective date, not from the previous due date.” The first due date is January 31, 2026. 2026 is not a leap year; 2028 is. His sister’s lease, written with the same clause, will take effect on January 31, 2028.',
      questions: {
        feb_due: {
          type: 'choice',
          instructions: 'What is the February 2026 due date?',
          criteria: { feb_28: 'February 28', mar_1: 'March 1', mar_3: 'March 3' },
        },
        mar_due: {
          type: 'choice',
          instructions: 'What is the March 2026 due date?',
          criteria: { mar_28: 'March 28', mar_30: 'March 30', mar_31: 'March 31' },
        },
        count_31: {
          type: 'choice',
          instructions: 'How many of the twelve 2026 due dates (January to December) fall on the 31st?',
          criteria: { five: 'Five', six: 'Six', seven: 'Seven', twelve: 'Twelve' },
        },
        feb_2028_on_28: { type: 'noul', instructions: 'For the sister’s lease, does the February 2028 due date fall on February 28?' },
      },
    },
  },
  {
    id: 'time-overnight-shift',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // Présence 21 h 45 → 6 h 10 = 8 h 25 ; moins 35 min de pause = 7 h 50 travaillées (< 8 h).
    // Plage de nuit 22 h → 6 h entièrement couverte (8 h), pause prise à 2 h incluse dedans : 8 h − 35 min = 7 h 25.
    expected: { worked: 'h7_50', over_8h: false, night_hours: 'h7_25' },
    fr: {
      name: 'Service de nuit',
      description: 'Durée d’un service qui passe minuit, pause déduite, et heures dans la plage de nuit.',
      state:
        'Karim, agent de sécurité, prend son service le vendredi à 21 h 45 et le termine le samedi à 6 h 10. Il prend une pause non rémunérée de 35 minutes, de 2 h 00 à 2 h 35. Son contrat définit les heures de nuit comme les heures travaillées entre 22 h et 6 h.',
      questions: {
        worked: {
          type: 'choice',
          instructions: 'Combien de temps Karim a-t-il travaillé, pause déduite ?',
          criteria: { h7_25: '7 h 25', h7_50: '7 h 50', h8_25: '8 h 25', h15_35: '15 h 35' },
        },
        over_8h: { type: 'noul', instructions: 'Karim a-t-il travaillé plus de 8 heures, pause déduite ?' },
        night_hours: {
          type: 'choice',
          instructions: 'Combien d’heures de nuit Karim a-t-il travaillé ?',
          criteria: { h6_25: '6 h 25', h7_25: '7 h 25', h7_50: '7 h 50', h8_00: '8 h 00' },
        },
      },
    },
    en: {
      name: 'Night shift',
      description: 'Length of a shift that crosses midnight, break deducted, and hours within the night window.',
      state:
        'Karim, a security guard, starts his shift on Friday at 9:45 pm and ends it on Saturday at 6:10 am. He takes an unpaid 35-minute break, from 2:00 am to 2:35 am. His contract defines night hours as hours worked between 10 pm and 6 am.',
      questions: {
        worked: {
          type: 'choice',
          instructions: 'How long did Karim work, break deducted?',
          criteria: { h7_25: '7 hr 25 min', h7_50: '7 hr 50 min', h8_25: '8 hr 25 min', h15_35: '15 hr 35 min' },
        },
        over_8h: { type: 'noul', instructions: 'Did Karim work more than 8 hours, break deducted?' },
        night_hours: {
          type: 'choice',
          instructions: 'How many night hours did Karim work?',
          criteria: { h6_25: '6 hr 25 min', h7_25: '7 hr 25 min', h7_50: '7 hr 50 min', h8_00: '8 hr 00 min' },
        },
      },
    },
  },
  {
    id: 'time-timezones-meeting',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 15 h à Paris (UTC+1) = 14 h UTC → New York (UTC−5) 9 h ; Tokyo (UTC+9) 23 h, toujours le jeudi 15.
    // Créneau commun 8 h–20 h : New York ≥ 8 h impose Paris ≥ 14 h ; Tokyo < 20 h impose Paris < 12 h → impossible.
    // Livraison vendredi 10 h à Tokyo = 1 h UTC vendredi = 20 h jeudi à New York → encore jeudi.
    expected: { ny_time: 'h9', tokyo_time: 'thu_23', common_slot: false, still_thursday_ny: true },
    fr: {
      name: 'Réunion sur trois fuseaux',
      description: 'Conversion d’horaires entre Paris, New York et Tokyo, changement de date compris.',
      state:
        'En janvier 2026, aucun changement d’heure n’a lieu. Décalages par rapport au temps universel (UTC) : Paris UTC+1, New York UTC−5, Tokyo UTC+9. Clémence, à Paris, fixe une réunion le jeudi 15 janvier 2026 à 15 h, heure de Paris, avec ses collègues de New York et de Tokyo. Chaque équipe accepte les réunions entre 8 h et 20 h, heure locale. L’équipe de Tokyo s’engage par ailleurs à livrer une maquette le vendredi 16 janvier à 10 h, heure de Tokyo.',
      questions: {
        ny_time: {
          type: 'choice',
          instructions: 'Quelle heure sera-t-il à New York au début de la réunion ?',
          criteria: { h8: '8 h', h9: '9 h', h10: '10 h', h21: '21 h' },
        },
        tokyo_time: {
          type: 'choice',
          instructions: 'Quand la réunion commence-t-elle à Tokyo, en heure locale ?',
          criteria: { wed_23: 'Mercredi 14 janvier à 23 h', thu_7: 'Jeudi 15 janvier à 7 h', thu_23: 'Jeudi 15 janvier à 23 h', fri_7: 'Vendredi 16 janvier à 7 h' },
        },
        common_slot: { type: 'noul', instructions: 'Existe-t-il une heure de début qui tombe entre 8 h et 20 h, heure locale, pour les trois équipes à la fois ?' },
        still_thursday_ny: { type: 'noul', instructions: 'Au moment où l’équipe de Tokyo livre la maquette, est-on encore jeudi à New York ?' },
      },
    },
    en: {
      name: 'Meeting across three time zones',
      description: 'Converting times between Paris, New York and Tokyo, including a change of date.',
      state:
        'In January 2026 there is no clock change. Offsets from Coordinated Universal Time (UTC): Paris UTC+1, New York UTC−5, Tokyo UTC+9. Clémence, in Paris, sets up a meeting on Thursday, January 15, 2026 at 3:00 pm Paris time with her colleagues in New York and Tokyo. Each team accepts meetings between 8:00 am and 8:00 pm local time. The Tokyo team has also committed to delivering a mock-up on Friday, January 16 at 10:00 am Tokyo time.',
      questions: {
        ny_time: {
          type: 'choice',
          instructions: 'What time will it be in New York when the meeting starts?',
          criteria: { h8: '8:00 am', h9: '9:00 am', h10: '10:00 am', h21: '9:00 pm' },
        },
        tokyo_time: {
          type: 'choice',
          instructions: 'When does the meeting start in Tokyo, local time?',
          criteria: { wed_23: 'Wednesday, January 14 at 11:00 pm', thu_7: 'Thursday, January 15 at 7:00 am', thu_23: 'Thursday, January 15 at 11:00 pm', fri_7: 'Friday, January 16 at 7:00 am' },
        },
        common_slot: { type: 'noul', instructions: 'Is there a start time that falls between 8:00 am and 8:00 pm local time for all three teams at once?' },
        still_thursday_ny: { type: 'noul', instructions: 'When the Tokyo team delivers the mock-up, is it still Thursday in New York?' },
      },
    },
  },
  {
    id: 'time-dst-weekly-call',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Appel fixé à 16 h, heure de Paris. Lundi 16 mars : Paris encore UTC+1 → 15 h UTC ; New York déjà UTC−4 → 11 h.
    // Lundi 30 mars : Paris UTC+2 → 14 h UTC ; New York UTC−4 → 10 h. Écart le lundi 23 mars : (+1) − (−4) = 5 h, pas 6.
    // Garde du samedi 28 à 22 h (UTC+1 = 21 h UTC) au dimanche 29 à 6 h (UTC+2 = 4 h UTC) : 7 h réelles.
    expected: { ny_mar_16: 'h11', ny_mar_30: 'h10', gap_6h_mar_23: false, night_shift_hours: 'h7' },
    fr: {
      name: 'Heure d’été décalée',
      description: 'Les États-Unis et la France ne changent pas d’heure le même jour : écart variable pendant trois semaines.',
      state: {
        context: 'Ophélie anime chaque lundi à 16 h, heure de Paris, un appel avec le bureau de New York. Elle assure aussi une garde de nuit à Lyon.',
        paris:
          'Jusqu’au dimanche 29 mars 2026 à 2 h du matin, Paris est à UTC+1. Cette nuit-là, à 2 h, les horloges avancent d’une heure (il est alors 3 h) et Paris passe à UTC+2. Lyon suit la même heure que Paris.',
        new_york: 'Jusqu’au dimanche 8 mars 2026 à 2 h du matin, New York est à UTC−5 ; ensuite, New York est à UTC−4.',
        calls: ['lundi 2 mars 2026', 'lundi 9 mars 2026', 'lundi 16 mars 2026', 'lundi 23 mars 2026', 'lundi 30 mars 2026'],
        night_shift: 'Du samedi 28 mars à 22 h au dimanche 29 mars à 6 h, heure affichée par les horloges de Lyon.',
      },
      questions: {
        ny_mar_16: {
          type: 'choice',
          instructions: 'Quelle heure est-il à New York au début de l’appel du lundi 16 mars ?',
          criteria: { h9: '9 h', h10: '10 h', h11: '11 h', h12: '12 h' },
        },
        ny_mar_30: {
          type: 'choice',
          instructions: 'Quelle heure est-il à New York au début de l’appel du lundi 30 mars ?',
          criteria: { h9: '9 h', h10: '10 h', h11: '11 h', h12: '12 h' },
        },
        gap_6h_mar_23: { type: 'noul', instructions: 'Le lundi 23 mars, le décalage entre Paris et New York est-il de 6 heures ?' },
        night_shift_hours: {
          type: 'choice',
          instructions: 'Combien d’heures réelles dure la garde de nuit d’Ophélie ?',
          criteria: { h7: '7 heures', h8: '8 heures', h9: '9 heures' },
        },
      },
    },
    en: {
      name: 'Staggered daylight saving time',
      description: 'The United States and France do not change their clocks on the same day: a shifting gap for three weeks.',
      state: {
        context: 'Every Monday at 4:00 pm Paris time, Ophélie hosts a call with the New York office. She also works a night shift in Lyon.',
        paris:
          'Until Sunday, March 29, 2026 at 2:00 am, Paris is on UTC+1. That night, at 2:00 am, clocks go forward one hour (it becomes 3:00 am) and Paris moves to UTC+2. Lyon keeps the same time as Paris.',
        new_york: 'Until Sunday, March 8, 2026 at 2:00 am, New York is on UTC−5; after that, New York is on UTC−4.',
        calls: ['Monday, March 2, 2026', 'Monday, March 9, 2026', 'Monday, March 16, 2026', 'Monday, March 23, 2026', 'Monday, March 30, 2026'],
        night_shift: 'From Saturday, March 28 at 10:00 pm to Sunday, March 29 at 6:00 am, as shown on the clocks in Lyon.',
      },
      questions: {
        ny_mar_16: {
          type: 'choice',
          instructions: 'What time is it in New York when the Monday, March 16 call starts?',
          criteria: { h9: '9:00 am', h10: '10:00 am', h11: '11:00 am', h12: '12:00 pm' },
        },
        ny_mar_30: {
          type: 'choice',
          instructions: 'What time is it in New York when the Monday, March 30 call starts?',
          criteria: { h9: '9:00 am', h10: '10:00 am', h11: '11:00 am', h12: '12:00 pm' },
        },
        gap_6h_mar_23: { type: 'noul', instructions: 'On Monday, March 23, is the time difference between Paris and New York 6 hours?' },
        night_shift_hours: {
          type: 'choice',
          instructions: 'How many actual hours does Ophélie’s night shift last?',
          criteria: { h7: '7 hours', h8: '8 hours', h9: '9 hours' },
        },
      },
    },
  },
  {
    id: 'time-oncall-rotation',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Semaines de lundi 9 h à lundi 9 h, à partir du lundi 5 janvier : Alice, Bruno, Chloé, David, puis on recommence.
    // Ven. 27 févr. : 53 jours après le 5 janv. → semaine 7 (7 mod 4 = 3) → David.
    // Lun. 23 mars à 8 h : avant la relève, encore la semaine du 16 mars (semaine 10, 10 mod 4 = 2) → Chloé (David à partir de 9 h).
    // Ven. 10 avr. : 95 jours → semaine 13 (13 mod 4 = 1) → Bruno. Ven. 1er mai : 116 jours → semaine 16 (16 mod 4 = 0) → Alice.
    expected: { feb_27: 'david', mar_23_8am: 'chloe', apr_10: 'bruno', may_1: 'alice' },
    fr: {
      name: 'Rotation d’astreinte',
      description: 'Rotation hebdomadaire à quatre, avec relève le lundi à 9 h.',
      state:
        'L’équipe informatique de la mutuelle Orvel assure une astreinte hebdomadaire. Chaque semaine d’astreinte va du lundi 9 h au lundi suivant 9 h. Le tour est fixe : Alice, puis Bruno, puis Chloé, puis David, puis de nouveau Alice, et ainsi de suite, sans exception. Alice a pris la première astreinte de l’année le lundi 5 janvier 2026 à 9 h.',
      questions: {
        feb_27: {
          type: 'choice',
          instructions: 'Qui est d’astreinte le vendredi 27 février 2026 ?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
        mar_23_8am: {
          type: 'choice',
          instructions: 'Qui est d’astreinte le lundi 23 mars 2026 à 8 h ?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
        apr_10: {
          type: 'choice',
          instructions: 'Qui est d’astreinte le vendredi 10 avril 2026 ?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
        may_1: {
          type: 'choice',
          instructions: 'Qui est d’astreinte le vendredi 1er mai 2026 ?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
      },
    },
    en: {
      name: 'On-call rotation',
      description: 'A four-person weekly rotation, with handover on Mondays at 9 am.',
      state:
        'The IT team at the Orvel insurance company runs a weekly on-call rota. Each on-call week runs from Monday 9:00 am to the following Monday 9:00 am. The order is fixed: Alice, then Bruno, then Chloé, then David, then Alice again, and so on, without exception. Alice took the first on-call week of the year on Monday, January 5, 2026 at 9:00 am.',
      questions: {
        feb_27: {
          type: 'choice',
          instructions: 'Who is on call on Friday, February 27, 2026?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
        mar_23_8am: {
          type: 'choice',
          instructions: 'Who is on call on Monday, March 23, 2026 at 8:00 am?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
        apr_10: {
          type: 'choice',
          instructions: 'Who is on call on Friday, April 10, 2026?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
        may_1: {
          type: 'choice',
          instructions: 'Who is on call on Friday, May 1, 2026?',
          criteria: { alice: 'Alice', bruno: 'Bruno', chloe: 'Chloé', david: 'David' },
        },
      },
    },
  },
  {
    id: 'time-age-on-date',
    category: 'Rules',
    complexity: 'complexe',
    length: 'court',
    // Il faut avoir 18 ans le jour du scrutin (dimanche 7 juin 2026). Lou (14 juin 2008) n’a que 17 ans ce jour-là ;
    // Inès (7 juin 2008) a 18 ans le jour même. Nina (29 février 2008) : en 2026, non bissextile, son anniversaire
    // est réputé tomber le 1er mars → le 28 février 2026, elle a encore 17 ans.
    expected: { lou_can_vote: false, ines_can_vote: true, nina_age: 'a17' },
    fr: {
      name: 'Âge à une date donnée',
      description: 'Majorité atteinte le jour même ou une semaine trop tard, et anniversaire d’une personne née un 29 février.',
      state:
        'Pour voter à l’élection municipale du dimanche 7 juin 2026, il faut avoir 18 ans au plus tard le jour du scrutin. On atteint un âge le jour de son anniversaire. Une personne née un 29 février est réputée avoir son anniversaire le 1er mars les années non bissextiles ; 2026 n’est pas bissextile. Dates de naissance : Lou, 14 juin 2008 ; Inès, 7 juin 2008 ; Nina, 29 février 2008.',
      questions: {
        lou_can_vote: { type: 'noul', instructions: 'Lou peut-elle voter le 7 juin 2026 ?' },
        ines_can_vote: { type: 'noul', instructions: 'Inès peut-elle voter le 7 juin 2026 ?' },
        nina_age: {
          type: 'choice',
          instructions: 'Quel âge Nina a-t-elle le samedi 28 février 2026 ?',
          criteria: { a16: '16 ans', a17: '17 ans', a18: '18 ans' },
        },
      },
    },
    en: {
      name: 'Age on a given date',
      description: 'Coming of age on the day itself or a week too late, and the birthday of someone born on February 29.',
      state:
        'To vote in the municipal election on Sunday, June 7, 2026, you must be 18 on election day at the latest. You reach an age on your birthday. A person born on February 29 is deemed to have their birthday on March 1 in non-leap years; 2026 is not a leap year. Dates of birth: Lou, June 14, 2008; Inès, June 7, 2008; Nina, February 29, 2008.',
      questions: {
        lou_can_vote: { type: 'noul', instructions: 'Can Lou vote on June 7, 2026?' },
        ines_can_vote: { type: 'noul', instructions: 'Can Inès vote on June 7, 2026?' },
        nina_age: {
          type: 'choice',
          instructions: 'How old is Nina on Saturday, February 28, 2026?',
          criteria: { a16: '16 years old', a17: '17 years old', a18: '18 years old' },
        },
      },
    },
  },
  {
    id: 'time-seniority-leave',
    category: 'Rules',
    complexity: 'complexe',
    length: 'court',
    // Ancienneté du 1er sept. 2019, congé sans solde du 1er mars au 31 août 2022 (6 mois) non compté.
    // 1er sept. 2019 → 1er mars 2022 : 2 ans 6 mois. Pour 5 ans, il manque 2 ans 6 mois à partir du 1er sept. 2022 → 1er mars 2025 :
    // atteint au 1er juin 2025. Pour 7 ans, il manque 4 ans 6 mois → 1er mars 2027.
    // Au 31 déc. 2026 : 7 ans 4 mois écoulés − 6 mois = 6 ans 10 mois → 6 années complètes, pas de prime des 7 ans.
    expected: { full_years: 'y6', bonus_7_dec_2026: false, seven_years_date: 'mar_1_2027', five_years_by_june_2025: true },
    fr: {
      name: 'Ancienneté avec congé sans solde',
      description: 'Calcul d’ancienneté dont il faut retrancher six mois de congé non comptés.',
      state:
        'Salomé est entrée chez Maroquinerie Duval le 1er septembre 2019. Elle a pris un congé sans solde du 1er mars 2022 au 31 août 2022 inclus ; selon l’accord d’entreprise, cette période ne compte pas dans l’ancienneté. Aucune autre interruption. L’accord prévoit une prime de fidélité dès 5 ans d’ancienneté, puis une prime majorée dès 7 ans.',
      questions: {
        full_years: {
          type: 'choice',
          instructions: 'Combien d’années complètes d’ancienneté Salomé a-t-elle au 31 décembre 2026 ?',
          criteria: { y5: '5 ans', y6: '6 ans', y7: '7 ans' },
        },
        bonus_7_dec_2026: { type: 'noul', instructions: 'Au 31 décembre 2026, Salomé a-t-elle droit à la prime majorée des 7 ans ?' },
        seven_years_date: {
          type: 'choice',
          instructions: 'À quelle date Salomé atteint-elle 7 ans d’ancienneté ?',
          criteria: { sep_1_2026: '1er septembre 2026', mar_1_2027: '1er mars 2027', sep_1_2027: '1er septembre 2027', mar_1_2026: '1er mars 2026' },
        },
        five_years_by_june_2025: { type: 'noul', instructions: 'Au 1er juin 2025, Salomé avait-elle déjà 5 ans d’ancienneté ?' },
      },
    },
    en: {
      name: 'Seniority with unpaid leave',
      description: 'A length-of-service calculation from which six months of uncounted leave must be subtracted.',
      state:
        'Salomé joined Maroquinerie Duval on September 1, 2019. She took unpaid leave from March 1, 2022 to August 31, 2022 inclusive; under the company agreement, this period does not count towards seniority. There were no other interruptions. The agreement provides a loyalty bonus from 5 years of seniority, then a higher bonus from 7 years.',
      questions: {
        full_years: {
          type: 'choice',
          instructions: 'How many full years of seniority does Salomé have on December 31, 2026?',
          criteria: { y5: '5 years', y6: '6 years', y7: '7 years' },
        },
        bonus_7_dec_2026: { type: 'noul', instructions: 'On December 31, 2026, is Salomé entitled to the higher 7-year bonus?' },
        seven_years_date: {
          type: 'choice',
          instructions: 'On what date does Salomé reach 7 years of seniority?',
          criteria: { sep_1_2026: 'September 1, 2026', mar_1_2027: 'March 1, 2027', sep_1_2027: 'September 1, 2027', mar_1_2026: 'March 1, 2026' },
        },
        five_years_by_june_2025: { type: 'noul', instructions: 'On June 1, 2025, did Salomé already have 5 years of seniority?' },
      },
    },
  },
  {
    id: 'time-relative-chronology',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Signature lundi 9 février. Inspection 3 jours après → jeudi 12. Livraison la veille de l’inspection → mercredi 11.
    // Lancement le lendemain de la livraison → jeudi 12, même jour que l’inspection. Incident le vendredi précédant
    // la signature → vendredi 6 février : premier événement.
    expected: { first_event: 'incident', delivery_date: 'wed_11', kickoff_same_day: true },
    fr: {
      name: 'Chronologie en dates relatives',
      description: 'Événements donnés dans le désordre, chacun daté par rapport à un autre.',
      state:
        'Notes de chantier de la résidence Les Aulnes, dans l’ordre où elles ont été rédigées : « L’inspection a eu lieu trois jours après la signature du contrat. » « La réunion de lancement s’est tenue le lendemain de la livraison des matériaux. » « Le contrat a été signé le lundi 9 février 2026. » « Un incident sur le terrain a été signalé le vendredi précédant la signature du contrat. » « Les matériaux ont été livrés la veille de l’inspection. »',
      questions: {
        first_event: {
          type: 'choice',
          instructions: 'Quel événement a eu lieu en premier ?',
          criteria: { signature: 'La signature du contrat', incident: 'L’incident sur le terrain', delivery: 'La livraison des matériaux', inspection: 'L’inspection' },
        },
        delivery_date: {
          type: 'choice',
          instructions: 'À quelle date les matériaux ont-ils été livrés ?',
          criteria: { tue_10: 'Mardi 10 février', wed_11: 'Mercredi 11 février', thu_12: 'Jeudi 12 février', fri_13: 'Vendredi 13 février' },
        },
        kickoff_same_day: { type: 'noul', instructions: 'La réunion de lancement a-t-elle eu lieu le même jour que l’inspection ?' },
      },
    },
    en: {
      name: 'Chronology from relative dates',
      description: 'Events given out of order, each dated relative to another.',
      state:
        'Site notes for the Les Aulnes residence, in the order they were written: “The inspection took place three days after the contract was signed.” “The kick-off meeting was held the day after the materials were delivered.” “The contract was signed on Monday, February 9, 2026.” “An incident on the site was reported on the Friday before the contract was signed.” “The materials were delivered the day before the inspection.”',
      questions: {
        first_event: {
          type: 'choice',
          instructions: 'Which event happened first?',
          criteria: { signature: 'The contract signing', incident: 'The incident on the site', delivery: 'The delivery of materials', inspection: 'The inspection' },
        },
        delivery_date: {
          type: 'choice',
          instructions: 'On what date were the materials delivered?',
          criteria: { tue_10: 'Tuesday, February 10', wed_11: 'Wednesday, February 11', thu_12: 'Thursday, February 12', fri_13: 'Friday, February 13' },
        },
        kickoff_same_day: { type: 'noul', instructions: 'Did the kick-off meeting take place on the same day as the inspection?' },
      },
    },
  },
  {
    id: 'time-12h-bus-schedule',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // 10:50 pm (22 h 50) → 3:10 am (3 h 10 le lendemain) = 4 h 20 (lire 3:10 pm donnerait 16 h 20).
    // Maya arrive à Hartford à 12:10 am (0 h 10), avant le passage du car à 12:35 am (0 h 35) → elle l’attrape.
    // Navette à 12:15 pm (12 h 15) : attente depuis 3 h 10 = 9 h 05.
    expected: { trip_duration: 'h4_20', maya_catches_bus: true, shuttle_wait: 'h9_05' },
    fr: {
      name: 'Horaires au format 12 heures',
      description: 'Horaires américains am/pm, avec minuit (12 am) et midi (12 pm) à ne pas confondre.',
      state:
        'Horaires du car de nuit d’une compagnie américaine, au format 12 heures (am : de minuit à midi ; pm : de midi à minuit ; 12:xx am correspond à 0 h xx et 12:xx pm à 12 h xx). Départ de Boston le mardi à 10:50 pm ; arrêt à Providence à 11:55 pm ; arrêt à Hartford à 12:35 am ; arrêt à New Haven à 1:25 am ; arrivée à New York à 3:10 am. Maya prévoit d’arriver à la gare routière de Hartford à 12:10 am pour monter dans ce car. À New York, la navette pour l’aéroport part à 12:15 pm.',
      questions: {
        trip_duration: {
          type: 'choice',
          instructions: 'Combien de temps dure le trajet de Boston à New York ?',
          criteria: { h4_20: '4 h 20', h5_20: '5 h 20', h7_40: '7 h 40', h16_20: '16 h 20' },
        },
        maya_catches_bus: { type: 'noul', instructions: 'Maya arrive-t-elle à Hartford avant le passage du car ?' },
        shuttle_wait: {
          type: 'choice',
          instructions: 'Combien de temps un voyageur arrivé à New York par ce car attend-il la navette pour l’aéroport ?',
          criteria: { h1_05: '1 h 05', h9_05: '9 h 05', h21_05: '21 h 05' },
        },
      },
    },
    en: {
      name: '12-hour clock schedule',
      description: 'US am/pm times, with midnight (12 am) and noon (12 pm) not to be confused.',
      state:
        'Night coach schedule from a US bus company, in 12-hour format (am: from midnight to noon; pm: from noon to midnight; 12:xx am is just after midnight and 12:xx pm just after noon). Departs Boston on Tuesday at 10:50 pm; stops in Providence at 11:55 pm; stops in Hartford at 12:35 am; stops in New Haven at 1:25 am; arrives in New York at 3:10 am. Maya plans to get to the Hartford bus station at 12:10 am to board this coach. In New York, the airport shuttle leaves at 12:15 pm.',
      questions: {
        trip_duration: {
          type: 'choice',
          instructions: 'How long is the journey from Boston to New York?',
          criteria: { h4_20: '4 hr 20 min', h5_20: '5 hr 20 min', h7_40: '7 hr 40 min', h16_20: '16 hr 20 min' },
        },
        maya_catches_bus: { type: 'noul', instructions: 'Does Maya get to Hartford before the coach passes through?' },
        shuttle_wait: {
          type: 'choice',
          instructions: 'How long does a passenger arriving in New York on this coach wait for the airport shuttle?',
          criteria: { h1_05: '1 hr 05 min', h9_05: '9 hr 05 min', h21_05: '21 hr 05 min' },
        },
      },
    },
  },
  {
    id: 'time-train-connections',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Arrivée à Montparnasse 8 h 51 + 45 min de transfert minimum = 9 h 36 → le 9 h 30 est manqué, premier train possible 10 h 04.
    // Arrivée à Dijon 12 h 58 ; car de 13 h 15 (17 min ≥ 10 min) → Beaune 14 h 05 (> 14 h). Durée totale 6 h 42 → 14 h 05 = 7 h 23.
    // Temps hors train et car : 8 h 51 → 10 h 04 = 73 min + 12 h 58 → 13 h 15 = 17 min = 1 h 30.
    expected: { first_train: 'h10_04', total_duration: 'h7_23', before_14h: false, connection_time: 1 },
    fr: {
      name: 'Trajet avec correspondances',
      description: 'Correspondances avec temps minimal, train manqué de peu, durée totale porte à porte.',
      state: {
        traveller: 'Mathilde part de Bordeaux pour Beaune le jeudi 4 juin 2026.',
        leg_1: 'TGV Bordeaux-Saint-Jean 6 h 42 → Paris-Montparnasse 8 h 51.',
        transfer_paris: 'Le trajet de Paris-Montparnasse à Paris-Gare-de-Lyon demande au moins 45 minutes.',
        trains_to_dijon: ['Paris-Gare-de-Lyon 9 h 30 → Dijon 11 h 08', 'Paris-Gare-de-Lyon 10 h 04 → Dijon 12 h 58', 'Paris-Gare-de-Lyon 10 h 50 → Dijon 13 h 20'],
        transfer_dijon: 'La correspondance entre le train et le car demande au moins 10 minutes à Dijon.',
        buses_to_beaune: ['Dijon 13 h 15 → Beaune 14 h 05', 'Dijon 15 h 15 → Beaune 16 h 05'],
      },
      questions: {
        first_train: {
          type: 'choice',
          instructions: 'Quel est le premier train pour Dijon que Mathilde peut prendre ?',
          criteria: { h9_30: 'Le 9 h 30', h10_04: 'Le 10 h 04', h10_50: 'Le 10 h 50' },
        },
        total_duration: {
          type: 'choice',
          instructions: 'En prenant les premières correspondances possibles, combien de temps dure le trajet de Bordeaux à Beaune ?',
          criteria: { h6_23: '6 h 23', h7_13: '7 h 13', h7_23: '7 h 23', h8_23: '8 h 23' },
        },
        before_14h: { type: 'noul', instructions: 'Mathilde peut-elle arriver à Beaune avant 14 h ?' },
        connection_time: {
          type: 'score',
          instructions: 'Combien de temps Mathilde passe-t-elle au total hors du train et du car, entre son départ de Bordeaux et son arrivée à Beaune ?',
          criteria: ['Moins d’une heure', 'De 1 h à 1 h 59', 'De 2 h à 2 h 59', '3 heures ou plus'],
        },
      },
    },
    en: {
      name: 'Journey with connections',
      description: 'Connections with minimum transfer times, a train narrowly missed, total door-to-door time.',
      state: {
        traveller: 'Mathilde is travelling from Bordeaux to Beaune on Thursday, June 4, 2026.',
        leg_1: 'TGV Bordeaux-Saint-Jean 6:42 am → Paris-Montparnasse 8:51 am.',
        transfer_paris: 'Getting from Paris-Montparnasse to Paris-Gare-de-Lyon takes at least 45 minutes.',
        trains_to_dijon: ['Paris-Gare-de-Lyon 9:30 am → Dijon 11:08 am', 'Paris-Gare-de-Lyon 10:04 am → Dijon 12:58 pm', 'Paris-Gare-de-Lyon 10:50 am → Dijon 1:20 pm'],
        transfer_dijon: 'Changing from the train to the coach in Dijon takes at least 10 minutes.',
        buses_to_beaune: ['Dijon 1:15 pm → Beaune 2:05 pm', 'Dijon 3:15 pm → Beaune 4:05 pm'],
      },
      questions: {
        first_train: {
          type: 'choice',
          instructions: 'What is the first train to Dijon that Mathilde can take?',
          criteria: { h9_30: 'The 9:30 am', h10_04: 'The 10:04 am', h10_50: 'The 10:50 am' },
        },
        total_duration: {
          type: 'choice',
          instructions: 'Taking the earliest possible connections, how long is the journey from Bordeaux to Beaune?',
          criteria: { h6_23: '6 hr 23 min', h7_13: '7 hr 13 min', h7_23: '7 hr 23 min', h8_23: '8 hr 23 min' },
        },
        before_14h: { type: 'noul', instructions: 'Can Mathilde reach Beaune before 2:00 pm?' },
        connection_time: {
          type: 'score',
          instructions: 'How much time in total does Mathilde spend off the train and coach, between leaving Bordeaux and arriving in Beaune?',
          criteria: ['Less than an hour', '1 hr to 1 hr 59 min', '2 hr to 2 hr 59 min', '3 hours or more'],
        },
      },
    },
  },
  {
    id: 'time-payment-terms',
    category: 'Rules',
    complexity: 'complexe',
    length: 'court',
    // « 45 jours fin de mois » tel que défini : date de facture + 45 jours, puis dernier jour du mois obtenu.
    // F-881 du 15 oct. : + 45 j = 29 nov. → 30 novembre. F-902 du 20 oct. : + 45 j = 4 déc. → 31 décembre.
    // Paiement le 3 décembre : F-881 en retard de 3 jours (1er, 2, 3 déc.) ; F-902 dans les délais.
    expected: { deadline_881: 'nov_30', deadline_902: 'dec_31', days_late_881: 2, on_time_902: true },
    fr: {
      name: 'Échéance à 45 jours fin de mois',
      description: 'Conditions de paiement définies dans l’énoncé, appliquées à deux factures de dates proches.',
      state:
        'Conditions de paiement de l’imprimerie Castagné : « Paiement à 45 jours fin de mois : on ajoute 45 jours à la date de la facture, puis l’échéance est reportée au dernier jour du mois ainsi obtenu. » Octobre compte 31 jours, novembre 30. La facture F-881 est datée du 15 octobre 2026 et la facture F-902 du 20 octobre 2026. Le client règle les deux factures par un virement reçu le 3 décembre 2026.',
      questions: {
        deadline_881: {
          type: 'choice',
          instructions: 'Quelle est la date d’échéance de la facture F-881 ?',
          criteria: { nov_15: '15 novembre 2026', nov_29: '29 novembre 2026', nov_30: '30 novembre 2026', dec_31: '31 décembre 2026' },
        },
        deadline_902: {
          type: 'choice',
          instructions: 'Quelle est la date d’échéance de la facture F-902 ?',
          criteria: { nov_30: '30 novembre 2026', dec_4: '4 décembre 2026', dec_31: '31 décembre 2026', jan_31: '31 janvier 2027' },
        },
        days_late_881: {
          type: 'score',
          instructions: 'Avec combien de jours de retard la facture F-881 est-elle payée ?',
          criteria: ['Aucun retard', '1 ou 2 jours', '3 à 5 jours', '6 jours ou plus'],
        },
        on_time_902: { type: 'noul', instructions: 'La facture F-902 est-elle payée dans les délais ?' },
      },
    },
    en: {
      name: '45 days end of month',
      description: 'Payment terms defined in the text, applied to two invoices with close dates.',
      state:
        'Payment terms of the Castagné print shop: “Payment at 45 days end of month: add 45 days to the invoice date, then the due date is moved to the last day of the month thus reached.” October has 31 days, November 30. Invoice F-881 is dated October 15, 2026 and invoice F-902 October 20, 2026. The customer pays both invoices by a bank transfer received on December 3, 2026.',
      questions: {
        deadline_881: {
          type: 'choice',
          instructions: 'What is the due date of invoice F-881?',
          criteria: { nov_15: 'November 15, 2026', nov_29: 'November 29, 2026', nov_30: 'November 30, 2026', dec_31: 'December 31, 2026' },
        },
        deadline_902: {
          type: 'choice',
          instructions: 'What is the due date of invoice F-902?',
          criteria: { nov_30: 'November 30, 2026', dec_4: 'December 4, 2026', dec_31: 'December 31, 2026', jan_31: 'January 31, 2027' },
        },
        days_late_881: {
          type: 'score',
          instructions: 'How many days late is invoice F-881 paid?',
          criteria: ['Not late', '1 or 2 days', '3 to 5 days', '6 days or more'],
        },
        on_time_902: { type: 'noul', instructions: 'Is invoice F-902 paid on time?' },
      },
    },
  },
  {
    id: 'time-recurring-cycles',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Arrosage tous les 10 jours depuis le mardi 3 mars : 3, 13, 23 mars, 2, 12 avril… → le 12 avril (5ᵉ) en fait partie.
    // 12 avril = 3 mars + 40 jours = 5 semaines + 5 jours → mardi + 5 = dimanche.
    // Filtre toutes les 6 semaines (42 jours) : coïncidence après ppcm(10, 42) = 210 jours → 3 mars + 210 = mardi 29 septembre.
    expected: { april_12_watering: true, fifth_weekday: 'sunday', first_coincidence: 'sep_29' },
    fr: {
      name: 'Tâches périodiques',
      description: 'Cycles de 10 jours et de 6 semaines partant du même jour, prochaine coïncidence.',
      state:
        'Le jardinier de la serre municipale arrose les orchidées tous les 10 jours et remplace le filtre de l’humidificateur toutes les 6 semaines. Les deux tâches ont été faites ensemble le mardi 3 mars 2026, qui compte comme le 1er arrosage. Mars compte 31 jours, avril 30, mai 31, juin 30, juillet 31, août 31.',
      questions: {
        april_12_watering: { type: 'noul', instructions: 'Le 12 avril 2026 est-il un jour d’arrosage ?' },
        fifth_weekday: {
          type: 'choice',
          instructions: 'Quel jour de la semaine tombe le 5ᵉ arrosage ?',
          criteria: { thursday: 'Jeudi', saturday: 'Samedi', sunday: 'Dimanche', monday: 'Lundi' },
        },
        first_coincidence: {
          type: 'choice',
          instructions: 'Après le 3 mars, à quelle date les deux tâches retombent-elles pour la première fois le même jour ?',
          criteria: { apr_14: '14 avril 2026', jun_9: '9 juin 2026', sep_29: '29 septembre 2026', dec_8: '8 décembre 2026' },
        },
      },
    },
    en: {
      name: 'Recurring tasks',
      description: '10-day and 6-week cycles starting on the same day, next time they coincide.',
      state:
        'The gardener at the municipal greenhouse waters the orchids every 10 days and replaces the humidifier filter every 6 weeks. Both tasks were done together on Tuesday, March 3, 2026, which counts as the 1st watering. March has 31 days, April 30, May 31, June 30, July 31, August 31.',
      questions: {
        april_12_watering: { type: 'noul', instructions: 'Is April 12, 2026 a watering day?' },
        fifth_weekday: {
          type: 'choice',
          instructions: 'On what day of the week does the 5th watering fall?',
          criteria: { thursday: 'Thursday', saturday: 'Saturday', sunday: 'Sunday', monday: 'Monday' },
        },
        first_coincidence: {
          type: 'choice',
          instructions: 'After March 3, on what date do the two tasks next fall on the same day?',
          criteria: { apr_14: 'April 14, 2026', jun_9: 'June 9, 2026', sep_29: 'September 29, 2026', dec_8: 'December 8, 2026' },
        },
      },
    },
  },
  {
    id: 'time-iso-weeks',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // 1er janv. 2026 = jeudi → semaine 1 = lundi 29 déc. 2025 – dimanche 4 janv. 2026 : le 31 déc. 2025 y appartient.
    // 18 mars 2026 : le lundi 16 mars tombe 77 jours (11 semaines) après le lundi 29 déc. → semaine 12.
    // 31 déc. 2026 est aussi un jeudi (365 jours = 52 semaines + 1) : sa semaine (lun. 28 déc. – dim. 3 janv.) est la 53ᵉ de 2026,
    // donc le vendredi 1er janv. 2027 n’est pas en semaine 1 de 2027.
    expected: { dec_31_2025_week_1: true, week_mar_18: 'w12', jan_1_2027_week_1: false },
    fr: {
      name: 'Numéros de semaine ISO',
      description: 'Semaines ISO définies dans l’énoncé, à cheval sur deux années.',
      state:
        'Le service paie numérote les semaines selon la norme ISO : une semaine va du lundi au dimanche ; la semaine 1 d’une année est celle qui contient le premier jeudi de cette année ; une semaine appartient à l’année dans laquelle tombe son jeudi. Le 1er janvier 2026 est un jeudi ; 2026 n’est pas bissextile (365 jours).',
      questions: {
        dec_31_2025_week_1: { type: 'noul', instructions: 'Le mercredi 31 décembre 2025 appartient-il à la semaine 1 de 2026 ?' },
        week_mar_18: {
          type: 'choice',
          instructions: 'Quel est le numéro de semaine du mercredi 18 mars 2026 ?',
          criteria: { w11: 'Semaine 11', w12: 'Semaine 12', w13: 'Semaine 13' },
        },
        jan_1_2027_week_1: { type: 'noul', instructions: 'Le vendredi 1er janvier 2027 appartient-il à la semaine 1 de 2027 ?' },
      },
    },
    en: {
      name: 'ISO week numbers',
      description: 'ISO weeks defined in the text, straddling two years.',
      state:
        'The payroll department numbers weeks according to the ISO standard: a week runs from Monday to Sunday; week 1 of a year is the week containing that year’s first Thursday; a week belongs to the year in which its Thursday falls. January 1, 2026 is a Thursday; 2026 is not a leap year (365 days).',
      questions: {
        dec_31_2025_week_1: { type: 'noul', instructions: 'Does Wednesday, December 31, 2025 belong to week 1 of 2026?' },
        week_mar_18: {
          type: 'choice',
          instructions: 'What is the week number of Wednesday, March 18, 2026?',
          criteria: { w11: 'Week 11', w12: 'Week 12', w13: 'Week 13' },
        },
        jan_1_2027_week_1: { type: 'noul', instructions: 'Does Friday, January 1, 2027 belong to week 1 of 2027?' },
      },
    },
  },
  {
    id: 'time-notice-period',
    category: 'Rules',
    complexity: 'complexe',
    length: 'court',
    // Fin du préavis = même quantième que la notification (30), n mois plus tard, sinon dernier jour du mois.
    // 1 mois après le 30 janvier 2026 : pas de 30 février → 28 février 2026. 2 mois : 30 mars 2026.
    // En 2028 (bissextile), 1 mois → 29 février 2028, pas le 28 : la date de fin change.
    expected: { end_one_month: 'feb_28', end_two_months: 'mar_30', same_in_2028: false },
    fr: {
      name: 'Fin de préavis',
      description: 'Préavis d’un ou deux mois à partir d’un 30 janvier, avec un février court.',
      state:
        'Accord d’entreprise de la société Brennac : « Le préavis commence le lendemain de la notification de la démission. Il prend fin, selon sa durée, le même jour du mois que la date de notification, un ou deux mois plus tard ; si ce jour n’existe pas dans le mois, il prend fin le dernier jour de ce mois. » Le préavis est d’un mois pour les employés et de deux mois pour les cadres. Léo (employé) et Rania (cadre) notifient tous deux leur démission le vendredi 30 janvier 2026. 2026 n’est pas bissextile ; 2028 l’est.',
      questions: {
        end_one_month: {
          type: 'choice',
          instructions: 'Quand le préavis de Léo prend-il fin ?',
          criteria: { feb_27: '27 février 2026', feb_28: '28 février 2026', mar_1: '1er mars 2026', mar_2: '2 mars 2026' },
        },
        end_two_months: {
          type: 'choice',
          instructions: 'Quand le préavis de Rania prend-il fin ?',
          criteria: { mar_28: '28 mars 2026', mar_30: '30 mars 2026', mar_31: '31 mars 2026', apr_1: '1er avril 2026' },
        },
        same_in_2028: { type: 'noul', instructions: 'Si Léo avait notifié sa démission le 30 janvier 2028, son préavis aurait-il pris fin le 28 février, comme en 2026 ?' },
      },
    },
    en: {
      name: 'End of notice period',
      description: 'One- or two-month notice from a January 30, with a short February.',
      state:
        'Company agreement at Brennac: “The notice period starts on the day after the resignation is notified. Depending on its length, it ends on the same day of the month as the notification date, one or two months later; if that day does not exist in the month, it ends on the last day of that month.” Notice is one month for employees and two months for managers. Léo (employee) and Rania (manager) both notify their resignation on Friday, January 30, 2026. 2026 is not a leap year; 2028 is.',
      questions: {
        end_one_month: {
          type: 'choice',
          instructions: 'When does Léo’s notice period end?',
          criteria: { feb_27: 'February 27, 2026', feb_28: 'February 28, 2026', mar_1: 'March 1, 2026', mar_2: 'March 2, 2026' },
        },
        end_two_months: {
          type: 'choice',
          instructions: 'When does Rania’s notice period end?',
          criteria: { mar_28: 'March 28, 2026', mar_30: 'March 30, 2026', mar_31: 'March 31, 2026', apr_1: 'April 1, 2026' },
        },
        same_in_2028: { type: 'noul', instructions: 'Had Léo notified his resignation on January 30, 2028, would his notice have ended on February 28, as in 2026?' },
      },
    },
  },
  {
    id: 'time-timesheet-total',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // 1 h 45 + 2 h 30 + 0 h 50 + 3 h 15 + 1 h 20 = 105 + 150 + 50 + 195 + 80 = 580 min = 9 h 40 (< 10 h).
    // Facturation 580 / 60 × 60 € = 580 €. Erreur typique : additionner comme des décimaux (8,60 h → 516 €).
    expected: { total_time: 'h9_40', over_10h: false, invoice: 'eur_580' },
    fr: {
      name: 'Total d’une feuille de temps',
      description: 'Addition d’heures et de minutes, à ne pas traiter comme des nombres décimaux.',
      state:
        'Feuille de temps d’Aïcha, consultante, pour le client Verbois (semaine du 9 mars 2026) : lundi 1 h 45 ; mardi 2 h 30 ; mercredi 50 min ; jeudi 3 h 15 ; vendredi 1 h 20. Son taux horaire est de 60 € HT, facturé à la minute près.',
      questions: {
        total_time: {
          type: 'choice',
          instructions: 'Combien de temps Aïcha a-t-elle passé au total pour Verbois cette semaine ?',
          criteria: { h8_60: '8 h 60', h9_00: '9 h 00', h9_40: '9 h 40', h10_20: '10 h 20' },
        },
        over_10h: { type: 'noul', instructions: 'Le total dépasse-t-il 10 heures ?' },
        invoice: {
          type: 'choice',
          instructions: 'Quel montant HT Aïcha doit-elle facturer pour cette semaine ?',
          criteria: { eur_516: '516 €', eur_540: '540 €', eur_580: '580 €', eur_600: '600 €' },
        },
      },
    },
    en: {
      name: 'Timesheet total',
      description: 'Adding hours and minutes, not to be treated as decimal numbers.',
      state:
        'Timesheet of Aïcha, a consultant, for the client Verbois (week of March 9, 2026): Monday 1 hr 45 min; Tuesday 2 hr 30 min; Wednesday 50 min; Thursday 3 hr 15 min; Friday 1 hr 20 min. Her hourly rate is €60 excluding VAT, billed to the minute.',
      questions: {
        total_time: {
          type: 'choice',
          instructions: 'How much time did Aïcha spend in total on Verbois this week?',
          criteria: { h8_60: '8 hr 60 min', h9_00: '9 hr 00 min', h9_40: '9 hr 40 min', h10_20: '10 hr 20 min' },
        },
        over_10h: { type: 'noul', instructions: 'Does the total exceed 10 hours?' },
        invoice: {
          type: 'choice',
          instructions: 'What amount excluding VAT should Aïcha invoice for this week?',
          criteria: { eur_516: '€516', eur_540: '€540', eur_580: '€580', eur_600: '€600' },
        },
      },
    },
  },
  {
    id: 'time-log-timezones',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Serveur A en UTC, serveur B en heure de Paris (UTC+2 en juillet) : on retire 2 h aux horodatages de B.
    // Erreur 09:59:30 Paris = 07:59:30 UTC : après le début du déploiement (07:58:12), avant sa fin (08:03:40).
    // Retour à la normale 10:06:00 Paris = 08:06:00 UTC, soit 2 min 20 s après la fin du déploiement (sans conversion : 2 h 2 min 20 s).
    expected: { error_before_deploy_end: true, error_before_deploy_start: false, recovery_delay: 'm2_20' },
    fr: {
      name: 'Journaux sur deux fuseaux',
      description: 'Deux serveurs qui n’horodatent pas dans le même fuseau : il faut convertir avant de comparer.',
      state: {
        context: 'Incident du mardi 14 juillet 2026. En juillet, l’heure de Paris est UTC+2.',
        server_a: {
          timezone: 'UTC',
          log: ['07:58:12 déploiement de la version 4.2 lancé', '08:03:40 déploiement de la version 4.2 terminé', '08:15:02 sauvegarde quotidienne lancée'],
        },
        server_b: {
          timezone: 'heure de Paris',
          log: ['09:52:10 contrôle de santé OK', '09:59:30 première erreur 500 sur /paiement', '10:02:05 alerte envoyée à l’astreinte', '10:06:00 taux d’erreur revenu à la normale'],
        },
      },
      questions: {
        error_before_deploy_end: { type: 'noul', instructions: 'La première erreur 500 est-elle survenue avant la fin du déploiement ?' },
        error_before_deploy_start: { type: 'noul', instructions: 'La première erreur 500 est-elle survenue avant le lancement du déploiement ?' },
        recovery_delay: {
          type: 'choice',
          instructions: 'Combien de temps après la fin du déploiement le taux d’erreur est-il revenu à la normale ?',
          criteria: { m2_20: '2 min 20 s', m6_30: '6 min 30 s', h1_57_40: '1 h 57 min 40 s', h2_02_20: '2 h 2 min 20 s' },
        },
      },
    },
    en: {
      name: 'Logs across two time zones',
      description: 'Two servers that timestamp in different time zones: convert before comparing.',
      state: {
        context: 'Incident on Tuesday, July 14, 2026. In July, Paris time is UTC+2.',
        server_a: {
          timezone: 'UTC',
          log: ['07:58:12 deployment of version 4.2 started', '08:03:40 deployment of version 4.2 finished', '08:15:02 daily backup started'],
        },
        server_b: {
          timezone: 'Paris time',
          log: ['09:52:10 health check OK', '09:59:30 first 500 error on /payment', '10:02:05 alert sent to on-call', '10:06:00 error rate back to normal'],
        },
      },
      questions: {
        error_before_deploy_end: { type: 'noul', instructions: 'Did the first 500 error occur before the deployment finished?' },
        error_before_deploy_start: { type: 'noul', instructions: 'Did the first 500 error occur before the deployment started?' },
        recovery_delay: {
          type: 'choice',
          instructions: 'How long after the deployment finished did the error rate return to normal?',
          criteria: { m2_20: '2 min 20 s', m6_30: '6 min 30 s', h1_57_40: '1 h 57 min 40 s', h2_02_20: '2 h 2 min 20 s' },
        },
      },
    },
  },
  {
    id: 'time-nurse-roster',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'long',
    // Repos entre deux postes (fin → début) : seule Coline enchaîne soir le mer. 11 (fin 22 h) et matin le jeu. 12 (début 6 h) → 8 h < 11 h.
    // Heures par semaine (M, S, N = 8 h ; J = 12 h ; nuit comptée le jour où elle commence) :
    // Aurore 40 + 48 = 88 ; Basile 56 (4 J + 1 M) + 32 → dépasse 48 h en semaine 1 ; Coline 32 + 32 ; Damien 32 + 32 ; Elsa 40 + 32.
    // Jours consécutifs : Damien travaille du jeu. 5 au mar. 10 = 6 jours ; Elsa du ven. 6 au mar. 10 = 5 jours (autorisé).
    // Elsa en semaine 1 : 5 nuits = 40 h, pas plus (la nuit du dimanche 8 est comptée entièrement en semaine 1).
    // Aurore : 88 h → tranche « 81 à 90 h » (en comptant les journées longues à 8 h on trouverait 80 h).
    expected: { rest_violation: 'coline', over_48h: true, consecutive_days: 'damien', elsa_week1_over_40: false, aurore_hours: 2 },
    fr: {
      name: 'Planning infirmier sur deux semaines',
      description: 'Planning de 14 jours pour cinq soignants, à confronter aux règles de repos, de durée hebdomadaire et de jours consécutifs.',
      state: {
        service: 'Unité de soins continus — planning du lundi 2 au dimanche 15 mars 2026',
        shifts: {
          matin: '6 h – 14 h (8 h)',
          soir: '14 h – 22 h (8 h)',
          nuit: '22 h – 6 h le lendemain (8 h)',
          'journée longue': '8 h – 20 h (12 h)',
        },
        rules: [
          'Semaine 1 : du lundi 2 au dimanche 8 mars. Semaine 2 : du lundi 9 au dimanche 15 mars.',
          'Un poste de nuit est rattaché au jour où il commence et compté en entier dans la semaine de ce jour.',
          'Repos minimal de 11 heures entre la fin d’un poste et le début du suivant.',
          'Au plus 48 heures de travail par semaine.',
          'Au plus 5 jours travaillés consécutifs (un poste de nuit compte pour le jour où il commence).',
          'Les jours non listés sont des jours de repos.',
        ],
        planning: roster('fr'),
      },
      questions: {
        rest_violation: {
          type: 'choice',
          instructions: 'Quel soignant ne respecte pas le repos minimal de 11 heures entre deux postes ?',
          criteria: { aurore: 'Aurore', basile: 'Basile', coline: 'Coline', damien: 'Damien', elsa: 'Elsa' },
        },
        over_48h: { type: 'noul', instructions: 'Un soignant dépasse-t-il 48 heures de travail sur l’une des deux semaines ?' },
        consecutive_days: {
          type: 'choice',
          instructions: 'Quel soignant travaille plus de 5 jours consécutifs ?',
          criteria: { aurore: 'Aurore', basile: 'Basile', coline: 'Coline', damien: 'Damien', elsa: 'Elsa' },
        },
        elsa_week1_over_40: { type: 'noul', instructions: 'Elsa travaille-t-elle plus de 40 heures en semaine 1 ?' },
        aurore_hours: {
          type: 'score',
          instructions: 'Combien d’heures Aurore travaille-t-elle au total sur les deux semaines ?',
          criteria: ['64 h ou moins', 'De 65 à 80 h', 'De 81 à 90 h', 'Plus de 90 h'],
        },
      },
    },
    en: {
      name: 'Two-week nursing roster',
      description: 'A 14-day roster for five carers, to be checked against rest, weekly hours and consecutive-day rules.',
      state: {
        service: 'Continuing care unit — roster from Monday, March 2 to Sunday, March 15, 2026',
        shifts: {
          morning: '6 am – 2 pm (8 hr)',
          evening: '2 pm – 10 pm (8 hr)',
          night: '10 pm – 6 am the next day (8 hr)',
          'long day': '8 am – 8 pm (12 hr)',
        },
        rules: [
          'Week 1: Monday, March 2 to Sunday, March 8. Week 2: Monday, March 9 to Sunday, March 15.',
          'A night shift belongs to the day it starts and counts in full towards that day’s week.',
          'Minimum rest of 11 hours between the end of one shift and the start of the next.',
          'At most 48 hours of work per week.',
          'At most 5 consecutive working days (a night shift counts for the day it starts).',
          'Days not listed are rest days.',
        ],
        planning: roster('en'),
      },
      questions: {
        rest_violation: {
          type: 'choice',
          instructions: 'Which carer does not respect the 11-hour minimum rest between two shifts?',
          criteria: { aurore: 'Aurore', basile: 'Basile', coline: 'Coline', damien: 'Damien', elsa: 'Elsa' },
        },
        over_48h: { type: 'noul', instructions: 'Does any carer work more than 48 hours in either of the two weeks?' },
        consecutive_days: {
          type: 'choice',
          instructions: 'Which carer works more than 5 consecutive days?',
          criteria: { aurore: 'Aurore', basile: 'Basile', coline: 'Coline', damien: 'Damien', elsa: 'Elsa' },
        },
        elsa_week1_over_40: { type: 'noul', instructions: 'Does Elsa work more than 40 hours in week 1?' },
        aurore_hours: {
          type: 'score',
          instructions: 'How many hours does Aurore work in total over the two weeks?',
          criteria: ['64 hr or less', '65 to 80 hr', '81 to 90 hr', 'More than 90 hr'],
        },
      },
    },
  },
  {
    id: 'time-support-sla',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'long',
    // Délai de première réponse compté en heures ouvrées (lun.–ven., 9 h–18 h, hors 1er et 8 mai), limite 4 h.
    // T-303 : 9 h → 13 h 20 = 4 h 20 (dépassé) ; T-306 : 11 h 30 → 16 h 45 = 5 h 15 (dépassé, le plus long) ;
    // T-307 (samedi) : lun. 9 h → 13 h 30 = 4 h 30 (dépassé) ; T-310 : 40 min + 3 h 45 = 4 h 25 (dépassé) ;
    // T-313 (créé le 8 mai, férié) : lun. 11 mai 9 h → 13 h 10 = 4 h 10 (dépassé). Total : 5 dépassements.
    // T-305 : jeu. 30 avr. 17 h → 18 h (1 h) + lun. 4 mai 9 h → 10 h (1 h) = 2 h, dans les temps malgré 89 h calendaires.
    // T-311 : 2 h + 30 min = 2 h 30. Autres : T-301 2 h 25, T-302 2 h 40, T-304 3 h 55, T-308 3 h 40, T-309 3 h 30, T-312 3 h 59.
    // Par agent : Léna 3 (T-306, T-307, T-313), Yanis 2 (T-303, T-310), Marc 0. Oublier les fériés ajoute T-305 et T-311 (7 dépassements).
    expected: { breach_count: 3, longest_ticket: 't306', t305_breach: false, t313_breach: true, agent_most_breaches: 'lena' },
    fr: {
      name: 'Délais de réponse du support',
      description: 'Treize tickets à confronter à un délai de 4 heures ouvrées, week-end et jours fériés compris.',
      state: {
        policy: [
          'Engagement : première réponse sous 4 heures ouvrées après la création du ticket.',
          'Heures ouvrées : du lundi au vendredi, de 9 h à 18 h (heure de Paris), hors jours fériés. Seul le temps passé dans ces plages compte.',
          'Un ticket créé en dehors des heures ouvrées commence à compter à la prochaine ouverture.',
          'Jours fériés de la période : vendredi 1er mai 2026 et vendredi 8 mai 2026.',
          'Un ticket dépasse l’engagement si plus de 4 heures ouvrées s’écoulent avant la première réponse.',
        ],
        tickets: tickets('fr'),
      },
      questions: {
        breach_count: {
          type: 'score',
          instructions: 'Combien de tickets dépassent l’engagement de 4 heures ouvrées ?',
          criteria: ['Aucun', '1 ou 2', '3 ou 4', '5 ou 6', '7 ou plus'],
        },
        longest_ticket: {
          type: 'choice',
          instructions: 'Quel ticket a attendu le plus d’heures ouvrées avant sa première réponse ?',
          criteria: { t305: 'T-305', t306: 'T-306', t311: 'T-311', t313: 'T-313' },
        },
        t305_breach: { type: 'noul', instructions: 'Le ticket T-305 dépasse-t-il l’engagement ?' },
        t313_breach: { type: 'noul', instructions: 'Le ticket T-313 dépasse-t-il l’engagement ?' },
        agent_most_breaches: {
          type: 'choice',
          instructions: 'Quel agent a le plus de tickets hors engagement ?',
          criteria: { yanis: 'Yanis', lena: 'Léna', marc: 'Marc' },
        },
      },
    },
    en: {
      name: 'Support response times',
      description: 'Thirteen tickets to check against a 4-business-hour target, weekend and public holidays included.',
      state: {
        policy: [
          'Commitment: first response within 4 business hours of the ticket being created.',
          'Business hours: Monday to Friday, 9:00 am to 6:00 pm (Paris time), excluding public holidays. Only time within these hours counts.',
          'A ticket created outside business hours starts counting at the next opening.',
          'Public holidays in the period: Friday, May 1, 2026 and Friday, May 8, 2026.',
          'A ticket breaches the commitment if more than 4 business hours pass before the first response.',
        ],
        tickets: tickets('en'),
      },
      questions: {
        breach_count: {
          type: 'score',
          instructions: 'How many tickets breach the 4-business-hour commitment?',
          criteria: ['None', '1 or 2', '3 or 4', '5 or 6', '7 or more'],
        },
        longest_ticket: {
          type: 'choice',
          instructions: 'Which ticket waited the most business hours before its first response?',
          criteria: { t305: 'T-305', t306: 'T-306', t311: 'T-311', t313: 'T-313' },
        },
        t305_breach: { type: 'noul', instructions: 'Does ticket T-305 breach the commitment?' },
        t313_breach: { type: 'noul', instructions: 'Does ticket T-313 breach the commitment?' },
        agent_most_breaches: {
          type: 'choice',
          instructions: 'Which agent has the most tickets that breach the commitment?',
          criteria: { yanis: 'Yanis', lena: 'Léna', marc: 'Marc' },
        },
      },
    },
  },
]
