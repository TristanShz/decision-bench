import type { BenchSuite } from '../../types'

// Cas rédigés directement en anglais et distincts de la suite « mixed », pour que les deux mesures restent indépendantes.

// ─── Textes longs ────────────────────────────────────────────────────────────

const POSTMORTEM = `POSTMORTEM — Checkout outage, 2026-09-17
Status: final · Author: Platform team · Review date: 2026-09-22

SUMMARY
Between 09:12 and 10:05 UTC on September 17, a portion of checkout attempts failed with HTTP 502 errors. The payments-api service could not complete the mutual TLS handshake with our card processor because the client certificate used for that connection had expired. Card authorizations that did go through were processed normally.

IMPACT
- Duration: 53 minutes (09:12 to 10:05 UTC).
- About 38% of checkout attempts failed during the window; the other 62% succeeded because they were routed to the secondary processor, which uses a different certificate.
- Roughly 4,100 orders could not be placed. Customers saw "Payment could not be processed, please try again."
- No customer was charged for a failed order and no order was charged twice. No data was lost or exposed.
- Support received 312 tickets related to the incident.

TIMELINE (UTC)
09:12 — Alert: payments-api 5xx rate above 5% for 3 minutes. On-call engineer (Wei) acknowledges.
09:16 — Wei checks recent deploys. The last deploy of payments-api was two days earlier; rolling it back is ruled out.
09:20 — Logs show "tls: expired certificate" on every connection to the primary processor.
09:27 — Incident declared, incident commander: Priya. Status page updated.
09:35 — The certificate rotation job is found to have been disabled on July 8 during the migration to the new secrets manager, and never re-enabled.
09:41 — Emergency certificate requested from the processor's portal.
09:58 — New certificate deployed to payments-api.
10:05 — Error rate back to baseline. Incident resolved.
10:30 — Status page marked as resolved.

ROOT CAUSE
The client certificate for the primary card processor expires every 90 days and is renewed by an automated rotation job. That job was disabled during the July secrets-manager migration to avoid writing to both stores at once. The migration checklist did not include re-enabling it. Nothing alerted on the approaching expiry, because expiry monitoring only covered our public-facing certificates.

WHAT WENT WELL
- The secondary processor absorbed a majority of traffic without any manual action.
- The error message shown to customers was accurate and did not encourage repeated attempts.

WHAT WENT POORLY
- It took 23 minutes to identify the cause, partly because the first hypothesis was a bad deploy.
- Internal certificates were not covered by expiry monitoring.

ACTION ITEMS
1. Re-enable the rotation job and add a test that fails if it is disabled. Owner: Priya (Platform). Due: 2026-09-24. Done.
2. Add expiry alerting 30 days ahead for every internal and external certificate. Owner: Tomás (SRE). Due: 2026-10-01.
3. Add "re-enable scheduled jobs" to the migration checklist template. Owner: Wei (Platform). Due: 2026-09-30.
4. Evaluate sending 100% of traffic to the secondary processor automatically when the primary error rate exceeds 20%. Owner: unassigned. To be discussed at the next architecture review.`

const SALES_CALL = `Call transcript — Brightpath × Harlow Foods — Tuesday, 2:00–2:40 pm ET
Attendees: Rachel Kim (Account Executive, Brightpath), Mina Osei (Solutions Engineer, Brightpath), Owen Fletcher (IT Manager, Harlow Foods)

Rachel: Thanks for making time again, Owen. Last week you saw the overview; today Mina will walk through the inventory forecasting module on your own sample data.

Owen: Great. I shared the export from our three distribution centers on Friday.

Mina: Got it, thanks. So here's last quarter replayed. The forecast for perishables in the Columbus center would have cut overstock by about 18% compared to what you actually ordered.

Owen: That's a big number. Our waste on dairy alone was painful last quarter. How does it handle promotions? We run a lot of regional promos.

Mina: Promotions are an input. You upload the promo calendar, and the model adjusts the forecast for the affected SKUs and stores.

Owen: Okay, that covers what our planners asked for. Honestly, functionally this is what we need.

Rachel: Good to hear. On pricing, the proposal I sent was for three sites at $4,200 a month. Does that work on your side?

Owen: Yes, that's within what we budgeted for this year. Pricing isn't the problem.

Rachel: What would be the main blocker, then?

Owen: Security. Our CISO, Grace, won't approve anything that touches our supplier data without a SOC 2 Type II report and single sign-on with our identity provider. Last year we dropped a vendor at the last minute over this.

Mina: We have a SOC 2 Type II report from March, and SSO through SAML works with all the major identity providers. I can send the report under NDA today.

Owen: Perfect. Grace will want to go through it with you directly, though.

Rachel: Of course. Could we set up a security review call with Grace this week?

Owen: She's free Thursday at 10 am. Let's lock that in.

Rachel: Done, I'm sending the invite now for Thursday 10 am with Mina and Grace. Once security signs off, what does the approval process look like?

Owen: I'll make the recommendation, but the contract is signed by our CFO, Daniel Brooks. He wasn't able to join today. He usually follows IT's recommendation if the budget is already approved.

Rachel: Understood. Would it help if we prepared a one-page summary for Daniel?

Owen: Yes, that would help. Keep it short: cost, expected savings, rollout timeline.

Rachel: Will do. On timing, you mentioned wanting to be live before the holiday season?

Owen: Ideally the Columbus center by mid-November, the other two in January.

Mina: That's realistic if we start onboarding in October.

Owen: Then let's see how Thursday goes. I'm optimistic.

Rachel: Great. Thanks, Owen, talk Thursday.`

const EXPENSE_POLICY = `TRAVEL AND EXPENSE POLICY — Northbeam Inc. (effective January 1, 2026)

1. GENERAL
Employees are reimbursed for reasonable, necessary business expenses incurred while traveling for work. Expenses must be submitted through the expense tool within 30 calendar days of the end of the trip. Late submissions require approval from a VP.

2. RECEIPTS
An itemized receipt is required for any single expense of $25 or more. Expenses under $25 do not require a receipt but must include a description.

3. LODGING
The nightly rate (before taxes) may not exceed:
- $250 in tier-1 cities: New York, San Francisco, Boston, Washington DC, London;
- $180 in all other cities.
Any higher rate requires written pre-approval from the employee's director.

4. MEALS
The daily meal limit is $75 per person for domestic travel and $100 for international travel, including tax and tip. Alcohol is not reimbursable, except at client meals pre-approved by a director. When a meal includes alcohol that is not reimbursable, the employee must remove the alcohol amount from the claim; the rest of the meal remains reimbursable.

5. GROUND TRANSPORTATION
Use economy options: standard rideshare (e.g. UberX, Lyft Standard), taxis or public transit. Premium rideshare (Uber Black, Lyft Lux) is not reimbursable, except between 10 pm and 6 am when no standard option is available. Personal car use is reimbursed at $0.67 per mile.

6. AIRFARE
Book economy class at least 14 days before departure when possible. Business class is allowed only for flights over 8 hours.

7. NON-REIMBURSABLE
Personal entertainment, minibar, upgrades, traffic and parking fines, and expenses for anyone who is not an employee, unless pre-approved.`

/** 70 tickets de support synthétiques et déterministes ; un seul contient une menace de poursuites. */
function syntheticTickets() {
  const customers = ['Acme Retail', 'Bluefin Labs', 'Cedar Health', 'Dunmore Freight', 'Evergreen Schools', 'Fairway Hotels']
  const templates: [string, string][] = [
    ['CSV export', 'How do I export last month’s report to CSV? I can only find PDF.'],
    ['Slow dashboard', 'The dashboard takes about 20 seconds to load in the afternoon. Mornings are fine.'],
    ['Add seats', 'We hired three people. Can we add three seats to our current plan?'],
    ['Invoice address', 'Please update the billing address on our invoices to our new office.'],
    ['Feature request', 'It would be great to filter the activity feed by team.'],
    ['Timezone', 'Scheduled reports arrive at 3 am our time. Can we change the timezone?'],
    ['Integration', 'Is there a native integration with our accounting software?'],
    ['Training', 'Do you offer a training session for new admins?'],
  ]
  let seed = 31
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 70 }, (_, i) => {
    if (i === 44)
      return {
        id: 'T-1044',
        customer: 'Halvorsen Logistics',
        channel: 'email',
        subject: 'Duplicate invoices',
        message: 'This is the third time we raise this. If the duplicate invoices from June are not credited by Friday, our legal counsel will file a claim.',
        priority: 'normal',
      }
    const [subject, message] = templates[Math.floor(rnd() * templates.length)]
    return {
      id: `T-${1000 + i}`,
      customer: customers[Math.floor(rnd() * customers.length)],
      channel: rnd() < 0.5 ? 'email' : 'chat',
      subject,
      message,
      priority: rnd() < 0.15 ? 'high' : 'normal',
    }
  })
}

// ─── Suite ───────────────────────────────────────────────────────────────────

export const suite: BenchSuite = {
  id: 'en',
  name: 'English',
  description: 'Cases written in English: understatement, idioms, US dates, phishing, expense policy, postmortem, sales call, support tickets.',
  lang: 'en',
  version: '1',
  cases: [
    {
      id: 'review-positive',
      name: 'Product review',
      description: 'Clearly positive review.',
      category: 'Sentiment',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Exceeded my expectations. Setup took five minutes and it’s whisper quiet, even on the highest setting.',
        questions: {
          is_positive: { type: 'noul', instructions: 'Is this review positive?' },
          mentions_noise: { type: 'noul', instructions: 'Does the review mention how loud the product is?' },
          sentiment: { type: 'score', instructions: 'Overall sentiment of the review', criteria: ['Very negative', 'Negative', 'Neutral', 'Positive', 'Very positive'] },
        },
      },
      expected: { is_positive: true, mentions_noise: true, sentiment: [3, 4] },
    },
    {
      id: 'understatement',
      name: 'Understatement',
      description: '“That could have gone better” after a failed demo.',
      category: 'Sentiment',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Our manager, after the client demo crashed twice and the client left early: “Well, that could have gone better.”',
        questions: {
          demo_successful: { type: 'noul', instructions: 'Was the demo a success?' },
          manager_view: {
            type: 'score',
            instructions: 'How does the manager actually rate the demo?',
            criteria: ['Very bad', 'Bad', 'Average', 'Good', 'Very good'],
          },
        },
      },
      expected: { demo_successful: false, manager_view: [0, 1] },
    },
    {
      id: 'sarcasm',
      name: 'Sarcasm',
      description: 'Sarcastic enthusiasm about a meeting.',
      category: 'Sentiment',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Oh great, another 45-minute “quick sync” that could have been an email. Exactly what my Friday afternoon needed.',
        questions: {
          is_sarcastic: { type: 'noul', instructions: 'Is the message sarcastic?' },
          is_enthusiastic: { type: 'noul', instructions: 'Is the author genuinely enthusiastic about the meeting?' },
        },
      },
      expected: { is_sarcastic: true, is_enthusiastic: false },
    },
    {
      id: 'idioms',
      name: 'Idioms',
      description: 'Two idioms with opposite meanings in one status update.',
      category: 'Comprehension',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Status update: the new onboarding flow was a piece of cake to ship. The database migration, on the other hand, is not out of the woods yet.',
        questions: {
          onboarding_hard: { type: 'noul', instructions: 'Was the onboarding flow difficult to ship?' },
          migration_done: { type: 'noul', instructions: 'Is the database migration safely finished?' },
          main_risk: {
            type: 'choice',
            instructions: 'Which project is currently the main risk?',
            criteria: { onboarding: 'Onboarding flow', migration: 'Database migration', none: 'No risk mentioned' },
          },
        },
      },
      expected: { onboarding_hard: false, migration_done: false, main_risk: 'migration' },
    },
    {
      id: 'calibration-fine',
      name: 'Ambiguous reply (calibration)',
      description: '“Fine.” alone: an intermediate probability is expected.',
      category: 'Calibration',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Fine.',
        questions: {
          is_satisfied: { type: 'noul', instructions: 'Is the customer satisfied?' },
        },
      },
      expected: { is_satisfied: [0.15, 0.85] },
    },
    {
      id: 'billing-ticket',
      name: 'Billing ticket',
      description: 'Double charge, calm tone.',
      category: 'Support',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Hi, it looks like I was charged twice for my March subscription ($29 on March 1 and again on March 2). Could you refund the duplicate? Thanks!',
        questions: {
          department: {
            type: 'choice',
            instructions: 'Which team should handle this?',
            criteria: { billing: 'Payments, invoicing, refunds', technical: 'Bugs, outages, integrations', sales: 'Pricing, upgrades, new accounts' },
          },
          refund_requested: { type: 'noul', instructions: 'Does the customer ask for a refund?' },
          frustration: { type: 'score', instructions: 'How frustrated is the customer?', criteria: ['Calm', 'Frustrated', 'Very angry'] },
        },
      },
      expected: { department: 'billing', refund_requested: true, frustration: 0 },
    },
    {
      id: 'intent-calendar',
      name: 'Assistant routing',
      description: 'Calendar lookup, not reminder creation.',
      category: 'Routing',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: { user_message: 'What do I have after lunch tomorrow?', timezone: 'America/Chicago' },
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
          creates_something: { type: 'noul', instructions: 'Does `user_message` ask to create a new event or reminder?' },
        },
      },
      expected: { tool: 'calendar_lookup', creates_something: false },
    },
    {
      id: 'moderation-threat',
      name: 'Moderation: threat',
      description: 'Conditional threat without profanity.',
      category: 'Moderation',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Keep posting lies about me and you’ll find out what happens when I see you at the gym.',
        questions: {
          is_threat: { type: 'noul', instructions: 'Does the message contain a threat?' },
          has_profanity: { type: 'noul', instructions: 'Does the message contain profanity or slurs?' },
          category: {
            type: 'choice',
            instructions: 'What is the main moderation category for this message?',
            criteria: { ok: 'Acceptable content', spam: 'Advertising, scams', harassment: 'Insults targeting a person', threat: 'Threats or intimidation' },
          },
        },
      },
      expected: { is_threat: true, has_profanity: false, category: 'threat' },
    },
    {
      id: 'moderation-criticism',
      name: 'Moderation: harsh criticism',
      description: 'Angry but acceptable feedback: false-positive trap.',
      category: 'Moderation',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'This update is terrible. The app crashes every time I open it, and clearly nobody tested it on Android. One star until it’s fixed.',
        questions: {
          is_toxic: { type: 'noul', instructions: 'Is the message insulting or harassing toward someone?' },
          should_remove: { type: 'noul', instructions: 'Should moderators remove this message?' },
          category: {
            type: 'choice',
            instructions: 'What is the main moderation category for this message?',
            criteria: { ok: 'Acceptable content', spam: 'Advertising, scams', harassment: 'Insults targeting a person', threat: 'Threats or intimidation' },
          },
        },
      },
      expected: { is_toxic: false, should_remove: false, category: 'ok' },
    },
    {
      id: 'phishing',
      name: 'Phishing email',
      description: 'Urgency, look-alike domain, password request.',
      category: 'Security',
      complexity: 'simple',
      length: 'court',
      lang: 'en',
      request: {
        state: {
          from: 'PayPal Security <no-reply@secure-paypa1-login.co>',
          subject: 'Action required: your account will be suspended',
          body: 'We detected unusual activity. Your account will be suspended within 24 hours unless you verify your identity. Confirm your password here: http://secure-paypa1-login.co/verify',
        },
        questions: {
          is_phishing: { type: 'noul', instructions: 'Is this email a phishing attempt?' },
          legit_domain: { type: 'noul', instructions: 'Is the sender’s domain an official PayPal domain?' },
          asks_credentials: { type: 'noul', instructions: 'Does the email ask for a password or other credentials?' },
        },
      },
      expected: { is_phishing: true, legit_domain: false, asks_credentials: true },
    },
    {
      id: 'us-date',
      name: 'US date format',
      description: '04/05 is April 5 in a US context.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'From the Chicago office: the vendor contract starts 04/05/2026 and runs for 12 months. Please submit the purchase order before the start date.',
        questions: {
          start_month: { type: 'choice', instructions: 'In which month does the contract start?', criteria: { april: 'April', may: 'May' } },
          ends_2027: { type: 'noul', instructions: 'Does the contract end in 2027?' },
        },
      },
      expected: { start_month: 'april', ends_2027: true },
    },
    {
      id: 'recipe-math',
      name: 'Quantity reasoning',
      description: 'Multiply then compare with what is available.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'The cookie recipe needs 2 cups of flour per batch. Sam has 7 cups of flour and wants to bake 4 batches for the school fair.',
        questions: {
          enough_flour: { type: 'noul', instructions: 'Does Sam have enough flour?' },
          shortfall: {
            type: 'choice',
            instructions: 'How much flour is Sam missing?',
            criteria: { none: 'Nothing, Sam has enough', one: '1 cup', two: '2 cups', three: '3 cups' },
          },
        },
      },
      // 4 × 2 = 8 cups needed, 7 available.
      expected: { enough_flour: false, shortfall: 'one' },
    },
    {
      id: 'percent-trap',
      name: 'Percentage trap',
      description: '+20% then −20% does not return to the start.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Our plan cost $100 per month. The price went up 20% in January, then down 20% in June.',
        questions: {
          back_to_original: { type: 'noul', instructions: 'Is the price after June back to $100?' },
          direction: {
            type: 'choice',
            instructions: 'Compared with the original $100, the price after June is:',
            criteria: { higher: 'Higher', lower: 'Lower', same: 'The same' },
          },
        },
      },
      // 100 × 1.2 × 0.8 = 96.
      expected: { back_to_original: false, direction: 'lower' },
    },
    {
      id: 'logic-interns',
      name: 'Logical deduction',
      description: 'Contrapositive and an undecidable case.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'No intern can approve expenses. Dana approved an expense yesterday. Lee has never approved an expense.',
        questions: {
          dana_intern: { type: 'noul', instructions: 'Is Dana an intern?' },
          lee_intern: {
            type: 'choice',
            instructions: 'Based only on these statements, is Lee an intern?',
            criteria: { yes: 'Lee is certainly an intern', no: 'Lee is certainly not an intern', unknown: 'It cannot be determined' },
          },
        },
      },
      expected: { dana_intern: false, lee_intern: 'unknown' },
    },
    {
      id: 'timeline',
      name: 'Career timeline',
      description: 'Infer a date range from duration and end date.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: 'Before joining Stripe in 2020, Maya spent three years at Shopify, which she left in 2019.',
        questions: {
          shopify_2018: { type: 'noul', instructions: 'Was Maya working at Shopify in 2018?' },
          current_employer: {
            type: 'choice',
            instructions: 'Which company did Maya join most recently?',
            criteria: { shopify: 'Shopify', stripe: 'Stripe', unknown: 'Cannot be determined' },
          },
        },
      },
      expected: { shopify_2018: true, current_employer: 'stripe' },
    },
    {
      id: 'claim-causation',
      name: 'Correlation vs causation',
      description: 'An observational study cited as proof of causation.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: {
          source:
            'The study followed 1,200 adults for five years and found that regular coffee drinkers had a 12% lower risk of type 2 diabetes. The authors stress that the study was observational and cannot establish causation.',
          claim: 'Drinking coffee prevents type 2 diabetes.',
        },
        questions: {
          supported: { type: 'noul', instructions: 'Is `claim` fully supported by `source`?' },
          causation_shown: { type: 'noul', instructions: 'Does `source` establish that coffee causes a lower diabetes risk?' },
          association_found: { type: 'noul', instructions: 'Does `source` report an association between coffee and diabetes risk?' },
        },
      },
      expected: { supported: false, causation_shown: false, association_found: true },
    },
    {
      id: 'resume-screening',
      name: 'Résumé screening',
      description: 'One requirement out of three is not met.',
      category: 'Structured data',
      complexity: 'complexe',
      length: 'court',
      lang: 'en',
      request: {
        state: {
          requirements: ['Python', 'At least 3 years of professional experience', 'Authorized to work in the EU'],
          candidate: {
            name: 'Jordan Ellis',
            skills: ['Python', 'SQL', 'Airflow'],
            experience: [{ company: 'DataNest', role: 'Data Engineer', from: '2024-01', to: 'present' }],
            work_authorization: 'EU citizen (Ireland)',
            as_of: '2026-06',
          },
        },
        questions: {
          meets_all: { type: 'noul', instructions: 'Does `candidate` meet all `requirements`?' },
          missing: {
            type: 'choice',
            instructions: 'Which requirement is not met?',
            criteria: { python: 'Python', experience: 'Years of experience', authorization: 'Work authorization', none: 'All requirements are met' },
          },
        },
      },
      // 2024-01 → 2026-06 : 2,5 ans d'expérience.
      expected: { meets_all: false, missing: 'experience' },
    },
    {
      id: 'code-async',
      name: 'Code review: async bug',
      description: '`forEach` with an async callback is not awaited.',
      category: 'Code',
      complexity: 'complexe',
      length: 'moyen',
      lang: 'en',
      request: {
        state: `async function totalRevenue(orderIds) {
  let total = 0
  orderIds.forEach(async (id) => {
    const order = await db.orders.findById(id)
    total += order.amount
  })
  return total
}

app.get('/revenue', async (req, res) => {
  const ids = req.query.ids.split(',')
  res.json({ total: await totalRevenue(ids) })
})`,
        questions: {
          has_bug: { type: 'noul', instructions: 'Does this code contain a bug that makes it return a wrong result?' },
          issue_type: {
            type: 'choice',
            instructions: 'What is the most serious problem in this code?',
            criteria: {
              async_not_awaited: 'Asynchronous work is not awaited',
              sql_injection: 'Untrusted input concatenated into SQL',
              xss: 'Untrusted output rendered as HTML',
              off_by_one: 'Off-by-one error in a loop',
              none: 'No significant problem',
            },
          },
          returns_zero: { type: 'noul', instructions: 'Will `totalRevenue` typically resolve to 0 for a non-empty list?' },
        },
      },
      expected: { has_bug: true, issue_type: 'async_not_awaited', returns_zero: true },
    },
    {
      id: 'return-policy',
      name: 'Return policy check',
      description: 'Category-specific return window applied to a purchase.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'moyen',
      lang: 'en',
      request: {
        state: {
          policy:
            'Most items can be returned within 30 days of delivery if unused and in their original packaging. Electronics (laptops, tablets, phones, headphones) can be returned within 15 days of delivery, opened or not, as long as all accessories are included. Gift cards and personalized items are final sale. Refunds go to the original payment method within 5–7 business days. A receipt or order number is required.',
          request:
            'Hi, I bought a laptop that was delivered 20 days ago. I opened it and used it a bit, but the keyboard layout isn’t what I expected. I still have every accessory and my order number. Can I return it for a full refund?',
        },
        questions: {
          eligible: { type: 'noul', instructions: 'Can the customer return the laptop under `policy`?' },
          reason: {
            type: 'choice',
            instructions: 'What is the deciding factor?',
            criteria: { window: 'The return window has passed', opened: 'The item was opened', accessories: 'Missing accessories', final_sale: 'Final sale item', none: 'Nothing, the return is accepted' },
          },
        },
      },
      // Électronique : 15 jours, ouvert ou non. 20 jours > 15.
      expected: { eligible: false, reason: 'window' },
    },
    {
      id: 'car-listing-10q',
      name: 'Used car listing: 10 questions',
      description: 'Abbreviations (OBO, mi, AWD) and many questions.',
      category: 'Extraction',
      complexity: 'simple',
      length: 'moyen',
      lang: 'en',
      request: {
        state:
          '2019 Subaru Outback 2.5i Premium, AWD, 64k mi. One owner, clean title, all service records. New tires (Michelin, March 2026). Minor scratch on the rear bumper, no accidents. Heated seats, Apple CarPlay, roof rack. Non-smoker. $18,900 OBO. Cash or cashier’s check only, no trades. Located in Portland, OR — local pickup only.',
        questions: {
          awd: { type: 'noul', instructions: 'Is the car all-wheel drive?' },
          under_70k: { type: 'noul', instructions: 'Is the mileage under 70,000 miles?' },
          had_accident: { type: 'noul', instructions: 'Has the car been in an accident?' },
          negotiable: { type: 'noul', instructions: 'Is the price negotiable?' },
          accepts_trade: { type: 'noul', instructions: 'Does the seller accept trade-ins?' },
          card_payment: { type: 'noul', instructions: 'Can the buyer pay by credit card?' },
          shipping: { type: 'noul', instructions: 'Will the seller ship the car?' },
          new_tires: { type: 'noul', instructions: 'Were the tires replaced in 2026?' },
          has_cosmetic_damage: { type: 'noul', instructions: 'Does the listing mention cosmetic damage?' },
          owners: { type: 'choice', instructions: 'How many owners has the car had, including the seller?', criteria: { one: '1', two: '2', three_plus: '3 or more', unknown: 'Not stated' } },
        },
      },
      expected: {
        awd: true,
        under_70k: true,
        had_accident: false,
        negotiable: true,
        accepts_trade: false,
        card_payment: false,
        shipping: false,
        new_tires: true,
        has_cosmetic_damage: true,
        owners: 'one',
      },
    },
    {
      id: 'expense-claim',
      name: 'Expense policy check',
      description: 'Long policy applied to a claim: several rules to combine.',
      category: 'Reasoning',
      complexity: 'complexe',
      length: 'long',
      lang: 'en',
      request: {
        state: {
          policy: EXPENSE_POLICY,
          claim: {
            employee: 'Alex Moreno',
            trip: 'Customer workshop in Denver, CO (domestic)',
            trip_end: '2026-08-02',
            submitted: '2026-08-20',
            items: [
              { item: 'Hotel, 2 nights', amount_per_night: 210, receipt: true },
              { item: 'Dinner (alone), total $68 including a $14 glass of wine', amount: 68, receipt: true },
              { item: 'Uber Black from airport to hotel, 3:10 pm, UberX available', amount: 46, receipt: true },
              { item: 'Coffee', amount: 6, receipt: false },
            ],
          },
        },
        questions: {
          hotel_ok: { type: 'noul', instructions: 'Is the hotel nightly rate in `claim` within `policy`?' },
          dinner_full: { type: 'noul', instructions: 'Is the dinner reimbursable in full ($68)?' },
          dinner_under_cap: { type: 'noul', instructions: 'Is the dinner total below the daily meal limit?' },
          uber_ok: { type: 'noul', instructions: 'Is the Uber Black ride reimbursable?' },
          on_time: { type: 'noul', instructions: 'Was `claim` submitted within the deadline?' },
          coffee_receipt: { type: 'noul', instructions: 'Does the coffee expense require a receipt?' },
        },
      },
      // Denver n'est pas tier-1 : plafond 180 $ < 210 $. Vin exclu. Uber Black à 15 h avec UberX disponible. 18 jours < 30. Café 6 $ < 25 $.
      expected: { hotel_ok: false, dinner_full: false, dinner_under_cap: true, uber_ok: false, on_time: true, coffee_receipt: false },
    },
    {
      id: 'postmortem',
      name: 'Incident postmortem',
      description: 'Long document: cause, impact, owners.',
      category: 'Extraction',
      complexity: 'complexe',
      length: 'long',
      lang: 'en',
      request: {
        state: POSTMORTEM,
        questions: {
          root_cause: {
            type: 'choice',
            instructions: 'What was the root cause of the outage?',
            criteria: { expired_certificate: 'An expired certificate', bad_deploy: 'A faulty deploy', database: 'A database failure', ddos: 'A traffic attack', dns: 'A DNS failure' },
          },
          duration: {
            type: 'choice',
            instructions: 'How long did the outage last?',
            criteria: { under_15: 'Less than 15 minutes', '15_to_30': '15 to 30 minutes', '30_to_60': '30 to 60 minutes', over_60: 'More than an hour' },
          },
          all_failed: { type: 'noul', instructions: 'Did every checkout attempt fail during the incident?' },
          double_charged: { type: 'noul', instructions: 'Were any customers charged twice?' },
          alerting_owner: {
            type: 'choice',
            instructions: 'Who owns adding certificate expiry alerting?',
            criteria: { Priya: 'Priya (Platform)', Tomas: 'Tomás (SRE)', Wei: 'Wei (Platform)', unassigned: 'Nobody yet' },
          },
          severity: { type: 'score', instructions: 'Incident severity', criteria: ['SEV4 — cosmetic', 'SEV3 — minor', 'SEV2 — major, partial outage', 'SEV1 — full outage'] },
        },
      },
      expected: { root_cause: 'expired_certificate', duration: '30_to_60', all_failed: false, double_charged: false, alerting_owner: 'Tomas', severity: [2, 3] },
    },
    {
      id: 'sales-call',
      name: 'Sales call transcript',
      description: 'Long transcript: objection, decision maker, next step.',
      category: 'Extraction',
      complexity: 'complexe',
      length: 'long',
      lang: 'en',
      request: {
        state: SALES_CALL,
        questions: {
          main_objection: {
            type: 'choice',
            instructions: 'What is the prospect’s main concern?',
            criteria: { price: 'Price', security: 'Security and compliance', features: 'Missing features', timing: 'Timing' },
          },
          budget_ok: { type: 'noul', instructions: 'Did the prospect say the price fits their budget?' },
          signer_present: { type: 'noul', instructions: 'Was the person who signs the contract on the call?' },
          next_meeting: { type: 'noul', instructions: 'Was a follow-up meeting scheduled with a date and time?' },
          stage: {
            type: 'choice',
            instructions: 'Which stage best describes this deal?',
            criteria: {
              discovery: 'First call, understanding needs',
              evaluation: 'Prospect assessing fit, technical or security review',
              negotiation: 'Discussing price and contract terms',
              closed_won: 'Contract signed',
              closed_lost: 'Prospect declined',
            },
          },
          interest: { type: 'score', instructions: 'Prospect’s interest level', criteria: ['Not interested', 'Lukewarm', 'Interested', 'Very eager to buy'] },
        },
      },
      expected: { main_objection: 'security', budget_ok: true, signer_present: false, next_meeting: true, stage: 'evaluation', interest: [2, 3] },
    },
    {
      id: 'tickets-needle',
      name: 'Support queue (long context)',
      description: '70 tickets in JSON: find the single legal threat.',
      category: 'Long context',
      complexity: 'complexe',
      length: 'très long',
      lang: 'en',
      request: {
        state: { tickets: syntheticTickets() },
        questions: {
          legal_threat: { type: 'noul', instructions: 'Does any ticket in `tickets` threaten legal action?' },
          legal_customer: {
            type: 'choice',
            instructions: 'Which customer threatened legal action?',
            criteria: { acme: 'Acme Retail', bluefin: 'Bluefin Labs', cedar: 'Cedar Health', halvorsen: 'Halvorsen Logistics', none: 'No customer did' },
          },
          security_incident: { type: 'noul', instructions: 'Does any ticket report a security breach or data leak?' },
        },
      },
      // syntheticTickets : seul T-1044 (Halvorsen Logistics) menace de poursuites ; aucun modèle ne parle de sécurité.
      expected: { legal_threat: true, legal_customer: 'halvorsen', security_incident: false },
    },
  ],
}
