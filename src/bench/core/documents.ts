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

const MAINTENANCE_CONTRACT = {
  fr: `CONTRAT DE MAINTENANCE INFORMATIQUE N° HX-2026-014
Entre Hexalis SAS, 12 rue des Forges, 26000 Valence (le « Prestataire »), et la Coopérative agricole de Valmont, 4 route de Chabeuil, 26000 Valence (le « Client »).
Signé à Valence le 15 mars 2026.

Article 1 — Objet
Le Prestataire assure la maintenance préventive et corrective du parc informatique du Client (postes de travail, serveurs, imprimantes et équipements réseau) sur les sites listés à l’annexe A.

Article 2 — Durée
Le contrat prend effet le 1er avril 2026 pour une durée de 24 mois. Il se renouvelle ensuite tacitement par périodes de 12 mois.

Article 3 — Prix
3.1 Le forfait mensuel est de 2 400 € HT, payable à 30 jours fin de mois.
3.2 Le forfait est révisé à chaque date anniversaire du contrat selon l’indice Syntec, la hausse étant plafonnée à 3 % par an.

Article 4 — Niveaux de service
4.1 Un incident est critique lorsqu’il empêche au moins dix utilisateurs de travailler ou bloque la chaîne de facturation.
4.2 Le délai d’intervention est de 8 heures ouvrées pour un incident critique et de 3 jours ouvrés pour tout autre incident, à compter de sa déclaration sur le portail du Prestataire.
4.3 Les heures ouvrées sont celles de la plage de couverture définie à l’annexe A.

Article 5 — Pénalités
5.1 Tout dépassement du délai d’intervention applicable à un incident critique donne lieu à une pénalité de 1 % du forfait mensuel par heure ouvrée de retard.
5.2 Le total des pénalités d’un même mois est plafonné à 10 % du forfait mensuel.
5.3 Les pénalités sont déduites de la facture du mois suivant.

Article 6 — Résiliation
6.1 Chaque partie peut s’opposer au renouvellement par lettre recommandée avec accusé de réception, moyennant un préavis de 3 mois avant l’échéance.
6.2 En cas de manquement grave non corrigé dans les 30 jours suivant une mise en demeure, l’autre partie peut résilier le contrat sans préavis.

Article 7 — Frais de déplacement
Les frais de déplacement du Prestataire sont à la charge du Client et facturés au réel, sur justificatifs.

Article 8 — Documents contractuels et ordre de priorité
Le contrat est constitué du présent document et de ses annexes signées par les deux parties. En cas de contradiction, les annexes prévalent sur le présent document et, entre deux annexes, la plus récente prévaut. Un document qui n’est pas signé par les deux parties n’a aucune valeur contractuelle.

Article 9 — Confidentialité
Chaque partie s’engage à ne pas divulguer les informations confidentielles de l’autre partie pendant la durée du contrat et les cinq années qui suivent.

Article 10 — Litiges
Tout litige relève du tribunal de commerce de Romans-sur-Isère.

—

ANNEXE A — Périmètre et plage de couverture (signée avec le contrat le 15 mars 2026)
Sites couverts, avec leur distance au siège du Client :
- Valence, siège social : 0 km ;
- Romans-sur-Isère, entrepôt : 20 km ;
- Crest, magasin : 30 km.
Plage de couverture : du lundi au vendredi, de 8 h à 18 h, hors jours fériés.
Interlocuteur du Client : M. Gilles Arnoux, responsable informatique.

—

ANNEXE B — Avenant n° 1 (signé par les deux parties le 2 juin 2026)
1. Le délai d’intervention pour un incident critique est ramené à 4 heures ouvrées.
2. Le plafond mensuel des pénalités est porté à 15 % du forfait mensuel.
3. Le magasin de Crest, fermé le 30 juin 2026, est retiré du périmètre à compter du 1er juillet 2026. Le magasin de Die, situé à 65 km du siège, y est ajouté à la même date.
4. Les frais de déplacement vers les sites situés à moins de 50 km du siège sont inclus dans le forfait ; au-delà, ils restent facturés au réel.
Les autres dispositions du contrat et de l’annexe A sont inchangées.

—

PROJET D’ANNEXE C — Avenant n° 2 (transmis par le Prestataire le 9 septembre 2026, non signé)
1. Le préavis de non-renouvellement prévu à l’article 6.1 est réduit à 1 mois.
2. Le forfait mensuel passe à 2 650 € HT à compter du 1er octobre 2026.

—

JOURNAL DES INCIDENTS — septembre 2026 (heure de déclaration sur le portail, puis heure d’intervention)
- Mardi 8 septembre, 9 h : panne du serveur de facturation au siège (incident critique). Intervention sur place à 11 h le même jour.
- Lundi 14 septembre, 8 h : coupure réseau à l’entrepôt de Romans-sur-Isère, 25 utilisateurs bloqués (incident critique). Intervention le mardi 15 septembre à 14 h.
- Jeudi 24 septembre, 10 h : imprimante hors service au magasin de Die (incident non critique). Intervention le lundi 28 septembre à 9 h.
Aucun autre incident n’a été déclaré en septembre.`,
  en: `IT MAINTENANCE CONTRACT NO. HX-2026-014
Between Hexalis SAS, 12 rue des Forges, 26000 Valence, France (the "Provider"), and the Valmont Farming Cooperative, 4 route de Chabeuil, 26000 Valence, France (the "Customer").
Signed in Valence on March 15, 2026.

Article 1 — Purpose
The Provider performs preventive and corrective maintenance of the Customer’s IT equipment (workstations, servers, printers and network devices) at the sites listed in Appendix A.

Article 2 — Term
The contract takes effect on April 1, 2026 for a term of 24 months. It then renews automatically for successive 12-month periods.

Article 3 — Price
3.1 The monthly fee is €2,400 excluding VAT, payable 30 days end of month.
3.2 The fee is revised on each anniversary date of the contract according to the Syntec index, with the increase capped at 3% per year.

Article 4 — Service levels
4.1 An incident is critical when it prevents at least ten users from working or blocks the invoicing process.
4.2 The response time is 8 business hours for a critical incident and 3 business days for any other incident, from the time it is reported on the Provider’s portal.
4.3 Business hours are those of the coverage window defined in Appendix A.

Article 5 — Penalties
5.1 Any overrun of the response time applicable to a critical incident gives rise to a penalty of 1% of the monthly fee per business hour of delay.
5.2 Total penalties for any one month are capped at 10% of the monthly fee.
5.3 Penalties are deducted from the following month’s invoice.

Article 6 — Termination
6.1 Either party may opt out of the renewal by registered letter with acknowledgment of receipt, giving 3 months’ notice before the expiry date.
6.2 In the event of a serious breach not remedied within 30 days of a formal notice, the other party may terminate the contract without notice.

Article 7 — Travel expenses
The Provider’s travel expenses are borne by the Customer and invoiced at cost, with receipts.

Article 8 — Contract documents and order of precedence
The contract consists of this document and its appendices signed by both parties. In the event of a conflict, the appendices prevail over this document and, between two appendices, the more recent one prevails. A document that has not been signed by both parties has no contractual value.

Article 9 — Confidentiality
Each party undertakes not to disclose the other party’s confidential information for the term of the contract and the following five years.

Article 10 — Disputes
Any dispute falls under the jurisdiction of the Romans-sur-Isère commercial court.

—

APPENDIX A — Scope and coverage window (signed with the contract on March 15, 2026)
Sites covered, with their distance from the Customer’s head office:
- Valence, head office: 0 km;
- Romans-sur-Isère, warehouse: 20 km;
- Crest, store: 30 km.
Coverage window: Monday to Friday, 8 am to 6 pm, excluding public holidays.
Customer contact: Mr. Gilles Arnoux, IT manager.

—

APPENDIX B — Amendment no. 1 (signed by both parties on June 2, 2026)
1. The response time for a critical incident is reduced to 4 business hours.
2. The monthly penalty cap is raised to 15% of the monthly fee.
3. The Crest store, closed on June 30, 2026, is removed from the scope as of July 1, 2026. The Die store, located 65 km from the head office, is added on the same date.
4. Travel expenses to sites less than 50 km from the head office are included in the fee; beyond that, they are still invoiced at cost.
The other provisions of the contract and of Appendix A are unchanged.

—

DRAFT APPENDIX C — Amendment no. 2 (sent by the Provider on September 9, 2026, not signed)
1. The notice period for opting out of the renewal set out in article 6.1 is reduced to 1 month.
2. The monthly fee rises to €2,650 excluding VAT as of October 1, 2026.

—

INCIDENT LOG — September 2026 (time reported on the portal, then response time)
- Tuesday, September 8, 9 am: billing server failure at the head office (critical incident). On-site response at 11 am the same day.
- Monday, September 14, 8 am: network outage at the Romans-sur-Isère warehouse, 25 users blocked (critical incident). Response on Tuesday, September 15 at 2 pm.
- Thursday, September 24, 10 am: printer out of order at the Die store (non-critical incident). Response on Monday, September 28 at 9 am.
No other incident was reported in September.`,
}

const GENERAL_MEETING = {
  fr: `PROCÈS-VERBAL DE L’ASSEMBLÉE GÉNÉRALE ORDINAIRE ET EXTRAORDINAIRE
Association « Les Jardins partagés du Moulin »
Samedi 14 mars 2026, salle polyvalente de Saint-Avit, de 18 h 30 à 21 h 45

Rappel des statuts (articles 11 et 12)
- L’assemblée ne délibère valablement que si la moitié au moins des membres à jour de cotisation sont présents ou représentés. Le quorum s’apprécie au moment de chaque vote.
- Un membre présent ne peut détenir plus de deux pouvoirs ; les pouvoirs excédentaires sont nuls.
- Les décisions ordinaires sont prises à la majorité simple des suffrages exprimés. Les abstentions et les bulletins blancs ne sont pas des suffrages exprimés.
- Les modifications des statuts requièrent au moins les deux tiers des suffrages exprimés.
- Si le quorum n’est plus atteint en cours de séance, les points restants ne peuvent pas être mis aux voix : ils sont reportés à une nouvelle assemblée, convoquée sous quinze jours, qui délibère alors sans condition de quorum.

Feuille de présence
Membres à jour de cotisation : 60.
Membres présents à l’ouverture : 24.
Pouvoirs remis : 9. Mme Josiane Roche en détient 3, M. Patrice Blin 2, et quatre autres membres présents 1 chacun.
Le président, M. Hervé Clément, constate que le quorum est atteint et ouvre la séance. Secrétaire de séance : Mme Nadia Ferhat.

1. Rapport moral et rapport financier
Le président présente le bilan de l’année : 112 parcelles cultivées, deux nouvelles serres, un partenariat avec l’école Jules-Ferry et une fête des récoltes qui a réuni près de 300 visiteurs. Il remercie les bénévoles qui ont repeint l’abri à outils.
Il détaille ensuite les projets pour 2026 : l’aménagement d’une parcelle accessible aux personnes en fauteuil roulant, la création d’une grainothèque dans l’ancien local à vélos et l’accueil de deux classes de l’école Jules-Ferry un mardi sur deux, d’avril à juin. La liste d’attente compte 23 foyers ; le bureau envisage de diviser les plus grandes parcelles pour en libérer six.
La trésorière, Mme Brigitte Lenoir, présente les comptes : 18 430 € de recettes (dont 9 000 € de cotisations, 6 200 € de subventions de la commune et 3 230 € de recettes de la fête des récoltes), 17 960 € de dépenses, soit un excédent de 470 €, reporté sur l’exercice suivant. Le vérificateur aux comptes, M. Ludovic Perrin, déclare n’avoir relevé aucune anomalie. Elle annonce qu’elle ne se représentera pas à son poste, après six années de mandat.
Résolution 1 — Approbation des comptes de l’exercice 2025 : pour 28, contre 2, abstentions 2.

2. Montant de la cotisation
Le bureau propose de porter la cotisation annuelle de 15 € à 20 € pour financer le remplacement du système d’arrosage, dont la pompe est tombée en panne trois fois l’été dernier. Plusieurs membres jugent la hausse trop forte. M. Blin propose 18 €, mais sa proposition n’est pas mise aux voix, faute d’avoir été inscrite à l’ordre du jour.
Résolution 2 — Cotisation annuelle portée à 20 € à partir du 1er janvier 2027 : pour 14, contre 13, abstentions 5.

3. Modification des statuts (partie extraordinaire)
Le bureau propose de permettre le vote électronique lors des prochaines assemblées, en modifiant l’article 12. Mme Roche s’inquiète pour les membres qui n’ont pas d’ordinateur ; le président précise que le vote papier resterait possible.
Résolution 3 — Modification de l’article 12 (vote électronique) : pour 19, contre 10, abstentions 3.

4. Questions diverses
Mme Roche demande que l’accès aux composteurs soit réservé aux membres. Le président répond que le point sera étudié en réunion de bureau. M. Ludovic Perrin signale que la clôture côté rivière est abîmée ; un chantier collectif est proposé pour le samedi 4 avril.
À 21 h 10, cinq membres présents quittent la séance, dont M. Blin. Les pouvoirs que M. Blin détenait ne sont plus exercés ; les quatre autres membres partis n’en détenaient pas.

5. Élection du trésorier
Une seule candidate se présente : Mme Aurélie Garcin, membre depuis 2021. Le président fait procéder au vote malgré les départs, « pour ne pas laisser le poste vacant ».
Résolution 4 — Élection de Mme Garcin au poste de trésorière : pour 15, contre 3, abstentions 7.

L’ordre du jour étant épuisé, le président lève la séance à 21 h 45 et remercie Mme Lenoir pour son engagement.

Le président, Hervé Clément — La secrétaire de séance, Nadia Ferhat`,
  en: `MINUTES OF THE ORDINARY AND EXTRAORDINARY GENERAL MEETING
"Les Jardins partagés du Moulin" community garden association
Saturday, March 14, 2026, Saint-Avit community hall, 6:30 pm to 9:45 pm

Reminder of the bylaws (articles 11 and 12)
- The meeting can validly decide only if at least half of the members whose dues are paid are present or represented. The quorum is assessed at the time of each vote.
- A member present may not hold more than two proxies; any proxies beyond that are void.
- Ordinary decisions are taken by a simple majority of the votes cast. Abstentions and blank ballots are not votes cast.
- Amendments to the bylaws require at least two thirds of the votes cast.
- If the quorum is no longer met during the meeting, the remaining items cannot be put to a vote: they are postponed to a new meeting, called within fifteen days, which then decides with no quorum requirement.

Attendance sheet
Members whose dues are paid: 60.
Members present at the opening: 24.
Proxies handed in: 9. Ms. Josiane Roche holds 3, Mr. Patrice Blin 2, and four other members present 1 each.
The chair, Mr. Hervé Clément, notes that the quorum is met and opens the meeting. Secretary of the meeting: Ms. Nadia Ferhat.

1. Activity report and financial report
The chair reviews the year: 112 plots cultivated, two new greenhouses, a partnership with the Jules-Ferry school and a harvest festival that drew nearly 300 visitors. He thanks the volunteers who repainted the tool shed.
He then outlines the projects for 2026: a plot made accessible to wheelchair users, a seed library in the former bike shed, and hosting two classes from the Jules-Ferry school every other Tuesday from April to June. The waiting list has 23 households; the board is considering splitting the largest plots to free up six.
The treasurer, Ms. Brigitte Lenoir, presents the accounts: €18,430 in income (including €9,000 in dues, €6,200 in grants from the town and €3,230 from the harvest festival) and €17,960 in expenses, a surplus of €470 carried forward to the next year. The auditor, Mr. Ludovic Perrin, states that he found no irregularities. She announces that she will not stand again for the position, after six years in office.
Resolution 1 — Approval of the 2025 accounts: for 28, against 2, abstentions 2.

2. Membership dues
The board proposes raising the annual dues from €15 to €20 to fund the replacement of the watering system, whose pump broke down three times last summer. Several members consider the increase too steep. Mr. Blin proposes €18, but his proposal is not put to a vote, since it was not on the agenda.
Resolution 2 — Annual dues raised to €20 from January 1, 2027: for 14, against 13, abstentions 5.

3. Amendment to the bylaws (extraordinary part)
The board proposes allowing electronic voting at future meetings by amending article 12. Ms. Roche is concerned about members who do not have a computer; the chair explains that paper voting would remain possible.
Resolution 3 — Amendment to article 12 (electronic voting): for 19, against 10, abstentions 3.

4. Other business
Ms. Roche asks for access to the compost bins to be restricted to members. The chair replies that the matter will be looked at in a board meeting. Mr. Ludovic Perrin reports that the fence on the river side is damaged; a group work day is proposed for Saturday, April 4.
At 9:10 pm, five members present leave the meeting, including Mr. Blin. The proxies Mr. Blin held are no longer exercised; the other four members who left held none.

5. Election of the treasurer
There is a single candidate: Ms. Aurélie Garcin, a member since 2021. The chair has the vote held despite the departures, "so as not to leave the position vacant."
Resolution 4 — Election of Ms. Garcin as treasurer: for 15, against 3, abstentions 7.

The agenda being completed, the chair closes the meeting at 9:45 pm and thanks Ms. Lenoir for her commitment.

The chair, Hervé Clément — The secretary of the meeting, Nadia Ferhat`,
}

const TRAVEL_POLICY = {
  fr: `POLITIQUE DE REMBOURSEMENT DES FRAIS DE DÉPLACEMENT — Groupe Altamar

═══ Version 1 — applicable aux déplacements effectués du 1er janvier 2025 au 31 août 2026 ═══

1. Principe. Les frais engagés pour un déplacement professionnel autorisé par le manager sont remboursés sur justificatifs, dans les limites ci-dessous.
2. Transport. Le train est privilégié pour tout trajet de moins de 5 heures. Le voyage se fait en 2de classe ; la 1re classe est autorisée lorsque la durée du trajet dépasse 3 heures.
3. Hébergement. Plafond par nuit, petit-déjeuner compris : 150 € à Paris, 110 € dans les autres villes.
4. Repas. 20 € par repas, sur justificatif. Aucun repas n’est remboursé lorsqu’il est fourni par l’organisateur.
5. Taxis et VTC. Remboursés sans accord préalable pour un trajet commencé après 21 h ; dans les autres cas, avec l’accord écrit du manager.
6. Véhicule personnel. Indemnité de 0,40 € par kilomètre, sur présentation de la carte grise et d’une attestation d’assurance.
7. Délais. La note de frais et ses justificatifs sont transmis dans les 30 jours suivant la fin du déplacement ; au-delà, les frais ne sont pas remboursés.
8. Avances. Une avance de 50 % des frais estimés peut être demandée pour tout déplacement de plus de trois jours.
9. Location de voiture. Autorisée lorsqu’aucun transport en commun ne permet de rejoindre le lieu de la mission dans un délai raisonnable ; catégorie économique uniquement, carburant remboursé sur justificatif.
10. Déplacements à l’étranger. Soumis à l’accord préalable du directeur de département ; les plafonds d’hébergement et de repas sont ceux du barème annexé, par pays.

═══ Version 2 — applicable aux déplacements commencés à partir du 1er septembre 2026 ═══

1. Principe. Les frais engagés pour un déplacement professionnel autorisé par le manager sont remboursés sur justificatifs, dans les limites ci-dessous.
2. Transport. Le train est privilégié pour tout trajet de moins de 5 heures. Le voyage se fait en 2de classe ; la 1re classe est autorisée lorsque la durée du trajet dépasse 4 heures.
3. Hébergement. Plafond par nuit, petit-déjeuner compris : 170 € à Paris, 110 € dans les autres villes.
4. Repas. 22 € par repas, sur justificatif. Aucun repas n’est remboursé lorsqu’il est fourni par l’organisateur.
5. Taxis et VTC. Remboursés uniquement avec l’accord écrit préalable du manager, quelle que soit l’heure du trajet.
6. Véhicule personnel. Indemnité de 0,40 € par kilomètre, sur présentation de la carte grise et d’une attestation d’assurance.
7. Délais. La note de frais et ses justificatifs sont transmis dans les 45 jours suivant la fin du déplacement ; au-delà, les frais ne sont pas remboursés.
8. Avances. Une avance de 50 % des frais estimés peut être demandée pour tout déplacement de plus de trois jours.
9. Location de voiture. Autorisée lorsqu’aucun transport en commun ne permet de rejoindre le lieu de la mission dans un délai raisonnable ; catégorie économique uniquement, carburant remboursé sur justificatif.
10. Déplacements à l’étranger. Soumis à l’accord préalable du directeur de département ; les plafonds d’hébergement et de repas sont ceux du barème annexé, par pays.

═══ Notes de frais de Mme Carole Vignal (service commercial, basée à Lyon) ═══

Déplacement n° 1 — Paris, du mardi 25 au mercredi 26 août 2026 (salon professionnel)
- Train Lyon–Paris aller-retour, 1 h 56 par trajet, 2de classe : 98 €.
- Hôtel, 1 nuit, petit-déjeuner compris : 160 €.
- Taxi du salon à l’hôtel, le 25 août à 22 h 10, sans accord préalable : 27 €.
- Dîner du 25 août : 19,50 €.

Déplacement n° 2 — Strasbourg, du mercredi 14 au vendredi 16 octobre 2026 (rendez-vous clients)
- Train Lyon–Strasbourg aller-retour, 3 h 40 par trajet, 1re classe : 212 €.
- Hôtel, 2 nuits à 104 €, petit-déjeuner compris : 208 €.
- Déjeuner du 15 octobre, offert par le client : non déclaré.
- Dîners des 14 et 15 octobre : 21 € et 22 €.

Déplacement n° 3 — Paris, du mardi 3 au mercredi 4 novembre 2026 (formation interne)
- Train Lyon–Paris aller-retour, 1 h 56 par trajet, 2de classe : 104 €.
- Hôtel, 1 nuit, petit-déjeuner compris : 165 €.
- Taxi de la gare à l’hôtel, le 3 novembre à 21 h 40, accord écrit du manager obtenu la veille : 24 €.`,
  en: `TRAVEL EXPENSE REIMBURSEMENT POLICY — Altamar Group

═══ Version 1 — applies to trips taken from January 1, 2025 to August 31, 2026 ═══

1. Principle. Expenses incurred for a business trip authorized by the manager are reimbursed on presentation of receipts, within the limits below.
2. Transport. Train is preferred for any journey of less than 5 hours. Travel is in second class; first class is allowed when the journey takes more than 3 hours.
3. Accommodation. Cap per night, breakfast included: €150 in Paris, €110 in other cities.
4. Meals. €20 per meal, with a receipt. No meal is reimbursed when it is provided by the organizer.
5. Taxis and ride-hailing. Reimbursed without prior approval for a ride starting after 9 pm; otherwise, with the manager’s written approval.
6. Personal vehicle. Allowance of €0.40 per kilometer, on presentation of the vehicle registration and a certificate of insurance.
7. Deadlines. The expense report and its receipts must be submitted within 30 days of the end of the trip; after that, expenses are not reimbursed.
8. Advances. An advance of 50% of the estimated expenses may be requested for any trip of more than three days.
9. Car rental. Allowed when no public transport can reach the place of the assignment within a reasonable time; economy category only, fuel reimbursed with a receipt.
10. Travel abroad. Subject to the department director’s prior approval; accommodation and meal caps are those of the attached schedule, by country.

═══ Version 2 — applies to trips starting on or after September 1, 2026 ═══

1. Principle. Expenses incurred for a business trip authorized by the manager are reimbursed on presentation of receipts, within the limits below.
2. Transport. Train is preferred for any journey of less than 5 hours. Travel is in second class; first class is allowed when the journey takes more than 4 hours.
3. Accommodation. Cap per night, breakfast included: €170 in Paris, €110 in other cities.
4. Meals. €22 per meal, with a receipt. No meal is reimbursed when it is provided by the organizer.
5. Taxis and ride-hailing. Reimbursed only with the manager’s prior written approval, whatever the time of the ride.
6. Personal vehicle. Allowance of €0.40 per kilometer, on presentation of the vehicle registration and a certificate of insurance.
7. Deadlines. The expense report and its receipts must be submitted within 45 days of the end of the trip; after that, expenses are not reimbursed.
8. Advances. An advance of 50% of the estimated expenses may be requested for any trip of more than three days.
9. Car rental. Allowed when no public transport can reach the place of the assignment within a reasonable time; economy category only, fuel reimbursed with a receipt.
10. Travel abroad. Subject to the department director’s prior approval; accommodation and meal caps are those of the attached schedule, by country.

═══ Expense reports of Ms. Carole Vignal (sales department, based in Lyon) ═══

Trip no. 1 — Paris, Tuesday, August 25 to Wednesday, August 26, 2026 (trade show)
- Lyon–Paris train, round trip, 1 h 56 min each way, second class: €98.
- Hotel, 1 night, breakfast included: €160.
- Taxi from the trade show to the hotel, August 25 at 10:10 pm, without prior approval: €27.
- Dinner on August 25: €19.50.

Trip no. 2 — Strasbourg, Wednesday, October 14 to Friday, October 16, 2026 (customer meetings)
- Lyon–Strasbourg train, round trip, 3 h 40 min each way, first class: €212.
- Hotel, 2 nights at €104, breakfast included: €208.
- Lunch on October 15, paid for by the customer: not claimed.
- Dinners on October 14 and 15: €21 and €22.

Trip no. 3 — Paris, Tuesday, November 3 to Wednesday, November 4, 2026 (internal training)
- Lyon–Paris train, round trip, 1 h 56 min each way, second class: €104.
- Hotel, 1 night, breakfast included: €165.
- Taxi from the station to the hotel, November 3 at 9:40 pm, manager’s written approval obtained the day before: €24.`,
}

const AUDIT_REPORT = {
  fr: `RAPPORT D’AUDIT QUALITÉ ET SÉCURITÉ — 2e trimestre 2026
Réseau de centres de maintenance Novaclim (climatisation et froid commercial)
Rédigé par le cabinet Certis Conseil pour la direction des opérations, le 12 juin 2026

RÉSUMÉ POUR LA DIRECTION
Les quatre centres audités ce trimestre (Lille, Metz, Reims et Amiens) ont obtenu un taux de conformité moyen de 92 %, en progression par rapport au trimestre précédent. Aucune non-conformité majeure n’a été relevée et aucun centre ne nécessite d’audit de suivi. Nous recommandons le maintien de la certification pour l’ensemble du réseau.

1. Méthodologie
Chaque centre est évalué sur 50 points de contrôle répartis en cinq domaines : sécurité des personnes, gestion des fluides frigorigènes, traçabilité des interventions, sauvegarde des données et formation. Le taux de conformité est la part des points de contrôle satisfaits.
Une non-conformité est majeure lorsqu’elle expose les personnes à un danger immédiat ou qu’elle rend impossible la reconstitution des interventions réalisées ; elle est mineure dans les autres cas.
Règles de décision :
- la certification d’un centre est maintenue si son taux de conformité est d’au moins 85 % et qu’aucune non-conformité majeure n’est ouverte à la clôture de l’audit ;
- un audit de suivi est programmé sous 60 jours pour tout centre dont le taux est inférieur à 80 % ou qui présente une non-conformité majeure ouverte à la clôture de l’audit.

2. Résultats détaillés

2.1 Lille (audit du 7 avril 2026) — taux de conformité : 96 % (48 points sur 50)
Deux non-conformités mineures : la fiche de sécurité d’un produit de nettoyage était absente de l’atelier et le registre de formation n’était pas signé par le formateur. Le centre a corrigé les deux points avant la clôture de l’audit. Les auditeurs soulignent la bonne tenue du registre des fluides.

2.2 Metz (audit du 22 avril 2026) — taux de conformité : 94 % (47 points sur 50)
Une non-conformité majeure : les sauvegardes du logiciel de suivi des interventions ne sont plus testées depuis novembre 2025, et la restauration tentée pendant l’audit a échoué. L’historique des interventions de 2025 ne peut donc pas être reconstitué. Deux non-conformités mineures portent sur l’étiquetage des bouteilles de fluide. La non-conformité majeure était toujours ouverte à la clôture de l’audit ; le responsable du centre doit présenter un plan d’action avant le 30 juin.

2.3 Reims (audit du 13 mai 2026) — taux de conformité : 78 % (39 points sur 50)
Onze non-conformités mineures, principalement de traçabilité : bons d’intervention incomplets, dates de contrôle des détecteurs de fuite manquantes, signatures des clients absentes. Aucune n’expose les personnes à un danger immédiat et aucune ne rend impossible la reconstitution des interventions. L’équipe, renouvelée à moitié en mars, connaît encore mal les procédures.

2.4 Amiens (audit du 27 mai 2026) — taux de conformité : 92 % (46 points sur 50)
Au trimestre précédent, Amiens présentait une non-conformité majeure (extincteurs de l’atelier non vérifiés depuis deux ans). Elle a été levée : les extincteurs ont été contrôlés le 3 avril 2026 et le certificat a été présenté aux auditeurs. Quatre non-conformités mineures ont été relevées, dont trois corrigées pendant l’audit ; la dernière (un affichage de consignes à remplacer) est à traiter avant la fin juillet.

3. Comparaison avec le trimestre précédent
Taux de conformité du 1er trimestre 2026 : Lille 93 %, Metz 95 %, Reims 84 %, Amiens 88 %, soit une moyenne de 90 %.

4. Recommandations
- Généraliser à tous les centres le test trimestriel de restauration des sauvegardes.
- Prévoir une journée de formation aux procédures de traçabilité pour les nouveaux arrivants.
- Mettre à jour la liste des fiches de sécurité lors de chaque changement de fournisseur de produits.

5. Calendrier des prochains audits
Le troisième trimestre couvrira les centres de Rouen, Caen, Le Havre et Évreux, entre le 1er septembre et le 15 octobre 2026. Les audits de suivi éventuels du deuxième trimestre s’ajoutent à ce calendrier et sont menés par la même équipe d’auditeurs, afin d’assurer la continuité des constats.

Annexe — Équipe d’audit : Marion Lefèvre (auditrice principale), Karim Bensaïd (auditeur fluides frigorigènes), Lucie Dumas (auditrice systèmes d’information).`,
  en: `QUALITY AND SAFETY AUDIT REPORT — Q2 2026
Novaclim maintenance center network (air conditioning and commercial refrigeration)
Written by Certis Conseil for the operations department, June 12, 2026

EXECUTIVE SUMMARY
The four centers audited this quarter (Lille, Metz, Reims and Amiens) achieved an average compliance rate of 92%, up from the previous quarter. No major nonconformity was found and no center requires a follow-up audit. We recommend maintaining certification for the whole network.

1. Methodology
Each center is assessed on 50 checkpoints across five areas: personal safety, refrigerant management, traceability of service calls, data backup, and training. The compliance rate is the share of checkpoints met.
A nonconformity is major when it exposes people to immediate danger or makes it impossible to reconstruct the service calls carried out; it is minor in all other cases.
Decision rules:
- a center’s certification is maintained if its compliance rate is at least 85% and no major nonconformity is open when the audit closes;
- a follow-up audit is scheduled within 60 days for any center whose rate is below 80% or that has a major nonconformity open when the audit closes.

2. Detailed results

2.1 Lille (audit of April 7, 2026) — compliance rate: 96% (48 points out of 50)
Two minor nonconformities: the safety data sheet for a cleaning product was missing from the workshop, and the training register had not been signed by the trainer. The center fixed both points before the audit closed. The auditors highlight the well-kept refrigerant register.

2.2 Metz (audit of April 22, 2026) — compliance rate: 94% (47 points out of 50)
One major nonconformity: backups of the service-call tracking software have not been tested since November 2025, and the restore attempted during the audit failed. The 2025 service-call history therefore cannot be reconstructed. Two minor nonconformities concern the labeling of refrigerant cylinders. The major nonconformity was still open when the audit closed; the center manager must present an action plan before June 30.

2.3 Reims (audit of May 13, 2026) — compliance rate: 78% (39 points out of 50)
Eleven minor nonconformities, mostly about traceability: incomplete service reports, missing inspection dates for leak detectors, missing customer signatures. None exposes people to immediate danger and none makes it impossible to reconstruct the service calls. The team, half of which was replaced in March, is still unfamiliar with the procedures.

2.4 Amiens (audit of May 27, 2026) — compliance rate: 92% (46 points out of 50)
In the previous quarter, Amiens had a major nonconformity (workshop fire extinguishers not inspected for two years). It has been cleared: the extinguishers were inspected on April 3, 2026 and the certificate was shown to the auditors. Four minor nonconformities were found, three of which were fixed during the audit; the last one (a safety notice to be replaced) must be dealt with before the end of July.

3. Comparison with the previous quarter
Q1 2026 compliance rates: Lille 93%, Metz 95%, Reims 84%, Amiens 88%, an average of 90%.

4. Recommendations
- Roll out a quarterly backup restore test to all centers.
- Plan a training day on traceability procedures for new staff.
- Update the list of safety data sheets whenever the product supplier changes.

5. Upcoming audit schedule
The third quarter will cover the Rouen, Caen, Le Havre and Évreux centers, between September 1 and October 15, 2026. Any follow-up audits arising from the second quarter are added to this schedule and are carried out by the same team of auditors, to ensure continuity of findings.

Appendix — Audit team: Marion Lefèvre (lead auditor), Karim Bensaïd (refrigerant auditor), Lucie Dumas (information systems auditor).`,
}

const PROJECT_MEETINGS = {
  fr: `COMPTES RENDUS — Comité projet « Migration ERP », Fromagerie Bellerive
Membres du comité : Agnès Morel (cheffe de projet), Nicolas Ferrand (achats), Nicolas Duval (DSI), Inès Brahimi (contrôle de gestion), Paul Lemoine (responsable de production), Sylvie Caron (ressources humaines).
Dans ces comptes rendus, « Nicolas F. » désigne Nicolas Ferrand et « Nicolas D. » Nicolas Duval.

━━ Réunion du lundi 5 octobre 2026 ━━
Présents : tous.
1. Calendrier. Agnès confirme la bascule sur le nouvel ERP le mardi 1er décembre 2026. Les données seront figées le vendredi 27 novembre au soir.
2. Actions décidées :
- A1 — Rédiger le cahier de recette : Nicolas D., pour le 20 octobre.
- A2 — Négocier les licences supplémentaires avec l’éditeur : Nicolas F., pour le 16 octobre.
- A3 — Préparer la formation des utilisateurs clés de la production : Inès, plan à présenter le 19 octobre.
- A4 — Rédiger la note d’information aux salariés : Sylvie, pour le 26 octobre.
3. Budget. Inès présente le suivi budgétaire : 148 000 € engagés sur un budget de 175 000 €. Le poste « licences » risque de dépasser de 6 000 € si l’éditeur n’accorde pas de remise.
4. Divers. Paul rappelle que la semaine du 23 novembre est chargée en production (commandes de fin d’année) : aucune formation ne pourra avoir lieu cette semaine-là.

━━ Réunion du lundi 12 octobre 2026 ━━
Présents : tous sauf Nicolas Duval, mobilisé par une panne réseau sur le site d’affinage de Poligny.
1. A1 — Nicolas D. étant absorbé par la panne de Poligny pour une durée indéterminée, Agnès confie le cahier de recette à Inès. L’échéance est repoussée au 27 octobre.
2. A2 — Nicolas F. annonce avoir obtenu une remise de 12 % ; les licences sont commandées. Action close.
3. A3 — Inès ne pouvant pas mener de front la recette et la formation, la préparation de la formation passe à Paul, qui connaît les équipes de production. Échéance inchangée.
4. Calendrier. L’éditeur annonce un retard de livraison du module qualité. Agnès propose de repousser la bascule au mardi 12 janvier 2027 ; la décision revient au comité de pilotage du jeudi 15 octobre.
5. A4 — Sylvie a fait relire la note par la direction ; diffusion prévue la semaine prochaine.
6. Budget. Grâce à la remise sur les licences, Inès ramène la prévision de dépassement à zéro ; il reste une marge de 3 000 €.
7. Risques. Paul s’inquiète des étiquettes de traçabilité des meules, que l’ancien système imprimait directement. Agnès demande à l’éditeur une démonstration du module d’étiquetage avant la fin du mois.

━━ Réunion du lundi 19 octobre 2026 ━━
Présents : tous.
1. Calendrier. Le comité de pilotage du 15 octobre a refusé le report : le module qualité sera activé après la bascule, qui est maintenue au mardi 1er décembre 2026.
2. A1 — Inès indique que le cahier de recette ne pourra pas être prêt le 27 octobre : la clôture mensuelle l’occupe toute la semaine. La panne de Poligny étant résolue, Nicolas (DSI) reprend finalement le cahier de recette, avec une nouvelle échéance au 3 novembre. Inès en relira la partie comptable.
3. A3 — Paul présente le plan de formation : quatre sessions de deux heures, les 9, 10, 16 et 17 novembre. Plan validé ; action close.
4. A4 — Note diffusée le 16 octobre. Action close.
5. Nouvelles actions :
- A5 — Reprendre les données fournisseurs dans le nouvel ERP : Nicolas F., pour le 6 novembre.
- A6 — Vérifier les droits d’accès de chaque utilisateur : Nicolas D., pour le 13 novembre.
- A7 — Organiser la permanence d’assistance des deux premières semaines après la bascule : Sylvie, pour le 20 novembre.
6. Étiquetage. La démonstration de l’éditeur a eu lieu le 16 octobre : le module imprime les étiquettes de traçabilité au format actuel. Le risque soulevé par Paul est levé.
Prochaine réunion : lundi 26 octobre 2026.`,
  en: `MINUTES — "ERP Migration" project committee, Bellerive Cheese Dairy
Committee members: Agnès Morel (project manager), Nicolas Ferrand (purchasing), Nicolas Duval (IT director), Inès Brahimi (management control), Paul Lemoine (production manager), Sylvie Caron (human resources).
In these minutes, "Nicolas F." refers to Nicolas Ferrand and "Nicolas D." to Nicolas Duval.

━━ Meeting of Monday, October 5, 2026 ━━
Attendees: everyone.
1. Schedule. Agnès confirms the switchover to the new ERP on Tuesday, December 1, 2026. Data will be frozen on the evening of Friday, November 27.
2. Action items:
- A1 — Write the acceptance test plan: Nicolas D., by October 20.
- A2 — Negotiate the additional licenses with the vendor: Nicolas F., by October 16.
- A3 — Prepare the training for production key users: Inès, plan to be presented on October 19.
- A4 — Write the information memo for employees: Sylvie, by October 26.
3. Budget. Inès presents the budget tracking: €148,000 committed out of a €175,000 budget. The licenses line may overrun by €6,000 if the vendor grants no discount.
4. Other business. Paul reminds everyone that the week of November 23 is busy in production (year-end orders): no training can take place that week.

━━ Meeting of Monday, October 12, 2026 ━━
Attendees: everyone except Nicolas Duval, busy with a network outage at the Poligny ripening site.
1. A1 — As Nicolas D. is tied up with the Poligny outage for an unknown length of time, Agnès gives the acceptance test plan to Inès. The deadline is pushed back to October 27.
2. A2 — Nicolas F. announces he obtained a 12% discount; the licenses have been ordered. Item closed.
3. A3 — As Inès cannot handle both the acceptance tests and the training, preparing the training moves to Paul, who knows the production teams. Deadline unchanged.
4. Schedule. The vendor announces a delay in delivering the quality module. Agnès proposes postponing the switchover to Tuesday, January 12, 2027; the decision lies with the steering committee on Thursday, October 15.
5. A4 — Sylvie had the memo reviewed by management; it will go out next week.
6. Budget. Thanks to the license discount, Inès brings the forecast overrun down to zero; there is €3,000 of headroom left.
7. Risks. Paul is worried about the traceability labels for the cheese wheels, which the old system printed directly. Agnès asks the vendor for a demo of the labeling module before the end of the month.

━━ Meeting of Monday, October 19, 2026 ━━
Attendees: everyone.
1. Schedule. The steering committee of October 15 refused the postponement: the quality module will be enabled after the switchover, which remains on Tuesday, December 1, 2026.
2. A1 — Inès says the acceptance test plan cannot be ready by October 27: the month-end close keeps her busy all week. As the Poligny outage is resolved, Nicolas (IT) finally takes the acceptance test plan back, with a new deadline of November 3. Inès will review its accounting part.
3. A3 — Paul presents the training plan: four two-hour sessions on November 9, 10, 16 and 17. Plan approved; item closed.
4. A4 — Memo sent out on October 16. Item closed.
5. New action items:
- A5 — Migrate supplier data into the new ERP: Nicolas F., by November 6.
- A6 — Check each user’s access rights: Nicolas D., by November 13.
- A7 — Organize the help desk for the first two weeks after the switchover: Sylvie, by November 20.
6. Labeling. The vendor’s demo took place on October 16: the module prints traceability labels in the current format. The risk raised by Paul is cleared.
Next meeting: Monday, October 26, 2026.`,
}

const HOSTING_CHAT = {
  fr: `Canal #portail-clients — messages du 2 au 18 novembre 2026
Contexte : choix de l’hébergeur du nouveau portail clients de la mutuelle d’assurance Solvea.

[lun. 2 nov., 10:14] Margaux Deschamps (directrice technique) : Après comparaison des trois offres, je propose d’héberger le portail chez Nuagine, région Paris : 1 850 € HT par mois pour l’ensemble, support 24 h/24 compris. Sans objection d’ici mercredi, on part là-dessus.
[lun. 2 nov., 11:02] Rayan Mbaye (développeur) : OK pour moi. Leur base de données gérée nous économise pas mal de travail d’exploitation.
[lun. 2 nov., 11:30] Chloé Arnaud (designer) : Rien à dire sur l’hébergement. Je dépose les maquettes de l’espace adhérent cet après-midi.
[mer. 4 nov., 09:30] Margaux : Pas d’objection : décision prise, on part sur Nuagine, région Paris. Rayan, tu peux préparer l’environnement de recette.
[mer. 4 nov., 14:18] Rayan : C’est parti, je crée le réseau et la base de recette.
[mer. 4 nov., 16:02] Chloé : Question : on garde l’ancien nom de domaine portail.solvea.fr ou on passe à espace.solvea.fr ? Le service communication préfère le second.
[mer. 4 nov., 16:20] Margaux : On garde portail.solvea.fr pour ne pas casser les liens des courriers déjà envoyés aux adhérents.
[jeu. 5 nov., 16:47] Élodie Fabre (juriste) : Je dois vous arrêter. Le contrat type de Nuagine prévoit que les sauvegardes peuvent être stockées hors de l’Union européenne. Or nos conventions avec les mutuelles partenaires exigent que toutes les données, sauvegardes comprises, restent dans l’UE. En l’état, on ne peut pas signer.
[jeu. 5 nov., 17:20] Margaux : Merci Élodie. Dans ce cas, Nuagine est abandonné. Rayan, arrête la recette. Je relance Stratus, qui était deuxième : 2 100 € HT par mois, région Francfort, et tout est garanti dans l’UE.
[ven. 6 nov., 10:05] Rayan : Arrêté. Je n’avais créé que le réseau, rien n’a été facturé.
[ven. 6 nov., 15:22] Chloé : Les maquettes sont validées par le service adhérents, avec deux corrections mineures sur le formulaire de remboursement.
[lun. 9 nov., 14:12] Margaux : Décision : on part sur Stratus, région Francfort. Le contrat sera signé par Thierry, puisque ma délégation de signature s’arrête à 20 000 € par an.
[mar. 10 nov., 08:55] Thierry Wauters (directeur financier) : Je signerai, mais pas avant d’avoir vu la clause de réversibilité : si on part, je veux récupérer toutes nos données dans un format standard, sans frais.
[mar. 10 nov., 09:40] Rayan : J’ai ouvert un compte d’essai chez Stratus pour tester le déploiement.
[mer. 11 nov., 10:15] Chloé : Le test d’accessibilité des maquettes est terminé : contraste insuffisant sur les boutons secondaires, je corrige.
[jeu. 12 nov., 11:40] Rayan : Mauvaise surprise chez Stratus : les 2 100 € ne comprennent pas la base de données gérée. Avec elle, on passe à 2 900 € HT par mois.
[jeu. 12 nov., 15:03] Élodie : Bonne nouvelle de mon côté : Nuagine accepte un avenant qui garantit le stockage de toutes les données, sauvegardes comprises, dans l’UE. Condition : choisir la région Strasbourg, car la région Paris réplique ses sauvegardes à Montréal. Le tarif reste de 1 850 € HT par mois.
[ven. 13 nov., 10:20] Margaux : Dans ce cas, on revient à Nuagine, en région Strasbourg, avec l’avenant obtenu par Élodie. Stratus est abandonné. Rayan, tu peux relancer la recette, sur Strasbourg cette fois.
[ven. 13 nov., 10:31] Rayan : Je relance sur Strasbourg et je ferme le compte d’essai Stratus.
[ven. 13 nov., 11:05] Chloé : Je mets à jour le schéma d’architecture dans le dossier projet.
[lun. 16 nov., 09:12] Thierry : J’ai lu l’avenant Nuagine : la clause de réversibilité me convient (export complet au format standard, sans frais). 1 850 € × 12 = 22 200 € par an : c’est bien à moi de signer. Je signe cette semaine.
[mer. 18 nov., 17:45] Margaux : Contrat et avenant signés par Thierry ce matin. Mise en production prévue le lundi 7 décembre. Merci à tous !`,
  en: `#customer-portal channel — messages from November 2 to 18, 2026
Context: choosing the hosting provider for the new customer portal of the Solvea mutual insurance company.

[Mon, Nov 2, 10:14] Margaux Deschamps (CTO): After comparing the three offers, I suggest hosting the portal with Nuagine, Paris region: €1,850 excluding VAT per month for everything, 24/7 support included. Unless anyone objects by Wednesday, we’ll go with that.
[Mon, Nov 2, 11:02] Rayan Mbaye (developer): Fine with me. Their managed database saves us quite a lot of operations work.
[Mon, Nov 2, 11:30] Chloé Arnaud (designer): Nothing to add on hosting. I’ll upload the member area mockups this afternoon.
[Wed, Nov 4, 09:30] Margaux: No objections: decision made, we’re going with Nuagine, Paris region. Rayan, you can set up the staging environment.
[Wed, Nov 4, 14:18] Rayan: On it, I’m creating the network and the staging database.
[Wed, Nov 4, 16:02] Chloé: Question: do we keep the old portail.solvea.fr domain or switch to espace.solvea.fr? The communications team prefers the second one.
[Wed, Nov 4, 16:20] Margaux: We keep portail.solvea.fr so we don’t break the links in the letters already sent to members.
[Thu, Nov 5, 16:47] Élodie Fabre (legal counsel): I have to stop you. Nuagine’s standard contract allows backups to be stored outside the European Union. But our agreements with our partner insurers require all data, backups included, to stay in the EU. As things stand, we can’t sign.
[Thu, Nov 5, 17:20] Margaux: Thanks Élodie. In that case, Nuagine is dropped. Rayan, stop the staging work. I’m getting back to Stratus, which came second: €2,100 excluding VAT per month, Frankfurt region, and everything is guaranteed to stay in the EU.
[Fri, Nov 6, 10:05] Rayan: Stopped. I had only created the network, nothing was billed.
[Fri, Nov 6, 15:22] Chloé: The mockups have been approved by the member services team, with two minor fixes on the claim form.
[Mon, Nov 9, 14:12] Margaux: Decision: we’re going with Stratus, Frankfurt region. Thierry will sign the contract, since my signing authority stops at €20,000 a year.
[Tue, Nov 10, 08:55] Thierry Wauters (CFO): I’ll sign, but not before I’ve seen the reversibility clause: if we leave, I want to get all our data back in a standard format, at no cost.
[Tue, Nov 10, 09:40] Rayan: I’ve opened a trial account with Stratus to test the deployment.
[Wed, Nov 11, 10:15] Chloé: The accessibility test of the mockups is done: insufficient contrast on the secondary buttons, I’m fixing it.
[Thu, Nov 12, 11:40] Rayan: Bad surprise at Stratus: the €2,100 doesn’t include the managed database. With it, we’re at €2,900 excluding VAT per month.
[Thu, Nov 12, 15:03] Élodie: Good news on my side: Nuagine accepts an amendment guaranteeing that all data, backups included, is stored in the EU. Condition: we must pick the Strasbourg region, because the Paris region replicates its backups to Montreal. The price stays at €1,850 excluding VAT per month.
[Fri, Nov 13, 10:20] Margaux: In that case, we’re going back to Nuagine, Strasbourg region, with the amendment Élodie obtained. Stratus is dropped. Rayan, you can restart the staging work, on Strasbourg this time.
[Fri, Nov 13, 10:31] Rayan: Restarting on Strasbourg and closing the Stratus trial account.
[Fri, Nov 13, 11:05] Chloé: I’m updating the architecture diagram in the project folder.
[Mon, Nov 16, 09:12] Thierry: I’ve read the Nuagine amendment: the reversibility clause works for me (full export in a standard format, at no cost). €1,850 × 12 = €22,200 a year: it’s indeed up to me to sign. I’ll sign this week.
[Wed, Nov 18, 17:45] Margaux: Contract and amendment signed by Thierry this morning. Go-live planned for Monday, December 7. Thanks everyone!`,
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

/** Date ISO (AAAA-MM-JJ) du n-ième jour de 2026 (1 = 1er janvier). */
function day2026(n: number) {
  return new Date(Date.UTC(2026, 0, n)).toISOString().slice(0, 10)
}

/**
 * 90 factures fournisseurs du premier semestre 2026, arrêtées au 30 juin 2026. Échéance = émission + 30 jours.
 * Hors aiguilles : payée si l’échéance est passée, impayée sinon (jamais d’échéance le 30 juin). Aiguilles :
 * 4 factures impayées en retard (Cléon Transports ×2, Ecotherm, Fibrolink) ; 3 factures en litige (Delta
 * Nettoyage ×2, Arvel Papeterie) pour 4 767,90 € ; leurre : une facture Bricoval payée dont la note parle
 * d’un litige clos.
 */
function syntheticInvoices(lang: CoreLang) {
  const rnd = seeded(5150)
  const suppliers = ['Arvel Papeterie', 'Bricoval', 'Cléon Transports', 'Delta Nettoyage', 'Ecotherm', 'Fibrolink']
  const centers: Record<CoreLang, string[]> = {
    fr: ['Logistique', 'Commercial', 'Production', 'Administration'],
    en: ['Logistics', 'Sales', 'Production', 'Administration'],
  }
  const asOf = 181 // 30 juin 2026
  const overdue: Record<number, string> = { 20: 'Cléon Transports', 33: 'Ecotherm', 41: 'Cléon Transports', 58: 'Fibrolink' }
  const disputed: Record<number, [string, number]> = { 12: ['Delta Nettoyage', 1840], 47: ['Delta Nettoyage', 2315.5], 66: ['Arvel Papeterie', 612.4] }
  const closedDispute: Record<CoreLang, string> = {
    fr: 'Litige du 12 mars clos : avoir reçu, solde réglé',
    en: 'Dispute of March 12 closed: credit note received, balance paid',
  }
  const invoices = Array.from({ length: 90 }, (_, i) => {
    const issued = 2 + 2 * i
    const due = issued + 30
    const invoice: Record<string, Json> = {
      id: `FAC-26-${String(101 + i).padStart(4, '0')}`,
      supplier: suppliers[Math.floor(rnd() * suppliers.length)],
      issued: day2026(issued),
      due: day2026(due),
      amount_eur: Math.round((80 + rnd() ** 2 * 2600) * 100) / 100,
      cost_center: centers[lang][Math.floor(rnd() * 4)],
      status: due < asOf ? 'paid' : 'unpaid',
    }
    if (overdue[i]) Object.assign(invoice, { supplier: overdue[i], status: 'unpaid' })
    if (disputed[i]) Object.assign(invoice, { supplier: disputed[i][0], amount_eur: disputed[i][1], status: 'disputed' })
    if (i === 30) Object.assign(invoice, { supplier: 'Bricoval', status: 'paid', note: closedDispute[lang] })
    return invoice
  })
  return { company: 'Maison Ferrandi', as_of: day2026(asOf), currency: 'EUR', invoices }
}

/**
 * 85 incidents de septembre 2026 sur dix serveurs. Hors aiguilles : gravité low/medium/high, durée de 5 à 120 min,
 * tous résolus, jamais sur srv-db-02 (absence). Aiguilles : 3 incidents critiques sur srv-web-02, tous résolus ;
 * 1 incident critique encore ouvert sur srv-app-01 ; la plus longue panne (418 min, gravité high) sur srv-cache-01.
 */
function syntheticIncidents(lang: CoreLang) {
  const rnd = seeded(9091)
  const servers = ['srv-web-01', 'srv-web-02', 'srv-web-03', 'srv-app-01', 'srv-app-02', 'srv-db-01', 'srv-db-03', 'srv-cache-01', 'srv-mail-01']
  const summaries: Record<CoreLang, string[]> = {
    fr: [
      'Utilisation CPU au-dessus de 90 % pendant plusieurs minutes',
      'Certificat TLS renouvelé en retard',
      'Latence réseau élevée vers la passerelle',
      'Redémarrage inattendu du service',
      'File d’attente des tâches saturée',
      'Espace disque faible sur la partition de journaux',
      'Échecs intermittents du contrôle de santé',
      'Synchronisation de l’horloge perdue',
    ],
    en: [
      'CPU usage above 90% for several minutes',
      'TLS certificate renewed late',
      'High network latency to the gateway',
      'Unexpected service restart',
      'Job queue saturated',
      'Low disk space on the log partition',
      'Intermittent health check failures',
      'Clock synchronization lost',
    ],
  }
  const critical: Record<CoreLang, string[]> = {
    fr: ['Erreurs 502 en cascade derrière le répartiteur de charge', 'Site indisponible après une mise à jour du noyau', 'Saturation des connexions, pages blanches pour les clients', 'Fuite mémoire : le processus applicatif est tué en boucle'],
    en: ['Cascading 502 errors behind the load balancer', 'Site down after a kernel update', 'Connection pool exhausted, blank pages for customers', 'Memory leak: the application process is killed repeatedly'],
  }
  const cacheOutage: Record<CoreLang, string> = { fr: 'Cluster de cache reconstruit après corruption des données', en: 'Cache cluster rebuilt after data corruption' }
  const severities = ['low', 'low', 'medium', 'medium', 'high']
  let t = 0
  return Array.from({ length: 85 }, (_, i) => {
    t += 180 + Math.floor(rnd() * 320)
    const d = 1 + Math.floor(t / 1440)
    const opened = `2026-09-${String(d).padStart(2, '0')}T${String(Math.floor((t % 1440) / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
    const incident: Record<string, Json> = {
      id: `INC-${5300 + i}`,
      opened,
      server: servers[Math.floor(rnd() * servers.length)],
      severity: severities[Math.floor(rnd() * severities.length)],
      summary: summaries[lang][Math.floor(rnd() * summaries[lang].length)],
      duration_min: 5 + Math.floor(rnd() * 116),
      status: 'resolved',
    }
    const crit = [14, 39, 61].indexOf(i)
    if (crit >= 0) Object.assign(incident, { server: 'srv-web-02', severity: 'critical', summary: critical[lang][crit], duration_min: [74, 112, 58][crit] })
    if (i === 77) Object.assign(incident, { server: 'srv-app-01', severity: 'critical', summary: critical[lang][3], duration_min: null, status: 'open' })
    if (i === 50) Object.assign(incident, { server: 'srv-cache-01', severity: 'high', summary: cacheOutage[lang], duration_min: 418 })
    return incident
  })
}

/**
 * 70 tickets de support. Deux agents homonymes : Julien Martin (Réseau) et Julien Martin (Facturation), jamais
 * tirés au hasard. Julien Martin (Réseau) : 6 tickets dont 4 résolus ; Julien Martin (Facturation) : 7 tickets dont
 * 5 résolus. Deux clientes homonymes : Claire Petit de Lyon (« Coupure de connexion », Sarah Benali, résolu) et
 * Claire Petit de Lille (« Facture en double », Julien Martin de la Facturation, ouvert). Seuls deux tickets sont
 * « urgent », tous deux à l’équipe Réseau.
 */
function syntheticTickets(lang: CoreLang) {
  const rnd = seeded(31337)
  const teams: Record<CoreLang, { network: string; billing: string; accounts: string }> = {
    fr: { network: 'Réseau', billing: 'Facturation', accounts: 'Comptes' },
    en: { network: 'Network', billing: 'Billing', accounts: 'Accounts' },
  }
  const T = teams[lang]
  const agents = [
    { name: 'Sarah Benali', team: T.network },
    { name: 'Hugo Lambert', team: T.billing },
    { name: 'Maëlle Roux', team: T.accounts },
    { name: 'Victor Leblanc', team: T.accounts },
  ]
  const requesters = [
    ['Alain Morin', 'Nantes'], ['Bérénice Caron', 'Lyon'], ['Cyril Dupont', 'Lille'], ['Delphine Royer', 'Rennes'],
    ['Éric Vidal', 'Toulouse'], ['Fanny Mercier', 'Lyon'], ['Gaël Henry', 'Brest'], ['Hélène Picard', 'Lille'],
    ['Ibrahim Diallo', 'Marseille'], ['Jeanne Colin', 'Dijon'], ['Kevin Masson', 'Nancy'], ['Laure Fabre', 'Montpellier'],
  ]
  const subjects: Record<CoreLang, string[]> = {
    fr: ['Débit internet lent', 'Changement d’adresse de facturation', 'Mot de passe oublié', 'Demande de duplicata de facture', 'Boîtier qui redémarre seul', 'Prélèvement rejeté', 'Ajout d’un utilisateur au compte', 'Wi-Fi instable à l’étage'],
    en: ['Slow internet speed', 'Billing address change', 'Forgotten password', 'Request for a copy of an invoice', 'Box restarts on its own', 'Direct debit rejected', 'Adding a user to the account', 'Unstable Wi-Fi upstairs'],
  }
  const special: Record<CoreLang, { outage: string; duplicate: string }> = {
    fr: { outage: 'Coupure de connexion', duplicate: 'Facture en double' },
    en: { outage: 'Connection outage', duplicate: 'Duplicate invoice' },
  }
  const priorities = ['low', 'normal', 'normal', 'high']
  const jmNetwork: Record<number, string> = { 5: 'resolved', 17: 'resolved', 29: 'open', 44: 'resolved', 52: 'open', 63: 'resolved' }
  const jmBilling: Record<number, string> = { 9: 'resolved', 22: 'resolved', 36: 'resolved', 40: 'open', 48: 'resolved', 57: 'open', 66: 'resolved' }
  return Array.from({ length: 70 }, (_, i) => {
    const [name, city] = requesters[Math.floor(rnd() * requesters.length)]
    const agent = agents[Math.floor(rnd() * agents.length)]
    const ticket: Record<string, Json> = {
      id: `TK-${4100 + i}`,
      opened: day2026(244 + Math.floor(i / 3)),
      requester: { name, city },
      subject: subjects[lang][Math.floor(rnd() * subjects[lang].length)],
      priority: priorities[Math.floor(rnd() * priorities.length)],
      assignee: { ...agent },
      status: rnd() < 0.7 ? 'resolved' : 'open',
    }
    if (jmNetwork[i]) Object.assign(ticket, { assignee: { name: 'Julien Martin', team: T.network }, status: jmNetwork[i] })
    if (jmBilling[i]) Object.assign(ticket, { assignee: { name: 'Julien Martin', team: T.billing }, status: jmBilling[i] })
    if (i === 24) Object.assign(ticket, { requester: { name: 'Claire Petit', city: 'Lyon' }, subject: special[lang].outage, assignee: { name: 'Sarah Benali', team: T.network }, status: 'resolved' })
    if (i === 40) Object.assign(ticket, { requester: { name: 'Claire Petit', city: 'Lille' }, subject: special[lang].duplicate })
    if (i === 31 || i === 52) ticket.priority = 'urgent'
    if (i === 31) Object.assign(ticket, { assignee: { name: 'Sarah Benali', team: T.network } })
    return ticket
  })
}

/**
 * Journal git de 95 commits, du plus récent au plus ancien. Événements (index chronologiques, 0 = le plus ancien) :
 * 8 délai HTTP 30 → 45 s (Mehdi) ; 15 SSO (Anaïs) ; 22 revert du 45 s (Tom) ; 34 export XLSX (Lucie) ; 41 revert du
 * SSO (Mehdi) ; 55 délai HTTP 30 → 60 s (Inès) ; 63 reapply du SSO (Tom) ; 72 revert de l’export XLSX (Lucie) ;
 * 80 leurre : documentation du délai de 90 s du proxy. Au final : 60 s, SSO présent, XLSX absent, 3 reverts.
 */
function syntheticGitLog(lang: CoreLang) {
  const rnd = seeded(777)
  const authors = ['Lucie Faure', 'Mehdi Saïdi', 'Anaïs Perret', 'Tom Girard', 'Inès Koné']
  const noise: Record<CoreLang, [string, string][]> = {
    fr: [
      ['fix(ui) : aligne les boutons de la fenêtre des paramètres', 'src/ui/settings.tsx'],
      ['chore : met à jour les dépendances de développement', 'package.json'],
      ['test(api) : couvre la pagination des factures', 'test/api/invoices.test.ts'],
      ['refactor(db) : extrait les requêtes de clients dans un module', 'src/db/customers.ts'],
      ['fix(pdf) : corrige les sauts de page des longs tableaux', 'src/pdf/table.ts'],
      ['docs : précise l’installation locale', 'README.md'],
      ['style : reformate les fichiers du dossier api', 'src/api/index.ts'],
      ['perf(search) : met en cache les suggestions fréquentes', 'src/search/suggest.ts'],
      ['fix(i18n) : traduit les messages d’erreur manquants', 'src/i18n/fr.json'],
      ['ci : met en cache les modules entre deux exécutions', '.github/workflows/ci.yml'],
      ['feat(ui) : affiche le nombre de factures en attente', 'src/ui/dashboard.tsx'],
      ['fix(api) : renvoie 404 pour une facture supprimée', 'src/api/invoices.ts'],
    ],
    en: [
      ['fix(ui): align the buttons in the settings dialog', 'src/ui/settings.tsx'],
      ['chore: update dev dependencies', 'package.json'],
      ['test(api): cover invoice pagination', 'test/api/invoices.test.ts'],
      ['refactor(db): move customer queries into a module', 'src/db/customers.ts'],
      ['fix(pdf): fix page breaks in long tables', 'src/pdf/table.ts'],
      ['docs: clarify local setup', 'README.md'],
      ['style: reformat files in the api folder', 'src/api/index.ts'],
      ['perf(search): cache frequent suggestions', 'src/search/suggest.ts'],
      ['fix(i18n): translate missing error messages', 'src/i18n/en.json'],
      ['ci: cache modules between runs', '.github/workflows/ci.yml'],
      ['feat(ui): show the number of pending invoices', 'src/ui/dashboard.tsx'],
      ['fix(api): return 404 for a deleted invoice', 'src/api/invoices.ts'],
    ],
  }
  const m: Record<CoreLang, Record<string, string>> = {
    fr: {
      t45: 'config : passe le délai d’expiration HTTP de 30 s à 45 s',
      sso: 'feat(auth) : ajoute la connexion SSO',
      xlsx: 'feat(export) : ajoute l’export XLSX des factures',
      t60: 'config : passe le délai d’expiration HTTP de 30 s à 60 s',
      proxy: 'docs : documente le délai de 90 s du proxy inverse',
      rev: 'Revert « %s »',
      reapply: 'Reapply « %s »',
      why41: 'Casse la connexion des comptes invités.',
      why63: 'Version corrigée : les comptes invités se connectent de nouveau.',
      why72: 'Fichiers corrompus au-delà de 10 000 lignes ; à reprendre plus tard.',
      why22: 'Délai trop long pour le répartiteur de charge.',
    },
    en: {
      t45: 'config: raise the HTTP timeout from 30 s to 45 s',
      sso: 'feat(auth): add SSO login',
      xlsx: 'feat(export): add XLSX export of invoices',
      t60: 'config: raise the HTTP timeout from 30 s to 60 s',
      proxy: 'docs: document the 90 s reverse proxy timeout',
      rev: 'Revert "%s"',
      reapply: 'Reapply "%s"',
      why41: 'Breaks guest account login.',
      why63: 'Fixed version: guest accounts can log in again.',
      why72: 'Files corrupted beyond 10,000 rows; to be redone later.',
      why22: 'Timeout too long for the load balancer.',
    },
  }
  const M = m[lang]
  const special: Record<number, [string, string, string, string?]> = {
    8: ['Mehdi Saïdi', M.t45, 'config/http.ts'],
    15: ['Anaïs Perret', M.sso, 'src/auth/sso.ts'],
    22: ['Tom Girard', M.rev.replace('%s', M.t45), 'config/http.ts', M.why22],
    34: ['Lucie Faure', M.xlsx, 'src/export/xlsx.ts'],
    41: ['Mehdi Saïdi', M.rev.replace('%s', M.sso), 'src/auth/sso.ts', M.why41],
    55: ['Inès Koné', M.t60, 'config/http.ts'],
    63: ['Tom Girard', M.reapply.replace('%s', M.sso), 'src/auth/sso.ts', M.why63],
    72: ['Lucie Faure', M.rev.replace('%s', M.xlsx), 'src/export/xlsx.ts', M.why72],
    80: ['Anaïs Perret', M.proxy, 'docs/deploy.md'],
  }
  const commits: string[] = []
  let t = 0
  for (let i = 0; i < 95; i++) {
    t += 120 + Math.floor(rnd() * 900)
    const hash = Math.floor(rnd() * 0xfffffff).toString(16).padStart(7, '0')
    let author = authors[Math.floor(rnd() * authors.length)]
    let [msg, file] = noise[lang][Math.floor(rnd() * noise[lang].length)]
    const plus = 1 + Math.floor(rnd() * 60)
    const minus = Math.floor(rnd() * 30)
    let body: string | undefined
    if (special[i]) [author, msg, file, body] = special[i]
    const d = new Date(Date.UTC(2026, 4, 4) + t * 60000)
    const date = `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)}`
    commits.push([`commit ${hash}`, `Author: ${author}`, `Date:   ${date}`, '', `    ${msg}`, ...(body ? ['', `    ${body}`] : []), '', ` ${file} | +${plus} −${minus}`].join('\n'))
  }
  return commits.reverse().join('\n\n')
}

/**
 * Annuaire de 108 salariés répartis en 9 équipes (membre i → équipe i % 9, la responsable de l’équipe k est le
 * salarié k). Bureau : bâtiment de l’équipe, étage 1 à 4. Aiguilles : Léon Garnier (salarié 41, équipe 5) ; seule
 * arrivée le 2025-03-03 = salarié 56 (équipe 2), leurre arrivé le 2024-03-03 = salarié 70 (équipe 7) ; deux
 * membres de l’équipe Juridique (salariés 21 et 48) ont un bureau dans le bâtiment C ; trois bureaux au
 * rez-de-chaussée (étage 0), aucun dans l’équipe Paie.
 */
function syntheticDirectory(lang: CoreLang) {
  const rnd = seeded(60606)
  const teamNames: Record<CoreLang, string[]> = {
    fr: ['Comptabilité', 'Paie', 'Achats', 'Juridique', 'Contrôle de gestion', 'Logistique', 'Informatique', 'Communication', 'Qualité'],
    en: ['Accounting', 'Payroll', 'Purchasing', 'Legal', 'Financial control', 'Logistics', 'IT', 'Communications', 'Quality'],
  }
  const buildings = ['A', 'A', 'B', 'B', 'A', 'D', 'C', 'B', 'D']
  const first = ['Agathe', 'Basile', 'Céline', 'Damien', 'Elsa', 'Florent', 'Gisèle', 'Hector', 'Iris', 'Jules', 'Katia', 'Lucas', 'Manon', 'Noé', 'Olga', 'Pierre', 'Romy', 'Simon', 'Tess', 'Ugo']
  const last = ['Arnaud', 'Besson', 'Chevalier', 'Delorme', 'Esnault', 'Fournier', 'Gauthier', 'Huet', 'Jacob', 'Leroy', 'Marchand', 'Navarro', 'Olivier', 'Poulain', 'Renard', 'Sanchez', 'Tessier', 'Vasseur']
  const titles: Record<CoreLang, string[]> = {
    fr: ['Chargé·e de mission', 'Analyste', 'Assistant·e', 'Gestionnaire', 'Technicien·ne', 'Coordinateur·rice'],
    en: ['Project officer', 'Analyst', 'Assistant', 'Administrator', 'Technician', 'Coordinator'],
  }
  const lead: Record<CoreLang, string> = { fr: 'Responsable d’équipe', en: 'Team lead' }
  const used = new Set<string>()
  const usedExt = new Set<number>()
  const employees = Array.from({ length: 108 }, (_, i) => {
    let name = ''
    do name = `${first[Math.floor(rnd() * first.length)]} ${last[Math.floor(rnd() * last.length)]}`
    while (used.has(name))
    used.add(name)
    let ext = 0
    do ext = 2000 + Math.floor(rnd() * 800)
    while (usedExt.has(ext))
    usedExt.add(ext)
    const team = i % 9
    const floor = 1 + Math.floor(rnd() * 4)
    const room = 10 + Math.floor(rnd() * 40)
    const y = 2015 + Math.floor(rnd() * 11)
    let start = `${y}-${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}-${String(1 + Math.floor(rnd() * 28)).padStart(2, '0')}`
    if (start.endsWith('-03-03')) start = `${y}-03-04`
    const titleIdx = Math.floor(rnd() * titles[lang].length)
    const e: Record<string, Json> = {
      name,
      team: teamNames[lang][team],
      title: i < 9 ? lead[lang] : titles[lang][titleIdx],
      office: `${buildings[team]}-${floor}${room}`,
      ext,
      start_date: start,
    }
    return e
  })
  employees[41].name = 'Léon Garnier'
  employees[56].start_date = '2025-03-03'
  employees[70].start_date = '2024-03-03'
  employees[21].office = 'C-214'
  employees[48].office = 'C-231'
  employees[13].office = 'A-012'
  employees[33].office = 'C-005'
  employees[77].office = 'D-018'
  const notices: Record<CoreLang, string[]> = {
    fr: [
      'Badge d’accès retrouvé le 2 octobre 2026 dans la salle de pause du bâtiment B. D’après le service sécurité, il appartient à la personne entrée dans l’entreprise le 3 mars 2025 ; merci de prévenir sa ou son responsable d’équipe.',
      'Travaux sur l’ascenseur du bâtiment D du 5 au 9 octobre 2026 : merci d’emprunter l’escalier.',
    ],
    en: [
      'Access badge found on October 2, 2026 in the break room of building B. According to the security team, it belongs to the person who joined the company on March 3, 2025; please let their team lead know.',
      'Elevator works in building D from October 5 to 9, 2026: please use the stairs.',
    ],
  }
  const teams = teamNames[lang].map((n, k) => ({ name: n, building: buildings[k], lead: employees[k].name }))
  return { notices: notices[lang], teams, employees }
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
  {
    id: 'doc-contract-amendment',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'long',
    // Article 8 : les annexes signées priment, la plus récente l’emporte ; le projet d’annexe C n’est pas signé, donc
    // sans effet (préavis 3 mois, forfait 2 400 €, révision seulement à la date anniversaire, le 1er avril 2027).
    // Pénalité de septembre : incident de Romans déclaré lundi 8 h, intervention mardi 14 h = 10 h + 6 h = 16 heures
    // ouvrées ; délai de l’annexe B = 4 h, donc 12 h de retard × 1 % × 2 400 € = 288 €, sous le plafond de 15 % (360 €).
    // Leurres : 192 € (délai de 8 h du contrat initial), 240 € (ancien plafond de 10 %), 384 € (16 h sans déduire le
    // délai). L’incident du 8 septembre (2 h) est dans les temps. Die est à 65 km (> 50) ; Crest est retiré au 1er juillet.
    expected: { september_penalty: 'eur_288', die_travel_billed: true, crest_covered: false, notice_period: 'm3', october_fee: 'eur_2400' },
    fr: {
      name: 'Contrat et avenants (annexe qui prime)',
      description: 'Contrat de maintenance modifié par un avenant signé et par un projet d’avenant non signé.',
      state: MAINTENANCE_CONTRACT.fr,
      questions: {
        september_penalty: {
          type: 'choice',
          instructions: 'Quel montant total de pénalités le Prestataire doit-il au titre des incidents de septembre 2026 ?',
          criteria: { eur_0: '0 €', eur_192: '192 €', eur_240: '240 €', eur_288: '288 €', eur_384: '384 €' },
        },
        die_travel_billed: { type: 'noul', instructions: 'Les frais de déplacement vers le magasin de Die sont-ils facturés au Client en plus du forfait ?' },
        crest_covered: { type: 'noul', instructions: 'Le magasin de Crest est-il couvert par le contrat en septembre 2026 ?' },
        notice_period: {
          type: 'choice',
          instructions: 'Quel préavis le Client doit-il respecter pour s’opposer au renouvellement du contrat ?',
          criteria: { m1: '1 mois', m2: '2 mois', m3: '3 mois', m6: '6 mois' },
        },
        october_fee: {
          type: 'choice',
          instructions: 'Quel forfait mensuel s’applique en octobre 2026 ?',
          criteria: { eur_2400: '2 400 € HT', eur_2472: '2 472 € HT', eur_2650: '2 650 € HT' },
        },
      },
    },
    en: {
      name: 'Contract and amendments (appendix prevails)',
      description: 'Maintenance contract changed by a signed amendment and by an unsigned draft amendment.',
      state: MAINTENANCE_CONTRACT.en,
      questions: {
        september_penalty: {
          type: 'choice',
          instructions: 'What total amount of penalties does the Provider owe for the September 2026 incidents?',
          criteria: { eur_0: '€0', eur_192: '€192', eur_240: '€240', eur_288: '€288', eur_384: '€384' },
        },
        die_travel_billed: { type: 'noul', instructions: 'Are travel expenses to the Die store invoiced to the Customer on top of the fee?' },
        crest_covered: { type: 'noul', instructions: 'Is the Crest store covered by the contract in September 2026?' },
        notice_period: {
          type: 'choice',
          instructions: 'How much notice must the Customer give to opt out of the contract renewal?',
          criteria: { m1: '1 month', m2: '2 months', m3: '3 months', m6: '6 months' },
        },
        october_fee: {
          type: 'choice',
          instructions: 'What monthly fee applies in October 2026?',
          criteria: { eur_2400: '€2,400 excluding VAT', eur_2472: '€2,472 excluding VAT', eur_2650: '€2,650 excluding VAT' },
        },
      },
    },
  },
  {
    id: 'doc-general-meeting-quorum',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'long',
    // Ouverture : 24 présents + 8 pouvoirs valables (Mme Roche est limitée à 2, son 3e pouvoir est nul) = 32 voix ≥ 30.
    // Résolution 2 : 14 pour, 13 contre (abstentions non comptées) → adoptée. Résolution 3 (statuts) : 19 sur 29
    // exprimés < 2/3 (19,33) → rejetée malgré la majorité. Après les départs : 19 présents + 6 pouvoirs = 25 < 30,
    // quorum perdu → l’élection du trésorier n’est pas valable. Résolutions valablement adoptées : 1 et 2.
    expected: { votes_at_opening: 'v32', res2_adopted: true, res3_adopted: false, treasurer_valid: false, adopted_count: 2 },
    fr: {
      name: 'Procès-verbal d’assemblée (quorum et majorités)',
      description: 'Pouvoirs plafonnés, majorité des deux tiers et quorum perdu en cours de séance.',
      state: GENERAL_MEETING.fr,
      questions: {
        votes_at_opening: {
          type: 'choice',
          instructions: 'De combien de voix (membres présents et pouvoirs valables) l’assemblée dispose-t-elle à l’ouverture ?',
          criteria: { v24: '24', v30: '30', v32: '32', v33: '33' },
        },
        res2_adopted: { type: 'noul', instructions: 'La résolution 2 (hausse de la cotisation) est-elle adoptée ?' },
        res3_adopted: { type: 'noul', instructions: 'La résolution 3 (modification des statuts) est-elle adoptée ?' },
        treasurer_valid: { type: 'noul', instructions: 'L’élection de Mme Garcin au poste de trésorière est-elle valable au regard des statuts ?' },
        adopted_count: {
          type: 'score',
          instructions: 'Combien de résolutions ont été valablement adoptées lors de cette assemblée ?',
          criteria: ['Aucune', 'Une', 'Deux', 'Trois', 'Quatre'],
        },
      },
    },
    en: {
      name: 'General meeting minutes (quorum and majorities)',
      description: 'Capped proxies, a two-thirds majority and a quorum lost during the meeting.',
      state: GENERAL_MEETING.en,
      questions: {
        votes_at_opening: {
          type: 'choice',
          instructions: 'How many votes (members present and valid proxies) does the meeting have at the opening?',
          criteria: { v24: '24', v30: '30', v32: '32', v33: '33' },
        },
        res2_adopted: { type: 'noul', instructions: 'Is resolution 2 (dues increase) adopted?' },
        res3_adopted: { type: 'noul', instructions: 'Is resolution 3 (amendment to the bylaws) adopted?' },
        treasurer_valid: { type: 'noul', instructions: 'Is the election of Ms. Garcin as treasurer valid under the bylaws?' },
        adopted_count: {
          type: 'score',
          instructions: 'How many resolutions were validly adopted at this meeting?',
          criteria: ['None', 'One', 'Two', 'Three', 'Four'],
        },
      },
    },
  },
  {
    id: 'doc-policy-versions',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // La date du déplacement choisit la version : août → v1, octobre et novembre → v2. Août : plafond Paris 150 €
    // (l’hôtel à 160 € le dépasse), taxi après 21 h sans accord remboursable en v1. Strasbourg (v2) : 1re classe
    // seulement au-delà de 4 h, or le trajet dure 3 h 40 (en v1, il aurait été remboursable) ; fin le 16 octobre +
    // 45 jours = 30 novembre (30 jours de la v1 → 15 novembre). Novembre : 165 € ≤ 170 € (plafond Paris de la v2).
    expected: { august_hotel_cap: 'eur_150', august_taxi_ok: true, strasbourg_first_class_ok: false, november_hotel_ok: true, strasbourg_deadline: 'nov_30' },
    fr: {
      name: 'Deux versions d’une politique de frais',
      description: 'Notes de frais à contrôler contre la version de la politique en vigueur à la date du déplacement.',
      state: TRAVEL_POLICY.fr,
      questions: {
        august_hotel_cap: {
          type: 'choice',
          instructions: 'Quel plafond d’hôtel par nuit s’applique au déplacement n° 1 (Paris, août 2026) ?',
          criteria: { eur_110: '110 €', eur_150: '150 €', eur_170: '170 €' },
        },
        august_taxi_ok: { type: 'noul', instructions: 'Le taxi du 25 août 2026 est-il remboursable ?' },
        strasbourg_first_class_ok: { type: 'noul', instructions: 'Le billet de train en 1re classe du déplacement n° 2 (Strasbourg) est-il remboursable ?' },
        november_hotel_ok: { type: 'noul', instructions: 'L’hôtel du déplacement n° 3 (Paris, novembre 2026) respecte-t-il le plafond applicable ?' },
        strasbourg_deadline: {
          type: 'choice',
          instructions: 'Jusqu’à quelle date Mme Vignal peut-elle transmettre la note de frais du déplacement n° 2 ?',
          criteria: { nov_15: '15 novembre 2026', nov_30: '30 novembre 2026', dec_15: '15 décembre 2026' },
        },
      },
    },
    en: {
      name: 'Two versions of an expense policy',
      description: 'Expense reports to check against the policy version in force on the date of the trip.',
      state: TRAVEL_POLICY.en,
      questions: {
        august_hotel_cap: {
          type: 'choice',
          instructions: 'What hotel cap per night applies to trip no. 1 (Paris, August 2026)?',
          criteria: { eur_110: '€110', eur_150: '€150', eur_170: '€170' },
        },
        august_taxi_ok: { type: 'noul', instructions: 'Is the taxi of August 25, 2026 reimbursable?' },
        strasbourg_first_class_ok: { type: 'noul', instructions: 'Is the first-class train ticket for trip no. 2 (Strasbourg) reimbursable?' },
        november_hotel_ok: { type: 'noul', instructions: 'Is the hotel for trip no. 3 (Paris, November 2026) within the applicable cap?' },
        strasbourg_deadline: {
          type: 'choice',
          instructions: 'By what date can Ms. Vignal submit the expense report for trip no. 2?',
          criteria: { nov_15: 'November 15, 2026', nov_30: 'November 30, 2026', dec_15: 'December 15, 2026' },
        },
      },
    },
  },
  {
    id: 'doc-audit-summary-mismatch',
    category: 'Comprehension',
    complexity: 'complexe',
    length: 'long',
    // Le résumé de tête est faux sur trois points : moyenne (96 + 94 + 78 + 92) / 4 = 90 % et non 92 %, sans progression
    // (90 % au trimestre précédent) ; non-conformité majeure ouverte à Metz ; audits de suivi pour Metz (majeure ouverte)
    // et Reims (78 % < 80 %), soit 2. Reims, le plus mauvais taux, n’a que des non-conformités mineures. Amiens : 92 % et
    // sa majeure du trimestre précédent est levée, donc certification maintenue.
    expected: { summary_accurate: false, major_nc_site: 'metz', average_rate: 'p90', follow_up_count: 2, amiens_certified: true },
    fr: {
      name: 'Rapport d’audit (résumé contredit par le détail)',
      description: 'Le résumé pour la direction ne correspond pas aux résultats détaillés par centre.',
      state: AUDIT_REPORT.fr,
      questions: {
        summary_accurate: { type: 'noul', instructions: 'Le résumé pour la direction est-il fidèle aux résultats détaillés du rapport ?' },
        major_nc_site: {
          type: 'choice',
          instructions: 'Quel centre présente une non-conformité majeure ouverte à la clôture de son audit du 2e trimestre ?',
          criteria: { lille: 'Lille', metz: 'Metz', reims: 'Reims', amiens: 'Amiens', none: 'Aucun' },
        },
        average_rate: {
          type: 'choice',
          instructions: 'D’après les résultats détaillés, quel est le taux de conformité moyen des quatre centres ce trimestre ?',
          criteria: { p86: '86 %', p88: '88 %', p90: '90 %', p92: '92 %' },
        },
        follow_up_count: {
          type: 'score',
          instructions: 'D’après les règles de décision, combien de centres doivent faire l’objet d’un audit de suivi ?',
          criteria: ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre'],
        },
        amiens_certified: { type: 'noul', instructions: 'D’après les règles de décision, la certification du centre d’Amiens est-elle maintenue ?' },
      },
    },
    en: {
      name: 'Audit report (summary contradicted by the details)',
      description: 'The executive summary does not match the detailed results per center.',
      state: AUDIT_REPORT.en,
      questions: {
        summary_accurate: { type: 'noul', instructions: 'Is the executive summary faithful to the detailed results of the report?' },
        major_nc_site: {
          type: 'choice',
          instructions: 'Which center has a major nonconformity open when its Q2 audit closed?',
          criteria: { lille: 'Lille', metz: 'Metz', reims: 'Reims', amiens: 'Amiens', none: 'None' },
        },
        average_rate: {
          type: 'choice',
          instructions: 'According to the detailed results, what is the average compliance rate of the four centers this quarter?',
          criteria: { p86: '86%', p88: '88%', p90: '90%', p92: '92%' },
        },
        follow_up_count: {
          type: 'score',
          instructions: 'Under the decision rules, how many centers must have a follow-up audit?',
          criteria: ['None', 'One', 'Two', 'Three', 'Four'],
        },
        amiens_certified: { type: 'noul', instructions: 'Under the decision rules, is the Amiens center’s certification maintained?' },
      },
    },
  },
  {
    id: 'doc-meeting-reassignment',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Cahier de recette : Nicolas D. (5 oct.) → Inès (12 oct., échéance 27 oct.) → « Nicolas (DSI) », c’est-à-dire
    // Nicolas Duval (19 oct., échéance 3 nov.). Le report de la bascule au 12 janvier est refusé par le comité de
    // pilotage : 1er décembre maintenu. Nicolas Ferrand : A2 close, A5 ouverte → 1 action ouverte (Nicolas Duval en a 2 :
    // A1 et A6).
    expected: { test_plan_owner: 'nicolas_d', test_plan_deadline: 'nov_3', switchover_kept: true, ferrand_open_actions: 1 },
    fr: {
      name: 'Comptes rendus successifs (action réattribuée)',
      description: 'Trois réunions : une action change deux fois de responsable, avec deux Nicolas dans l’équipe.',
      state: PROJECT_MEETINGS.fr,
      questions: {
        test_plan_owner: {
          type: 'choice',
          instructions: 'À l’issue de la réunion du 19 octobre, qui est responsable du cahier de recette ?',
          criteria: { nicolas_d: 'Nicolas Duval', nicolas_f: 'Nicolas Ferrand', ines: 'Inès Brahimi', agnes: 'Agnès Morel' },
        },
        test_plan_deadline: {
          type: 'choice',
          instructions: 'Quelle est l’échéance en vigueur du cahier de recette ?',
          criteria: { oct_20: '20 octobre 2026', oct_27: '27 octobre 2026', nov_3: '3 novembre 2026', nov_6: '6 novembre 2026' },
        },
        switchover_kept: { type: 'noul', instructions: 'La bascule sur le nouvel ERP est-elle toujours prévue le 1er décembre 2026 ?' },
        ferrand_open_actions: {
          type: 'score',
          instructions: 'À l’issue de la réunion du 19 octobre, combien d’actions ouvertes Nicolas Ferrand a-t-il à sa charge ?',
          criteria: ['Aucune', 'Une', 'Deux', 'Trois ou plus'],
        },
      },
    },
    en: {
      name: 'Successive minutes (reassigned action item)',
      description: 'Three meetings: an action item changes owner twice, with two Nicolases on the team.',
      state: PROJECT_MEETINGS.en,
      questions: {
        test_plan_owner: {
          type: 'choice',
          instructions: 'After the October 19 meeting, who owns the acceptance test plan?',
          criteria: { nicolas_d: 'Nicolas Duval', nicolas_f: 'Nicolas Ferrand', ines: 'Inès Brahimi', agnes: 'Agnès Morel' },
        },
        test_plan_deadline: {
          type: 'choice',
          instructions: 'What is the current deadline for the acceptance test plan?',
          criteria: { oct_20: 'October 20, 2026', oct_27: 'October 27, 2026', nov_3: 'November 3, 2026', nov_6: 'November 6, 2026' },
        },
        switchover_kept: { type: 'noul', instructions: 'Is the switchover to the new ERP still planned for December 1, 2026?' },
        ferrand_open_actions: {
          type: 'score',
          instructions: 'After the October 19 meeting, how many open action items does Nicolas Ferrand own?',
          criteria: ['None', 'One', 'Two', 'Three or more'],
        },
      },
    },
  },
  {
    id: 'doc-hosting-decision',
    category: 'Extraction',
    complexity: 'complexe',
    length: 'long',
    // Nuagine Paris (décidé le 4 nov.) → abandonné (sauvegardes hors UE) → Stratus Francfort (9 nov.) → abandonné
    // (2 900 € avec la base gérée) → retour à Nuagine, région Strasbourg, avec l’avenant UE (13 nov.), à 1 850 € par
    // mois. 1 850 × 12 = 22 200 € > 20 000 € de délégation de Margaux : c’est Thierry qui signe.
    expected: { final_provider: 'nuagine', region: 'strasbourg', monthly_cost: 'eur_1850', backups_in_eu: true, cto_could_sign: false },
    fr: {
      name: 'Fil de discussion (décision annulée puis rétablie)',
      description: 'Choix d’un hébergeur : décidé, abandonné, remplacé, puis rétabli sous condition.',
      state: HOSTING_CHAT.fr,
      questions: {
        final_provider: {
          type: 'choice',
          instructions: 'Quel hébergeur a finalement été retenu pour le portail ?',
          criteria: { stratus: 'Stratus', in_house: 'Un hébergement interne', nuagine: 'Nuagine', undecided: 'Aucune décision définitive n’a été prise' },
        },
        region: {
          type: 'choice',
          instructions: 'Dans quelle région le portail sera-t-il hébergé ?',
          criteria: { strasbourg: 'Strasbourg', paris: 'Paris', frankfurt: 'Francfort', montreal: 'Montréal' },
        },
        monthly_cost: {
          type: 'choice',
          instructions: 'Quel est le coût mensuel de l’hébergement retenu ?',
          criteria: { eur_1850: '1 850 € HT', eur_2100: '2 100 € HT', eur_2900: '2 900 € HT' },
        },
        backups_in_eu: { type: 'noul', instructions: 'Avec la solution retenue, les sauvegardes du portail restent-elles dans l’Union européenne ?' },
        cto_could_sign: { type: 'noul', instructions: 'Margaux Deschamps aurait-elle pu signer seule le contrat finalement retenu ?' },
      },
    },
    en: {
      name: 'Discussion thread (decision reversed, then restored)',
      description: 'Choosing a hosting provider: decided, dropped, replaced, then restored under a condition.',
      state: HOSTING_CHAT.en,
      questions: {
        final_provider: {
          type: 'choice',
          instructions: 'Which hosting provider was finally chosen for the portal?',
          criteria: { stratus: 'Stratus', in_house: 'In-house hosting', nuagine: 'Nuagine', undecided: 'No final decision has been made' },
        },
        region: {
          type: 'choice',
          instructions: 'In which region will the portal be hosted?',
          criteria: { strasbourg: 'Strasbourg', paris: 'Paris', frankfurt: 'Frankfurt', montreal: 'Montreal' },
        },
        monthly_cost: {
          type: 'choice',
          instructions: 'What is the monthly cost of the chosen hosting?',
          criteria: { eur_1850: '€1,850 excluding VAT', eur_2100: '€2,100 excluding VAT', eur_2900: '€2,900 excluding VAT' },
        },
        backups_in_eu: { type: 'noul', instructions: 'With the chosen solution, do the portal’s backups stay in the European Union?' },
        cto_could_sign: { type: 'noul', instructions: 'Could Margaux Deschamps have signed the contract finally chosen on her own?' },
      },
    },
  },
  {
    id: 'doc-invoices-aggregate',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'très long',
    // syntheticInvoices : 19 factures `unpaid`, dont seulement 4 en retard au 30 juin (échéance dépassée) : Cléon
    // Transports ×2, Ecotherm ×1, Fibrolink ×1 — Ecotherm a pourtant le plus de factures impayées au total (5).
    // Litiges : 1 840 + 2 315,50 + 612,40 = 4 767,90 €. Bricoval : aucune facture `disputed` (seulement une note de
    // litige clos sur une facture payée).
    expected: { overdue_count: 2, overdue_top_supplier: 'cleon', disputed_total: 'from_4000_to_6000', bricoval_disputed: false },
    fr: {
      name: 'Factures fournisseurs (agrégation sous condition)',
      description: '90 factures en JSON : compter et additionner selon le statut et l’échéance.',
      state: syntheticInvoices('fr'),
      questions: {
        overdue_count: {
          type: 'score',
          instructions: 'Au 30 juin 2026 (`as_of`), combien de factures sont impayées (`unpaid`) alors que leur échéance (`due`) est dépassée ?',
          criteria: ['Aucune', '1 ou 2', '3 ou 4', 'De 5 à 8', 'Plus de 8'],
        },
        overdue_top_supplier: {
          type: 'choice',
          instructions: 'Quel fournisseur compte le plus de factures impayées dont l’échéance est dépassée au 30 juin 2026 ?',
          criteria: { arvel: 'Arvel Papeterie', bricoval: 'Bricoval', cleon: 'Cléon Transports', ecotherm: 'Ecotherm', fibrolink: 'Fibrolink' },
        },
        disputed_total: {
          type: 'choice',
          instructions: 'Quel est le montant total des factures au statut `disputed` ?',
          criteria: { under_2000: 'Moins de 2 000 €', from_2000_to_4000: 'De 2 000 à 4 000 €', from_4000_to_6000: 'De 4 000 à 6 000 €', over_6000: 'Plus de 6 000 €' },
        },
        bricoval_disputed: { type: 'noul', instructions: 'Une facture de Bricoval est-elle actuellement en litige (statut `disputed`) ?' },
      },
    },
    en: {
      name: 'Supplier invoices (conditional aggregation)',
      description: '90 invoices in JSON: count and add up by status and due date.',
      state: syntheticInvoices('en'),
      questions: {
        overdue_count: {
          type: 'score',
          instructions: 'As of June 30, 2026 (`as_of`), how many invoices are unpaid (`unpaid`) even though their due date (`due`) has passed?',
          criteria: ['None', '1 or 2', '3 or 4', '5 to 8', 'More than 8'],
        },
        overdue_top_supplier: {
          type: 'choice',
          instructions: 'Which supplier has the most unpaid invoices past their due date as of June 30, 2026?',
          criteria: { arvel: 'Arvel Papeterie', bricoval: 'Bricoval', cleon: 'Cléon Transports', ecotherm: 'Ecotherm', fibrolink: 'Fibrolink' },
        },
        disputed_total: {
          type: 'choice',
          instructions: 'What is the total amount of the invoices with status `disputed`?',
          criteria: { under_2000: 'Less than €2,000', from_2000_to_4000: '€2,000 to €4,000', from_4000_to_6000: '€4,000 to €6,000', over_6000: 'More than €6,000' },
        },
        bricoval_disputed: { type: 'noul', instructions: 'Is any Bricoval invoice currently in dispute (status `disputed`)?' },
      },
    },
  },
  {
    id: 'doc-server-incidents',
    category: 'Long context',
    complexity: 'complexe',
    length: 'très long',
    // syntheticIncidents : aucun incident sur srv-db-02 (srv-db-01 et srv-db-03 en ont) ; 4 incidents `critical`, dont 3
    // sur srv-web-02 (tous résolus) et 1 encore ouvert sur srv-app-01 ; la plus longue durée (418 min) est sur
    // srv-cache-01, en gravité `high` — le plus long incident critique (112 min) est sur srv-web-02.
    expected: { db02_incident: false, web02_critical_count: 3, open_critical_server: 'srv_app_01', longest_outage_server: 'srv_cache_01', web02_all_resolved: true },
    fr: {
      name: 'Incidents serveurs (contexte long)',
      description: '85 incidents en JSON : compter par serveur et par gravité, constater une absence.',
      state: { incidents: syntheticIncidents('fr') },
      questions: {
        db02_incident: { type: 'noul', instructions: 'Le serveur srv-db-02 a-t-il connu au moins un incident en septembre 2026 ?' },
        web02_critical_count: {
          type: 'score',
          instructions: 'Combien d’incidents de gravité `critical` concernent le serveur srv-web-02 ?',
          criteria: ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre ou plus'],
        },
        open_critical_server: {
          type: 'choice',
          instructions: 'Sur quel serveur un incident de gravité `critical` est-il encore ouvert ?',
          criteria: { srv_web_02: 'srv-web-02', srv_app_01: 'srv-app-01', srv_app_02: 'srv-app-02', srv_db_01: 'srv-db-01', none: 'Aucun' },
        },
        longest_outage_server: {
          type: 'choice',
          instructions: 'Quel serveur a connu l’incident le plus long (`duration_min`) ?',
          criteria: { srv_cache_01: 'srv-cache-01', srv_web_02: 'srv-web-02', srv_db_03: 'srv-db-03', srv_app_01: 'srv-app-01' },
        },
        web02_all_resolved: { type: 'noul', instructions: 'Tous les incidents de gravité `critical` du serveur srv-web-02 sont-ils résolus ?' },
      },
    },
    en: {
      name: 'Server incidents (long context)',
      description: '85 incidents in JSON: count by server and severity, notice an absence.',
      state: { incidents: syntheticIncidents('en') },
      questions: {
        db02_incident: { type: 'noul', instructions: 'Did server srv-db-02 have at least one incident in September 2026?' },
        web02_critical_count: {
          type: 'score',
          instructions: 'How many incidents with severity `critical` involve server srv-web-02?',
          criteria: ['None', 'One', 'Two', 'Three', 'Four or more'],
        },
        open_critical_server: {
          type: 'choice',
          instructions: 'On which server is an incident with severity `critical` still open?',
          criteria: { srv_web_02: 'srv-web-02', srv_app_01: 'srv-app-01', srv_app_02: 'srv-app-02', srv_db_01: 'srv-db-01', none: 'None' },
        },
        longest_outage_server: {
          type: 'choice',
          instructions: 'Which server had the longest incident (`duration_min`)?',
          criteria: { srv_cache_01: 'srv-cache-01', srv_web_02: 'srv-web-02', srv_db_03: 'srv-db-03', srv_app_01: 'srv-app-01' },
        },
        web02_all_resolved: { type: 'noul', instructions: 'Are all incidents with severity `critical` on server srv-web-02 resolved?' },
      },
    },
  },
  {
    id: 'doc-tickets-homonyms',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'très long',
    // syntheticTickets : deux agents « Julien Martin » — Réseau : 6 tickets dont 4 résolus ; Facturation : 7 tickets
    // dont 5 résolus (9 résolus en confondant les deux). Deux clientes « Claire Petit » : celle de Lille a le ticket
    // « Facture en double », traité par Julien Martin de la Facturation et encore ouvert ; celle de Lyon, « Coupure de
    // connexion », est résolu. Les deux seuls tickets `urgent` sont à l’équipe Réseau.
    expected: { jm_network_resolved: 2, petit_lille_subject: 'duplicate', petit_lille_team: 'billing', urgent_accounts: false, petit_lille_open: true },
    fr: {
      name: 'Tickets de support (homonymes)',
      description: '70 tickets en JSON avec deux agents et deux clientes homonymes à distinguer.',
      state: { tickets: syntheticTickets('fr') },
      questions: {
        jm_network_resolved: {
          type: 'score',
          instructions: 'Combien de tickets au statut `resolved` sont assignés à Julien Martin de l’équipe Réseau ?',
          criteria: ['Aucun', '1 ou 2', '3 ou 4', '5 ou 6', '7 ou plus'],
        },
        petit_lille_subject: {
          type: 'choice',
          instructions: 'Quel est l’objet du ticket ouvert par Claire Petit, cliente à Lille ?',
          criteria: { outage: 'Coupure de connexion', duplicate: 'Facture en double', password: 'Mot de passe oublié', address: 'Changement d’adresse de facturation' },
        },
        petit_lille_team: {
          type: 'choice',
          instructions: 'Quelle équipe traite le ticket de Claire Petit, cliente à Lille ?',
          criteria: { network: 'Réseau', billing: 'Facturation', accounts: 'Comptes' },
        },
        urgent_accounts: { type: 'noul', instructions: 'Un ticket de priorité `urgent` est-il assigné à l’équipe Comptes ?' },
        petit_lille_open: { type: 'noul', instructions: 'Le ticket de Claire Petit, cliente à Lille, est-il encore ouvert ?' },
      },
    },
    en: {
      name: 'Support tickets (namesakes)',
      description: '70 tickets in JSON with two agents and two customers sharing the same name.',
      state: { tickets: syntheticTickets('en') },
      questions: {
        jm_network_resolved: {
          type: 'score',
          instructions: 'How many tickets with status `resolved` are assigned to Julien Martin from the Network team?',
          criteria: ['None', '1 or 2', '3 or 4', '5 or 6', '7 or more'],
        },
        petit_lille_subject: {
          type: 'choice',
          instructions: 'What is the subject of the ticket opened by Claire Petit, the customer in Lille?',
          criteria: { outage: 'Connection outage', duplicate: 'Duplicate invoice', password: 'Forgotten password', address: 'Billing address change' },
        },
        petit_lille_team: {
          type: 'choice',
          instructions: 'Which team is handling the ticket of Claire Petit, the customer in Lille?',
          criteria: { network: 'Network', billing: 'Billing', accounts: 'Accounts' },
        },
        urgent_accounts: { type: 'noul', instructions: 'Is any ticket with priority `urgent` assigned to the Accounts team?' },
        petit_lille_open: { type: 'noul', instructions: 'Is the ticket of Claire Petit, the customer in Lille, still open?' },
      },
    },
  },
  {
    id: 'doc-git-log-reverts',
    category: 'Long context',
    complexity: 'complexe',
    length: 'très long',
    // syntheticGitLog (du plus récent au plus ancien) : délai HTTP 30 → 45 s, annulé par un revert, puis 30 → 60 s :
    // 60 s au final (les 90 s concernent le proxy inverse). SSO ajouté par Anaïs, annulé par Mehdi, réappliqué par
    // Tom : présent. Export XLSX ajouté puis annulé par Lucie : absent. Exactement 3 commits dont le message commence par
    // « Revert » (la question exclut explicitement le « Reapply », qui est techniquement un revert de revert).
    expected: { http_timeout: 's60', sso_present: true, xlsx_present: false, revert_count: 3, sso_reapplied_by: 'tom' },
    fr: {
      name: 'Journal git avec reverts (contexte long)',
      description: '95 commits : reconstituer l’état final malgré les annulations et les réapplications.',
      state: syntheticGitLog('fr'),
      questions: {
        http_timeout: {
          type: 'choice',
          instructions: 'Dans la version la plus récente, quel est le délai d’expiration HTTP défini dans config/http.ts ?',
          criteria: { s30: '30 secondes', s45: '45 secondes', s90: '90 secondes', s60: '60 secondes' },
        },
        sso_present: { type: 'noul', instructions: 'La connexion SSO est-elle présente dans la version la plus récente ?' },
        xlsx_present: { type: 'noul', instructions: 'L’export XLSX des factures est-il présent dans la version la plus récente ?' },
        revert_count: {
          type: 'score',
          instructions: 'Combien de commits du journal ont un message qui commence par « Revert » ? (Un commit « Reapply » ne compte pas.)',
          criteria: ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre ou plus'],
        },
        sso_reapplied_by: {
          type: 'choice',
          instructions: 'Qui a réintroduit la connexion SSO après son annulation ?',
          criteria: { anais: 'Anaïs Perret', mehdi: 'Mehdi Saïdi', lucie: 'Lucie Faure', ines: 'Inès Koné', tom: 'Tom Girard' },
        },
      },
    },
    en: {
      name: 'Git log with reverts (long context)',
      description: '95 commits: work out the final state despite reverts and reapplies.',
      state: syntheticGitLog('en'),
      questions: {
        http_timeout: {
          type: 'choice',
          instructions: 'In the latest version, what is the HTTP timeout set in config/http.ts?',
          criteria: { s30: '30 seconds', s45: '45 seconds', s90: '90 seconds', s60: '60 seconds' },
        },
        sso_present: { type: 'noul', instructions: 'Is SSO login present in the latest version?' },
        xlsx_present: { type: 'noul', instructions: 'Is the XLSX export of invoices present in the latest version?' },
        revert_count: {
          type: 'score',
          instructions: 'How many commits in the log have a message starting with “Revert”? (A “Reapply” commit does not count.)',
          criteria: ['None', 'One', 'Two', 'Three', 'Four or more'],
        },
        sso_reapplied_by: {
          type: 'choice',
          instructions: 'Who brought SSO login back after it was reverted?',
          criteria: { anais: 'Anaïs Perret', mehdi: 'Mehdi Saïdi', lucie: 'Lucie Faure', ines: 'Inès Koné', tom: 'Tom Girard' },
        },
      },
    },
  },
  {
    id: 'doc-directory-multihop',
    category: 'Structured data',
    complexity: 'complexe',
    length: 'très long',
    // syntheticDirectory : Léon Garnier est en Logistique, dont la responsable est Elsa Sanchez, poste 2448 (2113 = Léon,
    // 2301 = Elsa Arnaud, de la même équipe, 2318 = Elsa Besson). Badge : seule arrivée le 2025-03-03 = Elsa Besson,
    // Achats (Olga Arnaud, arrivée le 2024-03-03, est en Communication). Juridique (bâtiment B) : 2 bureaux en C
    // (C-214, C-231). Étage 0 : trois bureaux (Contrôle de gestion, Informatique, Logistique), aucun en Paie.
    expected: { lead_ext: 'e2448', badge_team: 'purchasing', legal_outside_building: 2, payroll_ground_floor: false },
    fr: {
      name: 'Annuaire interne (multi-sauts)',
      description: '108 salariés et 9 équipes en JSON : enchaîner plusieurs recherches pour répondre.',
      state: syntheticDirectory('fr'),
      questions: {
        lead_ext: {
          type: 'choice',
          instructions: 'Quel est le numéro de poste (`ext`) de la personne qui dirige l’équipe de Léon Garnier ?',
          criteria: { e2113: '2113', e2301: '2301', e2448: '2448', e2318: '2318' },
        },
        badge_team: {
          type: 'choice',
          instructions: 'À quelle équipe appartient la personne dont le badge a été retrouvé ?',
          criteria: { purchasing: 'Achats', communications: 'Communication', logistics: 'Logistique', legal: 'Juridique' },
        },
        legal_outside_building: {
          type: 'score',
          instructions: 'Combien de membres de l’équipe Juridique ont leur bureau dans un autre bâtiment que celui de leur équipe ? (La lettre du bureau indique le bâtiment.)',
          criteria: ['Aucun', 'Un', 'Deux', 'Trois ou plus'],
        },
        payroll_ground_floor: {
          type: 'noul',
          instructions: 'Un membre de l’équipe Paie a-t-il son bureau au rez-de-chaussée ? (Le premier chiffre du bureau indique l’étage, 0 pour le rez-de-chaussée.)',
        },
      },
    },
    en: {
      name: 'Staff directory (multi-hop)',
      description: '108 employees and 9 teams in JSON: chain several lookups to answer.',
      state: syntheticDirectory('en'),
      questions: {
        lead_ext: {
          type: 'choice',
          instructions: 'What is the extension number (`ext`) of the person who leads Léon Garnier’s team?',
          criteria: { e2113: '2113', e2301: '2301', e2448: '2448', e2318: '2318' },
        },
        badge_team: {
          type: 'choice',
          instructions: 'Which team does the person whose badge was found belong to?',
          criteria: { purchasing: 'Purchasing', communications: 'Communications', logistics: 'Logistics', legal: 'Legal' },
        },
        legal_outside_building: {
          type: 'score',
          instructions: 'How many members of the Legal team have their office in a different building from their team’s? (The office letter gives the building.)',
          criteria: ['None', 'One', 'Two', 'Three or more'],
        },
        payroll_ground_floor: {
          type: 'noul',
          instructions: 'Does any member of the Payroll team have an office on the ground floor? (The first digit of the office gives the floor, 0 for the ground floor.)',
        },
      },
    },
  },
]
