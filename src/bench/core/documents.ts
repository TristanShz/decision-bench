import type { Json } from '../../types'
import type { CoreLang, Pair } from './pair.ts'

// Documents longs et contexte long : la réponse est enfouie dans le texte, ou doit être reconstituée à partir
// de plusieurs passages (décision annulée par un message ultérieur, exception éloignée de la règle, version
// qui annule une autre version, jeu de données généré avec une aiguille et une absence à constater).

// ─── Textes longs ────────────────────────────────────────────────────────────

const EMAIL_THREAD = {
  fr: `De : Sophie Marchetti
À : Équipe produit
Date : lundi 2 février 2026, 9 h 14
Objet : Séminaire de printemps — proposition

Bonjour à tous,

Merci d’avoir répondu au sondage sur le séminaire de printemps. La proposition qui arrive en tête est Lyon, les jeudi 19 et vendredi 20 mars 2026, au centre de congrès Belvédère. Le programme prévoit une matinée de bilan de l’année, un atelier sur la feuille de route et une activité d’équipe le vendredi après-midi.

La direction a validé un budget de 12 000 € pour 28 personnes. Merci de m’envoyer vos contraintes alimentaires avant le vendredi 13 février.

Sophie

---
De : Damien Roux
Date : mardi 3 février 2026, 11 h 02
Objet : RE: Séminaire de printemps — proposition

Bonjour Sophie,

Lyon me va très bien. En revanche, le 19 mars tombe en pleine mise en production de la version 5 : toute l’équipe infrastructure sera mobilisée ce jour-là. Est-ce qu’on peut décaler d’une semaine ?

Damien

---
De : Sophie Marchetti
Date : mercredi 4 février 2026, 8 h 47
Objet : RE: Séminaire de printemps — proposition

Bonne remarque, Damien. Je demande au centre Belvédère s’il peut nous accueillir les jeudi 26 et vendredi 27 mars à la place. Je vous tiens au courant.

Sophie

---
De : Léa Vasseur
Date : jeudi 5 février 2026, 16 h 20
Objet : RE: Séminaire de printemps — proposition

Bonjour,

Pour éviter les mauvaises surprises : le budget du séminaire couvre le transport, l’hébergement et les repas, mais pas l’activité d’équipe. Celle-ci doit être imputée sur le budget formation de chaque manager, comme l’an dernier.

Léa (finance)

---
De : Sophie Marchetti
Date : lundi 9 février 2026, 10 h 05
Objet : RE: Séminaire de printemps — proposition

Mauvaise nouvelle : le centre Belvédère est complet les 26 et 27 mars. En revanche, le domaine des Trois Lacs, près d’Annecy, est libre à ces dates pour un tarif comparable. Il dispose d’une salle plénière et de trois petites salles pour les ateliers. Sauf objection d’ici jeudi, je pars sur cette option.

Sophie

---
De : Marc Olivier
Date : mardi 10 février 2026, 18 h 31
Objet : RE: Séminaire de printemps — proposition

Pas d’objection pour Annecy. Autre changement : les quatre alternants viendront aussi, nous serons donc 32 et non 28. J’ai obtenu une rallonge auprès de la direction : le budget passe de 12 000 € à 13 500 €.

Marc

---
De : Damien Roux
Date : mercredi 11 février 2026, 9 h 12
Objet : RE: Séminaire de printemps — proposition

Parfait, merci ! Si ça aide, je peux réserver le car pour l’aller et le retour.

Damien

---
De : Sophie Marchetti
Date : jeudi 12 février 2026, 17 h 45
Objet : Séminaire de printemps — confirmation

Merci Damien, mais Léa a déjà un contrat-cadre avec un transporteur : c’est elle qui réservera le car.

Confirmation : domaine des Trois Lacs, près d’Annecy, jeudi 26 et vendredi 27 mars 2026, 32 participants. Départ en car le jeudi à 7 h 30 depuis le bureau. Pensez à m’envoyer vos contraintes alimentaires d’ici demain soir si ce n’est pas déjà fait.

Sophie`,
  en: `From: Sophie Marchetti
To: Product team
Date: Monday, February 2, 2026, 9:14 am
Subject: Spring offsite — proposal

Hi everyone,

Thanks for answering the survey about the spring offsite. The top proposal is Lyon, on Thursday, March 19 and Friday, March 20, 2026, at the Belvédère conference center. The agenda includes a morning reviewing the year, a roadmap workshop, and a team activity on Friday afternoon.

Management has approved a budget of €12,000 for 28 people. Please send me your dietary requirements before Friday, February 13.

Sophie

---
From: Damien Roux
Date: Tuesday, February 3, 2026, 11:02 am
Subject: RE: Spring offsite — proposal

Hi Sophie,

Lyon works for me. However, March 19 falls right in the middle of the version 5 release: the whole infrastructure team will be busy that day. Could we push it back by a week?

Damien

---
From: Sophie Marchetti
Date: Wednesday, February 4, 2026, 8:47 am
Subject: RE: Spring offsite — proposal

Good point, Damien. I’m asking the Belvédère center whether they can host us on Thursday, March 26 and Friday, March 27 instead. I’ll keep you posted.

Sophie

---
From: Léa Vasseur
Date: Thursday, February 5, 2026, 4:20 pm
Subject: RE: Spring offsite — proposal

Hello,

To avoid any surprises: the offsite budget covers transport, accommodation and meals, but not the team activity. That has to be charged to each manager’s training budget, as it was last year.

Léa (finance)

---
From: Sophie Marchetti
Date: Monday, February 9, 2026, 10:05 am
Subject: RE: Spring offsite — proposal

Bad news: the Belvédère center is fully booked on March 26 and 27. However, the Trois Lacs estate, near Annecy, is available on those dates for a similar price. It has a plenary room and three small rooms for the workshops. Unless someone objects by Thursday, I’ll go with that option.

Sophie

---
From: Marc Olivier
Date: Tuesday, February 10, 2026, 6:31 pm
Subject: RE: Spring offsite — proposal

No objection to Annecy. Another change: the four apprentices will come too, so we will be 32 rather than 28. I got extra funding from management: the budget goes from €12,000 to €13,500.

Marc

---
From: Damien Roux
Date: Wednesday, February 11, 2026, 9:12 am
Subject: RE: Spring offsite — proposal

Perfect, thanks! If it helps, I can book the coach for the round trip.

Damien

---
From: Sophie Marchetti
Date: Thursday, February 12, 2026, 5:45 pm
Subject: Spring offsite — confirmation

Thanks Damien, but Léa already has a framework contract with a coach company: she will book the coach.

Confirmation: Trois Lacs estate, near Annecy, Thursday, March 26 and Friday, March 27, 2026, 32 participants. The coach leaves the office on Thursday at 7:30 am. Remember to send me your dietary requirements by tomorrow evening if you haven’t already.

Sophie`,
}

const TERMS = {
  fr: `CONDITIONS GÉNÉRALES D’ABONNEMENT — NUVOLA DRIVE (extrait, version du 1er janvier 2026)

Article 1 — Objet
Les présentes conditions régissent l’accès au service de stockage en ligne Nuvola Drive (le « Service ») souscrit par un client professionnel (le « Client »).

Article 2 — Offres
Le Service est proposé selon deux formules : l’abonnement mensuel, facturé chaque mois, et l’abonnement annuel, facturé en une fois au début de chaque période de douze mois. L’abonnement annuel bénéficie d’une remise de 20 % par rapport à douze mensualités.

Article 3 — Paiement
Les factures sont payables à réception. En cas de retard de paiement de plus de 15 jours, Nuvola peut suspendre l’accès au Service après une mise en demeure restée sans effet pendant 8 jours.

Article 4 — Durée et résiliation
4.1 L’abonnement mensuel peut être résilié à tout moment ; la résiliation prend effet à la fin du mois en cours.
4.2 L’abonnement annuel peut être résilié à tout moment ; la résiliation prend effet à la fin de la période annuelle en cours. Sauf disposition contraire des présentes conditions, aucun remboursement, total ou partiel, n’est accordé pour la période en cours.
4.3 Toute demande de résiliation est adressée depuis l’espace client ou par courrier recommandé.

Article 5 — Assistance
L’assistance est joignable par messagerie du lundi au vendredi, de 8 h à 19 h. Le délai de première réponse est de 4 heures ouvrées pour les incidents bloquants et de 2 jours ouvrés pour les autres demandes.

Article 6 — Évolution des prix
Nuvola peut modifier ses tarifs en notifiant le Client au moins 60 jours avant leur entrée en vigueur. Le nouveau tarif s’applique à compter du renouvellement suivant. Le Client qui refuse le nouveau tarif peut s’opposer au renouvellement sans frais.

Article 7 — Responsabilité
La responsabilité de Nuvola est limitée, toutes causes confondues, au montant payé par le Client au cours des douze derniers mois. Nuvola n’est pas responsable des pertes de données causées par une action du Client ou de l’un de ses utilisateurs.

Article 8 — Disponibilité du Service
8.1 Nuvola s’engage sur une disponibilité mensuelle du Service d’au moins 99,5 %.
8.2 Les opérations de maintenance annoncées au Client au moins 72 heures à l’avance ne sont pas comptées comme des périodes d’indisponibilité.
8.3 Si la disponibilité d’un mois civil est inférieure à 98 %, le Client titulaire d’un abonnement annuel peut, par dérogation à l’article 4.2, résilier son abonnement avec effet immédiat et obtenir le remboursement des mois restants, au prorata. Cette demande doit être formulée au plus tard 30 jours après la fin du mois concerné.
8.4 Si la disponibilité d’un mois est comprise entre 98 % et 99,5 %, le Client reçoit un avoir égal à 10 % du prix mensuel, sans droit de résiliation anticipée.

Article 9 — Données du Client
Après la fin de l’abonnement, les données du Client restent accessibles en lecture et exportables pendant 45 jours. Elles sont ensuite définitivement supprimées.

Article 10 — Droit applicable
Les présentes conditions sont soumises au droit français.

—

DOSSIER CLIENT — Atelier Brunelle (abonnement annuel)
Début de la période annuelle en cours : 1er janvier 2026.
Rapport de disponibilité de mai 2026 : 97,1 % (maintenance annoncée exclue).
Maintenance du 18 mai 2026 : 6 heures, annoncée au Client le 13 mai 2026.
Demande du Client, reçue le 10 juin 2026 : « Après les coupures de mai, nous voulons résilier immédiatement et être remboursés des mois restants. »`,
  en: `GENERAL SUBSCRIPTION TERMS — NUVOLA DRIVE (excerpt, version of January 1, 2026)

Article 1 — Purpose
These terms govern access to the Nuvola Drive online storage service (the "Service") subscribed to by a business customer (the "Customer").

Article 2 — Plans
The Service is offered under two plans: the monthly subscription, billed every month, and the annual subscription, billed once at the start of each twelve-month period. The annual subscription comes with a 20% discount compared with twelve monthly payments.

Article 3 — Payment
Invoices are payable on receipt. If a payment is more than 15 days late, Nuvola may suspend access to the Service after a formal notice that has remained unanswered for 8 days.

Article 4 — Term and termination
4.1 The monthly subscription may be terminated at any time; termination takes effect at the end of the current month.
4.2 The annual subscription may be terminated at any time; termination takes effect at the end of the current annual period. Unless otherwise provided in these terms, no refund, full or partial, is granted for the current period.
4.3 Any termination request must be sent from the customer portal or by registered mail.

Article 5 — Support
Support can be reached by chat Monday to Friday, 8 am to 7 pm. The first response time is 4 business hours for blocking incidents and 2 business days for other requests.

Article 6 — Price changes
Nuvola may change its prices by notifying the Customer at least 60 days before they take effect. The new price applies from the next renewal. A Customer who refuses the new price may opt out of the renewal at no cost.

Article 7 — Liability
Nuvola's liability is limited, for all causes combined, to the amount paid by the Customer over the last twelve months. Nuvola is not liable for data loss caused by an action of the Customer or of one of its users.

Article 8 — Service availability
8.1 Nuvola commits to a monthly Service availability of at least 99.5%.
8.2 Maintenance operations announced to the Customer at least 72 hours in advance are not counted as periods of unavailability.
8.3 If the availability for a calendar month is below 98%, a Customer holding an annual subscription may, notwithstanding article 4.2, terminate its subscription with immediate effect and obtain a pro-rata refund of the remaining months. This request must be made no later than 30 days after the end of the month concerned.
8.4 If the availability for a month is between 98% and 99.5%, the Customer receives a credit equal to 10% of the monthly price, without any right of early termination.

Article 9 — Customer data
After the subscription ends, the Customer's data remains readable and exportable for 45 days. It is then permanently deleted.

Article 10 — Governing law
These terms are governed by French law.

—

CUSTOMER FILE — Atelier Brunelle (annual subscription)
Start of the current annual period: January 1, 2026.
Availability report for May 2026: 97.1% (announced maintenance excluded).
Maintenance on May 18, 2026: 6 hours, announced to the Customer on May 13, 2026.
Customer request, received on June 10, 2026: "After the outages in May, we want to terminate immediately and be refunded for the remaining months."`,
}

const CHANGELOG = {
  fr: `Tessera — Notes de version (de la plus récente à la plus ancienne)

## 4.9.0 — 2 mars 2026
- L’export PDF devient une fonctionnalité réservée à l’offre Pro. Les utilisateurs de l’offre gratuite conservent l’export en Markdown et en texte brut.
- Nouveaux modèles de notes : compte rendu, liste de courses, journal.
- Correction : les pièces jointes de plus de 50 Mo ne bloquent plus la synchronisation.

## 4.8.0 — 26 janvier 2026
- Le mode hors ligne sort de la bêta et est désormais activé pour tous.
- Recherche plein texte jusqu’à deux fois plus rapide sur les gros carnets.
- Correction : le compteur de mots ignorait les listes à puces.

## 4.7.1 — 8 janvier 2026
- Correction : plantage au démarrage sur certaines tablettes Android.

## 4.7.0 — 15 décembre 2025
- Retour de l’intervalle de sauvegarde automatique à 30 secondes : l’intervalle de 10 secondes introduit en 4.3.0 provoquait une consommation de batterie excessive.
- Les étiquettes peuvent maintenant être colorées.

## 4.6.0 — 10 novembre 2025
- Fin de la prise en charge d’Android 8. Android 9 est désormais la version minimale.
- Correction : en mode sombre, le texte des tableaux restait noir sur fond gris foncé.
- Nouveau raccourci clavier pour insérer la date du jour.

## 4.5.0 — 6 octobre 2025
- Nouveau : export des notes en PDF, disponible pour tous les utilisateurs.
- Les liens entre notes affichent un aperçu au survol.

## 4.4.0 — 1er septembre 2025
- Nouveau : mode sombre, qui suit par défaut le réglage du système.
- Meilleure accessibilité des menus pour les lecteurs d’écran.

## 4.3.0 — 28 juillet 2025
- La sauvegarde automatique passe de 30 secondes à 10 secondes.
- Correction : les notes épinglées disparaissaient après un tri par date.

## 4.2.0 — 23 juin 2025
- Nouveau (bêta) : mode hors ligne, à activer dans Paramètres > Expérimental.
- Import depuis des fichiers Markdown.

## 4.1.0 — 19 mai 2025
- Partage d’un carnet en lecture seule par lien.
- Correction : les rappels se déclenchaient une heure trop tôt après le passage à l’heure d’été.

## 4.0.0 — 14 avril 2025
- Nouvelle interface et refonte de la barre latérale.
- Synchronisation chiffrée de bout en bout.
- Versions minimales prises en charge : Android 8 et iOS 15.`,
  en: `Tessera — Release notes (newest first)

## 4.9.0 — March 2, 2026
- PDF export becomes a Pro-plan-only feature. Free-plan users keep Markdown and plain-text export.
- New note templates: meeting notes, shopping list, journal.
- Fix: attachments larger than 50 MB no longer block sync.

## 4.8.0 — January 26, 2026
- Offline mode leaves beta and is now enabled for everyone.
- Full-text search up to twice as fast on large notebooks.
- Fix: the word counter ignored bulleted lists.

## 4.7.1 — January 8, 2026
- Fix: crash on startup on some Android tablets.

## 4.7.0 — December 15, 2025
- Auto-save interval reverted to 30 seconds: the 10-second interval introduced in 4.3.0 caused excessive battery drain.
- Tags can now be colored.

## 4.6.0 — November 10, 2025
- Android 8 is no longer supported. Android 9 is now the minimum version.
- Fix: in dark mode, table text stayed black on a dark gray background.
- New keyboard shortcut to insert today’s date.

## 4.5.0 — October 6, 2025
- New: export notes to PDF, available to all users.
- Links between notes show a preview on hover.

## 4.4.0 — September 1, 2025
- New: dark mode, which follows the system setting by default.
- Better menu accessibility for screen readers.

## 4.3.0 — July 28, 2025
- Auto-save goes from 30 seconds to 10 seconds.
- Fix: pinned notes disappeared after sorting by date.

## 4.2.0 — June 23, 2025
- New (beta): offline mode, to be enabled in Settings > Experimental.
- Import from Markdown files.

## 4.1.0 — May 19, 2025
- Share a notebook read-only via a link.
- Fix: reminders fired one hour early after the switch to daylight saving time.

## 4.0.0 — April 14, 2025
- New interface and redesigned sidebar.
- End-to-end encrypted sync.
- Minimum supported versions: Android 8 and iOS 15.`,
}

const LAUNCH_MINUTES = {
  fr: `Réunion de préparation du lancement — application Kiwi Budget
Date : lundi 9 mars 2026, 10 h – 11 h 15
Présents : Julie Fontaine (cheffe de produit, animatrice), Bastien Morel (communication), Amélie Garnier (marketing), Karim Haddad (développement mobile), Odile Perrin (support client)

1. Calendrier
Julie rappelle que le lancement public est prévu le mardi 14 avril 2026. Personne ne s’y oppose : la date est confirmée.
Karim indique que la soumission aux magasins d’applications était prévue le vendredi 3 avril. Odile fait remarquer que la validation par Apple a pris neuf jours lors de la dernière mise à jour. Après discussion, la soumission est avancée au mardi 31 mars. Karim s’en charge.

2. Communication
Bastien rédigera le communiqué de presse, à envoyer aux journalistes le 13 avril sous embargo. Il partagera un premier jet avec Julie d’ici le 27 mars.
Amélie présente le plan de publications sur les réseaux sociaux : trois publications par semaine à partir du 1er avril. Elle préparera les visuels.

3. Bêta publique
Julie propose d’ouvrir une bêta publique d’une semaine, du 1er au 7 avril. Karim rappelle que chaque nouvelle version bêta doit aussi passer la validation des magasins, ce qui rend le calendrier trop serré. Décision : la bêta publique est abandonnée ; seule la bêta interne avec les 40 salariés volontaires est maintenue.

4. Support
Odile demande que la foire aux questions soit en ligne avant le lancement. Elle rédigera les vingt questions les plus probables. Karim fournira à Odile, d’ici le 20 mars, la liste des limitations connues de la version 1.0 pour qu’elle puisse les intégrer à la FAQ.
Odile signale aussi qu’il faudra deux personnes supplémentaires au support la semaine du lancement. Julie ne peut pas valider ce renfort aujourd’hui : elle doit d’abord obtenir l’accord du directeur financier.

5. Points divers
Bastien annonce qu’il sera en congé du 23 mars au 10 avril, une absence prévue de longue date. Julie fait remarquer que le premier jet du communiqué ne pourra donc pas être prêt le 27 mars. Amélie propose de reprendre la rédaction du communiqué de presse ; Bastien lui transmettra ses notes avant son départ. Julie valide : le communiqué passe à Amélie, avec la même échéance du 27 mars pour le premier jet.
Karim demande s’il faut prévoir une version pour tablette. Julie répond que la question sera étudiée après le lancement, pas avant.

Prochaine réunion : lundi 23 mars 2026, même heure.`,
  en: `Launch preparation meeting — Kiwi Budget app
Date: Monday, March 9, 2026, 10:00–11:15 am
Attendees: Julie Fontaine (product manager, chair), Bastien Morel (communications), Amélie Garnier (marketing), Karim Haddad (mobile development), Odile Perrin (customer support)

1. Schedule
Julie reminds everyone that the public launch is planned for Tuesday, April 14, 2026. Nobody objects: the date is confirmed.
Karim says the submission to the app stores was planned for Friday, April 3. Odile points out that Apple’s review took nine days for the last update. After discussion, the submission is moved up to Tuesday, March 31. Karim will handle it.

2. Communications
Bastien will write the press release, to be sent to journalists on April 13 under embargo. He will share a first draft with Julie by March 27.
Amélie presents the social media plan: three posts a week starting April 1. She will prepare the visuals.

3. Public beta
Julie suggests opening a one-week public beta, from April 1 to April 7. Karim reminds everyone that each new beta build must also go through store review, which makes the schedule too tight. Decision: the public beta is dropped; only the internal beta with the 40 volunteer employees is kept.

4. Support
Odile asks for the FAQ to be online before the launch. She will write the twenty most likely questions. Karim will give Odile, by March 20, the list of known limitations of version 1.0 so that she can include them in the FAQ.
Odile also says that support will need two extra people during launch week. Julie cannot approve these extra staff today: she first needs the CFO’s agreement.

5. Other business
Bastien announces that he will be on leave from March 23 to April 10, a long-planned absence. Julie points out that the first draft of the press release therefore cannot be ready by March 27. Amélie offers to take over writing the press release; Bastien will hand her his notes before he leaves. Julie agrees: the press release goes to Amélie, with the same March 27 deadline for the first draft.
Karim asks whether a tablet version should be planned. Julie answers that the question will be looked at after the launch, not before.

Next meeting: Monday, March 23, 2026, same time.`,
}

const POSTMORTEM = {
  fr: `Post-mortem — Incident INC-2291 : échecs de paiements
Date de l’incident : mercredi 4 mars 2026 (heures en UTC)
Rédigé par : Yanis Belkacem (astreinte)
Statut : clos

Contexte
Le service « ledger » enregistre les paiements par carte et déclenche les virements vers les commerçants. Il est déployé plusieurs fois par semaine.

Chronologie
09:02 — Déploiement de la version 2.31 du service ledger. La version contient une migration qui crée et active l’indicateur de fonctionnalité « batch_settlement ».
09:07 — Première alerte : la latence p99 de l’API de paiement dépasse 2 secondes.
09:12 — Yanis prend l’alerte en charge et ouvre le canal d’incident.
09:15 — Le taux d’erreur atteint 9 %. Les erreurs sont des délais d’attente dépassés vers la base de données.
09:20 — Hypothèse : saturation de la base de données. Clémence Aubry (administratrice de bases de données) est appelée.
09:29 — Clémence confirme que la base de données est en bonne santé : CPU à 35 %, aucun verrou bloquant, réplication à jour. Les délais dépassés viennent de requêtes de règlement groupé envoyées en rafale par le ledger.
09:34 — Le taux d’erreur atteint 38 %.
09:41 — Décision de revenir à la version 2.30.
09:48 — Retour à la version 2.30 terminé. Le taux d’erreur baisse mais reste à 12 %.
09:55 — Le support signale des réclamations de commerçants au sujet de paiements refusés.
10:05 — Cause identifiée : le retour à la version 2.30 n’a pas désactivé l’indicateur « batch_settlement », que la migration de la 2.31 avait activé. La version 2.30 exécute elle aussi le règlement groupé dès que l’indicateur est actif.
10:09 — Indicateur « batch_settlement » désactivé manuellement. Le taux d’erreur revient à 0,2 %, son niveau habituel.
10:30 — Fin de la surveillance renforcée, incident clos.

Impact
1 240 paiements ont échoué pendant l’incident. Les nouvelles tentatives automatiques en ont fait aboutir 1 203. Les 37 restants ont dû être retraités manuellement par l’équipe opérations le jour même. Aucun paiement n’a été débité deux fois.

Actions correctives
1. Les retours de version doivent aussi restaurer l’état des indicateurs de fonctionnalité (responsable : Yanis, pour le 18 mars 2026).
2. Ajouter une alerte sur le taux d’erreur du règlement groupé (responsable : Clémence, pour le 25 mars 2026).
3. Interdire aux migrations d’activer un indicateur de fonctionnalité ; l’activation devient une étape manuelle (responsable : équipe plateforme, date à définir).`,
  en: `Postmortem — Incident INC-2291: payment failures
Incident date: Wednesday, March 4, 2026 (times in UTC)
Written by: Yanis Belkacem (on call)
Status: closed

Context
The "ledger" service records card payments and triggers payouts to merchants. It is deployed several times a week.

Timeline
09:02 — Version 2.31 of the ledger service is deployed. The release contains a migration that creates and enables the "batch_settlement" feature flag.
09:07 — First alert: p99 latency of the payment API exceeds 2 seconds.
09:12 — Yanis acknowledges the alert and opens the incident channel.
09:15 — The error rate reaches 9%. The errors are timeouts to the database.
09:20 — Hypothesis: database saturation. Clémence Aubry (database administrator) is paged.
09:29 — Clémence confirms the database is healthy: CPU at 35%, no blocking locks, replication up to date. The timeouts come from batch settlement queries sent in bursts by the ledger.
09:34 — The error rate reaches 38%.
09:41 — Decision to roll back to version 2.30.
09:48 — Rollback to version 2.30 complete. The error rate drops but stays at 12%.
09:55 — Support reports merchant complaints about declined payments.
10:05 — Cause identified: rolling back to version 2.30 did not disable the "batch_settlement" flag, which the 2.31 migration had enabled. Version 2.30 also runs batch settlement whenever the flag is on.
10:09 — "batch_settlement" flag disabled manually. The error rate returns to 0.2%, its usual level.
10:30 — End of heightened monitoring, incident closed.

Impact
1,240 payments failed during the incident. Automatic retries got 1,203 of them through. The remaining 37 had to be reprocessed manually by the operations team the same day. No payment was charged twice.

Corrective actions
1. Rollbacks must also restore the state of feature flags (owner: Yanis, by March 18, 2026).
2. Add an alert on the batch settlement error rate (owner: Clémence, by March 25, 2026).
3. Forbid migrations from enabling a feature flag; enabling becomes a manual step (owner: platform team, date to be set).`,
}

const JOB_APPLICATION = {
  fr: `OFFRE D’EMPLOI — Ingénieur·e données senior
Entreprise : Maréa Logistique, Nantes
Contrat : CDI, temps plein
Rémunération : de 55 000 € à 65 000 € brut annuel selon expérience

Missions
Au sein d’une équipe de six personnes, vous concevez et maintenez les flux de données qui alimentent nos tableaux de bord d’exploitation et nos modèles de prévision de la demande. Vous travaillez avec les équipes entrepôt, transport et finance.

Profil requis
- Au moins 5 ans d’expérience professionnelle en ingénierie des données.
- Maîtrise de Python et de SQL.
- Expérience en production d’un orchestrateur de flux : Airflow ou Dagster.
- Français courant, à l’écrit comme à l’oral.
- Présence sur site à Nantes au moins deux jours par semaine (le mardi et le jeudi).

Atouts appréciés
- Expérience de Spark.
- Expérience de Kubernetes.

Avantages : télétravail le reste de la semaine, 27 jours de congés, mutuelle prise en charge à 70 %.

—

LETTRE DE CANDIDATURE — Thomas Lemarchand, Bordeaux, le 3 mars 2026

Madame, Monsieur,

Je vous propose ma candidature au poste d’ingénieur données senior. J’ai sept ans d’expérience professionnelle : deux ans comme analyste de données chez un distributeur de jardinerie, puis cinq ans comme ingénieur données chez Transvale, un transporteur régional.

Chez Transvale, j’ai construit en Python et en SQL l’ensemble des flux de suivi des livraisons, soit environ 140 traitements quotidiens. Je les ai migrés de simples tâches planifiées vers Dagster, que nous utilisons en production depuis trois ans. J’ai également optimisé nos traitements Spark de calcul des tournées, dont la durée est passée de quatre heures à quarante minutes. En revanche, je n’ai jamais travaillé avec Kubernetes : nos traitements tournent sur des machines virtuelles gérées par une autre équipe.

Le français est ma langue maternelle et je travaille couramment en anglais.

Je vis à Bordeaux et je ne souhaite pas déménager, pour des raisons familiales. Je peux me rendre à Nantes une fois par mois, pour une ou deux journées, mais pas chaque semaine.

Mes prétentions salariales sont de 70 000 € brut annuel.

Je serais ravi d’échanger avec vous.

Thomas Lemarchand`,
  en: `JOB OPENING — Senior data engineer
Company: Maréa Logistique, Nantes (France)
Contract: permanent, full time
Salary: €55,000 to €65,000 gross per year depending on experience

Responsibilities
Within a team of six, you design and maintain the data pipelines that feed our operations dashboards and our demand forecasting models. You work with the warehouse, transport and finance teams.

Requirements
- At least 5 years of professional experience in data engineering.
- Strong Python and SQL.
- Production experience with a workflow orchestrator: Airflow or Dagster.
- Fluent French, written and spoken.
- On site in Nantes at least two days a week (Tuesday and Thursday).

Nice to have
- Experience with Spark.
- Experience with Kubernetes.

Benefits: remote work the rest of the week, 27 days of paid leave, health insurance 70% covered.

—

COVER LETTER — Thomas Lemarchand, Bordeaux, March 3, 2026

Dear Hiring Manager,

I am applying for the senior data engineer position. I have seven years of professional experience: two years as a data analyst at a garden-supply retailer, then five years as a data engineer at Transvale, a regional carrier.

At Transvale, I built all of the delivery-tracking pipelines in Python and SQL, about 140 daily jobs. I migrated them from plain scheduled tasks to Dagster, which we have been running in production for three years. I also optimized our Spark route-planning jobs, cutting their runtime from four hours to forty minutes. On the other hand, I have never worked with Kubernetes: our jobs run on virtual machines managed by another team.

French is my native language and I work fluently in English.

I live in Bordeaux and do not wish to relocate, for family reasons. I can travel to Nantes once a month, for one or two days, but not every week.

My salary expectation is €70,000 gross per year.

I would be glad to discuss this with you.

Thomas Lemarchand`,
}

const SUPPORT_CHAT = {
  fr: `Conversation de support — Fibrea, chat du samedi 21 février 2026
Cliente : Mme Hélène Carvalho, contrat n° FB-208117
Conseiller : Romain

[14:02] Hélène : Bonjour, je souhaite résilier mon abonnement fibre.
[14:02] Romain : Bonjour madame Carvalho, je suis Romain. Je regarde votre dossier. Puis-je vous demander la raison de votre demande ?
[14:04] Hélène : Le prix. Je paie 49,99 € par mois et je ne regarde presque jamais la télévision. Une voisine paie beaucoup moins cher chez un concurrent.
[14:05] Romain : Je comprends. Vous avez l’offre Fibre Intégrale : internet, télévision et téléphone fixe. Vous n’êtes plus engagée depuis janvier, donc une résiliation ne vous coûterait aucuns frais. Avant que je l’enregistre, puis-je vous proposer une alternative ?
[14:06] Hélène : Allez-y, mais rapidement.
[14:07] Romain : L’offre Fibre Essentielle comprend internet avec le même débit, sans la télévision, pour 29,99 € par mois. Le téléphone fixe est en option à 5 € par mois.
[14:09] Hélène : Et il y a un engagement ?
[14:09] Romain : Non, aucun nouvel engagement : vous restez libre de résilier quand vous voulez.
[14:11] Hélène : Bon. Dans ce cas, je préfère changer d’offre plutôt que résilier. Je n’ai pas besoin du téléphone fixe, enlevez-le.
[14:12] Romain : C’est noté : Fibre Essentielle sans option téléphone, 29,99 € par mois. Ce changement nécessite un nouveau boîtier, que nous vous envoyons gratuitement. Je l’envoie à votre adresse de facturation, 8 allée des Tilleuls à Rennes ?
[14:13] Hélène : Non, je serai absente la semaine prochaine. Envoyez-le plutôt chez ma fille, 41 rue de la Monnaie à Rennes.
[14:14] Romain : Très bien, livraison au 41 rue de la Monnaie, à Rennes. Comptez trois à cinq jours ouvrés.
[14:16] Hélène : Attendez, je réfléchis pour le téléphone. Ma mère m’appelle toujours sur le fixe, elle ne sait pas se servir d’un portable. Finalement, je garde l’option téléphone.
[14:17] Romain : Aucun problème, je rajoute l’option téléphone. Votre nouvelle mensualité sera donc de 34,99 € par mois, à partir de votre prochaine facture du 1er mars.
[14:18] Hélène : Et mon ancien boîtier ?
[14:19] Romain : Vous le renverrez dans le carton du nouveau, avec l’étiquette prépayée fournie, dans les 30 jours suivant la réception. Sinon, il vous serait facturé 90 €.
[14:20] Hélène : D’accord. Et vous confirmez que je n’aurai plus la télévision ?
[14:20] Romain : Je confirme : la télévision s’arrêtera à l’activation du nouveau boîtier.
[14:21] Hélène : Très bien. Merci pour votre aide.
[14:21] Romain : Avec plaisir. Je vous envoie un récapitulatif par courriel. Bonne fin de journée !`,
  en: `Support conversation — Fibrea, chat of Saturday, February 21, 2026
Customer: Ms. Hélène Carvalho, contract no. FB-208117
Agent: Romain

[14:02] Hélène: Hello, I want to cancel my fiber subscription.
[14:02] Romain: Hello Ms. Carvalho, I’m Romain. I’m looking at your account. May I ask why you want to cancel?
[14:04] Hélène: The price. I pay €49.99 a month and I almost never watch TV. A neighbor pays much less with a competitor.
[14:05] Romain: I understand. You have the Fiber Complete plan: internet, TV and landline. Your commitment ended in January, so cancelling would cost you no fees. Before I record it, may I suggest an alternative?
[14:06] Hélène: Go ahead, but be quick.
[14:07] Romain: The Fiber Essential plan includes internet at the same speed, without TV, for €29.99 a month. The landline is an option at €5 a month.
[14:09] Hélène: And is there a commitment?
[14:09] Romain: No, no new commitment: you remain free to cancel whenever you want.
[14:11] Hélène: Fine. In that case, I’d rather switch plans than cancel. I don’t need the landline, remove it.
[14:12] Romain: Noted: Fiber Essential without the landline option, €29.99 a month. This change requires a new box, which we send you free of charge. Shall I send it to your billing address, 8 allée des Tilleuls in Rennes?
[14:13] Hélène: No, I’ll be away next week. Send it to my daughter’s instead, 41 rue de la Monnaie in Rennes.
[14:14] Romain: Very well, delivery to 41 rue de la Monnaie, Rennes. Allow three to five business days.
[14:16] Hélène: Wait, I’m thinking about the phone. My mother always calls me on the landline, she can’t use a mobile. In the end, I’ll keep the landline option.
[14:17] Romain: No problem, I’m adding the landline option back. Your new monthly payment will therefore be €34.99 a month, starting with your next bill on March 1.
[14:18] Hélène: And my old box?
[14:19] Romain: You’ll send it back in the new box’s carton, with the prepaid label provided, within 30 days of receipt. Otherwise, you would be charged €90 for it.
[14:20] Hélène: All right. And you confirm I won’t have TV anymore?
[14:20] Romain: I confirm: TV will stop when the new box is activated.
[14:21] Hélène: Great. Thanks for your help.
[14:21] Romain: My pleasure. I’ll email you a summary. Have a nice day!`,
}

// ─── Jeux de données générés ─────────────────────────────────────────────────

/** Générateur pseudo-aléatoire déterministe (Park–Miller), identique d’une langue à l’autre. */
function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

/**
 * 45 commandes de mars 2026. Aiguilles : CMD-2038 (Brightwater Clinics, 40 bureaux assis-debout, 6 760 €,
 * virement) est de loin la plus grosse commande — la suivante, CMD-2011, fait 992 € ; seule CMD-2033
 * signale un colis endommagé ; exactement deux commandes annulées (CMD-2023 et CMD-2041). Absence : aucune
 * commande n’est livrée au Japon (six pays européens seulement).
 */
function syntheticOrders(lang: CoreLang) {
  const rnd = seeded(97)
  const customers = ['Altamira Studio', 'Bellwood Dental', 'Corvin & Fils', 'Dalmore Coworking', 'Estrella Foods', 'Fennick Architects', 'Granville School', 'Hollis Print']
  const countries: Record<CoreLang, string[]> = {
    fr: ['France', 'Belgique', 'Allemagne', 'Espagne', 'Italie', 'Pays-Bas'],
    en: ['France', 'Belgium', 'Germany', 'Spain', 'Italy', 'Netherlands'],
  }
  const products: Record<CoreLang, string[]> = {
    fr: ['Chaise de bureau', 'Lampe de bureau', 'Caisson à tiroirs', 'Écran 27 pouces', 'Support d’écran', 'Repose-pieds', 'Tableau blanc', 'Casque audio'],
    en: ['Office chair', 'Desk lamp', 'Drawer unit', '27-inch monitor', 'Monitor arm', 'Footrest', 'Whiteboard', 'Headset'],
  }
  const prices = [149, 39, 119, 229, 59, 29, 89, 79]
  const notes: Record<CoreLang, string[]> = {
    fr: ['Livrer avant midi', 'Code du portail : 4512', 'Appeler avant la livraison', 'Accès par la cour arrière'],
    en: ['Deliver before noon', 'Gate code: 4512', 'Call before delivery', 'Access via the back yard'],
  }
  const damaged: Record<CoreLang, string> = {
    fr: 'Colis reçu endommagé : deux pieds cassés, le client demande un remboursement',
    en: 'Parcel arrived damaged: two legs broken, the customer is asking for a refund',
  }
  const desk: Record<CoreLang, string> = { fr: 'Bureau assis-debout', en: 'Standing desk' }
  const payments = ['card', 'bank_transfer', 'paypal']
  const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'processing']
  return Array.from({ length: 45 }, (_, i) => {
    const day = 1 + Math.floor((i * 31) / 45)
    const order: Record<string, Json> = {
      id: `CMD-${2000 + i}`,
      date: `2026-03-${String(day).padStart(2, '0')}`,
      customer: customers[Math.floor(rnd() * customers.length)],
      country: countries[lang][Math.floor(rnd() * 6)],
    }
    const lines = 1 + Math.floor(rnd() * 3)
    const items = Array.from({ length: lines }, () => {
      const p = Math.floor(rnd() * products[lang].length)
      return { product: products[lang][p], qty: 1 + Math.floor(rnd() * 3), unit_eur: prices[p] }
    })
    const payment = payments[Math.floor(rnd() * payments.length)]
    const status = statuses[Math.floor(rnd() * statuses.length)]
    const noteRoll = rnd()
    if (i === 38) {
      Object.assign(order, { customer: 'Brightwater Clinics', country: countries[lang][0] })
      order.items = [{ product: desk[lang], qty: 40, unit_eur: 169 }]
      order.total_eur = 6760
      order.payment = 'bank_transfer'
      order.status = 'processing'
      return order
    }
    order.items = items
    order.total_eur = items.reduce((s, it) => s + it.qty * it.unit_eur, 0)
    order.payment = payment
    order.status = i === 23 || i === 41 ? 'cancelled' : status
    if (i === 33) order.note = damaged[lang]
    else if (noteRoll < 0.12) order.note = notes[lang][Math.floor(noteRoll * 100) % notes[lang].length]
    return order
  })
}

/**
 * 144 relevés de trois chambres froides le 4 mars 2026 (une mesure toutes les 30 minutes). Valeurs normales
 * entre 2,0 et 4,5 °C (jusqu’à 5,5 °C porte ouverte). Aiguille : CF-2 dépasse 8 °C à 14:00, 14:30 et 15:00
 * (3 relevés), porte fermée. Leurre : CF-1 monte à 7,6 °C à 09:00 porte ouverte (sous le seuil). Absence :
 * aucun relevé sous 0 °C.
 */
function syntheticColdRoom(lang: CoreLang) {
  const rnd = seeded(4242)
  const readings = []
  for (let slot = 0; slot < 48; slot++) {
    const ts = `2026-03-04T${String(Math.floor(slot / 2)).padStart(2, '0')}:${slot % 2 ? '30' : '00'}`
    for (const room of ['CF-1', 'CF-2', 'CF-3']) {
      const base = 2 + rnd() * 2.5
      const open = rnd() < 0.06
      const hum = 70 + Math.floor(rnd() * 15)
      let temp = Math.round((base + (open ? 1 : 0)) * 10) / 10
      let door = open ? 'open' : 'closed'
      if (room === 'CF-2' && slot >= 28 && slot <= 30) [temp, door] = [[8.6, 9.4, 8.9][slot - 28], 'closed']
      if (room === 'CF-2' && slot === 31) temp = 6.3
      if (room === 'CF-1' && slot === 18) [temp, door] = [7.6, 'open']
      readings.push({ ts, room, temp_c: temp, door, humidity_pct: hum })
    }
  }
  const site = { fr: 'Entrepôt frigorifique de Saint-Herblain — chambres froides CF-1 à CF-3', en: 'Saint-Herblain cold storage warehouse — cold rooms CF-1 to CF-3' }
  return { site: site[lang], unit: '°C', readings }
}

/**
 * 100 lignes de journal applicatif du 4 mars 2026. Aiguilles : un seul ERROR (index 63, service auth : clé de
 * signature des jetons expirée) et un seul avertissement disque (index 31, hôte db-2, 91 %). Les WARN
 * aléatoires ne parlent jamais de disque. Absence : aucun manque de mémoire, aucun niveau FATAL.
 */
function syntheticLogs(lang: CoreLang) {
  const rnd = seeded(2026)
  const info: Record<CoreLang, [string, string][]> = {
    fr: [
      ['api', 'Requête GET /v1/orders traitée en 84 ms'],
      ['api', 'Requête POST /v1/carts traitée en 132 ms'],
      ['search', 'Index « produits » rafraîchi (12 408 documents)'],
      ['payments', 'Paiement autorisé pour la commande'],
      ['auth', 'Connexion réussie'],
      ['worker', 'Tâche « envoi des factures » terminée'],
      ['worker', 'Tâche « nettoyage du cache » terminée'],
      ['auth', 'Jeton d’accès renouvelé'],
    ],
    en: [
      ['api', 'GET /v1/orders handled in 84 ms'],
      ['api', 'POST /v1/carts handled in 132 ms'],
      ['search', '"products" index refreshed (12,408 documents)'],
      ['payments', 'Payment authorized for order'],
      ['auth', 'Login succeeded'],
      ['worker', 'Job "send invoices" completed'],
      ['worker', 'Job "clear cache" completed'],
      ['auth', 'Access token renewed'],
    ],
  }
  const warn: Record<CoreLang, [string, string][]> = {
    fr: [
      ['api', 'Requête lente : GET /v1/reports traitée en 1 480 ms'],
      ['search', 'Nouvelle tentative de connexion au cluster (1/3)'],
      ['payments', 'Délai de réponse du prestataire bancaire supérieur à 800 ms'],
    ],
    en: [
      ['api', 'Slow request: GET /v1/reports handled in 1,480 ms'],
      ['search', 'Retrying cluster connection (1/3)'],
      ['payments', 'Bank provider response time above 800 ms'],
    ],
  }
  const needles: Record<CoreLang, { disk: string; error: string }> = {
    fr: { disk: 'Utilisation du disque à 91 % sur /var/lib/postgresql', error: 'Échec de la signature du jeton : la clé de signature a expiré le 2026-03-04 à 09:00 UTC' },
    en: { disk: 'Disk usage at 91% on /var/lib/postgresql', error: 'Token signing failed: signing key expired on 2026-03-04 at 09:00 UTC' },
  }
  const hosts = ['web-1', 'web-2', 'db-1', 'web-3']
  let t = 8 * 3600
  return Array.from({ length: 100 }, (_, i) => {
    t += 30 + Math.floor(rnd() * 90)
    const ts = `2026-03-04T${[Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60].map((n) => String(n).padStart(2, '0')).join(':')}Z`
    const isWarn = rnd() < 0.08
    const [service, msg] = isWarn ? warn[lang][Math.floor(rnd() * warn[lang].length)] : info[lang][Math.floor(rnd() * info[lang].length)]
    const host = hosts[Math.floor(rnd() * hosts.length)]
    if (i === 31) return { ts, level: 'WARN', service: 'postgres', host: 'db-2', msg: needles[lang].disk }
    if (i === 63) return { ts, level: 'ERROR', service: 'auth', host: 'web-2', msg: needles[lang].error }
    return { ts, level: isWarn ? 'WARN' : 'INFO', service, host, msg }
  })
}

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const DOCUMENTS: Pair[] = [
  {
    id: 'doc-email-thread',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Lyon puis Annecy (Belvédère complet), 19–20 mars puis 26–27 mars, 12 000 € puis 13 500 € (rallonge de Marc) ;
    // Damien propose de réserver le car mais c’est Léa qui s’en charge ; l’activité est imputée au budget formation.
    expected: { venue: 'annecy', dates: 'march_26_27', budget: 'eur_13500', coach_booker: 'lea', activity_in_budget: false },
    fr: {
      name: 'Fil de courriels (décision modifiée)',
      description: 'Séminaire : le lieu, la date et le budget changent au fil des messages.',
      state: EMAIL_THREAD.fr,
      questions: {
        venue: {
          type: 'choice',
          instructions: 'Où le séminaire aura-t-il finalement lieu ?',
          criteria: { lyon: 'Centre de congrès Belvédère, à Lyon', annecy: 'Domaine des Trois Lacs, près d’Annecy', undecided: 'Le lieu n’est pas encore décidé' },
        },
        dates: {
          type: 'choice',
          instructions: 'À quelles dates le séminaire aura-t-il finalement lieu ?',
          criteria: { march_19_20: '19 et 20 mars 2026', march_26_27: '26 et 27 mars 2026', april_2_3: '2 et 3 avril 2026' },
        },
        budget: {
          type: 'choice',
          instructions: 'Quel est le budget final du séminaire ?',
          criteria: { eur_12000: '12 000 €', eur_13500: '13 500 €', eur_15000: '15 000 €' },
        },
        coach_booker: {
          type: 'choice',
          instructions: 'Qui réservera le car ?',
          criteria: { sophie: 'Sophie Marchetti', damien: 'Damien Roux', lea: 'Léa Vasseur', marc: 'Marc Olivier' },
        },
        activity_in_budget: { type: 'noul', instructions: 'L’activité d’équipe est-elle financée par le budget du séminaire ?' },
      },
    },
    en: {
      name: 'Email thread (changed decision)',
      description: 'Offsite: the venue, dates and budget change over the messages.',
      state: EMAIL_THREAD.en,
      questions: {
        venue: {
          type: 'choice',
          instructions: 'Where will the offsite finally take place?',
          criteria: { lyon: 'Belvédère conference center, Lyon', annecy: 'Trois Lacs estate, near Annecy', undecided: 'The venue has not been decided yet' },
        },
        dates: {
          type: 'choice',
          instructions: 'On which dates will the offsite finally take place?',
          criteria: { march_19_20: 'March 19 and 20, 2026', march_26_27: 'March 26 and 27, 2026', april_2_3: 'April 2 and 3, 2026' },
        },
        budget: {
          type: 'choice',
          instructions: 'What is the final budget for the offsite?',
          criteria: { eur_12000: '€12,000', eur_13500: '€13,500', eur_15000: '€15,000' },
        },
        coach_booker: {
          type: 'choice',
          instructions: 'Who will book the coach?',
          criteria: { sophie: 'Sophie Marchetti', damien: 'Damien Roux', lea: 'Léa Vasseur', marc: 'Marc Olivier' },
        },
        activity_in_budget: { type: 'noul', instructions: 'Is the team activity funded by the offsite budget?' },
      },
    },
  },
  {
    id: 'doc-terms-exception',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Règle générale (4.2) : pas de remboursement ; exception (8.3) : disponibilité < 98 % → résiliation immédiate
    // et remboursement, si la demande arrive au plus tard 30 jours après la fin du mois (mai → 30 juin).
    // 97,1 % < 98 %, demande le 10 juin : recevable. Le 15 juillet serait hors délai. La maintenance annoncée
    // 5 jours à l’avance (≥ 72 h) n’est pas une indisponibilité (8.2).
    expected: { refund_eligible: true, governing_clause: 'art_8_3', maintenance_counts: false, july_request_ok: false, data_export_days: 'days_45' },
    fr: {
      name: 'Conditions d’abonnement (clause d’exception)',
      description: 'Pas de remboursement en principe, sauf l’exception de l’article 8.3.',
      state: TERMS.fr,
      questions: {
        refund_eligible: {
          type: 'noul',
          instructions: 'D’après les conditions, l’Atelier Brunelle peut-il résilier immédiatement et être remboursé des mois restants ?',
        },
        governing_clause: {
          type: 'choice',
          instructions: 'Quelle clause détermine la réponse à la demande du client ?',
          criteria: {
            art_4_2: 'Article 4.2 : aucun remboursement de la période annuelle en cours',
            art_6: 'Article 6 : évolution des prix',
            art_8_3: 'Article 8.3 : disponibilité mensuelle inférieure à 98 %',
            art_8_4: 'Article 8.4 : avoir de 10 % du prix mensuel',
          },
        },
        maintenance_counts: { type: 'noul', instructions: 'La maintenance du 18 mai 2026 compte-t-elle comme une période d’indisponibilité ?' },
        july_request_ok: {
          type: 'noul',
          instructions: 'Si la même demande avait été reçue le 15 juillet 2026, aurait-elle encore donné droit à la résiliation immédiate avec remboursement ?',
        },
        data_export_days: {
          type: 'choice',
          instructions: 'Pendant combien de jours après la fin de l’abonnement les données du client restent-elles exportables ?',
          criteria: { days_30: '30 jours', days_45: '45 jours', days_60: '60 jours', days_90: '90 jours' },
        },
      },
    },
    en: {
      name: 'Subscription terms (exception clause)',
      description: 'No refund as a rule, except for the article 8.3 exception.',
      state: TERMS.en,
      questions: {
        refund_eligible: {
          type: 'noul',
          instructions: 'Under the terms, can Atelier Brunelle terminate immediately and be refunded for the remaining months?',
        },
        governing_clause: {
          type: 'choice',
          instructions: 'Which clause determines the answer to the customer’s request?',
          criteria: {
            art_4_2: 'Article 4.2: no refund for the current annual period',
            art_6: 'Article 6: price changes',
            art_8_3: 'Article 8.3: monthly availability below 98%',
            art_8_4: 'Article 8.4: credit of 10% of the monthly price',
          },
        },
        maintenance_counts: { type: 'noul', instructions: 'Does the maintenance on May 18, 2026 count as a period of unavailability?' },
        july_request_ok: {
          type: 'noul',
          instructions: 'If the same request had been received on July 15, 2026, would it still have qualified for immediate termination with a refund?',
        },
        data_export_days: {
          type: 'choice',
          instructions: 'For how many days after the subscription ends does the customer’s data remain exportable?',
          criteria: { days_30: '30 days', days_45: '45 days', days_60: '60 days', days_90: '90 days' },
        },
      },
    },
  },
  {
    id: 'doc-changelog',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Mode sombre introduit en 4.4.0 (4.6.0 ne fait que le corriger). Sauvegarde : 30 s → 10 s (4.3.0) → 30 s
    // (4.7.0). Hors ligne : bêta en 4.2.0, stable en 4.8.0. PDF : gratuit en 4.5.0, réservé à Pro en 4.9.0.
    // Android 8 abandonné en 4.6.0, jamais réintroduit.
    expected: { dark_mode_version: 'v4_4', autosave_latest: 's30', offline_still_beta: false, pdf_on_free_plan: false, supports_android_8: false },
    fr: {
      name: 'Notes de version',
      description: 'Onze versions : quelle version a introduit, annulé ou modifié quoi.',
      state: CHANGELOG.fr,
      questions: {
        dark_mode_version: {
          type: 'choice',
          instructions: 'Quelle version a introduit le mode sombre ?',
          criteria: { v4_2: '4.2.0', v4_4: '4.4.0', v4_6: '4.6.0', v4_8: '4.8.0' },
        },
        autosave_latest: {
          type: 'choice',
          instructions: 'Dans la version la plus récente, quel est l’intervalle de sauvegarde automatique ?',
          criteria: { s10: '10 secondes', s30: '30 secondes', s60: '60 secondes' },
        },
        offline_still_beta: { type: 'noul', instructions: 'Dans la version la plus récente, le mode hors ligne est-il encore en bêta ?' },
        pdf_on_free_plan: { type: 'noul', instructions: 'Dans la version la plus récente, un utilisateur de l’offre gratuite peut-il exporter ses notes en PDF ?' },
        supports_android_8: { type: 'noul', instructions: 'La version 4.9.0 prend-elle en charge Android 8 ?' },
      },
    },
    en: {
      name: 'Release notes',
      description: 'Eleven versions: which version introduced, reverted or changed what.',
      state: CHANGELOG.en,
      questions: {
        dark_mode_version: {
          type: 'choice',
          instructions: 'Which version introduced dark mode?',
          criteria: { v4_2: '4.2.0', v4_4: '4.4.0', v4_6: '4.6.0', v4_8: '4.8.0' },
        },
        autosave_latest: {
          type: 'choice',
          instructions: 'In the latest version, what is the auto-save interval?',
          criteria: { s10: '10 seconds', s30: '30 seconds', s60: '60 seconds' },
        },
        offline_still_beta: { type: 'noul', instructions: 'In the latest version, is offline mode still in beta?' },
        pdf_on_free_plan: { type: 'noul', instructions: 'In the latest version, can a free-plan user export notes to PDF?' },
        supports_android_8: { type: 'noul', instructions: 'Does version 4.9.0 support Android 8?' },
      },
    },
  },
  {
    id: 'doc-action-items',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Le communiqué passe de Bastien (en congé) à Amélie en fin de réunion. Soumission avancée du 3 avril au 31 mars.
    // Actions de Karim : la soumission (31 mars) et la liste des limitations (20 mars) = 2 ; la version tablette
    // n’est pas une action (étudiée après le lancement).
    expected: { press_release_owner: 'amelie', store_submission: 'march_31', public_beta_kept: false, extra_support_approved: false, karim_actions: 2 },
    fr: {
      name: 'Compte rendu avec actions',
      description: 'Réunion de lancement : responsables, échéances et réaffectation en fin de réunion.',
      state: LAUNCH_MINUTES.fr,
      questions: {
        press_release_owner: {
          type: 'choice',
          instructions: 'Qui est finalement chargé de rédiger le communiqué de presse ?',
          criteria: { julie: 'Julie Fontaine', bastien: 'Bastien Morel', amelie: 'Amélie Garnier', karim: 'Karim Haddad', odile: 'Odile Perrin' },
        },
        store_submission: {
          type: 'choice',
          instructions: 'Quelle est la date retenue pour la soumission aux magasins d’applications ?',
          criteria: { march_20: '20 mars 2026', march_31: '31 mars 2026', april_3: '3 avril 2026', april_14: '14 avril 2026' },
        },
        public_beta_kept: { type: 'noul', instructions: 'La bêta publique est-elle maintenue ?' },
        extra_support_approved: { type: 'noul', instructions: 'Le renfort de deux personnes au support a-t-il été validé pendant la réunion ?' },
        karim_actions: {
          type: 'score',
          instructions: 'Combien d’actions sont confiées à Karim pendant la réunion ?',
          criteria: ['Aucune', 'Une', 'Deux', 'Trois ou plus'],
        },
      },
    },
    en: {
      name: 'Minutes with action items',
      description: 'Launch meeting: owners, deadlines and a reassignment at the end of the meeting.',
      state: LAUNCH_MINUTES.en,
      questions: {
        press_release_owner: {
          type: 'choice',
          instructions: 'Who is finally in charge of writing the press release?',
          criteria: { julie: 'Julie Fontaine', bastien: 'Bastien Morel', amelie: 'Amélie Garnier', karim: 'Karim Haddad', odile: 'Odile Perrin' },
        },
        store_submission: {
          type: 'choice',
          instructions: 'What date was set for the app store submission?',
          criteria: { march_20: 'March 20, 2026', march_31: 'March 31, 2026', april_3: 'April 3, 2026', april_14: 'April 14, 2026' },
        },
        public_beta_kept: { type: 'noul', instructions: 'Is the public beta kept?' },
        extra_support_approved: { type: 'noul', instructions: 'Were the two extra support staff approved during the meeting?' },
        karim_actions: {
          type: 'score',
          instructions: 'How many action items are assigned to Karim during the meeting?',
          criteria: ['None', 'One', 'Two', 'Three or more'],
        },
      },
    },
  },
  {
    id: 'doc-incident-timeline',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Première alerte 09:07, retour au niveau habituel 10:09 : 62 minutes. Le retour à la 2.30 laisse 12 %
    // d’erreurs ; la base est saine (09:29) ; 37 paiements retraités à la main (niveau « 1 à 49 »).
    expected: { root_cause: 'feature_flag', rollback_sufficient: false, database_healthy: true, time_to_recover: 'from_60_to_90', manual_reprocessing: 1 },
    fr: {
      name: 'Chronologie d’incident',
      description: 'Post-mortem : cause racine, retour de version insuffisant, durée et impact.',
      state: POSTMORTEM.fr,
      questions: {
        root_cause: {
          type: 'choice',
          instructions: 'Quelle est la cause racine de l’incident ?',
          criteria: {
            database: 'Une saturation de la base de données',
            code_v231: 'Un bogue du code de la version 2.31, corrigé par le retour à la version 2.30',
            feature_flag: 'L’indicateur « batch_settlement », activé par la migration et resté actif après le retour de version',
            network: 'Une panne réseau',
          },
        },
        rollback_sufficient: { type: 'noul', instructions: 'Le retour à la version 2.30 a-t-il suffi à ramener le taux d’erreur à son niveau habituel ?' },
        database_healthy: { type: 'noul', instructions: 'La base de données était-elle en bonne santé pendant l’incident ?' },
        time_to_recover: {
          type: 'choice',
          instructions: 'Combien de temps s’est-il écoulé entre la première alerte et le retour du taux d’erreur à son niveau habituel ?',
          criteria: { under_30: 'Moins de 30 minutes', from_30_to_60: 'Entre 30 et 60 minutes', from_60_to_90: 'Entre 60 et 90 minutes', over_90: 'Plus de 90 minutes' },
        },
        manual_reprocessing: {
          type: 'score',
          instructions: 'Combien de paiements ont dû être retraités manuellement ?',
          criteria: ['Aucun', 'De 1 à 49', 'De 50 à 499', '500 ou plus'],
        },
      },
    },
    en: {
      name: 'Incident timeline',
      description: 'Postmortem: root cause, insufficient rollback, duration and impact.',
      state: POSTMORTEM.en,
      questions: {
        root_cause: {
          type: 'choice',
          instructions: 'What is the root cause of the incident?',
          criteria: {
            database: 'Database saturation',
            code_v231: 'A bug in the version 2.31 code, fixed by rolling back to version 2.30',
            feature_flag: 'The "batch_settlement" flag, enabled by the migration and left on after the rollback',
            network: 'A network outage',
          },
        },
        rollback_sufficient: { type: 'noul', instructions: 'Was rolling back to version 2.30 enough to bring the error rate back to its usual level?' },
        database_healthy: { type: 'noul', instructions: 'Was the database healthy during the incident?' },
        time_to_recover: {
          type: 'choice',
          instructions: 'How much time passed between the first alert and the error rate returning to its usual level?',
          criteria: { under_30: 'Less than 30 minutes', from_30_to_60: 'Between 30 and 60 minutes', from_60_to_90: 'Between 60 and 90 minutes', over_90: 'More than 90 minutes' },
        },
        manual_reprocessing: {
          type: 'score',
          instructions: 'How many payments had to be reprocessed manually?',
          criteria: ['None', '1 to 49', '50 to 499', '500 or more'],
        },
      },
    },
  },
  {
    id: 'doc-job-application',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Cinq ans comme ingénieur données (exigence : au moins 5) ; Dagster satisfait « Airflow ou Dagster » ;
    // une venue par mois au lieu de deux jours par semaine ; 70 000 € > 65 000 € ; Spark oui, Kubernetes non.
    expected: { experience_ok: true, orchestrator_ok: true, unmet_requirement: 'onsite', salary_in_range: false, nice_to_have: 1 },
    fr: {
      name: 'Offre d’emploi et candidature',
      description: 'Confronter une lettre de candidature aux exigences d’une offre.',
      state: JOB_APPLICATION.fr,
      questions: {
        experience_ok: { type: 'noul', instructions: 'Le candidat remplit-il l’exigence d’expérience en ingénierie des données ?' },
        orchestrator_ok: { type: 'noul', instructions: 'Le candidat remplit-il l’exigence d’expérience en production d’un orchestrateur de flux ?' },
        unmet_requirement: {
          type: 'choice',
          instructions: 'Quelle exigence du profil requis le candidat ne remplit-il pas ?',
          criteria: {
            experience: 'Les 5 ans d’expérience',
            python_sql: 'Python et SQL',
            orchestrator: 'L’orchestrateur de flux',
            french: 'Le français courant',
            onsite: 'La présence sur site deux jours par semaine',
            none: 'Il les remplit toutes',
          },
        },
        salary_in_range: { type: 'noul', instructions: 'Les prétentions salariales du candidat sont-elles dans la fourchette de l’offre ?' },
        nice_to_have: {
          type: 'score',
          instructions: 'Combien des atouts appréciés le candidat possède-t-il ?',
          criteria: ['Aucun', 'Un seul', 'Les deux'],
        },
      },
    },
    en: {
      name: 'Job opening and application',
      description: 'Check a cover letter against the requirements of a job opening.',
      state: JOB_APPLICATION.en,
      questions: {
        experience_ok: { type: 'noul', instructions: 'Does the candidate meet the data engineering experience requirement?' },
        orchestrator_ok: { type: 'noul', instructions: 'Does the candidate meet the requirement for production experience with a workflow orchestrator?' },
        unmet_requirement: {
          type: 'choice',
          instructions: 'Which of the listed requirements does the candidate not meet?',
          criteria: {
            experience: 'The 5 years of experience',
            python_sql: 'Python and SQL',
            orchestrator: 'The workflow orchestrator',
            french: 'Fluent French',
            onsite: 'Being on site two days a week',
            none: 'He meets all of them',
          },
        },
        salary_in_range: { type: 'noul', instructions: 'Is the candidate’s salary expectation within the range of the job opening?' },
        nice_to_have: {
          type: 'score',
          instructions: 'How many of the nice-to-have items does the candidate have?',
          criteria: ['None', 'Only one', 'Both'],
        },
      },
    },
  },
  {
    id: 'doc-support-transcript',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // La cliente demande la résiliation puis accepte une offre moins chère ; elle retire puis remet l’option
    // téléphone (29,99 € + 5 € = 34,99 €, confirmé par le conseiller) ; livraison chez sa fille ; aucun nouvel engagement.
    expected: { outcome: 'downgraded', new_monthly_price: 'eur_34_99', box_delivery: 'daughter', keeps_landline: true, new_commitment: false },
    fr: {
      name: 'Conversation de support',
      description: 'Une cliente qui change d’avis plusieurs fois : retenir l’état final.',
      state: SUPPORT_CHAT.fr,
      questions: {
        outcome: {
          type: 'choice',
          instructions: 'Quelle est l’issue de la conversation ?',
          criteria: { cancelled: 'L’abonnement est résilié', downgraded: 'Passage à une offre moins chère', unchanged: 'Aucun changement', upgraded: 'Passage à une offre plus chère' },
        },
        new_monthly_price: {
          type: 'choice',
          instructions: 'Quelle sera la nouvelle mensualité de la cliente ?',
          criteria: { eur_29_99: '29,99 €', eur_34_99: '34,99 €', eur_49_99: '49,99 €', eur_54_99: '54,99 €' },
        },
        box_delivery: {
          type: 'choice',
          instructions: 'Où le nouveau boîtier sera-t-il livré ?',
          criteria: { billing: '8 allée des Tilleuls, Rennes (adresse de facturation)', daughter: '41 rue de la Monnaie, Rennes (chez sa fille)', pickup: 'En point relais' },
        },
        keeps_landline: { type: 'noul', instructions: 'La cliente conserve-t-elle l’option téléphone fixe ?' },
        new_commitment: { type: 'noul', instructions: 'Le changement d’offre entraîne-t-il un nouvel engagement ?' },
      },
    },
    en: {
      name: 'Support conversation',
      description: 'A customer who changes her mind several times: keep the final state.',
      state: SUPPORT_CHAT.en,
      questions: {
        outcome: {
          type: 'choice',
          instructions: 'What is the outcome of the conversation?',
          criteria: { cancelled: 'The subscription is cancelled', downgraded: 'Switch to a cheaper plan', unchanged: 'No change', upgraded: 'Switch to a more expensive plan' },
        },
        new_monthly_price: {
          type: 'choice',
          instructions: 'What will the customer’s new monthly payment be?',
          criteria: { eur_29_99: '€29.99', eur_34_99: '€34.99', eur_49_99: '€49.99', eur_54_99: '€54.99' },
        },
        box_delivery: {
          type: 'choice',
          instructions: 'Where will the new box be delivered?',
          criteria: { billing: '8 allée des Tilleuls, Rennes (billing address)', daughter: '41 rue de la Monnaie, Rennes (her daughter’s)', pickup: 'To a pickup point' },
        },
        keeps_landline: { type: 'noul', instructions: 'Does the customer keep the landline option?' },
        new_commitment: { type: 'noul', instructions: 'Does the plan change involve a new commitment?' },
      },
    },
  },
  {
    id: 'doc-orders-needle',
    category: 'Long context',
    complexity: 'complexe',
    length: 'très long',
    // syntheticOrders : CMD-2038 (Brightwater Clinics, 6 760 €, virement) est la plus grosse commande, loin devant CMD-2011 (992 €) ;
    // seule CMD-2033 signale un colis endommagé ; exactement 2 commandes annulées ; aucun pays hors d’Europe.
    expected: { largest_customer: 'brightwater', largest_paid_by_transfer: true, damaged_order: 'cmd_2033', cancelled_count: 2, ships_to_japan: false },
    fr: {
      name: 'Commandes (contexte long)',
      description: '45 commandes en JSON : une commande hors norme, un colis endommagé, des annulations à compter.',
      state: { orders: syntheticOrders('fr') },
      questions: {
        largest_customer: {
          type: 'choice',
          instructions: 'Quel client a passé la commande dont le montant total (`total_eur`) est le plus élevé ?',
          criteria: { altamira: 'Altamira Studio', bellwood: 'Bellwood Dental', brightwater: 'Brightwater Clinics', dalmore: 'Dalmore Coworking', hollis: 'Hollis Print' },
        },
        largest_paid_by_transfer: { type: 'noul', instructions: 'Cette commande au montant le plus élevé a-t-elle été payée par virement bancaire ?' },
        damaged_order: {
          type: 'choice',
          instructions: 'Quelle commande signale un colis endommagé ?',
          criteria: { cmd_2023: 'CMD-2023', cmd_2033: 'CMD-2033', cmd_2038: 'CMD-2038', cmd_2041: 'CMD-2041', none: 'Aucune' },
        },
        cancelled_count: {
          type: 'score',
          instructions: 'Combien de commandes ont le statut `cancelled` ?',
          criteria: ['Aucune', 'Une', 'Deux', 'Trois ou plus'],
        },
        ships_to_japan: { type: 'noul', instructions: 'Une commande est-elle livrée au Japon ?' },
      },
    },
    en: {
      name: 'Orders (long context)',
      description: '45 orders in JSON: one outlier order, one damaged parcel, cancellations to count.',
      state: { orders: syntheticOrders('en') },
      questions: {
        largest_customer: {
          type: 'choice',
          instructions: 'Which customer placed the order with the highest total amount (`total_eur`)?',
          criteria: { altamira: 'Altamira Studio', bellwood: 'Bellwood Dental', brightwater: 'Brightwater Clinics', dalmore: 'Dalmore Coworking', hollis: 'Hollis Print' },
        },
        largest_paid_by_transfer: { type: 'noul', instructions: 'Was this highest-value order paid by bank transfer?' },
        damaged_order: {
          type: 'choice',
          instructions: 'Which order reports a damaged parcel?',
          criteria: { cmd_2023: 'CMD-2023', cmd_2033: 'CMD-2033', cmd_2038: 'CMD-2038', cmd_2041: 'CMD-2041', none: 'None' },
        },
        cancelled_count: {
          type: 'score',
          instructions: 'How many orders have the status `cancelled`?',
          criteria: ['None', 'One', 'Two', 'Three or more'],
        },
        ships_to_japan: { type: 'noul', instructions: 'Is any order shipped to Japan?' },
      },
    },
  },
  {
    id: 'doc-cold-room-readings',
    category: 'Long context',
    complexity: 'complexe',
    length: 'très long',
    // syntheticColdRoom : seuls 3 relevés dépassent 8 °C, tous de CF-2 (14:00, 14:30, 15:00) ; le pic de CF-1 à
    // 7,6 °C reste sous le seuil ; le minimum est 2,0 °C, donc aucun relevé sous 0 °C.
    expected: { above_8: true, above_8_room: 'cf_2', below_zero: false, above_8_count: 2 },
    fr: {
      name: 'Relevés de chambres froides (contexte long)',
      description: '144 relevés de température en JSON : un dépassement de seuil à localiser et à compter.',
      state: syntheticColdRoom('fr'),
      questions: {
        above_8: { type: 'noul', instructions: 'Un relevé de `readings` dépasse-t-il 8 °C ?' },
        above_8_room: {
          type: 'choice',
          instructions: 'Quelle chambre froide a dépassé 8 °C ?',
          criteria: { cf_1: 'CF-1', cf_2: 'CF-2', cf_3: 'CF-3', none: 'Aucune' },
        },
        below_zero: { type: 'noul', instructions: 'Un relevé est-il descendu sous 0 °C ?' },
        above_8_count: {
          type: 'score',
          instructions: 'Combien de relevés dépassent 8 °C ?',
          criteria: ['Aucun', '1 ou 2', 'De 3 à 5', '6 ou plus'],
        },
      },
    },
    en: {
      name: 'Cold room readings (long context)',
      description: '144 temperature readings in JSON: a threshold breach to locate and count.',
      state: syntheticColdRoom('en'),
      questions: {
        above_8: { type: 'noul', instructions: 'Does any reading in `readings` exceed 8 °C?' },
        above_8_room: {
          type: 'choice',
          instructions: 'Which cold room exceeded 8 °C?',
          criteria: { cf_1: 'CF-1', cf_2: 'CF-2', cf_3: 'CF-3', none: 'None' },
        },
        below_zero: { type: 'noul', instructions: 'Did any reading drop below 0 °C?' },
        above_8_count: {
          type: 'score',
          instructions: 'How many readings exceed 8 °C?',
          criteria: ['None', '1 or 2', '3 to 5', '6 or more'],
        },
      },
    },
  },
  {
    id: 'doc-app-logs',
    category: 'Long context',
    complexity: 'complexe',
    length: 'très long',
    // syntheticLogs : un seul ERROR (auth, clé de signature expirée), un seul avertissement disque (db-2, 91 %) ;
    // aucune entrée ne parle de mémoire.
    expected: { error_service: 'auth', disk_warning_host: 'db_2', out_of_memory: false, error_count: 1 },
    fr: {
      name: 'Journal applicatif (contexte long)',
      description: '100 lignes de journal en JSON : une erreur et une alerte disque parmi le bruit.',
      state: { logs: syntheticLogs('fr') },
      questions: {
        error_service: {
          type: 'choice',
          instructions: 'Quel service a produit une entrée de niveau `ERROR` ?',
          criteria: { api: 'api', auth: 'auth', payments: 'payments', search: 'search', none: 'Aucun' },
        },
        disk_warning_host: {
          type: 'choice',
          instructions: 'Sur quel hôte l’utilisation du disque a-t-elle déclenché un avertissement ?',
          criteria: { web_1: 'web-1', web_2: 'web-2', db_1: 'db-1', db_2: 'db-2', none: 'Aucun' },
        },
        out_of_memory: { type: 'noul', instructions: 'Le journal signale-t-il qu’un service a manqué de mémoire ?' },
        error_count: {
          type: 'score',
          instructions: 'Combien d’entrées ont le niveau `ERROR` ?',
          criteria: ['Aucune', 'Une', 'De 2 à 5', 'Plus de 5'],
        },
      },
    },
    en: {
      name: 'Application log (long context)',
      description: '100 log lines in JSON: one error and one disk warning among the noise.',
      state: { logs: syntheticLogs('en') },
      questions: {
        error_service: {
          type: 'choice',
          instructions: 'Which service produced an entry with level `ERROR`?',
          criteria: { api: 'api', auth: 'auth', payments: 'payments', search: 'search', none: 'None' },
        },
        disk_warning_host: {
          type: 'choice',
          instructions: 'On which host did disk usage trigger a warning?',
          criteria: { web_1: 'web-1', web_2: 'web-2', db_1: 'db-1', db_2: 'db-2', none: 'None' },
        },
        out_of_memory: { type: 'noul', instructions: 'Does the log report that a service ran out of memory?' },
        error_count: {
          type: 'score',
          instructions: 'How many entries have level `ERROR`?',
          criteria: ['None', 'One', '2 to 5', 'More than 5'],
        },
      },
    },
  },
]
