import type { BenchSuite } from '../../types'

// ─── Textes longs ────────────────────────────────────────────────────────────

const EMAIL_FR = `Objet : Re: Re: Livraison commande #48213 — toujours rien

Bonjour Madame Lefèvre,

Je me permets de revenir vers vous au sujet de notre commande #48213 passée le 2 septembre (12 postes de travail assis-debout, référence ERGO-140, et les caissons associés). Lors de notre échange téléphonique du 16 septembre, vous m'aviez confirmé une livraison au plus tard le 30 septembre. Nous sommes aujourd'hui le 8 octobre et nous n'avons reçu ni le matériel, ni la moindre information de suivi.

Je vous rappelle que ce mobilier est destiné à l'aménagement de notre nouvel open space, dont l'ouverture est fixée au lundi 20 octobre. Une quinzaine de collaborateurs doivent s'y installer ce jour-là, le déménagement est planifié, et le bail de nos anciens locaux se termine le 24 octobre. Sans les bureaux, nous devrons louer du mobilier temporaire à nos frais.

J'ai bien noté dans votre dernier message que le retard était lié à « un problème d'approvisionnement chez le fabricant ». Je comprends que ces situations arrivent, mais j'ai besoin d'éléments concrets :

1. une date de livraison ferme et engageante ;
2. la confirmation que les caissons seront livrés en même temps que les bureaux ;
3. à défaut d'une livraison avant le 17 octobre, les conditions d'une annulation sans frais et du remboursement de l'acompte de 4 860 € versé le 3 septembre.

Merci de me répondre par écrit avant ce vendredi 10 octobre, 17 h. Sans retour de votre part d'ici là, je me verrai contrainte de transmettre le dossier à notre service juridique et de solliciter un autre fournisseur.

Je reste joignable au 01 45 67 89 10 si un échange de vive voix permet d'avancer plus vite.

Cordialement,

Claire Dumont
Responsable des services généraux — Atelier Nord SAS`

const CONTRACT_EN = `MASTER SERVICES AGREEMENT — EXCERPT

This Master Services Agreement ("Agreement") is entered into as of January 15, 2025 ("Effective Date") by and between Northwind Analytics Ltd., a company incorporated under the laws of England and Wales ("Provider"), and Brightline Retail SAS, a company incorporated under the laws of France ("Customer").

1. SERVICES. Provider shall make available to Customer the hosted analytics platform described in Schedule A (the "Services"), together with the support services described in Schedule B. Provider may update the Services from time to time, provided that such updates do not materially reduce the functionality of the Services during the then-current Term.

2. FEES AND PAYMENT. Customer shall pay the fees set forth in each Order Form. Unless otherwise stated, fees are invoiced annually in advance and are payable within forty-five (45) days of the invoice date. Late payments shall bear interest at the rate of one percent (1%) per month or the maximum rate permitted by law, whichever is lower. Provider may increase fees upon renewal by giving written notice at least sixty (60) days prior to the end of the then-current Term; any such increase shall not exceed five percent (5%) per year.

3. TERM AND RENEWAL. This Agreement commences on the Effective Date and continues for an initial term of thirty-six (36) months (the "Initial Term"). Thereafter, this Agreement shall automatically renew for successive periods of twelve (12) months (each a "Renewal Term"), unless either party gives written notice of non-renewal at least ninety (90) days prior to the end of the then-current Term.

4. TERMINATION. Either party may terminate this Agreement for cause upon thirty (30) days' written notice if the other party materially breaches this Agreement and fails to cure such breach within such notice period. Customer may not terminate this Agreement for convenience during the Initial Term. Upon termination, Customer shall pay all fees accrued through the effective date of termination.

5. DATA PROTECTION. Each party shall comply with applicable data protection laws, including Regulation (EU) 2016/679 (GDPR). Provider shall process Customer Personal Data solely on documented instructions from Customer, as set out in the Data Processing Addendum attached as Schedule C. Provider shall notify Customer without undue delay, and in any event within seventy-two (72) hours, after becoming aware of a Personal Data Breach. Customer Personal Data shall be hosted exclusively within the European Economic Area.

6. CONFIDENTIALITY. Each party agrees to hold the other party's Confidential Information in strict confidence and not to disclose it to any third party, except to its employees and contractors who need to know such information and are bound by confidentiality obligations no less protective than those set out herein. These obligations shall survive for five (5) years following termination.

7. LIMITATION OF LIABILITY. Except for breaches of Section 6 (Confidentiality) and a party's indemnification obligations, neither party's aggregate liability arising out of or related to this Agreement shall exceed the total fees paid or payable by Customer in the twelve (12) months preceding the event giving rise to the claim. In no event shall either party be liable for any indirect, incidental, special or consequential damages, including loss of profits, revenue or data.

8. SERVICE LEVELS. Provider shall use commercially reasonable efforts to make the Services available 99.5% of the time in each calendar month, excluding scheduled maintenance. If availability falls below this commitment, Customer shall be entitled to the service credits described in Schedule B, which shall constitute Customer's sole and exclusive remedy for such failure.

9. GOVERNING LAW AND JURISDICTION. This Agreement shall be governed by and construed in accordance with the laws of England and Wales. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of London, England.

10. ASSIGNMENT. Neither party may assign this Agreement without the prior written consent of the other party, except in connection with a merger, acquisition or sale of all or substantially all of its assets, provided that the assignee agrees in writing to be bound by this Agreement.`

const MEETING_FR = `Transcription — Comité produit hebdomadaire, jeudi 2 octobre, 10 h 00 – 10 h 45
Participants : Sophie (directrice produit), Karim (lead technique), Inès (design), Marc (commercial), Julie (support)

Sophie : Bonjour à tous. Un seul vrai sujet aujourd'hui : est-ce qu'on lance la nouvelle facturation par usage le 1er novembre comme prévu, ou est-ce qu'on décale ? Karim, où en est-on côté technique ?

Karim : Le moteur de calcul est terminé et testé. Ce qui reste, c'est la migration des 340 clients existants vers le nouveau modèle de données. On a fait une répétition sur une copie de la production la semaine dernière : 12 comptes ont échoué, tous à cause d'anciens avoirs mal formatés. J'ai besoin d'une semaine pour corriger le script et refaire une répétition complète.

Marc : Côté commercial, trois gros prospects attendent cette offre. Deux d'entre eux ont conditionné leur signature à une facturation par usage avant la fin de l'année. Si on décale à janvier, je pense qu'on en perd au moins un.

Julie : Je veux juste rappeler qu'au support on n'a encore aucune documentation sur le nouveau modèle. Si on lance le 1er novembre sans FAQ ni macros, on va se faire déborder. Il me faut au minimum deux semaines avant le lancement pour former l'équipe.

Inès : Les écrans de la page de facturation sont prêts, il reste la page de simulation de coûts. Je peux la livrer pour le 17 octobre.

Sophie : D'accord. Si je résume : technique prêt le 10 octobre si la répétition passe, design le 17, et le support a besoin de deux semaines de préparation avant le lancement. Ça reste compatible avec le 1er novembre, à condition que Karim confirme la répétition d'ici le 10.

Karim : Ça me va, mais je ne veux pas lancer si la deuxième répétition a encore des échecs. On garde un point de décision le 10 octobre ?

Sophie : Oui. Décision : on maintient le lancement au 1er novembre, avec un point go / no-go le vendredi 10 octobre basé sur la deuxième répétition de migration. Karim est responsable de la répétition et du go / no-go technique. Julie, tu prépares la FAQ et les macros avec Inès, première version pour le 20 octobre.

Marc : Je peux annoncer la date aux prospects ?

Sophie : Pas avant le 10. Tu peux leur dire que c'est prévu pour novembre, sans date ferme.

Marc : Entendu, même si ça ne va pas les ravir.

Julie : Et le budget pour les heures supplémentaires du support pendant la première semaine ? J'avais demandé 3 000 €.

Sophie : Je n'ai pas encore la validation de la direction financière. Je reviens vers toi la semaine prochaine.

Sophie : Merci à tous, bonne fin de journée.`

/** Journal synthétique déterministe : 84 lignes (≈ 4 500 tokens) de bruit avec un incident mémoire noyé au milieu. */
function syntheticLogs(): string {
  const services = ['api-gateway', 'auth', 'orders', 'payments', 'catalog']
  const paths = ['/v2/orders', '/v2/cart', '/v2/products?page=3', '/v2/users/me', '/healthz', '/v2/checkout']
  const lines: string[] = []
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 84; i++) {
    const t = new Date(Date.UTC(2026, 9, 6, 14, 0, 0) + i * 2300).toISOString()
    const svc = services[Math.floor(rnd() * services.length)]
    if (i === 49) lines.push(`${t} WARN  orders pod=orders-7d9f heap_used=3.71GiB heap_limit=4.00GiB gc_pause_ms=1840`)
    else if (i === 53) lines.push(`${t} ERROR orders pod=orders-7d9f java.lang.OutOfMemoryError: Java heap space at com.shop.orders.ExportJob.buildCsv(ExportJob.java:212)`)
    else if (i === 54) lines.push(`${t} WARN  kubelet pod=orders-7d9f container orders terminated reason=OOMKilled exitCode=137 restartCount=3`)
    else if (i === 56) lines.push(`${t} ERROR api-gateway upstream=orders status=503 path=/v2/orders msg="no healthy upstream"`)
    else if (rnd() < 0.06) lines.push(`${t} WARN  ${svc} slow request path=${paths[Math.floor(rnd() * paths.length)]} duration_ms=${800 + Math.floor(rnd() * 600)}`)
    else lines.push(`${t} INFO  ${svc} request path=${paths[Math.floor(rnd() * paths.length)]} status=200 duration_ms=${12 + Math.floor(rnd() * 140)} disk_free=61%`)
  }
  return lines.join('\n')
}

/** Catalogue synthétique déterministe de 60 produits ; un seul produit audio est en rupture. */
function syntheticCatalog() {
  const cats = ['audio', 'video', 'informatique', 'maison', 'sport']
  const names: Record<string, string[]> = {
    audio: ['Casque', 'Enceinte', 'Écouteurs', 'Barre de son', 'Micro'],
    video: ['Téléviseur', 'Projecteur', 'Caméra', 'Écran'],
    informatique: ['Clavier', 'Souris', 'SSD', 'Routeur', 'Webcam'],
    maison: ['Aspirateur', 'Bouilloire', 'Lampe', 'Ventilateur'],
    sport: ['Tapis', 'Haltères', 'Gourde', 'Montre GPS'],
  }
  let seed = 11
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 60 }, (_, i) => {
    const category = cats[i % cats.length]
    const list = names[category]
    return {
      sku: `SKU-${String(1000 + i * 7)}`,
      name: `${list[Math.floor(rnd() * list.length)]} ${String.fromCharCode(65 + (i % 26))}${i}`,
      category,
      price_eur: Math.round(15 + rnd() * 600),
      stock: i === 38 ? 0 : 3 + Math.floor(rnd() * 80),
    }
  })
}

const PRODUCT_LISTING = `iPhone 13 — 128 Go — bleu. Occasion, très bon état : quelques micro-rayures sur la coque arrière, écran intact. Batterie à 89 %. Vendu avec boîte d'origine et câble USB-C vers Lightning, sans chargeur secteur. Débloqué tout opérateur. Prix : 430 €, livraison offerte en France. Remise en main propre possible à Lyon. Particulier, pas d'échange.`

// ─── Suite ───────────────────────────────────────────────────────────────────

export const suite: BenchSuite = {
  id: 'mixed',
  name: 'Mixte',
  description: 'Suite d’origine : 8 cas en français, 12 en anglais, 1 en allemand, 1 en espagnol et 1 de code. Figée pour rester comparable aux premiers rapports.',
  lang: 'mul',
  // À incrémenter dès qu'un cas change : la comparaison signale les rapports de versions différentes.
  version: '1',
  cases: [
    {
      id: 'lang-detect',
      name: 'Détection de langue',
      description: 'Un choice, phrase très courte.',
      category: 'Classification',
      complexity: 'simple',
      length: 'court',
      lang: 'es',
      request: {
        state: '¿Dónde está la estación de tren más cercana?',
        questions: {
          language: {
            type: 'choice',
            instructions: 'In which language is this text written?',
            criteria: { fr: 'French', en: 'English', es: 'Spanish', de: 'German', it: 'Italian', pt: 'Portuguese' },
          },
        },
      },
      expected: { language: 'es' },
    },
    {
      id: 'sentiment-en',
      name: 'Sentiment court (EN)',
      description: 'Noul + score sur un avis positif sans ambiguïté.',
      category: 'Sentiment',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Absolutely love these headphones. Crystal clear sound and the battery lasts forever.',
        questions: {
          is_positive: { type: 'noul', instructions: 'Is this review positive?' },
          sentiment: {
            type: 'score',
            instructions: 'Overall sentiment of the review',
            criteria: ['Very negative', 'Negative', 'Neutral', 'Positive', 'Very positive'],
          },
        },
      },
      expected: { is_positive: true, sentiment: [3, 4] },
    },
    {
      id: 'sarcasm-fr',
      name: 'Sarcasme (FR)',
      description: 'Formulation polie mais message négatif.',
      category: 'Sentiment',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Génial, troisième panne de la box cette semaine. Merci beaucoup pour ce service exceptionnel, vraiment.',
        questions: {
          is_satisfied: { type: 'noul', instructions: 'Le client est-il satisfait du service ?' },
          is_sarcastic: { type: 'noul', instructions: 'Le message est-il ironique ou sarcastique ?' },
          sentiment: {
            type: 'score',
            instructions: 'Sentiment réel du client',
            criteria: ['Très négatif', 'Négatif', 'Neutre', 'Positif', 'Très positif'],
          },
        },
      },
      expected: { is_satisfied: false, is_sarcastic: true, sentiment: [0, 1] },
    },
    {
      id: 'review-de',
      name: 'Avis mitigé (DE)',
      description: 'Multilingue, aspects positifs et négatifs mêlés.',
      category: 'Sentiment',
      complexity: 'complexe',
      length: 'court',
      lang: 'de',
      request: {
        state: 'Die Lieferung kam zwei Wochen zu spät und die Verpackung war beschädigt. Die Kaffeemaschine selbst funktioniert aber einwandfrei und der Kaffee schmeckt hervorragend.',
        questions: {
          delivery_problem: { type: 'noul', instructions: 'Does the review mention a delivery problem?' },
          product_works: { type: 'noul', instructions: 'Does the product itself work well according to the review?' },
          main_complaint: {
            type: 'choice',
            instructions: 'What is the main complaint?',
            criteria: { delivery: 'Shipping delays or damaged packaging', quality: 'Product defects', price: 'Too expensive', service: 'Customer service' },
          },
        },
      },
      expected: { delivery_problem: true, product_works: true, main_complaint: 'delivery' },
    },
    {
      id: 'support-triage',
      name: 'Triage de support',
      description: 'Noul + choice + score, ticket critique.',
      category: 'Support',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Your API has returned HTTP 500 on every webhook since 6am. Our production is DOWN and we are losing orders. Fix this NOW.',
        questions: {
          is_urgent: {
            type: 'noul',
            instructions: 'Does this convey urgency?',
            criteria: { true: 'Explicitly time-sensitive', false: 'No urgency expressed' },
          },
          department: {
            type: 'choice',
            instructions: 'Which team should handle this?',
            criteria: { billing: 'Payments, invoicing, refunds', technical: 'Bugs, outages, integrations', sales: 'Pricing, upgrades, new accounts' },
          },
          frustration: { type: 'score', instructions: 'How frustrated is the customer?', criteria: ['Calm', 'Frustrated', 'Very angry'] },
        },
      },
      expected: { is_urgent: true, department: 'technical', frustration: [1, 2] },
    },
    {
      id: 'intent-routing',
      name: "Routage d'intention",
      description: 'Choice à 6 options sur un state JSON.',
      category: 'Routage',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: { user_message: 'Can you remind me to call the dentist tomorrow at 9?', timezone: 'Europe/Paris' },
        questions: {
          tool: {
            type: 'choice',
            instructions: 'Which function should handle `user_message`?',
            criteria: {
              get_weather: 'Questions about weather or forecasts',
              create_reminder: 'Set a reminder or alarm at a given time',
              send_email: 'Write or send an email to someone',
              search_web: 'Look up general information online',
              calendar_lookup: 'Check existing events in the calendar',
              none: 'Small talk or nothing actionable',
            },
          },
          has_explicit_time: { type: 'noul', instructions: 'Does `user_message` specify an explicit date or time?' },
        },
      },
      expected: { tool: 'create_reminder', has_explicit_time: true },
    },
    {
      id: 'moderation',
      name: 'Modération multi-label',
      description: '4 nouls indépendants + catégorie.',
      category: 'Modération',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Contact me at john.doe@gmail.com or +33 6 12 34 56 78 for cheap Instagram followers, best price guaranteed!!!',
        questions: {
          is_spam: { type: 'noul', instructions: 'Is this message unsolicited advertising or spam?' },
          has_personal_info: { type: 'noul', instructions: 'Does the message contain personal contact information (email, phone, address)?' },
          is_toxic: { type: 'noul', instructions: 'Is the message insulting, harassing or hateful toward someone?' },
          is_threat: { type: 'noul', instructions: 'Does the message contain a threat of violence?' },
          category: {
            type: 'choice',
            instructions: 'What is the main moderation category for this message?',
            criteria: { ok: 'Acceptable content', spam: 'Advertising, scams, unsolicited promotion', harassment: 'Insults or attacks targeting a person', hate: 'Attacks on a group based on identity' },
          },
        },
      },
      expected: { is_spam: true, has_personal_info: true, is_toxic: false, is_threat: false, category: 'spam' },
    },
    {
      id: 'dedup-positive',
      name: 'Déduplication (même personne)',
      description: 'State structuré + instructions objet, variantes de nom.',
      category: 'Données structurées',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: { resume: { name: 'Jonathan Smith', city: 'Oakland, CA', experience: [{ company: 'Google', role: 'Software Engineer', years: '2016-2022' }] } },
        questions: {
          same_person: {
            type: 'noul',
            instructions: {
              potential_duplicate: { name: 'John Smith', location: 'Oakland, California', last_employer: 'Google' },
              question: 'Is `resume` for the same person as `potential_duplicate`?',
            },
          },
        },
      },
      expected: { same_person: true },
    },
    {
      id: 'dedup-negative',
      name: 'Déduplication (homonyme)',
      description: 'Même nom, tout le reste diffère.',
      category: 'Données structurées',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: { resume: { name: 'Jonathan Smith', city: 'Oakland, CA', birth_year: 1991, experience: [{ company: 'Google', role: 'Software Engineer', years: '2016-2022' }] } },
        questions: {
          same_person: {
            type: 'noul',
            instructions: {
              potential_duplicate: { name: 'John Smith', location: 'Aberdeen, Scotland', birth_year: 1958, last_employer: 'BP', role: 'Offshore drilling supervisor' },
              question: 'Is `resume` for the same person as `potential_duplicate`?',
            },
          },
        },
      },
      expected: { same_person: false },
    },
    {
      id: 'citation-check',
      name: 'Vérification de citation',
      description: 'La source contredit l’affirmation (piège sur une date).',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: {
          source: 'The Eiffel Tower was completed in March 1889 for the World Fair. It is 330 metres tall and was the tallest man-made structure in the world until 1930, when the Chrysler Building surpassed it.',
          claim: 'The Eiffel Tower remained the tallest structure in the world until the 1950s.',
        },
        questions: {
          supported: { type: 'noul', instructions: 'Is `claim` fully supported by `source`?' },
          support_level: {
            type: 'score',
            instructions: 'How well does `source` support `claim`?',
            criteria: ['The source contradicts the claim', 'The source does not address the claim', 'The source partially supports the claim', 'The source fully supports the claim'],
          },
        },
      },
      expected: { supported: false, support_level: 0 },
    },
    {
      id: 'arithmetic',
      name: 'Arithmétique (FR)',
      description: 'Vérifier un rendu de monnaie : calcul en deux étapes.',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Marie achète 4 stylos à 3,50 € pièce et un cahier à 2,20 €. Elle paie avec un billet de 20 €. Le caissier lui rend 3,80 €.',
        questions: {
          change_correct: { type: 'noul', instructions: 'Le caissier a-t-il rendu la bonne somme ?' },
          error_direction: {
            type: 'choice',
            instructions: 'Comment qualifier la monnaie rendue ?',
            criteria: { exact: 'Montant exact', too_much: 'Le caissier a rendu trop', too_little: 'Le caissier n’a pas rendu assez' },
          },
        },
      },
      // 4 × 3,50 + 2,20 = 16,20 € → 3,80 € à rendre.
      expected: { change_correct: true, error_direction: 'exact' },
    },
    {
      id: 'logic',
      name: 'Déduction logique',
      description: 'Syllogisme avec négation (modus tollens).',
      category: 'Raisonnement',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Every member of the board attended the Tuesday meeting. Paul did not attend the Tuesday meeting. Laura attended the Tuesday meeting.',
        questions: {
          paul_board: { type: 'noul', instructions: 'Is Paul a member of the board?' },
          laura_board: {
            type: 'choice',
            instructions: 'Based only on the statements, is Laura a member of the board?',
            criteria: { yes: 'Laura is certainly a board member', no: 'Laura is certainly not a board member', unknown: 'It cannot be determined from the statements' },
          },
        },
      },
      expected: { paul_board: false, laura_board: 'unknown' },
    },
    {
      id: 'code-review',
      name: 'Revue de code',
      description: 'Détecter une injection SQL et en estimer la gravité.',
      category: 'Code',
      complexity: 'complexe',
      length: 'moyen',
      lang: 'code',
      request: {
        state: `def get_user_orders(request):
    user_id = request.GET.get("user_id")
    status = request.GET.get("status", "paid")
    query = f"SELECT id, total, created_at FROM orders WHERE user_id = {user_id} AND status = '{status}'"
    with connection.cursor() as cur:
        cur.execute(query)
        rows = cur.fetchall()
    return JsonResponse({"orders": [dict(zip(["id", "total", "created_at"], r)) for r in rows]})`,
        questions: {
          has_security_issue: { type: 'noul', instructions: 'Does this code contain a security vulnerability?' },
          issue_type: {
            type: 'choice',
            instructions: 'What is the most serious problem in this code?',
            criteria: { sql_injection: 'Untrusted input concatenated into SQL', xss: 'Untrusted output rendered as HTML', race_condition: 'Concurrent access bug', performance: 'Inefficient query or N+1', none: 'No significant problem' },
          },
          severity: { type: 'score', instructions: 'How severe is the most serious problem?', criteria: ['None', 'Low', 'Medium', 'High', 'Critical'] },
        },
      },
      expected: { has_security_issue: true, issue_type: 'sql_injection', severity: [3, 4] },
    },
    {
      id: 'medical-triage',
      name: 'Triage médical (FR)',
      description: 'Symptômes d’urgence vitale, niveau de priorité.',
      category: 'Support',
      complexity: 'simple',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Homme de 58 ans, douleur thoracique intense et oppressante depuis 20 minutes, irradiant dans le bras gauche et la mâchoire, avec sueurs froides et nausées.',
        questions: {
          call_emergency: { type: 'noul', instructions: 'Faut-il appeler immédiatement les secours (15 / 112) ?' },
          priority: {
            type: 'score',
            instructions: 'Niveau de priorité de prise en charge',
            criteria: ['Consultation non urgente', 'Consultation dans la journée', 'Urgences dans l’heure', 'Urgence vitale immédiate'],
          },
        },
      },
      expected: { call_emergency: true, priority: 3 },
    },
    {
      id: 'ambiguous',
      name: 'Message ambigu (calibration)',
      description: 'Aucune réponse évidente : on attend une probabilité intermédiaire.',
      category: 'Calibration',
      complexity: 'complexe',
      length: 'court',
      lang: 'fr',
      request: {
        state: 'Ok.',
        questions: {
          is_satisfied: { type: 'noul', instructions: 'Le client est-il satisfait ?' },
        },
      },
      expected: { is_satisfied: [0.15, 0.85] },
    },
    {
      id: 'essay-rubric',
      name: 'Correction sur grille',
      description: 'Réponse d’élève notée sur une grille à 5 niveaux.',
      category: 'Évaluation',
      complexity: 'complexe',
      length: 'moyen',
      lang: 'en',
      request: {
        state: {
          question: 'Explain why the sky appears blue during the day.',
          student_answer:
            'Sunlight contains all colours. When it enters the atmosphere it hits gas molecules, which scatter light. Shorter wavelengths like blue are scattered much more strongly than longer ones like red (this is called Rayleigh scattering, and it goes roughly with 1/λ⁴). So blue light reaches our eyes from every direction of the sky. Violet is scattered even more, but our eyes are less sensitive to it and some is absorbed high up, so we see blue.',
        },
        questions: {
          mentions_scattering: { type: 'noul', instructions: 'Does `student_answer` identify light scattering as the cause?' },
          has_factual_error: { type: 'noul', instructions: 'Does `student_answer` contain a factual error?' },
          grade: {
            type: 'score',
            instructions: 'Grade `student_answer` for `question`.',
            criteria: ['Off-topic or wrong', 'Major misconceptions', 'Partially correct', 'Correct but incomplete', 'Complete, precise and well explained'],
          },
        },
      },
      expected: { mentions_scattering: true, has_factual_error: false, grade: [3, 4] },
    },
    {
      id: 'product-16q',
      name: 'Annonce : 16 questions',
      description: 'State court, beaucoup de questions : coût par question.',
      category: 'Extraction',
      complexity: 'simple',
      length: 'moyen',
      lang: 'fr',
      request: {
        state: PRODUCT_LISTING,
        questions: {
          is_used: { type: 'noul', instructions: 'Le produit est-il d’occasion ?' },
          is_smartphone: { type: 'noul', instructions: 'Le produit est-il un smartphone ?' },
          is_android: { type: 'noul', instructions: 'Le produit fonctionne-t-il sous Android ?' },
          mentions_storage: { type: 'noul', instructions: 'L’annonce indique-t-elle la capacité de stockage ?' },
          mentions_color: { type: 'noul', instructions: 'L’annonce indique-t-elle la couleur ?' },
          price_under_500: { type: 'noul', instructions: 'Le prix est-il inférieur à 500 € ?' },
          free_shipping: { type: 'noul', instructions: 'La livraison est-elle gratuite ?' },
          battery_above_90: { type: 'noul', instructions: 'La batterie est-elle au-dessus de 90 % ?' },
          has_scratches: { type: 'noul', instructions: 'L’annonce mentionne-t-elle des rayures ?' },
          screen_damaged: { type: 'noul', instructions: 'L’écran est-il endommagé ?' },
          charger_included: { type: 'noul', instructions: 'Un chargeur secteur est-il fourni ?' },
          original_box: { type: 'noul', instructions: 'La boîte d’origine est-elle fournie ?' },
          carrier_locked: { type: 'noul', instructions: 'Le téléphone est-il bloqué sur un opérateur ?' },
          pickup_possible: { type: 'noul', instructions: 'Une remise en main propre est-elle possible ?' },
          professional_seller: { type: 'noul', instructions: 'Le vendeur est-il un professionnel ?' },
          accepts_trade: { type: 'noul', instructions: 'Le vendeur accepte-t-il les échanges ?' },
        },
      },
      expected: {
        is_used: true,
        is_smartphone: true,
        is_android: false,
        mentions_storage: true,
        mentions_color: true,
        price_under_500: true,
        free_shipping: true,
        battery_above_90: false,
        has_scratches: true,
        screen_damaged: false,
        charger_included: false,
        original_box: true,
        carrier_locked: false,
        pickup_possible: true,
        professional_seller: false,
        accepts_trade: false,
      },
    },
    {
      id: 'orders-table',
      name: 'Agrégation sur tableau JSON',
      description: 'Somme et comparaison sur des données structurées.',
      category: 'Données structurées',
      complexity: 'complexe',
      length: 'moyen',
      lang: 'en',
      request: {
        state: {
          orders: [
            { id: 'A-101', customer: 'Acme', amount_eur: 320, status: 'paid' },
            { id: 'A-102', customer: 'Globex', amount_eur: 780, status: 'paid' },
            { id: 'A-103', customer: 'Acme', amount_eur: 150, status: 'refunded' },
            { id: 'A-104', customer: 'Initech', amount_eur: 410, status: 'paid' },
            { id: 'A-105', customer: 'Acme', amount_eur: 290, status: 'paid' },
            { id: 'A-106', customer: 'Globex', amount_eur: 95, status: 'cancelled' },
            { id: 'A-107', customer: 'Initech', amount_eur: 260, status: 'paid' },
          ],
        },
        questions: {
          paid_total_over_2000: { type: 'noul', instructions: 'Is the total amount of orders with status "paid" in `orders` greater than 2000 €?' },
          top_customer: {
            type: 'choice',
            instructions: 'Which customer has the highest total amount of "paid" orders?',
            criteria: { Acme: null, Globex: null, Initech: null },
          },
          has_refund: { type: 'noul', instructions: 'Does `orders` contain at least one refunded order?' },
        },
      },
      // Payées : 320 + 780 + 410 + 290 + 260 = 2060 € ; Globex 780, Initech 670, Acme 610.
      expected: { paid_total_over_2000: true, top_customer: 'Globex', has_refund: true },
    },
    {
      id: 'email-long-fr',
      name: 'E-mail client long (FR)',
      description: 'Réclamation détaillée : catégorie, échéance, ton.',
      category: 'Support',
      complexity: 'complexe',
      length: 'long',
      lang: 'fr',
      request: {
        state: EMAIL_FR,
        questions: {
          category: {
            type: 'choice',
            instructions: 'Quel est l’objet principal de cet e-mail ?',
            criteria: { retard_livraison: 'Livraison en retard ou non reçue', produit_defectueux: 'Produit reçu endommagé ou défectueux', facturation: 'Erreur de facture ou de paiement', demande_devis: 'Demande de prix ou de devis', autre: 'Autre sujet' },
          },
          has_deadline: { type: 'noul', instructions: 'L’expéditrice fixe-t-elle une date limite de réponse ?' },
          threatens_escalation: { type: 'noul', instructions: 'L’expéditrice menace-t-elle d’une escalade (juridique, changement de fournisseur) ?' },
          asks_refund: { type: 'noul', instructions: 'L’expéditrice évoque-t-elle un remboursement ?' },
          is_insulting: { type: 'noul', instructions: 'L’e-mail contient-il des insultes ?' },
          tone: { type: 'score', instructions: 'Ton de l’e-mail', criteria: ['Cordial et détendu', 'Neutre', 'Ferme mais poli', 'Agressif'] },
        },
      },
      expected: { category: 'retard_livraison', has_deadline: true, threatens_escalation: true, asks_refund: true, is_insulting: false, tone: 2 },
    },
    {
      id: 'meeting-long-fr',
      name: 'Compte rendu de réunion (FR)',
      description: 'Transcription longue : décision, responsable, budget.',
      category: 'Extraction',
      complexity: 'complexe',
      length: 'long',
      lang: 'fr',
      request: {
        state: MEETING_FR,
        questions: {
          launch_decision: {
            type: 'choice',
            instructions: 'Quelle décision a été prise sur la date de lancement ?',
            criteria: {
              maintenu: 'Lancement maintenu au 1er novembre, sous condition d’un point go / no-go',
              decale_janvier: 'Lancement décalé à janvier',
              annule: 'Projet annulé',
              pas_de_decision: 'Aucune décision prise',
            },
          },
          go_nogo_owner: {
            type: 'choice',
            instructions: 'Qui est responsable du go / no-go technique ?',
            criteria: { Sophie: null, Karim: null, Ines: 'Inès', Marc: null, Julie: null },
          },
          budget_approved: { type: 'noul', instructions: 'Le budget d’heures supplémentaires du support a-t-il été validé pendant la réunion ?' },
          sales_can_announce_date: { type: 'noul', instructions: 'Marc est-il autorisé à annoncer une date ferme aux prospects dès maintenant ?' },
          tension_level: { type: 'score', instructions: 'Niveau de tension dans la réunion', criteria: ['Aucune tension', 'Désaccords légers et constructifs', 'Tensions marquées', 'Conflit ouvert'] },
        },
      },
      expected: { launch_decision: 'maintenu', go_nogo_owner: 'Karim', budget_approved: false, sales_can_announce_date: false, tension_level: 1 },
    },
    {
      id: 'contract-long-en',
      name: 'Analyse de contrat (EN)',
      description: 'Clauses à retrouver dans un contrat long.',
      category: 'Juridique',
      complexity: 'complexe',
      length: 'long',
      lang: 'en',
      request: {
        state: CONTRACT_EN,
        questions: {
          auto_renewal: { type: 'noul', instructions: 'Does the agreement renew automatically?' },
          non_renewal_notice: {
            type: 'choice',
            instructions: 'How much notice is required to prevent renewal?',
            criteria: { '30_days': '30 days', '45_days': '45 days', '60_days': '60 days', '90_days': '90 days', none: 'Not specified' },
          },
          governing_law: {
            type: 'choice',
            instructions: 'Which law governs the agreement?',
            criteria: { france: 'French law', england: 'Laws of England and Wales', us: 'A US state law', eu: 'EU law only', unspecified: 'Not specified' },
          },
          termination_for_convenience: { type: 'noul', instructions: 'Can the Customer terminate for convenience during the Initial Term?' },
          liability_capped: { type: 'noul', instructions: 'Is the general liability of the parties capped?' },
          eu_hosting: { type: 'noul', instructions: 'Must Customer Personal Data be hosted in the European Economic Area?' },
          customer_risk: {
            type: 'score',
            instructions: 'From the Customer’s perspective, how restrictive is this agreement?',
            criteria: ['Very favourable to Customer', 'Balanced', 'Somewhat restrictive', 'Very restrictive'],
          },
        },
      },
      expected: {
        auto_renewal: true,
        non_renewal_notice: '90_days',
        governing_law: 'england',
        termination_for_convenience: false,
        liability_capped: true,
        eu_hosting: true,
        customer_risk: [1, 2],
      },
    },
    {
      id: 'catalog-needle',
      name: 'Aiguille dans un catalogue',
      description: '60 produits en JSON : retrouver la rupture de stock.',
      category: 'Contexte long',
      complexity: 'complexe',
      length: 'très long',
      lang: 'fr',
      request: {
        state: { catalog: syntheticCatalog() },
        questions: {
          audio_out_of_stock: { type: 'noul', instructions: 'Un produit de la catégorie « audio » de `catalog` a-t-il un stock de 0 ?' },
          video_out_of_stock: { type: 'noul', instructions: 'Un produit de la catégorie « video » de `catalog` a-t-il un stock de 0 ?' },
          out_of_stock_category: {
            type: 'choice',
            instructions: 'Dans quelle catégorie se trouve le produit en rupture de stock (stock = 0) ?',
            criteria: { audio: null, video: null, informatique: null, maison: null, sport: null },
          },
        },
      },
      // syntheticCatalog : seul l'index 38 a un stock nul, catégorie cats[38 % 5] = 'maison'.
      expected: { audio_out_of_stock: false, video_out_of_stock: false, out_of_stock_category: 'maison' },
    },
    {
      id: 'logs-incident',
      name: 'Analyse de logs (incident)',
      description: '84 lignes de logs, cause racine noyée dans le bruit.',
      category: 'Contexte long',
      complexity: 'complexe',
      length: 'très long',
      lang: 'en',
      request: {
        state: syntheticLogs(),
        questions: {
          root_cause: {
            type: 'choice',
            instructions: 'What is the most likely root cause of the incident in these logs?',
            criteria: { memory: 'Memory exhaustion (heap / OOM)', disk: 'Disk full', network: 'Network or DNS failure', auth: 'Authentication failure', config: 'Bad configuration deployment' },
          },
          affected_service: {
            type: 'choice',
            instructions: 'Which service failed first?',
            criteria: { 'api-gateway': null, auth: null, orders: null, payments: null, catalog: null },
          },
          users_impacted: { type: 'noul', instructions: 'Did end users receive errors as a result of the incident?' },
          severity: { type: 'score', instructions: 'Incident severity', criteria: ['SEV4 — cosmetic', 'SEV3 — minor', 'SEV2 — major, partial outage', 'SEV1 — full outage'] },
        },
      },
      expected: { root_cause: 'memory', affected_service: 'orders', users_impacted: true, severity: [2, 3] },
    },
  ],
}
