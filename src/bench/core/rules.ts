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

const HOME_POLICY = {
  fr: `Contrat Habitation « Sérénité » — Conditions générales (édition 2026)

Article 1 — Objet du contrat
Le présent contrat garantit la résidence principale désignée aux conditions particulières, ainsi que les biens mobiliers qu’elle contient, contre les événements énumérés aux articles 3 à 5, dans les limites fixées aux articles 6 à 9.

Article 2 — Définitions
Effraction : forcement, dégradation ou destruction de tout dispositif de fermeture extérieur (porte, fenêtre, volet, serrure).
Objets de valeur : bijoux, montres, pierres précieuses, œuvres d’art et objets de collection dont la valeur unitaire dépasse 1 500 €.
Appareils électroniques : téléviseurs, ordinateurs, tablettes, téléphones, consoles, matériel audio et photo.
Inoccupation : absence de toute personne dans le logement, de jour comme de nuit.

Article 3 — Dégâts des eaux
Sont garantis les dommages causés par les fuites et ruptures accidentelles de canalisations, les débordements d’appareils à effet d’eau et les infiltrations par la toiture. Sont exclus les dommages résultant d’un défaut d’entretien connu de l’assuré, ainsi que les frais de recherche de fuite au-delà de 1 000 €.

Article 4 — Vol et vandalisme
Le vol est garanti lorsqu’il est commis par effraction, par escalade, par usage de fausses clés ou avec violences sur les occupants. Le vol commis sans aucune de ces circonstances, notamment lorsque la porte n’était pas verrouillée, n’est pas garanti. Les actes de vandalisme commis à l’occasion d’un vol garanti sont couverts dans les mêmes conditions.

Article 5 — Bris de glace
Sont garantis les bris des vitres, baies vitrées et plaques de cuisson vitrocéramiques. Les miroirs et les écrans d’appareils électroniques sont exclus de cette garantie.

Article 6 — Plafonds d’indemnisation
Mobilier et biens personnels : 40 000 € par sinistre.
Objets de valeur : 8 000 € par sinistre au total, quel que soit le nombre d’objets ; ce plafond est inclus dans celui du mobilier.
Espèces, chèques et cartes de paiement : 300 € par sinistre.

Article 7 — Évaluation des biens
Les biens sont indemnisés en valeur d’usage : valeur de remplacement à neuf diminuée d’un abattement pour vétusté de 10 % par année d’ancienneté complète, dans la limite de 50 %. Les objets de valeur et les espèces ne subissent aucun abattement pour vétusté. Lorsque l’option « valeur à neuf » figure aux conditions particulières, aucun abattement n’est appliqué aux biens de moins de cinq ans.

Article 8 — Déclaration du sinistre
L’assuré déclare le sinistre dans les 5 jours ouvrés suivant sa découverte, ramenés à 2 jours ouvrés en cas de vol. En cas de vol, il dépose plainte auprès des autorités et joint le récépissé à sa déclaration. Les factures, photographies ou certificats d’authenticité établissant l’existence et la valeur des biens sont transmis dans les 30 jours.

Article 9 — Franchise
Une franchise de 250 € est déduite de l’indemnité de chaque sinistre, après application des plafonds. Elle est ramenée à 150 € pour le bris de glace.

Article 10 — Cotisation
La cotisation est annuelle et payable d’avance. Le paiement mensuel par prélèvement est possible sans frais. En cas de non-paiement, les garanties sont suspendues 30 jours après l’envoi d’une mise en demeure.

Article 11 — Résiliation
L’assuré peut résilier le contrat à tout moment après la première année, avec effet un mois après réception de sa demande. L’assureur peut le résilier après un sinistre, avec un préavis d’un mois.

Article 12 — Subrogation
Après indemnisation, l’assureur est subrogé dans les droits de l’assuré contre le responsable du sinistre.

Article 13 — Inoccupation prolongée
Lorsque le logement est inoccupé plus de 60 jours consécutifs, la garantie vol est suspendue à compter du 61e jour d’inoccupation et jusqu’au retour de l’assuré. Cette suspension ne s’applique pas si le logement est équipé d’une alarme reliée à un centre de télésurveillance ; une alarme sonore non reliée ne suffit pas.

Article 14 — Réclamations
Toute réclamation est adressée au service clients, puis, à défaut de réponse satisfaisante sous deux mois, au médiateur de l’assurance.`,
  en: `“Serenity” Home Insurance — General terms and conditions (2026 edition)

Article 1 — Purpose of the contract
This contract covers the primary residence named in the specific conditions, and the personal property it contains, against the events listed in Articles 3 to 5, within the limits set in Articles 6 to 9.

Article 2 — Definitions
Break-in: forcing, damaging or destroying any external locking device (door, window, shutter, lock).
Valuables: jewelry, watches, precious stones, works of art and collectibles with a unit value above €1,500.
Electronic devices: televisions, computers, tablets, phones, game consoles, audio and photo equipment.
Vacancy: no one present in the home, day or night.

Article 3 — Water damage
Covered: damage caused by accidental leaks and bursts of pipes, overflowing water appliances and leaks through the roof. Excluded: damage resulting from a lack of maintenance known to the policyholder, and leak detection costs above €1,000.

Article 4 — Theft and vandalism
Theft is covered when committed by break-in, by climbing in, with false keys or with violence against the occupants. Theft committed without any of these circumstances, in particular when the door was not locked, is not covered. Vandalism committed during a covered theft is covered under the same conditions.

Article 5 — Glass breakage
Covered: breakage of windows, glass doors and glass-ceramic cooktops. Mirrors and screens of electronic devices are excluded from this cover.

Article 6 — Compensation limits
Furniture and personal property: €40,000 per claim.
Valuables: €8,000 per claim in total, whatever the number of items; this limit is included in the furniture limit.
Cash, checks and payment cards: €300 per claim.

Article 7 — Valuation of property
Property is compensated at its depreciated value: the cost of replacing it new, minus a depreciation of 10% per full year of age, up to a maximum of 50%. Valuables and cash are not depreciated. When the “new-for-old” option appears in the specific conditions, no depreciation is applied to items less than five years old.

Article 8 — Reporting a claim
The policyholder reports the claim within 5 working days of discovering it, reduced to 2 working days for theft. For theft, the policyholder files a police report and attaches the receipt to the claim. Invoices, photographs or certificates of authenticity proving the existence and value of the items are sent within 30 days.

Article 9 — Deductible
A deductible of €250 is subtracted from the compensation for each claim, after the limits have been applied. It is reduced to €150 for glass breakage.

Article 10 — Premium
The premium is annual and payable in advance. Monthly payment by direct debit is available at no extra cost. If the premium is not paid, cover is suspended 30 days after a formal notice is sent.

Article 11 — Cancellation
The policyholder may cancel the contract at any time after the first year, effective one month after the request is received. The insurer may cancel it after a claim, with one month’s notice.

Article 12 — Subrogation
After paying compensation, the insurer takes over the policyholder’s rights against whoever caused the loss.

Article 13 — Extended vacancy
When the home is vacant for more than 60 consecutive days, theft cover is suspended from the 61st day of vacancy until the policyholder returns. This suspension does not apply if the home is equipped with an alarm connected to a remote monitoring center; a standalone siren alarm that is not connected is not enough.

Article 14 — Complaints
Complaints are sent to customer service and then, if no satisfactory answer is received within two months, to the insurance ombudsman.`,
}

const HOME_CLAIM = {
  fr: `Conditions particulières — M. et Mme Lemaire
Résidence principale : appartement de 4 pièces à Nantes. Option « valeur à neuf » : non souscrite. Équipement : alarme sonore, non reliée à un centre de télésurveillance.

Déclaration de sinistre
Les Lemaire ont quitté leur appartement le 1er juillet 2026 pour leur maison de vacances et n’y sont revenus que le 15 septembre au soir ; personne n’y est entré entre-temps. À leur retour, ils constatent que la serrure de la porte d’entrée a été forcée. Les images de la caméra du hall de l’immeuble, saisies par la police, établissent que le cambriolage a eu lieu le 20 août 2026. Plainte déposée et sinistre déclaré le 16 septembre, factures et certificat jointes.
Biens volés :
— une montre achetée 3 200 € il y a trois ans ;
— un collier estimé à 6 500 € (certificat d’un joaillier) ;
— un téléviseur acheté neuf il y a 2 ans et 4 mois, dont le prix de remplacement à neuf est aujourd’hui de 1 200 € ;
— 150 € en espèces.`,
  en: `Specific conditions — Mr. and Mrs. Lemaire
Primary residence: 4-room apartment in Nantes. “New-for-old” option: not taken. Equipment: siren alarm, not connected to a remote monitoring center.

Claim report
The Lemaires left their apartment on July 1, 2026 for their vacation home and only came back on the evening of September 15; no one entered the apartment in the meantime. On their return, they find that the front door lock has been forced. Footage from the building’s lobby camera, seized by the police, shows that the burglary took place on August 20, 2026. Police report filed and claim reported on September 16, with invoices and certificate attached.
Stolen items:
— a watch bought for €3,200 three years ago;
— a necklace valued at €6,500 (jeweler’s certificate);
— a television bought new 2 years and 4 months ago, whose replacement cost new is €1,200 today;
— €150 in cash.`,
}

const HR_GUIDE = {
  fr: `Guide des avantages et des absences — Norvalis (édition du 1er janvier 2026)

1. Champ d’application
Le présent guide s’applique à tous les salariés de Norvalis titulaires d’un CDI ou d’un CDD, quelle que soit leur durée de travail. Les stagiaires relèvent d’une note distincte.

2. Congés payés
2.1. Chaque salarié acquiert 2,08 jours ouvrés de congés par mois de travail effectif, soit 25 jours par année complète.
2.2. Les congés se prennent par journées entières ou par demi-journées. Une absence de plus de 10 jours consécutifs doit être demandée au moins deux mois à l’avance.
2.3. Les jours non pris au 31 décembre sont perdus, sauf accord écrit du responsable pour un report d’au plus 5 jours jusqu’au 31 mars.

3. Congés pour événements familiaux
3.1. Le salarié bénéficie, sur justificatif, des jours d’absence rémunérés suivants :
— mariage ou PACS du salarié : 4 jours ;
— mariage d’un enfant : 1 jour ;
— naissance ou adoption : 3 jours ;
— décès du conjoint, du partenaire de PACS ou d’un enfant : 5 jours ;
— décès du père, de la mère, d’un frère ou d’une sœur : 3 jours ;
— décès d’un grand-parent : 1 jour.
3.2. Ces jours sont pris dans une période de 30 jours entourant l’événement et ne peuvent pas être reportés.
3.3. Ils ne réduisent pas le droit à congés payés.

4. Jours de repos des cadres
Les cadres au forfait jours bénéficient de 10 jours de repos par an, fixés en accord avec leur responsable. Les autres salariés travaillent 35 heures par semaine et n’ont pas de jours de repos supplémentaires.

5. Télétravail
5.1. Après la période d’essai, tout salarié dont le poste le permet peut télétravailler jusqu’à 2 jours par semaine.
5.2. Une indemnité de 2,50 € par jour télétravaillé est versée, dans la limite de 50 € par mois.

6. Titres-restaurant
6.1. Un titre-restaurant d’une valeur de 10 € est attribué pour chaque jour travaillé comportant une pause déjeuner, y compris en télétravail. La part patronale est de 60 %.
6.2. Aucun titre n’est attribué pour les jours de déplacement dont les repas sont remboursés sur note de frais.

7. Frais de transport
7.1. Norvalis prend en charge 50 % de l’abonnement de transports publics utilisé par le salarié entre son domicile et son lieu de travail.
7.2. Les salariés qui utilisent un vélo pour tout ou partie de leur trajet domicile-travail perçoivent un forfait mobilités durables de 300 € par an.
7.3. Sauf disposition contraire du présent guide, la prise en charge de l’abonnement et le forfait mobilités durables ne se cumulent pas : le salarié qui remplit les deux conditions perçoit le plus élevé des deux montants annuels.

8. Prime d’ancienneté
8.1. Une prime d’ancienneté mensuelle est versée, en pourcentage du salaire de base : 3 % à partir de 3 ans d’ancienneté, 6 % à partir de 6 ans, 9 % à partir de 9 ans. Le taux ne dépasse jamais 9 %.
8.2. L’ancienneté s’apprécie au premier jour du mois de paie et ne tient compte que des années passées chez Norvalis, sauf disposition contraire du présent guide.

9. Don de jours
Un salarié peut céder anonymement des jours de congés payés non pris, au-delà du 20e jour, à un collègue dont l’enfant est gravement malade.

10. Visite médicale
Une visite d’information et de prévention a lieu dans les trois mois suivant l’embauche, puis tous les cinq ans.

11. Formation
Chaque salarié peut demander chaque année une formation de son choix, d’au plus 3 jours, prise en charge par Norvalis dans la limite de 1 500 €.

12. Dispositions particulières
12.1. Par dérogation à l’article 3.1, le congé pour mariage ou PACS du salarié est porté à 6 jours pour les salariés ayant au moins 5 ans d’ancienneté à la date de l’événement.
12.2. Les congés pour événements familiaux ne sont pas dus pendant la période d’essai, à l’exception des congés pour décès, qui restent dus en toutes circonstances.
12.3. Par dérogation à l’article 8.2, l’ancienneté acquise dans une société rachetée par Norvalis est reprise intégralement pour les salariés dont le contrat a été transféré à Norvalis lors du rachat.
12.4. Par dérogation à l’article 7.3, les salariés domiciliés à plus de 25 km de leur lieu de travail peuvent cumuler la prise en charge de l’abonnement et le forfait mobilités durables, dans la limite de 600 € par an au total.`,
  en: `Benefits and absence guide — Norvalis (edition of January 1, 2026)

1. Scope
This guide applies to all Norvalis employees on a permanent or fixed-term contract, whatever their working hours. Interns are covered by a separate note.

2. Paid leave
2.1. Each employee earns 2.08 working days of leave per month actually worked, i.e. 25 days per full year.
2.2. Leave is taken in full or half days. An absence of more than 10 consecutive days must be requested at least two months in advance.
2.3. Days not taken by December 31 are lost, unless the manager agrees in writing to carry over at most 5 days until March 31.

3. Family event leave
3.1. On presentation of supporting documents, employees are entitled to the following paid days off:
— employee’s own marriage or civil partnership: 4 days;
— marriage of a child: 1 day;
— birth or adoption: 3 days;
— death of a spouse, civil partner or child: 5 days;
— death of a father, mother, brother or sister: 3 days;
— death of a grandparent: 1 day.
3.2. These days are taken within a 30-day period around the event and cannot be carried over.
3.3. They do not reduce paid leave entitlement.

4. Rest days for managers
Managers on a yearly day-count arrangement get 10 rest days per year, agreed with their manager. Other employees work 35 hours a week and get no extra rest days.

5. Remote work
5.1. After the probation period, any employee whose job allows it may work remotely up to 2 days a week.
5.2. An allowance of €2.50 per remote working day is paid, up to €50 per month.

6. Meal vouchers
6.1. A €10 meal voucher is given for each working day that includes a lunch break, including remote working days. The employer pays 60% of its value.
6.2. No voucher is given for travel days on which meals are reimbursed through expense claims.

7. Commuting costs
7.1. Norvalis pays 50% of the public transport pass the employee uses between home and work.
7.2. Employees who use a bicycle for all or part of their commute receive a sustainable mobility allowance of €300 per year.
7.3. Unless otherwise provided in this guide, the transport pass contribution and the sustainable mobility allowance cannot be combined: an employee who meets both conditions receives whichever annual amount is higher.

8. Seniority bonus
8.1. A monthly seniority bonus is paid as a percentage of base salary: 3% from 3 years of service, 6% from 6 years, 9% from 9 years. The rate never exceeds 9%.
8.2. Seniority is assessed on the first day of the pay month and only counts years spent at Norvalis, unless otherwise provided in this guide.

9. Leave donation
An employee may anonymously donate unused paid leave days, beyond the 20th day, to a colleague whose child is seriously ill.

10. Medical check-up
An information and prevention visit takes place within three months of hiring, then every five years.

11. Training
Each employee may request one training course of their choice per year, of at most 3 days, paid by Norvalis up to €1,500.

12. Special provisions
12.1. Notwithstanding Article 3.1, leave for the employee’s own marriage or civil partnership is increased to 6 days for employees with at least 5 years of service on the date of the event.
12.2. Family event leave is not due during the probation period, except bereavement leave, which remains due in all circumstances.
12.3. Notwithstanding Article 8.2, seniority acquired in a company bought by Norvalis is carried over in full for employees whose contract was transferred to Norvalis at the time of the acquisition.
12.4. Notwithstanding Article 7.3, employees living more than 25 km from their workplace may combine the transport pass contribution and the sustainable mobility allowance, up to a total of €600 per year.`,
}

const HR_REQUESTS = {
  fr: `Situations à traiter (octobre 2026) :
— Sarah Benali, 6 ans d’ancienneté, se marie le 19 septembre 2026.
— Hugo Petitjean, embauché le 1er septembre 2026 et en période d’essai : son père est décédé le 28 septembre.
— Inès Moreau, embauchée le 15 août 2026 et en période d’essai jusqu’au 14 novembre : elle conclut un PACS le 10 octobre.
— Malik Haddad, salaire de base 2 800 € : salarié d’Atelier Brenne pendant 3 ans, son contrat a été transféré à Norvalis lors du rachat de cette société ; il travaille depuis 4 ans et 2 mois chez Norvalis.
— Théo Garnier, domicilié à 32 km du site : abonnement de train de 90 € par mois, payé 12 mois par an ; il se rend à vélo de son domicile à la gare.`,
  en: `Situations to handle (October 2026):
— Sarah Benali, 6 years of service, gets married on September 19, 2026.
— Hugo Petitjean, hired on September 1, 2026 and on probation: his father died on September 28.
— Inès Moreau, hired on August 15, 2026 and on probation until November 14: she enters a civil partnership on October 10.
— Malik Haddad, base salary €2,800: employed by Atelier Brenne for 3 years, his contract was transferred to Norvalis when that company was bought; he has been working at Norvalis for 4 years and 2 months.
— Théo Garnier, who lives 32 km from the site: train pass costing €90 per month, paid 12 months a year; he cycles from home to the station.`,
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
  {
    id: 'rules-income-tax',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Abattement : 10 % × 37 800 = 3 780 € (< 14 000) → revenu imposable 34 020 €, dans la tranche à 30 %.
    // Impôt : (28 000 − 11 000) × 11 % + (34 020 − 28 000) × 30 % = 1 870 + 1 806 = 3 676 €.
    // Taux moyen : 3 676 / 34 020 ≈ 10,8 % → inférieur à 11 % (piège : le taux marginal n’est pas le taux moyen).
    expected: { marginal_rate: 2, tax: 'eur_3676', average_above_11: false },
    fr: {
      name: 'Impôt sur le revenu par tranches',
      description: 'Abattement plafonné, barème marginal, taux moyen.',
      state: {
        rules:
          'Revenu imposable = salaire net annuel diminué d’un abattement de 10 %, plafonné à 14 000 €. Barème : 0 % jusqu’à 11 000 € ; 11 % pour la fraction comprise entre 11 000 € et 28 000 € ; 30 % pour la fraction comprise entre 28 000 € et 80 000 € ; 41 % au-delà de 80 000 €. Chaque taux s’applique uniquement à la fraction du revenu comprise dans sa tranche.',
        taxpayer: 'Margaux Lefort, célibataire, salaire net annuel de 37 800 €, aucun autre revenu.',
      },
      questions: {
        marginal_rate: { type: 'score', instructions: 'Quelle est la tranche marginale d’imposition de Margaux ?', criteria: ['0 %', '11 %', '30 %', '41 %'] },
        tax: {
          type: 'choice',
          instructions: 'Quel est le montant de l’impôt de Margaux ?',
          criteria: { eur_3742: '3 742 €', eur_3676: '3 676 €', eur_4810: '4 810 €', eur_10206: '10 206 €' },
        },
        average_above_11: { type: 'noul', instructions: 'Le taux moyen d’imposition de Margaux (impôt divisé par revenu imposable) dépasse-t-il 11 % ?' },
      },
    },
    en: {
      name: 'Tiered income tax',
      description: 'Capped allowance, marginal brackets, average rate.',
      state: {
        rules:
          'Taxable income = annual net salary minus a 10% allowance, capped at €14,000. Brackets: 0% up to €11,000; 11% on the portion between €11,000 and €28,000; 30% on the portion between €28,000 and €80,000; 41% above €80,000. Each rate applies only to the portion of income that falls within its bracket.',
        taxpayer: 'Margaux Lefort, single, annual net salary of €37,800, no other income.',
      },
      questions: {
        marginal_rate: { type: 'score', instructions: 'What is Margaux’s marginal tax bracket?', criteria: ['0%', '11%', '30%', '41%'] },
        tax: {
          type: 'choice',
          instructions: 'How much tax does Margaux owe?',
          criteria: { eur_3742: '€3,742', eur_3676: '€3,676', eur_4810: '€4,810', eur_10206: '€10,206' },
        },
        average_above_11: { type: 'noul', instructions: 'Is Margaux’s average tax rate (tax divided by taxable income) above 11%?' },
      },
    },
  },
  {
    id: 'rules-bank-fees',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Client A : 11 opérations, dont 3 sous 5 € (2,10 ; 4,99 ; 3,50) ; 5,00 € n’est pas « inférieur à 5 € » → 8 facturées × 8 € = 64 € < 80 €.
    // Client B (fragile) : 7 opérations, dont 1 sous 5 € (1,20) → 6 × 4 € = 24 €, plafonné à 20 €.
    expected: { a_fee: 'eur_64', a_capped: false, b_fee: 'eur_20' },
    fr: {
      name: 'Commissions d’intervention bancaires',
      description: 'Seuil de franchise, plafond mensuel, tarif pour clients fragiles.',
      state: {
        rules:
          'Commission d’intervention : 8 € par opération ayant entraîné un dépassement du découvert autorisé. Aucune commission n’est prélevée pour une opération dont le dépassement est inférieur à 5 €. Plafond : 80 € par mois. Pour les clients reconnus financièrement fragiles : 4 € par opération et plafond de 20 € par mois ; la règle des 5 € s’applique aussi.',
        march: [
          { client: 'A', fragile: false, overdraft_per_operation: ['12,40 €', '2,10 €', '37,00 €', '4,99 €', '5,00 €', '88,20 €', '3,50 €', '19,90 €', '61,00 €', '7,25 €', '140,00 €'] },
          { client: 'B', fragile: true, overdraft_per_operation: ['23,00 €', '1,20 €', '9,80 €', '45,00 €', '6,60 €', '130,00 €', '15,00 €'] },
        ],
      },
      questions: {
        a_fee: {
          type: 'choice',
          instructions: 'Quel montant de commissions sera prélevé au client A pour mars ?',
          criteria: { eur_56: '56 €', eur_64: '64 €', eur_80: '80 €', eur_88: '88 €' },
        },
        a_capped: { type: 'noul', instructions: 'Le plafond mensuel limite-t-il les commissions du client A ?' },
        b_fee: {
          type: 'choice',
          instructions: 'Quel montant de commissions sera prélevé au client B pour mars ?',
          criteria: { eur_20: '20 €', eur_24: '24 €', eur_28: '28 €', eur_48: '48 €' },
        },
      },
    },
    en: {
      name: 'Bank overdraft fees',
      description: 'Small-amount exemption, monthly cap, rate for vulnerable customers.',
      state: {
        rules:
          'Overdraft handling fee: €8 per transaction that took the account beyond its authorized overdraft. No fee is charged for a transaction whose excess is less than €5. Cap: €80 per month. For customers recognized as financially vulnerable: €4 per transaction and a cap of €20 per month; the €5 rule also applies.',
        march: [
          { client: 'A', vulnerable: false, excess_per_transaction: ['€12.40', '€2.10', '€37.00', '€4.99', '€5.00', '€88.20', '€3.50', '€19.90', '€61.00', '€7.25', '€140.00'] },
          { client: 'B', vulnerable: true, excess_per_transaction: ['€23.00', '€1.20', '€9.80', '€45.00', '€6.60', '€130.00', '€15.00'] },
        ],
      },
      questions: {
        a_fee: {
          type: 'choice',
          instructions: 'How much in fees will customer A be charged for March?',
          criteria: { eur_56: '€56', eur_64: '€64', eur_80: '€80', eur_88: '€88' },
        },
        a_capped: { type: 'noul', instructions: 'Does the monthly cap limit customer A’s fees?' },
        b_fee: {
          type: 'choice',
          instructions: 'How much in fees will customer B be charged for March?',
          criteria: { eur_20: '€20', eur_24: '€24', eur_28: '€28', eur_48: '€48' },
        },
      },
    },
  },
  {
    id: 'rules-parcel-zones',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // A : 40 cm > 35 → poids volumétrique 40 × 30 × 30 / 5 000 = 7,2 kg > 4 kg réels → tranche 5–10 kg, zone 2 → 32 €.
    // B : 50 cm > 35 → volumétrique 50 × 40 × 20 / 5 000 = 8 kg < 12 kg réels → 12 kg, tranche 10–20 kg, zone 3 → 95 €.
    // C : aucune dimension > 35 cm → poids réel 3 kg (le volumétrique de 5,4 kg est ignoré) → tranche 2–5 kg, zone 1 → 10 €.
    expected: { a_cost: 'eur_32', b_cost: 'eur_95', c_volumetric: false, c_cost: 'eur_10' },
    fr: {
      name: 'Tarifs de colis par poids et par zone',
      description: 'Poids volumétrique conditionnel, tranches de poids, trois zones.',
      state: {
        rules:
          'Poids taxé : si l’une des dimensions du colis dépasse 35 cm, le poids taxé est le plus élevé entre le poids réel et le poids volumétrique (longueur × largeur × hauteur en cm, divisé par 5 000) ; sinon, seul le poids réel compte. Zones : 1 = France métropolitaine ; 2 = Union européenne hors France ; 3 = reste du monde. Colis de plus de 20 kg taxés refusés.',
        prices_eur: {
          'jusqu’à 2 kg inclus': { zone_1: 7, zone_2: 14, zone_3: 25 },
          'plus de 2 kg et jusqu’à 5 kg inclus': { zone_1: 10, zone_2: 21, zone_3: 39 },
          'plus de 5 kg et jusqu’à 10 kg inclus': { zone_1: 15, zone_2: 32, zone_3: 61 },
          'plus de 10 kg et jusqu’à 20 kg inclus': { zone_1: 22, zone_2: 48, zone_3: 95 },
        },
        parcels: [
          { id: 'A', destination: 'Bruxelles (Belgique)', dimensions_cm: '40 × 30 × 30', real_weight: '4 kg' },
          { id: 'B', destination: 'Montréal (Canada)', dimensions_cm: '50 × 40 × 20', real_weight: '12 kg' },
          { id: 'C', destination: 'Lyon', dimensions_cm: '30 × 30 × 30', real_weight: '3 kg' },
        ],
      },
      questions: {
        a_cost: {
          type: 'choice',
          instructions: 'Quel est le prix d’envoi du colis A ?',
          criteria: { eur_15: '15 €', eur_21: '21 €', eur_32: '32 €', eur_48: '48 €' },
        },
        b_cost: {
          type: 'choice',
          instructions: 'Quel est le prix d’envoi du colis B ?',
          criteria: { eur_39: '39 €', eur_48: '48 €', eur_61: '61 €', eur_95: '95 €' },
        },
        c_volumetric: { type: 'noul', instructions: 'Le poids volumétrique intervient-il dans le calcul du prix du colis C ?' },
        c_cost: {
          type: 'choice',
          instructions: 'Quel est le prix d’envoi du colis C ?',
          criteria: { eur_7: '7 €', eur_10: '10 €', eur_15: '15 €', eur_21: '21 €' },
        },
      },
    },
    en: {
      name: 'Parcel rates by weight and zone',
      description: 'Conditional volumetric weight, weight tiers, three zones.',
      state: {
        rules:
          'Chargeable weight: if any dimension of the parcel exceeds 35 cm, the chargeable weight is the higher of the actual weight and the volumetric weight (length × width × height in cm, divided by 5,000); otherwise, only the actual weight counts. Zones: 1 = mainland France; 2 = European Union outside France; 3 = rest of the world. Parcels with a chargeable weight above 20 kg are refused.',
        prices_eur: {
          'up to and including 2 kg': { zone_1: 7, zone_2: 14, zone_3: 25 },
          'over 2 kg and up to and including 5 kg': { zone_1: 10, zone_2: 21, zone_3: 39 },
          'over 5 kg and up to and including 10 kg': { zone_1: 15, zone_2: 32, zone_3: 61 },
          'over 10 kg and up to and including 20 kg': { zone_1: 22, zone_2: 48, zone_3: 95 },
        },
        parcels: [
          { id: 'A', destination: 'Brussels (Belgium)', dimensions_cm: '40 × 30 × 30', actual_weight: '4 kg' },
          { id: 'B', destination: 'Montreal (Canada)', dimensions_cm: '50 × 40 × 20', actual_weight: '12 kg' },
          { id: 'C', destination: 'Lyon', dimensions_cm: '30 × 30 × 30', actual_weight: '3 kg' },
        ],
      },
      questions: {
        a_cost: {
          type: 'choice',
          instructions: 'How much does it cost to ship parcel A?',
          criteria: { eur_15: '€15', eur_21: '€21', eur_32: '€32', eur_48: '€48' },
        },
        b_cost: {
          type: 'choice',
          instructions: 'How much does it cost to ship parcel B?',
          criteria: { eur_39: '€39', eur_48: '€48', eur_61: '€61', eur_95: '€95' },
        },
        c_volumetric: { type: 'noul', instructions: 'Does the volumetric weight play a part in the price of parcel C?' },
        c_cost: {
          type: 'choice',
          instructions: 'How much does it cost to ship parcel C?',
          criteria: { eur_7: '€7', eur_10: '€10', eur_15: '€15', eur_21: '€21' },
        },
      },
    },
  },
  {
    id: 'rules-return-tree',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // A : casque = électronique, non Premium → 15 jours ; 20 jours → refusé.
    // B : Premium → 60 jours pour tout produit, électronique comprise ; 45 jours → accepté.
    // C : jeu vidéo descellé → jamais repris (règle 1), le délai ne joue pas ; pas de défaut.
    // D : pull, 30 jours, 12 jours → accepté ; non Premium, non défectueux → 5,90 € de frais déduits : 59 − 5,90 = 53,10 € sur la carte.
    expected: { a_accepted: false, b_accepted: true, c_accepted: false, d_refund: 'eur_53_10' },
    fr: {
      name: 'Arbre de décision des retours',
      description: 'Délais par catégorie, statut Premium, exception produits descellés, frais de retour.',
      state: {
        policy: [
          '1. Les logiciels, jeux vidéo et cartes cadeaux dont l’emballage scellé a été ouvert ne sont jamais repris, sauf défaut constaté (règle 4).',
          '2. Délai de retour standard : 30 jours après la livraison. Électronique (téléphones, casques, ordinateurs, tablettes) : 15 jours.',
          '3. Membres Premium : délai porté à 60 jours pour tous les produits, électronique comprise. La règle 1 s’applique aussi à eux.',
          '4. Produit défectueux constaté par le service après-vente : retour accepté jusqu’à 2 ans après la livraison, y compris pour les produits visés à la règle 1.',
          '5. Frais de retour : gratuits pour les membres Premium et les produits défectueux ; 5,90 € sinon, déduits du remboursement.',
          '6. Le remboursement est fait sur le moyen de paiement d’origine.',
        ],
        returns: [
          { id: 'A', premium: false, product: 'casque audio sans fil, 89 €', delivered: 'il y a 20 jours', state: 'fonctionne' },
          { id: 'B', premium: true, product: 'tablette, 329 €', delivered: 'il y a 45 jours', state: 'fonctionne' },
          { id: 'C', premium: false, product: 'jeu vidéo, emballage scellé ouvert, 69 €', delivered: 'il y a 5 jours', state: 'fonctionne' },
          { id: 'D', premium: false, product: 'pull en laine, 59 €, payé par carte bancaire', delivered: 'il y a 12 jours', state: 'neuf, étiquette attachée' },
        ],
      },
      questions: {
        a_accepted: { type: 'noul', instructions: 'Le retour A est-il accepté ?' },
        b_accepted: { type: 'noul', instructions: 'Le retour B est-il accepté ?' },
        c_accepted: { type: 'noul', instructions: 'Le retour C est-il accepté ?' },
        d_refund: {
          type: 'choice',
          instructions: 'Quel montant sera remboursé pour le retour D ?',
          criteria: { eur_0: '0 €', eur_47_20: '47,20 €', eur_53_10: '53,10 €', eur_59: '59,00 €' },
        },
      },
    },
    en: {
      name: 'Return decision tree',
      description: 'Deadlines by category, Premium status, unsealed product exception, return fees.',
      state: {
        policy: [
          '1. Software, video games and gift cards whose sealed packaging has been opened are never taken back, unless a defect is confirmed (rule 4).',
          '2. Standard return period: 30 days after delivery. Electronics (phones, headphones, computers, tablets): 15 days.',
          '3. Premium members: return period extended to 60 days for all products, electronics included. Rule 1 also applies to them.',
          '4. Defective product confirmed by after-sales service: return accepted up to 2 years after delivery, including for products covered by rule 1.',
          '5. Return shipping: free for Premium members and defective products; €5.90 otherwise, deducted from the refund.',
          '6. Refunds are made to the original payment method.',
        ],
        returns: [
          { id: 'A', premium: false, product: 'wireless headphones, €89', delivered: '20 days ago', condition: 'works' },
          { id: 'B', premium: true, product: 'tablet, €329', delivered: '45 days ago', condition: 'works' },
          { id: 'C', premium: false, product: 'video game, sealed packaging opened, €69', delivered: '5 days ago', condition: 'works' },
          { id: 'D', premium: false, product: 'wool sweater, €59, paid by credit card', delivered: '12 days ago', condition: 'new, tag attached' },
        ],
      },
      questions: {
        a_accepted: { type: 'noul', instructions: 'Is return A accepted?' },
        b_accepted: { type: 'noul', instructions: 'Is return B accepted?' },
        c_accepted: { type: 'noul', instructions: 'Is return C accepted?' },
        d_refund: {
          type: 'choice',
          instructions: 'How much will be refunded for return D?',
          criteria: { eur_0: '€0', eur_47_20: '€47.20', eur_53_10: '€53.10', eur_59: '€59.00' },
        },
      },
    },
  },
  {
    id: 'rules-renovation-grants',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Logement de 22 ans (> 15) → aide régionale possible : 15 % × 6 000 = 900 € (< 1 500). B et C ne se cumulent pas.
    // Modeste : A + B = 4 000 + 1 200 = 5 200 ; A + C = 4 900 ; plafond 75 % × 6 000 = 4 500 → 4 500 € dans les deux cas.
    // Intermédiaire : A + B = 2 500 + 1 200 = 3 700 ; A + C = 3 400 ; plafond 60 % × 6 000 = 3 600 → 3 600 €.
    expected: { total_modest: 'eur_4500', b_and_c: false, cap_applies: true, total_intermediate: 'eur_3600' },
    fr: {
      name: 'Aides à la rénovation énergétique',
      description: 'Montants selon les revenus, non-cumul, écrêtement global.',
      state: {
        rules: [
          'Aide A (État) pour l’installation d’une pompe à chaleur : 4 000 € pour un ménage aux revenus modestes, 2 500 € pour un ménage aux revenus intermédiaires, rien pour un ménage aisé.',
          'Aide B (fournisseur d’énergie) : 1 200 € forfaitaires, quels que soient les revenus.',
          'Aide C (Région) : 15 % du coût TTC des travaux, plafonnée à 1 500 €, réservée aux logements achevés depuis plus de 15 ans.',
          'L’aide A se cumule avec B ou avec C, mais B et C ne se cumulent pas entre elles : le ménage choisit l’une des deux.',
          'Écrêtement : le total des aides perçues ne peut dépasser 75 % du coût TTC pour un ménage modeste, 60 % pour un ménage intermédiaire ; l’excédent est retenu sur l’aide A.',
        ],
        household: 'Famille Rocher, revenus modestes. Maison achevée il y a 22 ans. Pompe à chaleur : devis de 6 000 € TTC.',
      },
      questions: {
        total_modest: {
          type: 'choice',
          instructions: 'Quel est le montant total maximal d’aides que la famille Rocher peut percevoir ?',
          criteria: { eur_4500: '4 500 €', eur_4900: '4 900 €', eur_5200: '5 200 €', eur_6100: '6 100 €' },
        },
        b_and_c: { type: 'noul', instructions: 'La famille peut-elle percevoir à la fois l’aide B et l’aide C ?' },
        cap_applies: { type: 'noul', instructions: 'L’écrêtement réduit-il les aides de la famille Rocher, quelle que soit la combinaison choisie ?' },
        total_intermediate: {
          type: 'choice',
          instructions: 'Si la famille avait des revenus intermédiaires (tout le reste inchangé), quel serait le montant total maximal d’aides ?',
          criteria: { eur_3400: '3 400 €', eur_3700: '3 700 €', eur_4600: '4 600 €', eur_3600: '3 600 €' },
        },
      },
    },
    en: {
      name: 'Energy renovation grants',
      description: 'Income-based amounts, non-combinable grants, overall cap.',
      state: {
        rules: [
          'Grant A (government) for installing a heat pump: €4,000 for a low-income household, €2,500 for a middle-income household, nothing for a high-income household.',
          'Grant B (energy supplier): flat €1,200, whatever the income.',
          'Grant C (regional council): 15% of the cost of the work including VAT, capped at €1,500, only for homes completed more than 15 years ago.',
          'Grant A can be combined with B or with C, but B and C cannot be combined with each other: the household picks one of the two.',
          'Overall cap: total grants received cannot exceed 75% of the cost including VAT for a low-income household, 60% for a middle-income household; any excess is withheld from grant A.',
        ],
        household: 'The Rocher family, low income. House completed 22 years ago. Heat pump: quote of €6,000 including VAT.',
      },
      questions: {
        total_modest: {
          type: 'choice',
          instructions: 'What is the maximum total amount of grants the Rocher family can receive?',
          criteria: { eur_4500: '€4,500', eur_4900: '€4,900', eur_5200: '€5,200', eur_6100: '€6,100' },
        },
        b_and_c: { type: 'noul', instructions: 'Can the family receive both grant B and grant C?' },
        cap_applies: { type: 'noul', instructions: 'Does the overall cap reduce the Rocher family’s grants, whichever combination is chosen?' },
        total_intermediate: {
          type: 'choice',
          instructions: 'If the family had a middle income (everything else unchanged), what would be the maximum total amount of grants?',
          criteria: { eur_3400: '€3,400', eur_3700: '€3,700', eur_4600: '€4,600', eur_3600: '€3,600' },
        },
      },
    },
  },
  {
    id: 'rules-student-housing-aid',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Amandine : 24 ans, étudiante en Bretagne, foyer à 38 000 € mais 3 enfants à charge → plafond 45 000 € ; loyer 520 € → éligible.
    // Bastien : 29 ans mais handicap reconnu (pas de limite d’âge), apprenti en Bretagne ; déclarant seul → plafond 12 000 €, or 13 500 € → non.
    // Chloé : inscrite à Nantes (Pays de la Loire) ; un stage à Rennes n’est pas un apprentissage → condition 2 non remplie.
    // Dorian : né le 1er septembre 1998, il a 28 ans le 1er septembre 2026 → pas « moins de 28 ans », et pas de handicap → non.
    // Elsa : 22 ans, déclarante seule, 9 800 € < 12 000 € ; loyer hors charges 760 − 40 = 720 € ≤ 750 € → éligible.
    expected: { amandine: true, bastien: false, chloe: false, dorian: false, elsa: true },
    fr: {
      name: 'Aide au logement étudiant',
      description: 'Critères ET/OU imbriqués évalués pour cinq candidats.',
      state: {
        rules: [
          'Le « Pass Logement » de la Région Bretagne est accordé si TOUTES les conditions suivantes sont remplies :',
          '1. Avoir moins de 28 ans au 1er septembre 2026, OU être reconnu en situation de handicap (aucune limite d’âge dans ce cas).',
          '2. Être inscrit dans un établissement d’enseignement supérieur situé en Bretagne, OU être apprenti dans une entreprise située en Bretagne.',
          '3. Revenus : si le candidat est rattaché au foyer fiscal de ses parents, revenus annuels de ce foyer inférieurs à 35 000 €, plafond porté à 45 000 € si le foyer compte au moins 3 enfants à charge ; si le candidat déclare seul ses revenus, ses propres revenus annuels doivent être inférieurs à 12 000 €.',
          '4. Loyer mensuel hors charges inférieur ou égal à 750 €.',
          '5. Ne pas être déjà logé en résidence universitaire.',
        ],
        candidates: [
          { name: 'Amandine', age: 24, situation: 'étudiante à l’Université de Rennes', tax: 'rattachée au foyer de ses parents : 38 000 € par an, 3 enfants à charge', rent: '520 € hors charges', housing: 'studio privé' },
          { name: 'Bastien', age: 29, situation: 'apprenti chez un menuisier à Brest, handicap reconnu', tax: 'déclare seul ses revenus : 13 500 € par an', rent: '480 € hors charges', housing: 'appartement privé' },
          { name: 'Chloé', age: 23, situation: 'inscrite à l’université de Nantes (Pays de la Loire), en stage de six mois dans une entreprise de Rennes', tax: 'déclare seule ses revenus : 7 200 € par an', rent: '450 € hors charges', housing: 'colocation privée à Rennes' },
          { name: 'Dorian', birth_date: '1er septembre 1998', situation: 'étudiant à l’Université de Brest', tax: 'déclare seul ses revenus : 8 000 € par an', rent: '500 € hors charges', housing: 'appartement privé' },
          { name: 'Elsa', age: 22, situation: 'étudiante à l’école d’ingénieurs de Brest', tax: 'déclare seule ses revenus : 9 800 € par an', rent: '760 € par mois charges comprises, dont 40 € de charges', housing: 'appartement privé' },
        ],
      },
      questions: {
        amandine: { type: 'noul', instructions: 'Amandine est-elle éligible au Pass Logement ?' },
        bastien: { type: 'noul', instructions: 'Bastien est-il éligible au Pass Logement ?' },
        chloe: { type: 'noul', instructions: 'Chloé est-elle éligible au Pass Logement ?' },
        dorian: { type: 'noul', instructions: 'Dorian est-il éligible au Pass Logement ?' },
        elsa: { type: 'noul', instructions: 'Elsa est-elle éligible au Pass Logement ?' },
      },
    },
    en: {
      name: 'Student housing aid',
      description: 'Nested AND/OR criteria checked for five applicants.',
      state: {
        rules: [
          'The Brittany Region’s “Housing Pass” is granted if ALL of the following conditions are met:',
          '1. Be under 28 on September 1, 2026, OR have a recognized disability (no age limit in that case).',
          '2. Be enrolled in a higher education institution located in Brittany, OR be an apprentice in a company located in Brittany.',
          '3. Income: if the applicant is a dependant on their parents’ tax return, that household’s annual income must be below €35,000, raised to €45,000 if the household has at least 3 dependent children; if the applicant files their own tax return, their own annual income must be below €12,000.',
          '4. Monthly rent excluding service charges of €750 or less.',
          '5. Not already living in university housing.',
        ],
        candidates: [
          { name: 'Amandine', age: 24, situation: 'student at the University of Rennes', tax: 'dependant on her parents’ return: €38,000 per year, 3 dependent children', rent: '€520 excluding service charges', housing: 'private studio' },
          { name: 'Bastien', age: 29, situation: 'apprentice with a carpenter in Brest, recognized disability', tax: 'files his own return: €13,500 per year', rent: '€480 excluding service charges', housing: 'private apartment' },
          { name: 'Chloé', age: 23, situation: 'enrolled at the University of Nantes (Pays de la Loire region), on a six-month internship at a company in Rennes', tax: 'files her own return: €7,200 per year', rent: '€450 excluding service charges', housing: 'private flat-share in Rennes' },
          { name: 'Dorian', birth_date: 'September 1, 1998', situation: 'student at the University of Brest', tax: 'files his own return: €8,000 per year', rent: '€500 excluding service charges', housing: 'private apartment' },
          { name: 'Elsa', age: 22, situation: 'student at the engineering school in Brest', tax: 'files her own return: €9,800 per year', rent: '€760 per month including €40 of service charges', housing: 'private apartment' },
        ],
      },
      questions: {
        amandine: { type: 'noul', instructions: 'Is Amandine eligible for the Housing Pass?' },
        bastien: { type: 'noul', instructions: 'Is Bastien eligible for the Housing Pass?' },
        chloe: { type: 'noul', instructions: 'Is Chloé eligible for the Housing Pass?' },
        dorian: { type: 'noul', instructions: 'Is Dorian eligible for the Housing Pass?' },
        elsa: { type: 'noul', instructions: 'Is Elsa eligible for the Housing Pass?' },
      },
    },
  },
  {
    id: 'rules-remote-work',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // Nora : temps partiel (4 jours) → 1 jour maximum ; sa demande de 2 jours ne peut pas être accordée telle quelle.
    // Yanis : en période d’essai, mais la recommandation du médecin du travail l’emporte (jusqu’à 3 jours) → 2 jours accordés.
    // Léo : temps plein, 2 jours maximum ; les jours non pris la semaine précédente ne se reportent pas → 2.
    expected: { nora_granted: false, yanis_granted: true, leo_days: 'd2' },
    fr: {
      name: 'Politique de télétravail',
      description: 'Temps partiel, période d’essai, dérogation médicale, absence de report.',
      state: {
        policy:
          'Télétravail : jusqu’à 2 jours par semaine pour les salariés à temps plein, 1 jour pour les salariés à temps partiel (moins de 5 jours travaillés par semaine). Pas de télétravail pendant la période d’essai. Dérogation : sur recommandation écrite du médecin du travail, le salarié peut télétravailler jusqu’à 3 jours par semaine, y compris pendant la période d’essai et quel que soit son temps de travail. Les jours non utilisés une semaine ne sont pas reportables sur les semaines suivantes.',
        requests: [
          { name: 'Nora', schedule: 'temps partiel, 4 jours par semaine', probation: 'terminée', request: '2 jours de télétravail par semaine' },
          { name: 'Yanis', schedule: 'temps plein', probation: 'en cours', request: '2 jours de télétravail par semaine, avec une recommandation écrite du médecin du travail' },
          { name: 'Léo', schedule: 'temps plein', probation: 'terminée', request: '4 jours de télétravail cette semaine, car il n’a pas télétravaillé la semaine dernière' },
        ],
      },
      questions: {
        nora_granted: { type: 'noul', instructions: 'La demande de Nora peut-elle être accordée telle quelle ?' },
        yanis_granted: { type: 'noul', instructions: 'La demande de Yanis peut-elle être accordée telle quelle ?' },
        leo_days: {
          type: 'choice',
          instructions: 'Combien de jours Léo peut-il télétravailler cette semaine au maximum ?',
          criteria: { d1: '1 jour', d2: '2 jours', d3: '3 jours', d4: '4 jours' },
        },
      },
    },
    en: {
      name: 'Remote work policy',
      description: 'Part-time work, probation, medical exemption, no carry-over.',
      state: {
        policy:
          'Remote work: up to 2 days a week for full-time employees, 1 day for part-time employees (fewer than 5 working days a week). No remote work during the probation period. Exemption: on the written recommendation of the occupational physician, an employee may work remotely up to 3 days a week, including during the probation period and whatever their working hours. Days not used in a given week cannot be carried over to the following weeks.',
        requests: [
          { name: 'Nora', schedule: 'part-time, 4 days a week', probation: 'completed', request: '2 remote days a week' },
          { name: 'Yanis', schedule: 'full-time', probation: 'ongoing', request: '2 remote days a week, with a written recommendation from the occupational physician' },
          { name: 'Léo', schedule: 'full-time', probation: 'completed', request: '4 remote days this week, since he did not work remotely last week' },
        ],
      },
      questions: {
        nora_granted: { type: 'noul', instructions: 'Can Nora’s request be granted as it stands?' },
        yanis_granted: { type: 'noul', instructions: 'Can Yanis’s request be granted as it stands?' },
        leo_days: {
          type: 'choice',
          instructions: 'What is the maximum number of days Léo can work remotely this week?',
          criteria: { d1: '1 day', d2: '2 days', d3: '3 days', d4: '4 days' },
        },
      },
    },
  },
  {
    id: 'rules-probation-period',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Karim (cadre) : essai de 4 mois du 2 mars au 1er juillet ; accord de renouvellement signé le 10 juillet, après la fin → renouvellement nul,
    // il est confirmé depuis le 2 juillet → plus en période d’essai le 15 juillet.
    // Lucie (agent de maîtrise, essai de 3 mois) : embauchée le 1er juin, rupture notifiée le 20 août → présence entre 1 et 3 mois → 2 semaines.
    // Mehdi (employé) : démission pendant l’essai après 5 jours de présence (< 8 jours) → 24 heures.
    expected: { karim_on_probation: false, lucie_notice: 'w2', mehdi_notice: 'h24' },
    fr: {
      name: 'Période d’essai et délais de prévenance',
      description: 'Renouvellement tardif, délais selon l’ancienneté et selon qui rompt.',
      state: {
        policy: [
          'Durée de la période d’essai : employés 2 mois, agents de maîtrise 3 mois, cadres 4 mois.',
          'Renouvellement : une seule fois, pour une durée égale, uniquement si le salarié l’a accepté par écrit avant la fin de la période initiale. Sinon, le salarié est confirmé dans son poste à la fin de la période initiale.',
          'Rupture par l’employeur pendant l’essai, délai de prévenance : 24 heures si le salarié est présent depuis moins de 8 jours ; 48 heures entre 8 jours et 1 mois de présence ; 2 semaines après 1 mois de présence ; 1 mois après 3 mois de présence.',
          'Rupture par le salarié pendant l’essai : 48 heures, ramenées à 24 heures s’il est présent depuis moins de 8 jours.',
        ],
        employees: [
          { name: 'Karim', category: 'cadre', hired: '2 mars 2026', note: 'accord écrit de renouvellement de la période d’essai signé le 10 juillet 2026' },
          { name: 'Lucie', category: 'agent de maîtrise', hired: '1er juin 2026', note: 'l’employeur lui notifie la fin de sa période d’essai le 20 août 2026' },
          { name: 'Mehdi', category: 'employé', hired: 'lundi 5 octobre 2026', note: 'il démissionne le vendredi 9 octobre 2026, pendant sa période d’essai' },
        ],
      },
      questions: {
        karim_on_probation: { type: 'noul', instructions: 'Karim était-il encore en période d’essai le 15 juillet 2026 ?' },
        lucie_notice: {
          type: 'choice',
          instructions: 'Quel délai de prévenance l’employeur doit-il respecter envers Lucie ?',
          criteria: { h24: '24 heures', h48: '48 heures', w2: '2 semaines', m1: '1 mois' },
        },
        mehdi_notice: {
          type: 'choice',
          instructions: 'Quel délai de prévenance Mehdi doit-il respecter ?',
          criteria: { h24: '24 heures', h48: '48 heures', w2: '2 semaines', m1: '1 mois' },
        },
      },
    },
    en: {
      name: 'Probation period and notice',
      description: 'Late renewal, notice depending on length of service and on who ends it.',
      state: {
        policy: [
          'Length of the probation period: staff 2 months, supervisors 3 months, managers 4 months.',
          'Renewal: once only, for the same length, and only if the employee has agreed to it in writing before the end of the initial period. Otherwise, the employee is confirmed in the job at the end of the initial period.',
          'Termination by the employer during probation, notice period: 24 hours if the employee has been present for less than 8 days; 48 hours between 8 days and 1 month of presence; 2 weeks after 1 month of presence; 1 month after 3 months of presence.',
          'Termination by the employee during probation: 48 hours, reduced to 24 hours if present for less than 8 days.',
        ],
        employees: [
          { name: 'Karim', category: 'manager', hired: 'March 2, 2026', note: 'written agreement to renew the probation period signed on July 10, 2026' },
          { name: 'Lucie', category: 'supervisor', hired: 'June 1, 2026', note: 'the employer notifies her of the end of her probation on August 20, 2026' },
          { name: 'Mehdi', category: 'staff', hired: 'Monday, October 5, 2026', note: 'he resigns on Friday, October 9, 2026, during his probation period' },
        ],
      },
      questions: {
        karim_on_probation: { type: 'noul', instructions: 'Was Karim still on probation on July 15, 2026?' },
        lucie_notice: {
          type: 'choice',
          instructions: 'What notice period must the employer give Lucie?',
          criteria: { h24: '24 hours', h48: '48 hours', w2: '2 weeks', m1: '1 month' },
        },
        mehdi_notice: {
          type: 'choice',
          instructions: 'What notice period must Mehdi give?',
          criteria: { h24: '24 hours', h48: '48 hours', w2: '2 weeks', m1: '1 month' },
        },
      },
    },
  },
  {
    id: 'rules-kyc-vigilance',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // A : ancien maire, mandat terminé depuis 18 mois (> 12) → n’est plus PPE ; résident UE, 800 € < 1 000 € → simplifiée.
    // B : dépôt d’espèces de 10 000 €, seuil « au moins 10 000 € » atteint → renforcée.
    // C : résident suisse, hors UE → pas de vigilance simplifiée ; aucun critère renforcé → standard.
    // D : sœur d’un député en exercice = membre de la famille d’une PPE → renforcée → validation du responsable conformité.
    expected: { a_level: 0, b_level: 2, c_level: 1, d_compliance: true },
    fr: {
      name: 'Niveaux de vigilance KYC',
      description: 'Vigilance simplifiée, standard ou renforcée selon résidence, montant et exposition politique.',
      state: {
        policy: [
          'Vigilance renforcée si au moins une des conditions suivantes est remplie : le client est une personne politiquement exposée (PPE) ou un membre de la famille d’une PPE ; le client réside dans un pays de la liste des pays à haut risque ; l’opération est un versement en espèces d’au moins 10 000 €.',
          'Une personne reste PPE pendant 12 mois après la fin de ses fonctions ; au-delà, elle n’est plus considérée comme PPE.',
          'Vigilance simplifiée si aucune condition de vigilance renforcée n’est remplie ET si le client réside dans l’Union européenne ET si l’opération est inférieure à 1 000 €.',
          'Vigilance standard dans tous les autres cas.',
          'Pièces exigées : simplifiée, une pièce d’identité ; standard, une pièce d’identité et un justificatif de domicile de moins de 3 mois ; renforcée, en plus, un justificatif de l’origine des fonds et la validation du responsable conformité.',
          'Pays à haut risque : liste interne de mars 2026 (aucun pays de l’Union européenne, ni la Suisse, n’y figure).',
        ],
        clients: [
          { id: 'A', residence: 'Belgique', operation: 'virement entrant de 800 €', profile: 'ancien maire d’une commune de 40 000 habitants, mandat terminé il y a 18 mois' },
          { id: 'B', residence: 'France', operation: 'dépôt d’espèces de 10 000 €', profile: 'commerçant' },
          { id: 'C', residence: 'Suisse', operation: 'virement entrant de 500 €', profile: 'salarié, aucune fonction publique' },
          { id: 'D', residence: 'France', operation: 'virement entrant de 300 €', profile: 'sœur d’un député en exercice' },
        ],
      },
      questions: {
        a_level: { type: 'score', instructions: 'Quel niveau de vigilance s’applique au client A ?', criteria: ['Simplifiée', 'Standard', 'Renforcée'] },
        b_level: { type: 'score', instructions: 'Quel niveau de vigilance s’applique au client B ?', criteria: ['Simplifiée', 'Standard', 'Renforcée'] },
        c_level: { type: 'score', instructions: 'Quel niveau de vigilance s’applique au client C ?', criteria: ['Simplifiée', 'Standard', 'Renforcée'] },
        d_compliance: { type: 'noul', instructions: 'Le dossier du client D doit-il être validé par le responsable conformité ?' },
      },
    },
    en: {
      name: 'KYC due diligence levels',
      description: 'Simplified, standard or enhanced due diligence by residence, amount and political exposure.',
      state: {
        policy: [
          'Enhanced due diligence if at least one of the following conditions is met: the customer is a politically exposed person (PEP) or a family member of a PEP; the customer lives in a country on the high-risk country list; the transaction is a cash deposit of at least €10,000.',
          'A person remains a PEP for 12 months after leaving office; after that, they are no longer considered a PEP.',
          'Simplified due diligence if no enhanced due diligence condition is met AND the customer lives in the European Union AND the transaction is below €1,000.',
          'Standard due diligence in all other cases.',
          'Documents required: simplified, an ID document; standard, an ID document and proof of address less than 3 months old; enhanced, in addition, proof of the source of funds and approval by the compliance officer.',
          'High-risk countries: internal list of March 2026 (no European Union country, nor Switzerland, is on it).',
        ],
        clients: [
          { id: 'A', residence: 'Belgium', transaction: 'incoming transfer of €800', profile: 'former mayor of a town of 40,000 people, left office 18 months ago' },
          { id: 'B', residence: 'France', transaction: 'cash deposit of €10,000', profile: 'shopkeeper' },
          { id: 'C', residence: 'Switzerland', transaction: 'incoming transfer of €500', profile: 'employee, no public office' },
          { id: 'D', residence: 'France', transaction: 'incoming transfer of €300', profile: 'sister of a sitting member of parliament' },
        ],
      },
      questions: {
        a_level: { type: 'score', instructions: 'Which due diligence level applies to customer A?', criteria: ['Simplified', 'Standard', 'Enhanced'] },
        b_level: { type: 'score', instructions: 'Which due diligence level applies to customer B?', criteria: ['Simplified', 'Standard', 'Enhanced'] },
        c_level: { type: 'score', instructions: 'Which due diligence level applies to customer C?', criteria: ['Simplified', 'Standard', 'Enhanced'] },
        d_compliance: { type: 'noul', instructions: 'Must customer D’s file be approved by the compliance officer?' },
      },
    },
  },
  {
    id: 'rules-purchase-approval',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // R1 : 950 € HT, mais 400 € HT au même fournisseur 12 jours avant → 1 350 € cumulés → responsable + contrôleur financier.
    // R2 : 1 200 € TTC = 1 000 € HT → palier 1 000 € (inclus) + logiciel → responsable + contrôleur + DSI.
    // R3 : 9 800 € HT ; la commande de 3 000 € date de 45 jours (hors fenêtre de 30 jours) → pas de directeur général.
    // R4 : 8 500 + 2 000 € HT au même fournisseur sur 20 jours = 10 500 € ≥ 10 000 € → directeur général requis.
    expected: { r1_approvers: 'manager_finance', r2_approvers: 'manager_finance_cio', r3_ceo: false, r4_ceo: true },
    fr: {
      name: 'Circuit de validation des achats',
      description: 'Paliers HT, validation DSI, cumul anti-fractionnement sur 30 jours.',
      state: {
        policy:
          'Les seuils s’appliquent aux montants hors taxes (TVA de 20 %). Moins de 1 000 € : responsable d’équipe. De 1 000 € à 9 999,99 € : responsable d’équipe et contrôleur financier. 10 000 € et plus : responsable d’équipe, contrôleur financier et directeur général. Tout achat informatique (matériel ou logiciel) requiert en plus la validation du DSI, quel que soit son montant. Anti-fractionnement : pour déterminer le palier, on additionne la demande et toutes les commandes passées au même fournisseur au cours des 30 jours précédents.',
        requests: [
          { id: 'R1', object: 'chaises de bureau', supplier: 'Bureaux Plus', amount: '950 € HT', history: 'commande de 400 € HT chez Bureaux Plus il y a 12 jours' },
          { id: 'R2', object: 'licence de logiciel de comptabilité', supplier: 'Logicompta', amount: '1 200 € TTC', history: 'aucune commande antérieure chez Logicompta' },
          { id: 'R3', object: 'mission de conseil', supplier: 'Altiva Conseil', amount: '9 800 € HT', history: 'commande de 3 000 € HT chez Altiva Conseil il y a 45 jours' },
          { id: 'R4', object: 'aménagement de salle de réunion', supplier: 'Atelier Fabre', amount: '8 500 € HT', history: 'commande de 2 000 € HT chez Atelier Fabre il y a 20 jours' },
        ],
      },
      questions: {
        r1_approvers: {
          type: 'choice',
          instructions: 'Qui doit valider la demande R1 ?',
          criteria: {
            manager: 'Le responsable d’équipe seul',
            manager_finance: 'Le responsable d’équipe et le contrôleur financier',
            manager_finance_ceo: 'Le responsable d’équipe, le contrôleur financier et le directeur général',
            manager_cio: 'Le responsable d’équipe et le DSI',
            manager_finance_cio: 'Le responsable d’équipe, le contrôleur financier et le DSI',
          },
        },
        r2_approvers: {
          type: 'choice',
          instructions: 'Qui doit valider la demande R2 ?',
          criteria: {
            manager: 'Le responsable d’équipe seul',
            manager_finance: 'Le responsable d’équipe et le contrôleur financier',
            manager_finance_ceo: 'Le responsable d’équipe, le contrôleur financier et le directeur général',
            manager_cio: 'Le responsable d’équipe et le DSI',
            manager_finance_cio: 'Le responsable d’équipe, le contrôleur financier et le DSI',
          },
        },
        r3_ceo: { type: 'noul', instructions: 'La demande R3 doit-elle être validée par le directeur général ?' },
        r4_ceo: { type: 'noul', instructions: 'La demande R4 doit-elle être validée par le directeur général ?' },
      },
    },
    en: {
      name: 'Purchase approval workflow',
      description: 'Pre-tax tiers, IT approval, 30-day anti-splitting rule.',
      state: {
        policy:
          'Thresholds apply to amounts excluding VAT (VAT rate 20%). Under €1,000: team manager. From €1,000 to €9,999.99: team manager and financial controller. €10,000 and above: team manager, financial controller and CEO. Any IT purchase (hardware or software) also requires approval from the CIO, whatever the amount. Anti-splitting: to determine the tier, the request is added to all orders placed with the same supplier in the previous 30 days.',
        requests: [
          { id: 'R1', item: 'office chairs', supplier: 'Bureaux Plus', amount: '€950 excl. VAT', history: '€400 excl. VAT order from Bureaux Plus 12 days ago' },
          { id: 'R2', item: 'accounting software license', supplier: 'Logicompta', amount: '€1,200 incl. VAT', history: 'no previous order from Logicompta' },
          { id: 'R3', item: 'consulting assignment', supplier: 'Altiva Conseil', amount: '€9,800 excl. VAT', history: '€3,000 excl. VAT order from Altiva Conseil 45 days ago' },
          { id: 'R4', item: 'meeting room fit-out', supplier: 'Atelier Fabre', amount: '€8,500 excl. VAT', history: '€2,000 excl. VAT order from Atelier Fabre 20 days ago' },
        ],
      },
      questions: {
        r1_approvers: {
          type: 'choice',
          instructions: 'Who must approve request R1?',
          criteria: {
            manager: 'The team manager alone',
            manager_finance: 'The team manager and the financial controller',
            manager_finance_ceo: 'The team manager, the financial controller and the CEO',
            manager_cio: 'The team manager and the CIO',
            manager_finance_cio: 'The team manager, the financial controller and the CIO',
          },
        },
        r2_approvers: {
          type: 'choice',
          instructions: 'Who must approve request R2?',
          criteria: {
            manager: 'The team manager alone',
            manager_finance: 'The team manager and the financial controller',
            manager_finance_ceo: 'The team manager, the financial controller and the CEO',
            manager_cio: 'The team manager and the CIO',
            manager_finance_cio: 'The team manager, the financial controller and the CIO',
          },
        },
        r3_ceo: { type: 'noul', instructions: 'Must request R3 be approved by the CEO?' },
        r4_ceo: { type: 'noul', instructions: 'Must request R4 be approved by the CEO?' },
      },
    },
  },
  {
    id: 'rules-folder-permissions',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Paul (Employés, Chefs de projet) : écriture héritée de /Projets sur /Projets/Atlas, aucun refus ne le vise → oui.
    // Julie est aussi Stagiaire : le refus d’écriture sur /Projets/Atlas l’emporte sur l’autorisation des Chefs de projet → non.
    // Julie sur /Projets/Boréal : le refus ne porte que sur Atlas et ses sous-dossiers → l’écriture héritée de /Projets s’applique → oui.
    // /Projets/Atlas/Contrats : héritage désactivé → seules les règles du dossier lui-même comptent : Paul n’y a aucun droit.
    // Marc (Stagiaires) : le refus d’Atlas n’est pas hérité par Contrats, où il a lecture et écriture nominatives → oui.
    expected: { paul_write_atlas: true, julie_write_atlas: false, julie_write_boreal: true, paul_read_contracts: false, marc_write_contracts: true },
    fr: {
      name: 'Droits sur des dossiers partagés',
      description: 'Héritage, union des groupes, refus explicite prioritaire, héritage désactivé.',
      state: {
        rules: [
          'Les droits d’un utilisateur sont l’union des droits accordés à son nom et à chacun de ses groupes.',
          'Les règles d’un dossier s’appliquent à tous ses sous-dossiers (héritage), sauf si l’héritage est désactivé sur un sous-dossier : dans ce cas, aucune règle des dossiers parents (ni autorisation, ni refus) ne s’applique à ce sous-dossier ni à ses propres sous-dossiers.',
          'Un refus explicite qui s’applique à l’utilisateur (à son nom ou via l’un de ses groupes) l’emporte toujours sur toute autorisation.',
          'Sans autorisation applicable, l’accès est refusé.',
        ],
        folders: {
          '/Projets': ['Autoriser lecture : groupe Employés', 'Autoriser écriture : groupe Chefs de projet'],
          '/Projets/Atlas': ['Refuser écriture : groupe Stagiaires'],
          '/Projets/Atlas/Contrats': ['Héritage désactivé', 'Autoriser lecture : groupe Juridique', 'Autoriser lecture et écriture : utilisateur Marc'],
          '/Projets/Boréal': ['Aucune règle propre'],
        },
        users: {
          Paul: ['Employés', 'Chefs de projet'],
          Julie: ['Employés', 'Chefs de projet', 'Stagiaires'],
          Marc: ['Employés', 'Stagiaires'],
        },
      },
      questions: {
        paul_write_atlas: { type: 'noul', instructions: 'Paul peut-il écrire dans /Projets/Atlas ?' },
        julie_write_atlas: { type: 'noul', instructions: 'Julie peut-elle écrire dans /Projets/Atlas ?' },
        julie_write_boreal: { type: 'noul', instructions: 'Julie peut-elle écrire dans /Projets/Boréal ?' },
        paul_read_contracts: { type: 'noul', instructions: 'Paul peut-il lire /Projets/Atlas/Contrats ?' },
        marc_write_contracts: { type: 'noul', instructions: 'Marc peut-il écrire dans /Projets/Atlas/Contrats ?' },
      },
    },
    en: {
      name: 'Shared folder permissions',
      description: 'Inheritance, union of groups, explicit deny wins, disabled inheritance.',
      state: {
        rules: [
          'A user’s permissions are the union of the permissions granted to them by name and to each of their groups.',
          'A folder’s rules apply to all its subfolders (inheritance), unless inheritance is disabled on a subfolder: in that case, no rule from the parent folders (neither allow nor deny) applies to that subfolder or to its own subfolders.',
          'An explicit deny that applies to the user (by name or through one of their groups) always overrides any allow.',
          'Without an applicable allow, access is denied.',
        ],
        folders: {
          '/Projects': ['Allow read: group Employees', 'Allow write: group Project managers'],
          '/Projects/Atlas': ['Deny write: group Interns'],
          '/Projects/Atlas/Contracts': ['Inheritance disabled', 'Allow read: group Legal', 'Allow read and write: user Marc'],
          '/Projects/Boreal': ['No rules of its own'],
        },
        users: {
          Paul: ['Employees', 'Project managers'],
          Julie: ['Employees', 'Project managers', 'Interns'],
          Marc: ['Employees', 'Interns'],
        },
      },
      questions: {
        paul_write_atlas: { type: 'noul', instructions: 'Can Paul write to /Projects/Atlas?' },
        julie_write_atlas: { type: 'noul', instructions: 'Can Julie write to /Projects/Atlas?' },
        julie_write_boreal: { type: 'noul', instructions: 'Can Julie write to /Projects/Boreal?' },
        paul_read_contracts: { type: 'noul', instructions: 'Can Paul read /Projects/Atlas/Contracts?' },
        marc_write_contracts: { type: 'noul', instructions: 'Can Marc write to /Projects/Atlas/Contracts?' },
      },
    },
  },
  {
    id: 'rules-car-insurance',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // Pare-brise : 1 450 − 80 = 1 370 €, puis plafond de 1 200 € → 1 200 € (le plafond s’applique après la franchise).
    // Collision : Anaïs a son permis depuis 2 ans et 10 mois (< 3 ans) → franchise doublée à 800 € → 3 100 − 800 = 2 300 €.
    expected: { glass_payout: 'eur_1200', deductible_doubled: true, collision_payout: 'eur_2300' },
    fr: {
      name: 'Assurance auto : franchises et plafond',
      description: 'Franchise bris de glace, plafond appliqué après franchise, conducteur novice.',
      state: {
        contract:
          'Dommages au véhicule : franchise de 400 € par sinistre, doublée si le conducteur au moment du sinistre est titulaire du permis depuis moins de 3 ans. Bris de glace : franchise de 80 € quel que soit le conducteur, indemnité plafonnée à 1 200 € par sinistre ; le plafond s’applique au montant obtenu après déduction de la franchise. Exclusion : conduite sous l’emprise de l’alcool.',
        claims: [
          { date: '12 mars 2026', event: 'pare-brise fendu par un gravillon sur l’autoroute', driver: 'Gilles Marchand, permis depuis 25 ans', repair: '1 450 €' },
          { date: '8 juin 2026', event: 'collision avec un poteau en se garant, contrôle d’alcoolémie négatif', driver: 'Anaïs Marchand, permis depuis 2 ans et 10 mois', repair: '3 100 €' },
        ],
      },
      questions: {
        glass_payout: {
          type: 'choice',
          instructions: 'Quelle indemnité sera versée pour le pare-brise ?',
          criteria: { eur_1120: '1 120 €', eur_1200: '1 200 €', eur_1370: '1 370 €', eur_1450: '1 450 €' },
        },
        deductible_doubled: { type: 'noul', instructions: 'La franchise est-elle doublée pour la collision du 8 juin ?' },
        collision_payout: {
          type: 'choice',
          instructions: 'Quelle indemnité sera versée pour la collision ?',
          criteria: { eur_2300: '2 300 €', eur_2700: '2 700 €', eur_3020: '3 020 €', eur_0: '0 €' },
        },
      },
    },
    en: {
      name: 'Car insurance: deductibles and cap',
      description: 'Glass deductible, cap applied after the deductible, new driver.',
      state: {
        contract:
          'Damage to the vehicle: €400 deductible per claim, doubled if the driver at the time of the incident has held a license for less than 3 years. Glass breakage: €80 deductible whoever the driver, compensation capped at €1,200 per claim; the cap applies to the amount left after the deductible. Exclusion: driving under the influence of alcohol.',
        claims: [
          { date: 'March 12, 2026', event: 'windshield cracked by a stone chip on the highway', driver: 'Gilles Marchand, licensed for 25 years', repair: '€1,450' },
          { date: 'June 8, 2026', event: 'hit a post while parking, negative breath test', driver: 'Anaïs Marchand, licensed for 2 years and 10 months', repair: '€3,100' },
        ],
      },
      questions: {
        glass_payout: {
          type: 'choice',
          instructions: 'How much will be paid for the windshield?',
          criteria: { eur_1120: '€1,120', eur_1200: '€1,200', eur_1370: '€1,370', eur_1450: '€1,450' },
        },
        deductible_doubled: { type: 'noul', instructions: 'Is the deductible doubled for the June 8 collision?' },
        collision_payout: {
          type: 'choice',
          instructions: 'How much will be paid for the collision?',
          criteria: { eur_2300: '€2,300', eur_2700: '€2,700', eur_3020: '€3,020', eur_0: '€0' },
        },
      },
    },
  },
  {
    id: 'rules-league-tiebreak',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Points : Aigles 0 + 3 + 3 (forfait) = 6 ; Bisons 3 + 3 + 0 = 6 ; Castors 0 + 3 + 3 = 6 ; Dauphins 0 − 1 (forfait) = −1.
    // Confrontations directes entre les trois : Bisons bat Aigles, Aigles bat Castors, Castors bat Bisons → 3 points chacun, égalité persistante.
    // Différence de buts générale : Bisons 8 − 1 = +7 ; Aigles 5 − 3 = +2 (forfait compté 3–0) ; Castors 2 − 2 = 0 → Bisons, Aigles, Castors.
    expected: { first: 'bisons', third: 'castors', dauphins_points: 'pm1' },
    fr: {
      name: 'Classement d’un mini-championnat',
      description: 'Égalité à trois, critères de départage successifs, forfait pénalisé.',
      state: {
        rules: [
          'Victoire : 3 points ; match nul : 1 point ; défaite : 0 point.',
          'Forfait : l’équipe forfait perd le match sur le score de 0–3 et se voit retirer 1 point supplémentaire au classement. Ce score de 0–3 compte dans les buts marqués et encaissés.',
          'En cas d’égalité de points entre deux équipes ou plus, on les départage dans cet ordre : 1) points obtenus dans les matchs joués entre les équipes à égalité ; 2) si l’égalité persiste, différence de buts sur l’ensemble du championnat ; 3) buts marqués sur l’ensemble du championnat.',
        ],
        results: [
          'Aigles 0–3 Bisons',
          'Aigles 2–0 Castors',
          'Aigles – Dauphins : forfait des Dauphins',
          'Bisons 5–0 Dauphins',
          'Castors 1–0 Bisons',
          'Castors 1–0 Dauphins',
        ],
      },
      questions: {
        first: {
          type: 'choice',
          instructions: 'Quelle équipe termine première ?',
          criteria: { aigles: 'Aigles', bisons: 'Bisons', castors: 'Castors', dauphins: 'Dauphins' },
        },
        third: {
          type: 'choice',
          instructions: 'Quelle équipe termine troisième ?',
          criteria: { aigles: 'Aigles', bisons: 'Bisons', castors: 'Castors', dauphins: 'Dauphins' },
        },
        dauphins_points: {
          type: 'choice',
          instructions: 'Combien de points les Dauphins ont-ils au classement final ?',
          criteria: { pm1: '−1 point', p0: '0 point', p1: '1 point', p3: '3 points' },
        },
      },
    },
    en: {
      name: 'Mini-league standings',
      description: 'Three-way tie, successive tie-breakers, forfeit penalty.',
      state: {
        rules: [
          'Win: 3 points; draw: 1 point; loss: 0 points.',
          'Forfeit: the forfeiting team loses the match 0–3 and has 1 additional point deducted in the standings. This 0–3 score counts toward goals scored and conceded.',
          'If two or more teams are level on points, they are separated in this order: 1) points earned in the matches played between the tied teams; 2) if still level, goal difference over the whole league; 3) goals scored over the whole league.',
        ],
        results: [
          'Eagles 0–3 Bisons',
          'Eagles 2–0 Beavers',
          'Eagles – Dolphins: Dolphins forfeit',
          'Bisons 5–0 Dolphins',
          'Beavers 1–0 Bisons',
          'Beavers 1–0 Dolphins',
        ],
      },
      questions: {
        first: {
          type: 'choice',
          instructions: 'Which team finishes first?',
          criteria: { aigles: 'Eagles', bisons: 'Bisons', castors: 'Beavers', dauphins: 'Dolphins' },
        },
        third: {
          type: 'choice',
          instructions: 'Which team finishes third?',
          criteria: { aigles: 'Eagles', bisons: 'Bisons', castors: 'Beavers', dauphins: 'Dolphins' },
        },
        dauphins_points: {
          type: 'choice',
          instructions: 'How many points do the Dolphins have in the final standings?',
          criteria: { pm1: '−1 point', p0: '0 points', p1: '1 point', p3: '3 points' },
        },
      },
    },
  },
  {
    id: 'rules-terms-version',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // A : souscrit le 15 mai 2026 (avant le 1er juillet) → version 1 maintenue jusqu’au 31 décembre ; demande le 10 novembre → 100 % : 18 × 30 = 540 €.
    // B : souscrit le 3 août, demande le 2 novembre (≥ 1er novembre) → version 2 : 50 % × 21 × 25 = 262,50 €.
    // C : la version se détermine à la date de la demande (28 octobre), pas à la date d’effet (15 novembre) → version 1.
    expected: { a_fee: 'eur_540', b_fee: 'eur_262_50', c_v2: false },
    fr: {
      name: 'Frais de résiliation et version des conditions',
      description: 'Date d’effet d’une nouvelle version, maintien transitoire, date de référence.',
      state: {
        terms: [
          'Version 1 (jusqu’au 31 octobre 2026) : en cas de résiliation avant la fin de l’engagement, frais égaux à 100 % des mensualités restant dues.',
          'Version 2 (en vigueur à partir du 1er novembre 2026) : frais égaux à 50 % des mensualités restant dues.',
          'La version applicable est celle en vigueur à la date de la demande de résiliation, et non à la date où la résiliation prend effet.',
          'Disposition transitoire : pour les contrats souscrits avant le 1er juillet 2026, la version 1 continue de s’appliquer à toute demande faite jusqu’au 31 décembre 2026.',
        ],
        customers: [
          { id: 'A', subscribed: '15 mai 2026', monthly: '30 €', request: '10 novembre 2026', remaining_installments: 18 },
          { id: 'B', subscribed: '3 août 2026', monthly: '25 €', request: '2 novembre 2026', remaining_installments: 21 },
          { id: 'C', subscribed: '1er septembre 2026', monthly: '20 €', request: '28 octobre 2026, avec effet au 15 novembre 2026', remaining_installments: 22 },
        ],
      },
      questions: {
        a_fee: {
          type: 'choice',
          instructions: 'Quels frais de résiliation le client A doit-il payer ?',
          criteria: { eur_0: '0 €', eur_270: '270 €', eur_540: '540 €', eur_720: '720 €' },
        },
        b_fee: {
          type: 'choice',
          instructions: 'Quels frais de résiliation le client B doit-il payer ?',
          criteria: { eur_262_50: '262,50 €', eur_525: '525 €', eur_300: '300 €', eur_0: '0 €' },
        },
        c_v2: { type: 'noul', instructions: 'La version 2 des conditions s’applique-t-elle à la résiliation du client C ?' },
      },
    },
    en: {
      name: 'Cancellation fees and terms version',
      description: 'Effective date of a new version, transitional rule, reference date.',
      state: {
        terms: [
          'Version 1 (until October 31, 2026): if the contract is cancelled before the end of the commitment, the fee equals 100% of the remaining monthly payments.',
          'Version 2 (in force from November 1, 2026): the fee equals 50% of the remaining monthly payments.',
          'The applicable version is the one in force on the date of the cancellation request, not on the date the cancellation takes effect.',
          'Transitional provision: for contracts signed before July 1, 2026, version 1 continues to apply to any request made until December 31, 2026.',
        ],
        customers: [
          { id: 'A', signed: 'May 15, 2026', monthly: '€30', request: 'November 10, 2026', remaining_payments: 18 },
          { id: 'B', signed: 'August 3, 2026', monthly: '€25', request: 'November 2, 2026', remaining_payments: 21 },
          { id: 'C', signed: 'September 1, 2026', monthly: '€20', request: 'October 28, 2026, effective November 15, 2026', remaining_payments: 22 },
        ],
      },
      questions: {
        a_fee: {
          type: 'choice',
          instructions: 'What cancellation fee must customer A pay?',
          criteria: { eur_0: '€0', eur_270: '€270', eur_540: '€540', eur_720: '€720' },
        },
        b_fee: {
          type: 'choice',
          instructions: 'What cancellation fee must customer B pay?',
          criteria: { eur_262_50: '€262.50', eur_525: '€525', eur_300: '€300', eur_0: '€0' },
        },
        c_v2: { type: 'noul', instructions: 'Does version 2 of the terms apply to customer C’s cancellation?' },
      },
    },
  },
  {
    id: 'rules-scholarship-points',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'moyen',
    // Yasmine : 320 km → 2 points ; frère lycéen → 2 ; sœur étudiante dans le supérieur → 4 ; parent isolé → 3 → 11 points.
    // Plafond : 20 000 + 11 × 2 500 = 47 500 € ; 50 % = 23 750 ; 75 % = 35 625 ; 31 000 € est entre les deux → échelon 2.
    // Romain : 25 km → 0 point, aucun autre critère → plafond 20 000 € ; 21 000 € au-delà → aucune bourse.
    expected: { yasmine_points: 'p11', yasmine_level: 2, romain_eligible: false },
    fr: {
      name: 'Bourse d’études sur critères',
      description: 'Points de charge, plafond ajusté, échelons en pourcentage du plafond.',
      state: {
        rules: [
          'Points de charge : distance entre le domicile familial et l’établissement de 30 à 249 km, 1 point ; 250 km ou plus, 2 points. Chaque frère ou sœur à charge qui n’est pas dans l’enseignement supérieur, 2 points ; chaque frère ou sœur inscrit dans l’enseignement supérieur, 4 points. Parent isolé, 3 points.',
          'Plafond de revenus du foyer = 20 000 € + 2 500 € par point de charge.',
          'Échelon 3 : revenus inférieurs ou égaux à 50 % du plafond. Échelon 2 : supérieurs à 50 % et inférieurs ou égaux à 75 % du plafond. Échelon 1 : supérieurs à 75 % et inférieurs ou égaux au plafond. Au-delà du plafond : aucune bourse.',
        ],
        students: [
          { name: 'Yasmine', distance: '320 km', family: 'un frère lycéen et une sœur étudiante en licence, tous deux à charge ; vit avec sa mère seule', household_income: '31 000 €' },
          { name: 'Romain', distance: '25 km', family: 'enfant unique, vit avec ses deux parents', household_income: '21 000 €' },
        ],
      },
      questions: {
        yasmine_points: {
          type: 'choice',
          instructions: 'Combien de points de charge Yasmine obtient-elle ?',
          criteria: { p7: '7 points', p9: '9 points', p11: '11 points', p13: '13 points' },
        },
        yasmine_level: { type: 'score', instructions: 'Quel échelon de bourse Yasmine obtient-elle ?', criteria: ['Aucune bourse', 'Échelon 1', 'Échelon 2', 'Échelon 3'] },
        romain_eligible: { type: 'noul', instructions: 'Romain obtient-il une bourse ?' },
      },
    },
    en: {
      name: 'Means-tested scholarship',
      description: 'Need points, adjusted ceiling, levels as a share of the ceiling.',
      state: {
        rules: [
          'Need points: distance between the family home and the institution of 30 to 249 km, 1 point; 250 km or more, 2 points. Each dependent sibling who is not in higher education, 2 points; each sibling enrolled in higher education, 4 points. Single parent, 3 points.',
          'Household income ceiling = €20,000 + €2,500 per need point.',
          'Level 3: income at or below 50% of the ceiling. Level 2: above 50% and at or below 75% of the ceiling. Level 1: above 75% and at or below the ceiling. Above the ceiling: no scholarship.',
        ],
        students: [
          { name: 'Yasmine', distance: '320 km', family: 'a brother in high school and a sister doing a bachelor’s degree, both dependants; lives with her single mother', household_income: '€31,000' },
          { name: 'Romain', distance: '25 km', family: 'only child, lives with both parents', household_income: '€21,000' },
        ],
      },
      questions: {
        yasmine_points: {
          type: 'choice',
          instructions: 'How many need points does Yasmine get?',
          criteria: { p7: '7 points', p9: '9 points', p11: '11 points', p13: '13 points' },
        },
        yasmine_level: { type: 'score', instructions: 'Which scholarship level does Yasmine get?', criteria: ['No scholarship', 'Level 1', 'Level 2', 'Level 3'] },
        romain_eligible: { type: 'noul', instructions: 'Does Romain get a scholarship?' },
      },
    },
  },
  {
    id: 'rules-library-fines',
    category: 'Reasoning',
    complexity: 'simple',
    length: 'court',
    // Hélène : roman 5 jours (> 3 → les 5 jours facturés) = 1,00 € ; DVD nouveauté 26 × 0,50 = 13 € plafonnés à 10 € ; BD 3 jours → toléré, 0 €.
    // Total 11,00 €. Lou (15 ans) : aucun frais, suspension égale au plus long retard (8 jours), pas à la somme (10).
    expected: { helene_total: 'eur_11', lou_fees: false, lou_suspension: 'd8' },
    fr: {
      name: 'Pénalités de retard à la médiathèque',
      description: 'Tolérance de trois jours, plafond par document, règle propre aux mineurs.',
      state: {
        rules:
          'Pénalité de retard : 0,20 € par jour et par document ; 0,50 € pour les documents « nouveauté ». Aucun frais si le document est rendu avec au plus 3 jours de retard ; au-delà, tous les jours de retard sont facturés, y compris les 3 premiers. Plafond : 10 € par document. Abonnés de moins de 18 ans : aucun frais, mais le droit d’emprunt est suspendu pendant un nombre de jours égal au plus long retard constaté lors du retour.',
        returns: [
          { borrower: 'Hélène, 42 ans', items: ['roman, 5 jours de retard', 'DVD « nouveauté », 26 jours de retard', 'bande dessinée, 3 jours de retard'] },
          { borrower: 'Lou, 15 ans', items: ['album, 8 jours de retard', 'roman, 2 jours de retard'] },
        ],
      },
      questions: {
        helene_total: {
          type: 'choice',
          instructions: 'Combien Hélène doit-elle payer au total ?',
          criteria: { eur_10_40: '10,40 €', eur_11: '11,00 €', eur_11_60: '11,60 €', eur_14: '14,00 €' },
        },
        lou_fees: { type: 'noul', instructions: 'Lou doit-elle payer des frais de retard ?' },
        lou_suspension: {
          type: 'choice',
          instructions: 'Pendant combien de jours le droit d’emprunt de Lou est-il suspendu ?',
          criteria: { d0: '0 jour', d2: '2 jours', d8: '8 jours', d10: '10 jours' },
        },
      },
    },
    en: {
      name: 'Library late fees',
      description: 'Three-day grace period, per-item cap, rule for minors.',
      state: {
        rules:
          'Late fee: €0.20 per day per item; €0.50 for “new release” items. No fee if the item is returned at most 3 days late; beyond that, every day late is charged, including the first 3. Cap: €10 per item. Members under 18: no fees, but borrowing rights are suspended for a number of days equal to the longest delay found at return.',
        returns: [
          { borrower: 'Hélène, 42', items: ['novel, 5 days late', '“new release” DVD, 26 days late', 'comic book, 3 days late'] },
          { borrower: 'Lou, 15', items: ['picture book, 8 days late', 'novel, 2 days late'] },
        ],
      },
      questions: {
        helene_total: {
          type: 'choice',
          instructions: 'How much does Hélène have to pay in total?',
          criteria: { eur_10_40: '€10.40', eur_11: '€11.00', eur_11_60: '€11.60', eur_14: '€14.00' },
        },
        lou_fees: { type: 'noul', instructions: 'Does Lou have to pay late fees?' },
        lou_suspension: {
          type: 'choice',
          instructions: 'For how many days are Lou’s borrowing rights suspended?',
          criteria: { d0: '0 days', d2: '2 days', d8: '8 days', d10: '10 days' },
        },
      },
    },
  },
  {
    id: 'rules-electricity-blocks',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Foyer A : HP 300 × 0,22 = 66 + 120 × 0,27 = 32,40 ; HC 250 × 0,16 = 40 ; + 15 € d’abonnement → 153,40 €.
    // Le 421e kWh HP est au-delà des 300 premiers → 0,27 €, pas 0,22 €.
    // Foyer B : HP 280 × 0,22 = 61,60 (les HC ne comptent pas dans les 300) ; HC 400 × 0,16 = 64 ; + 15 → 140,60 €.
    expected: { a_bill: 'eur_153_40', a_extra_hp_022: false, b_bill: 'eur_140_60' },
    fr: {
      name: 'Facture d’électricité par blocs',
      description: 'Tarif progressif en heures pleines, heures creuses hors bloc, abonnement.',
      state: {
        tariff:
          'Heures pleines (HP) : 0,22 € par kWh pour les 300 premiers kWh HP du mois, 0,27 € par kWh HP au-delà. Heures creuses (HC) : 0,16 € par kWh quel que soit le volume ; les kWh HC ne comptent pas dans les 300 premiers kWh. Abonnement : 15 € par mois.',
        october: [
          { household: 'A', hp_kwh: 420, hc_kwh: 250 },
          { household: 'B', hp_kwh: 280, hc_kwh: 400 },
        ],
      },
      questions: {
        a_bill: {
          type: 'choice',
          instructions: 'Quel est le montant de la facture d’octobre du foyer A ?',
          criteria: { eur_138_40: '138,40 €', eur_147_40: '147,40 €', eur_153_40: '153,40 €', eur_168_40: '168,40 €' },
        },
        a_extra_hp_022: { type: 'noul', instructions: 'Un kWh supplémentaire consommé en heures pleines en octobre aurait-il coûté 0,22 € au foyer A ?' },
        b_bill: {
          type: 'choice',
          instructions: 'Quel est le montant de la facture d’octobre du foyer B ?',
          criteria: { eur_125_60: '125,60 €', eur_140_60: '140,60 €', eur_154_60: '154,60 €', eur_164_60: '164,60 €' },
        },
      },
    },
    en: {
      name: 'Block-rate electricity bill',
      description: 'Rising peak-hour rate, off-peak outside the block, standing charge.',
      state: {
        tariff:
          'Peak hours: €0.22 per kWh for the first 300 peak kWh of the month, €0.27 per peak kWh beyond that. Off-peak hours: €0.16 per kWh whatever the volume; off-peak kWh do not count toward the first 300 kWh. Standing charge: €15 per month.',
        october: [
          { household: 'A', peak_kwh: 420, off_peak_kwh: 250 },
          { household: 'B', peak_kwh: 280, off_peak_kwh: 400 },
        ],
      },
      questions: {
        a_bill: {
          type: 'choice',
          instructions: 'How much is household A’s October bill?',
          criteria: { eur_138_40: '€138.40', eur_147_40: '€147.40', eur_153_40: '€153.40', eur_168_40: '€168.40' },
        },
        a_extra_hp_022: { type: 'noul', instructions: 'Would one more peak-hour kWh in October have cost household A €0.22?' },
        b_bill: {
          type: 'choice',
          instructions: 'How much is household B’s October bill?',
          criteria: { eur_125_60: '€125.60', eur_140_60: '€140.60', eur_154_60: '€154.60', eur_164_60: '€164.60' },
        },
      },
    },
  },
  {
    id: 'rules-card-game-score',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'court',
    // Ana : 3 × 2 + 1 × 3 + 1 série × 5 = 14. Ben : 1 × 2 + 3 × 3 + 1 série × 5 = 16. Cléo : 2 × 2 + 2 × 3 + 2 séries × 5 = 20.
    // Rouges : Ana 2, Ben 2, Cléo 3 → seule Cléo perd 4 points → 16. Égalité Ben / Cléo à 16 : Ben a 6 cartes, Cléo 7 → Ben gagne.
    expected: { winner: 'ben', cleo_score: 'pts16', ben_penalty: false },
    fr: {
      name: 'Décompte d’un jeu de cartes',
      description: 'Points par couleur, bonus de série, pénalité, départage.',
      state: {
        rules: [
          'Chaque carte verte rapporte 2 points, chaque carte bleue 3 points ; les cartes rouges ne rapportent rien par elles-mêmes.',
          'Chaque série complète d’une carte verte, une bleue et une rouge rapporte 5 points de bonus (une carte ne compte que dans une seule série).',
          'Le ou les joueurs ayant le plus de cartes rouges perdent 4 points ; en cas d’égalité pour le maximum, tous les joueurs concernés perdent 4 points.',
          'Le plus grand score l’emporte ; en cas d’égalité, le joueur qui a le moins de cartes au total gagne.',
        ],
        hands: {
          Ana: { vertes: 3, bleues: 1, rouges: 2 },
          Ben: { vertes: 1, bleues: 3, rouges: 2 },
          Cléo: { vertes: 2, bleues: 2, rouges: 3 },
        },
      },
      questions: {
        winner: { type: 'choice', instructions: 'Qui gagne la partie ?', criteria: { ana: 'Ana', ben: 'Ben', cleo: 'Cléo' } },
        cleo_score: {
          type: 'choice',
          instructions: 'Quel est le score final de Cléo ?',
          criteria: { pts10: '10 points', pts16: '16 points', pts20: '20 points', pts11: '11 points' },
        },
        ben_penalty: { type: 'noul', instructions: 'Ben perd-il 4 points pour ses cartes rouges ?' },
      },
    },
    en: {
      name: 'Card game scoring',
      description: 'Points per color, set bonus, penalty, tie-break.',
      state: {
        rules: [
          'Each green card is worth 2 points, each blue card 3 points; red cards are worth nothing on their own.',
          'Each complete set of one green, one blue and one red card earns a 5-point bonus (a card counts in only one set).',
          'The player or players with the most red cards lose 4 points; if several players share the maximum, all of them lose 4 points.',
          'The highest score wins; in case of a tie, the player with the fewest cards in total wins.',
        ],
        hands: {
          Ana: { green: 3, blue: 1, red: 2 },
          Ben: { green: 1, blue: 3, red: 2 },
          Cléo: { green: 2, blue: 2, red: 3 },
        },
      },
      questions: {
        winner: { type: 'choice', instructions: 'Who wins the game?', criteria: { ana: 'Ana', ben: 'Ben', cleo: 'Cléo' } },
        cleo_score: {
          type: 'choice',
          instructions: 'What is Cléo’s final score?',
          criteria: { pts10: '10 points', pts16: '16 points', pts20: '20 points', pts11: '11 points' },
        },
        ben_penalty: { type: 'noul', instructions: 'Does Ben lose 4 points for his red cards?' },
      },
    },
  },
  {
    id: 'rules-home-insurance',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'long',
    // Inoccupation depuis le 1er juillet : le 20 août est le 51e jour (≤ 60) → la suspension de l’article 13 ne joue pas encore ; effraction → vol couvert.
    // Le 5 septembre serait le 67e jour : suspendu, et l’alarme sonore non reliée ne suffit pas → non couvert.
    // Objets de valeur (sans vétusté) : 3 200 + 6 500 = 9 700 €, plafonnés à 8 000 €. Téléviseur : 2 ans complets → 20 % → 960 €. Espèces 150 € (< 300).
    // Indemnité : 8 000 + 960 + 150 − 250 (franchise après plafonds) = 8 860 €.
    expected: { theft_covered: true, alarm_helps: false, valuables_capped: true, payout: 'eur_8860', if_sept_5: false },
    fr: {
      name: 'Assurance habitation : cambriolage pendant les vacances',
      description: 'Contrat complet ; l’exception d’inoccupation est loin de la garantie vol.',
      state: `${HOME_POLICY.fr}\n\n${HOME_CLAIM.fr}`,
      questions: {
        theft_covered: { type: 'noul', instructions: 'Le cambriolage du 20 août est-il couvert par le contrat ?' },
        alarm_helps: { type: 'noul', instructions: 'L’alarme des Lemaire leur permet-elle d’échapper à la suspension prévue en cas d’inoccupation prolongée ?' },
        valuables_capped: { type: 'noul', instructions: 'Le plafond des objets de valeur réduit-il l’indemnité des Lemaire ?' },
        payout: {
          type: 'choice',
          instructions: 'Quelle indemnité les Lemaire recevront-ils pour ce cambriolage ?',
          criteria: { eur_8710: '8 710 €', eur_8860: '8 860 €', eur_9100: '9 100 €', eur_10560: '10 560 €' },
        },
        if_sept_5: { type: 'noul', instructions: 'Si le cambriolage avait eu lieu le 5 septembre (tout le reste inchangé), aurait-il été couvert ?' },
      },
    },
    en: {
      name: 'Home insurance: burglary during the holidays',
      description: 'Full contract; the vacancy exception is far from the theft cover.',
      state: `${HOME_POLICY.en}\n\n${HOME_CLAIM.en}`,
      questions: {
        theft_covered: { type: 'noul', instructions: 'Is the August 20 burglary covered by the contract?' },
        alarm_helps: { type: 'noul', instructions: 'Does the Lemaires’ alarm exempt them from the suspension that applies in case of extended vacancy?' },
        valuables_capped: { type: 'noul', instructions: 'Does the limit on valuables reduce the Lemaires’ compensation?' },
        payout: {
          type: 'choice',
          instructions: 'How much compensation will the Lemaires receive for this burglary?',
          criteria: { eur_8710: '€8,710', eur_8860: '€8,860', eur_9100: '€9,100', eur_10560: '€10,560' },
        },
        if_sept_5: { type: 'noul', instructions: 'If the burglary had taken place on September 5 (everything else unchanged), would it have been covered?' },
      },
    },
  },
  {
    id: 'rules-hr-guide',
    category: 'Reasoning',
    complexity: 'complexe',
    length: 'long',
    // Sarah : 6 ans d’ancienneté ≥ 5 → l’article 12.1 porte le congé mariage de 4 à 6 jours.
    // Hugo : période d’essai, mais les congés pour décès restent dus (12.2) → 3 jours pour le décès de son père.
    // Inès : PACS pendant la période d’essai → pas de congé (12.2).
    // Malik : 3 ans chez Atelier Brenne repris (12.3, contrat transféré) + 4 ans et 2 mois → 7 ans → 6 % × 2 800 = 168 €.
    // Théo : à 32 km (> 25) → cumul autorisé (12.4) : 50 % × 90 × 12 = 540 + 300 = 840 €, plafonné à 600 €.
    expected: { sarah_days: 'd6', hugo_leave: true, ines_leave: false, malik_bonus: 'eur_168', theo_commute: 'eur_600' },
    fr: {
      name: 'Guide RH : avantages et absences',
      description: 'Guide complet ; les dérogations sont regroupées à la fin, loin des règles générales.',
      state: `${HR_GUIDE.fr}\n\n${HR_REQUESTS.fr}`,
      questions: {
        sarah_days: {
          type: 'choice',
          instructions: 'Combien de jours de congé Sarah obtient-elle pour son mariage ?',
          criteria: { d3: '3 jours', d4: '4 jours', d5: '5 jours', d6: '6 jours' },
        },
        hugo_leave: { type: 'noul', instructions: 'Hugo a-t-il droit à des jours de congé pour le décès de son père ?' },
        ines_leave: { type: 'noul', instructions: 'Inès a-t-elle droit à des jours de congé pour son PACS ?' },
        malik_bonus: {
          type: 'choice',
          instructions: 'Quel est le montant mensuel de la prime d’ancienneté de Malik ?',
          criteria: { eur_0: '0 €', eur_84: '84 €', eur_168: '168 €', eur_252: '252 €' },
        },
        theo_commute: {
          type: 'choice',
          instructions: 'Quel montant annuel total Théo perçoit-il au titre de ses frais de transport ?',
          criteria: { eur_600: '600 €', eur_300: '300 €', eur_540: '540 €', eur_840: '840 €' },
        },
      },
    },
    en: {
      name: 'HR guide: benefits and absences',
      description: 'Full guide; the exceptions are grouped at the end, far from the general rules.',
      state: `${HR_GUIDE.en}\n\n${HR_REQUESTS.en}`,
      questions: {
        sarah_days: {
          type: 'choice',
          instructions: 'How many days of leave does Sarah get for her wedding?',
          criteria: { d3: '3 days', d4: '4 days', d5: '5 days', d6: '6 days' },
        },
        hugo_leave: { type: 'noul', instructions: 'Is Hugo entitled to leave days for his father’s death?' },
        ines_leave: { type: 'noul', instructions: 'Is Inès entitled to leave days for her civil partnership?' },
        malik_bonus: {
          type: 'choice',
          instructions: 'How much is Malik’s monthly seniority bonus?',
          criteria: { eur_0: '€0', eur_84: '€84', eur_168: '€168', eur_252: '€252' },
        },
        theo_commute: {
          type: 'choice',
          instructions: 'What total annual amount does Théo receive for his commuting costs?',
          criteria: { eur_600: '€600', eur_300: '€300', eur_540: '€540', eur_840: '€840' },
        },
      },
    },
  },
]
