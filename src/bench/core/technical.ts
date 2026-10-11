import type { Json } from '../../types'
import type { Pair } from './pair.ts'

// Technique, tel qu’un modèle de décision le rencontre en production : prédire la sortie d’un court extrait
// (JavaScript, Python, SQL), relire un diff (faille introduite, message de commit trompeur, changement cassant),
// évaluer une configuration, une règle de pare-feu, une expression régulière, une plage semver ou une
// expression cron, trier des alertes de monitoring. Le code est identique dans les deux langues ; seules la
// prose et les questions sont traduites. Chaque sortie a été vérifiée en exécutant le code (Node 26, Python 3,
// SQLite, semver de npm).

// ─── Extraits partagés ───────────────────────────────────────────────────────

const JS_SORT = `const latencies = [120, 85, 1000, 9, 300];
const sorted = latencies.sort();
const median = sorted[Math.floor(sorted.length / 2)];
console.log(sorted[0], median);`

const PY_DEFAULT = `def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags

a = add_tag("urgent")
b = add_tag("billing")
c = add_tag("vip", [])
print(len(a), len(b), len(c), a is b)`

const JS_VERSION = `// Feature flag: dark mode exists since app version 2.9.0
function supportsDarkMode(appVersion) {
  return appVersion >= "2.9.0";
}`

const PY_PAGES = `def page_count(total, per_page):
    return total // per_page

def page_items(items, page, per_page):  # pages are numbered from 1
    start = page * per_page
    return items[start:start + per_page]

items = list(range(1, 46))  # items 1 to 45
for page in range(1, page_count(len(items), 10) + 1):
    send(page_items(items, page, 10))`

const SQL_TICKETS = `CREATE TABLE tickets (id INTEGER, status TEXT, assignee TEXT, priority INTEGER);
INSERT INTO tickets VALUES
  (1, 'open',    'alice', 2),
  (2, 'closed',  'bob',   1),
  (3, 'open',    NULL,    3),
  (4, NULL,      'carol', 2),
  (5, 'pending', NULL,    NULL),
  (6, 'open',    'bob',   1);
CREATE TABLE oncall (assignee TEXT);
INSERT INTO oncall VALUES ('alice'), (NULL);`

const SQL_TICKET_QUERIES = {
  q1: `SELECT COUNT(*) FROM tickets WHERE status <> 'closed';`,
  q2: `SELECT COUNT(assignee) FROM tickets;`,
  q3: `SELECT COUNT(*) FROM tickets WHERE assignee NOT IN (SELECT assignee FROM oncall);`,
  q4: `SELECT AVG(priority) FROM tickets;`,
}

const SQL_ORDERS = `customers(id, name):
  (1, 'Arlan'), (2, 'Brisol'), (3, 'Kestel'), (4, 'Tamaris')
orders(id, customer_id, ordered_at, amount):
  (101, 1, '2026-01-10', 120), (102, 1, '2026-02-03', 80),
  (103, 2, '2026-02-14', 200), (104, 3, '2025-12-28', 50)`

const SQL_JOIN_A = `-- Query A
SELECT c.name, COUNT(o.id) AS n, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.ordered_at >= '2026-01-01'
GROUP BY c.id, c.name
ORDER BY c.id;`

const SQL_JOIN_B = `-- Query B
SELECT c.name, COUNT(o.id) AS n, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.ordered_at >= '2026-01-01'
GROUP BY c.id, c.name
ORDER BY c.id;`

const SQL_JOIN_C = `-- Query C: Query A with COUNT(*) instead of COUNT(o.id)
SELECT c.name, COUNT(*) AS n, SUM(o.amount) AS total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.ordered_at >= '2026-01-01'
GROUP BY c.id, c.name
ORDER BY c.id;`

const DIFF_SQLI = `--- a/app/users/repository.py
+++ b/app/users/repository.py
@@ -18,9 +18,7 @@ def find_user_by_email(email: str):
     # email comes straight from request.args["email"]
     with db.cursor() as cur:
-        cur.execute(
-            "SELECT id, email, role FROM users WHERE email = %s", (email,)
-        )
+        cur.execute(f"SELECT id, email, role FROM users WHERE email = '{email}'")
         return cur.fetchone()`

const DIFF_AUTHZ = `--- a/api/invoices.py
+++ b/api/invoices.py
@@ -41,12 +41,10 @@
 @router.delete("/invoices/{invoice_id}", status_code=204)
 def delete_invoice(invoice_id: int, user: User = Depends(current_user)):
     invoice = db.get(Invoice, invoice_id)
     if invoice is None:
         raise HTTPException(status_code=404)
-    if invoice.account_id != user.account_id:
-        raise HTTPException(status_code=403)
     db.delete(invoice)
     db.commit()`

const DIFF_SECRET = `--- a/billing/settings.py
+++ b/billing/settings.py
@@ -12,3 +12,4 @@
 PAYFLOW_API_URL = "https://api.payflow.example/v2"
 PAYFLOW_TIMEOUT_S = 10
+PAYFLOW_SECRET_KEY = "pf_live_FAKE0000EXAMPLE0000KEY0000"
--- /dev/null
+++ b/.env.example
@@ -0,0 +1,2 @@
+PAYFLOW_SECRET_KEY=changeme
+DATABASE_URL=postgres://user:password@localhost:5432/billing`

const NPM_DEPS = {
  'package.json': { dependencies: { chartkit: '^1.2.3', dateparse: '~1.2.3', tinyqueue: '^0.2.3' } },
  published_versions: {
    chartkit: ['1.2.3', '1.9.4', '1.10.0', '1.11.0-rc.1', '2.0.0'],
    dateparse: ['1.2.3', '1.2.9', '1.3.0', '2.0.0'],
    tinyqueue: ['0.2.3', '0.2.9', '0.2.10', '0.3.0', '1.0.0'],
  },
  dist_tags: { chartkit: { latest: '2.0.0' }, dateparse: { latest: '2.0.0' }, tinyqueue: { latest: '1.0.0' } },
}

const CRONTAB = `# m    h     dom mon dow   command
*/15   9-17  *   *   1-5   /opt/sync/run-inventory-sync
30     7     1   *   1     /opt/reports/send-monthly-report`

const JS_REGEX = String.raw`const SKU = /[A-Z]{3}-\d{4}/;
const ZIP = /^\d{5}$/;
const TAG = /^v\d+\.\d+$/g;

SKU.test("abcXYZ-12345");  // (1)
SKU.test("abc-1234");      // (2)
ZIP.test("75001\n");       // (3)
TAG.test("v1.2");          // (4)
TAG.test("v1.3");          // (5)
TAG.test("v1.4");          // (6)`

const FIREWALL = `# evaluated top to bottom, first match wins
1  allow  tcp  from 10.0.0.0/22      to any           port 22
2  deny   tcp  from 10.0.2.0/24      to any           port 22
3  allow  tcp  from any              to 10.0.10.5/32  port 443
4  deny   ip   from 192.168.0.0/16   to any
5  allow  tcp  from 192.168.4.0/24   to 10.0.10.5/32  port 5432
*  deny   ip   from any              to any           # default policy`

const JS_MERGE = `const defaults = {
  port: 8080,
  db: { host: "localhost", port: 5432, pool: 10 },
  features: ["search"],
};
const production = {
  db: { host: "db.internal" },
  features: ["search", "export"],
};
const config = { ...defaults, ...production };
if (process.env.PORT) config.port = Number(process.env.PORT);
// the service is started with PORT=9090`

const JS_ASYNC = `const ids = [1, 2, 3];
const done = [];
ids.forEach(async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 10 * (4 - id)));
  done.push(id);
});
console.log("count:", done.length);
setTimeout(() => console.log("order:", done.join(",")), 100);
for (var i = 0; i < 3; i++) setTimeout(() => console.log("i:", i), 0);`

const DIFF_PRICING = {
  A: `--- a/src/format.ts
+++ b/src/format.ts
-export function formatPrice(amount: number, currency: string): string {
+export function formatPrice(amount: number, currency: string, locale = "en-US"): string {`,
  B: `--- a/src/quote.ts
+++ b/src/quote.ts
 export interface Quote {
   id: string;
-  total: number;
+  totalAmount: number;
   currency: string;
 }`,
  C: `--- a/src/round.ts
+++ b/src/round.ts
-  return Math.round(value * 100) / 100;
+  return Math.round((value + Number.EPSILON) * 100) / 100;`,
}

// Alertes brutes telles que les envoie l’outil de monitoring : identiques dans les deux langues.
const ALERTS: Json[] = [
  { time: '13:41', source: 'ci-runner-3', alert: 'DiskUsageHigh', severity: 'warning', value: '82%', threshold: '80%', status: 'firing' },
  { time: '13:47', source: 'batch-worker-1', alert: 'HighCPU', severity: 'warning', value: '93%', threshold: '90%', status: 'resolved after 4 min' },
  { time: '13:52', source: 'staging/payments-api', alert: 'PodRestarting', severity: 'info', value: '3 restarts in 15 min', status: 'firing' },
  { time: '14:00', source: 'api.example-shop.test', alert: 'TLSCertExpiringSoon', severity: 'warning', value: 'expires in 27 days', status: 'firing' },
  { time: '14:02', source: 'deploy-bot', alert: 'DeploymentFinished', severity: 'info', value: 'checkout-service v4.12.0 rolled out to 100% (prod)', status: 'event' },
  { time: '14:04', source: 'prod/checkout-service', alert: 'HTTP5xxRateHigh', severity: 'critical', value: '7.8%', threshold: '2%', status: 'firing' },
  { time: '14:05', source: 'prod/checkout-service', alert: 'LatencyP99High', severity: 'warning', value: '2.4 s', threshold: '1.5 s', status: 'firing' },
  { time: '14:06', source: 'ci-runner-3', alert: 'DiskUsageHigh', severity: 'warning', value: '79%', threshold: '80%', status: 'resolved' },
  { time: '14:07', source: 'prod/checkout-service', alert: 'RequestRate', severity: 'info', value: '412 req/s', baseline: '405 req/s (same hour last week)', status: 'ok' },
  { time: '14:07', source: 'prod/orders-db', alert: 'QueryLatencyP95', severity: 'info', value: '18 ms', baseline: '17 ms', status: 'ok' },
  { time: '14:08', source: 'ci-runner-3', alert: 'DiskUsageHigh', severity: 'warning', value: '81%', threshold: '80%', status: 'firing' },
  { time: '14:09', source: 'prod/checkout-service', alert: 'HTTP5xxRateHigh', severity: 'critical', value: '8.1%', threshold: '2%', status: 'firing' },
  { time: '14:10', source: 'prod/checkout-service', alert: 'ErrorLogSpike', severity: 'warning', value: '1,904 × "TypeError: cannot read properties of undefined (reading \'vatRate\')"', status: 'firing' },
  { time: '14:11', source: 'staging/payments-api', alert: 'PodRestarting', severity: 'info', value: '4 restarts in 15 min', status: 'firing' },
]

// ─── Cas ─────────────────────────────────────────────────────────────────────

export const TECHNICAL: Pair[] = [
  {
    id: 'tech-js-default-sort',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // Array.prototype.sort() sans comparateur trie les éléments comme des chaînes : [1000, 120, 300, 85, 9].
    // sorted[0] = 1000, sorted[2] = 300 (la vraie médiane numérique serait 120). sort() trie sur place et renvoie
    // le même tableau : latencies est donc modifié.
    expected: { first_value: 'v1000', median_value: 'v300', original_unchanged: false },
    fr: {
      name: 'Tri par défaut en JavaScript',
      description: 'sort() sans comparateur trie des nombres comme des chaînes, et sur place.',
      state: { language: 'JavaScript (Node.js 22)', context: 'Calcul de la latence médiane d’un service, en millisecondes.', code: JS_SORT },
      questions: {
        first_value: { type: 'choice', instructions: 'Quelle est la première valeur affichée (sorted[0]) ?', criteria: { v9: '9', v85: '85', v120: '120', v1000: '1000' } },
        median_value: { type: 'choice', instructions: 'Quelle valeur le code affiche-t-il comme médiane ?', criteria: { v85: '85', v120: '120', v300: '300', v1000: '1000' } },
        original_unchanged: { type: 'noul', instructions: 'Après l’exécution, le tableau latencies est-il toujours dans son ordre d’origine ?' },
      },
    },
    en: {
      name: 'JavaScript default sort',
      description: 'sort() without a comparator sorts numbers as strings, and in place.',
      state: { language: 'JavaScript (Node.js 22)', context: 'Computing the median latency of a service, in milliseconds.', code: JS_SORT },
      questions: {
        first_value: { type: 'choice', instructions: 'What is the first value printed (sorted[0])?', criteria: { v9: '9', v85: '85', v120: '120', v1000: '1000' } },
        median_value: { type: 'choice', instructions: 'Which value does the code print as the median?', criteria: { v85: '85', v120: '120', v300: '300', v1000: '1000' } },
        original_unchanged: { type: 'noul', instructions: 'After execution, is the latencies array still in its original order?' },
      },
    },
  },
  {
    id: 'tech-py-mutable-default',
    category: 'Technical',
    complexity: 'simple',
    length: 'court',
    // La liste par défaut est créée une seule fois, à la définition de la fonction : a et b sont le même objet
    // ["urgent", "billing"]. c reçoit une liste neuve → ["vip"]. Sortie : 2 2 1 True.
    expected: { len_a: 'two', same_object: true, c_only_vip: true },
    fr: {
      name: 'Argument par défaut mutable',
      description: 'Une liste par défaut partagée entre les appels en Python.',
      state: { language: 'Python 3.12', code: PY_DEFAULT },
      questions: {
        len_a: { type: 'choice', instructions: 'Quelle valeur le programme affiche-t-il pour len(a) ?', criteria: { one: '1', two: '2', three: '3' } },
        same_object: { type: 'noul', instructions: 'L’expression « a is b » vaut-elle True ?' },
        c_only_vip: { type: 'noul', instructions: 'La liste c contient-elle uniquement "vip" ?' },
      },
    },
    en: {
      name: 'Mutable default argument',
      description: 'A default list shared across calls in Python.',
      state: { language: 'Python 3.12', code: PY_DEFAULT },
      questions: {
        len_a: { type: 'choice', instructions: 'What value does the program print for len(a)?', criteria: { one: '1', two: '2', three: '3' } },
        same_object: { type: 'noul', instructions: 'Does the expression “a is b” evaluate to True?' },
        c_only_vip: { type: 'noul', instructions: 'Does list c contain only "vip"?' },
      },
    },
  },
  {
    id: 'tech-js-version-string-compare',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // Comparaison de chaînes, caractère par caractère : "2.10.1" < "2.9.0" ("1" < "9") et "10.0.0" < "2.9.0" ("1" < "2").
    // Résultats : 2.10.1 → false, 3.0.0 → true, 2.9.0 → true, 10.0.0 → false, 2.8.5 → false.
    // Deux versions sur quatre éligibles (≥ 2.9.0) obtiennent true.
    expected: { accepts_2_10_1: false, accepts_10_0_0: false, eligible_true_count: 'two' },
    fr: {
      name: 'Comparaison de versions en chaînes',
      description: 'Un drapeau de fonctionnalité qui compare des numéros de version comme du texte.',
      state: {
        language: 'JavaScript',
        context: 'Revue de code : ce drapeau active le mode sombre pour les applications mobiles. Versions en circulation : 2.8.5, 2.9.0, 2.10.1, 3.0.0 et 10.0.0.',
        code: JS_VERSION,
      },
      questions: {
        accepts_2_10_1: { type: 'noul', instructions: 'supportsDarkMode("2.10.1") renvoie-t-il true ?' },
        accepts_10_0_0: { type: 'noul', instructions: 'supportsDarkMode("10.0.0") renvoie-t-il true ?' },
        eligible_true_count: {
          type: 'choice',
          instructions: 'Parmi les quatre versions en circulation qui ont réellement le mode sombre (2.9.0 et au-delà), combien obtiennent true ?',
          criteria: { one: 'Une', two: 'Deux', three: 'Trois', four: 'Quatre' },
        },
      },
    },
    en: {
      name: 'Version strings compared as text',
      description: 'A feature flag that compares version numbers as text.',
      state: {
        language: 'JavaScript',
        context: 'Code review: this flag enables dark mode for the mobile apps. Versions in the field: 2.8.5, 2.9.0, 2.10.1, 3.0.0 and 10.0.0.',
        code: JS_VERSION,
      },
      questions: {
        accepts_2_10_1: { type: 'noul', instructions: 'Does supportsDarkMode("2.10.1") return true?' },
        accepts_10_0_0: { type: 'noul', instructions: 'Does supportsDarkMode("10.0.0") return true?' },
        eligible_true_count: {
          type: 'choice',
          instructions: 'Of the four versions in the field that actually have dark mode (2.9.0 and later), how many get true?',
          criteria: { one: 'One', two: 'Two', three: 'Three', four: 'Four' },
        },
      },
    },
  },
  {
    id: 'tech-py-pagination',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // page_count(45, 10) = 45 // 10 = 4 (il faudrait 5). page_items(…, 1, 10) commence à l’indice 10 → éléments 11 à 20.
    // Pages 1 à 4 → indices 10 à 49 → éléments 11 à 45 : les éléments 1 à 10 ne sont jamais envoyés, mais 41 à 45 le sont.
    // Les deux erreurs se compensent en partie, d’où le piège.
    expected: { first_page_items: 'items_11_20', first_items_sent: false, last_items_sent: true },
    fr: {
      name: 'Pagination et division entière',
      description: 'Deux décalages d’une unité qui se compensent en partie.',
      state: { language: 'Python 3.12', context: 'Export par lots de 45 éléments numérotés de 1 à 45, 10 par page.', code: PY_PAGES },
      questions: {
        first_page_items: {
          type: 'choice',
          instructions: 'Quels éléments page_items(items, 1, 10) renvoie-t-il ?',
          criteria: { items_1_10: 'Les éléments 1 à 10', items_0_9: 'Les éléments 0 à 9', items_11_20: 'Les éléments 11 à 20', items_10_19: 'Les éléments 10 à 19' },
        },
        first_items_sent: { type: 'noul', instructions: 'La boucle envoie-t-elle les éléments 1 à 10 ?' },
        last_items_sent: { type: 'noul', instructions: 'La boucle envoie-t-elle les éléments 41 à 45 ?' },
      },
    },
    en: {
      name: 'Pagination and integer division',
      description: 'Two off-by-one errors that partly cancel out.',
      state: { language: 'Python 3.12', context: 'Batch export of 45 items numbered 1 to 45, 10 per page.', code: PY_PAGES },
      questions: {
        first_page_items: {
          type: 'choice',
          instructions: 'Which items does page_items(items, 1, 10) return?',
          criteria: { items_1_10: 'Items 1 to 10', items_0_9: 'Items 0 to 9', items_11_20: 'Items 11 to 20', items_10_19: 'Items 10 to 19' },
        },
        first_items_sent: { type: 'noul', instructions: 'Does the loop send items 1 to 10?' },
        last_items_sent: { type: 'noul', instructions: 'Does the loop send items 41 to 45?' },
      },
    },
  },
  {
    id: 'tech-sql-null-semantics',
    category: 'Technical',
    complexity: 'complexe',
    length: 'moyen',
    // q1 : status <> 'closed' est NULL (donc faux) pour la ligne 4 → lignes 1, 3, 5, 6 = 4.
    // q2 : COUNT(assignee) ignore les NULL → 4. q3 : NOT IN sur une sous-requête contenant NULL n’est jamais vrai → 0.
    // q4 : AVG ignore la priorité NULL → 9 / 5 = 1,8 (et non 9 / 6 = 1,5).
    expected: { q1_result: 'four', q3_returns_zero: true, q4_result: 'avg_1_8', q2_equals_row_count: false },
    fr: {
      name: 'NULL en SQL',
      description: 'Comparaisons, COUNT, NOT IN et AVG en présence de NULL.',
      state: { engine: 'SQLite 3 (même comportement en PostgreSQL)', schema_and_data: SQL_TICKETS, queries: SQL_TICKET_QUERIES },
      questions: {
        q1_result: { type: 'choice', instructions: 'Quel nombre la requête q1 renvoie-t-elle ?', criteria: { three: '3', four: '4', five: '5', six: '6' } },
        q3_returns_zero: { type: 'noul', instructions: 'La requête q3 renvoie-t-elle 0 ?' },
        q4_result: { type: 'choice', instructions: 'Que renvoie la requête q4 ?', criteria: { avg_1_5: '1,5', avg_1_8: '1,8', null: 'NULL' } },
        q2_equals_row_count: { type: 'noul', instructions: 'La requête q2 renvoie-t-elle le nombre total de lignes de la table tickets ?' },
      },
    },
    en: {
      name: 'NULL in SQL',
      description: 'Comparisons, COUNT, NOT IN and AVG in the presence of NULL.',
      state: { engine: 'SQLite 3 (same behaviour in PostgreSQL)', schema_and_data: SQL_TICKETS, queries: SQL_TICKET_QUERIES },
      questions: {
        q1_result: { type: 'choice', instructions: 'What number does query q1 return?', criteria: { three: '3', four: '4', five: '5', six: '6' } },
        q3_returns_zero: { type: 'noul', instructions: 'Does query q3 return 0?' },
        q4_result: { type: 'choice', instructions: 'What does query q4 return?', criteria: { avg_1_5: '1.5', avg_1_8: '1.8', null: 'NULL' } },
        q2_equals_row_count: { type: 'noul', instructions: 'Does query q2 return the total number of rows in the tickets table?' },
      },
    },
  },
  {
    id: 'tech-sql-left-join-filter',
    category: 'Technical',
    complexity: 'complexe',
    length: 'moyen',
    // A : le filtre de date est dans le ON, tous les clients restent → Arlan 2/200, Brisol 1/200, Kestel 0/NULL, Tamaris 0/NULL.
    // La commande 104 de Kestel (2025) est exclue par la jointure : SUM sur aucune ligne → NULL, pas 50.
    // B : le filtre dans le WHERE élimine les lignes complétées par NULL → la jointure devient interne, 2 lignes.
    // C : COUNT(*) compte la ligne complétée par NULL → Tamaris a n = 1.
    expected: { rows_in_b: 'two', kestel_total_a: 'null', tamaris_n_c: 'one' },
    fr: {
      name: 'LEFT JOIN et filtre',
      description: 'Filtre dans le ON ou dans le WHERE, COUNT(*) ou COUNT(colonne).',
      state: { engine: 'SQLite 3 (même comportement en PostgreSQL)', tables: SQL_ORDERS, queries: [SQL_JOIN_A, SQL_JOIN_B, SQL_JOIN_C] },
      questions: {
        rows_in_b: { type: 'choice', instructions: 'Combien de lignes la requête B renvoie-t-elle ?', criteria: { two: '2', three: '3', four: '4' } },
        kestel_total_a: { type: 'choice', instructions: 'Quelle valeur la colonne total prend-elle pour Kestel dans la requête A ?', criteria: { zero: '0', fifty: '50', null: 'NULL' } },
        tamaris_n_c: { type: 'choice', instructions: 'Quelle valeur la colonne n prend-elle pour Tamaris dans la requête C ?', criteria: { zero: '0', one: '1', null: 'NULL' } },
      },
    },
    en: {
      name: 'LEFT JOIN and filtering',
      description: 'Filter in the ON clause or in the WHERE clause, COUNT(*) or COUNT(column).',
      state: { engine: 'SQLite 3 (same behaviour in PostgreSQL)', tables: SQL_ORDERS, queries: [SQL_JOIN_A, SQL_JOIN_B, SQL_JOIN_C] },
      questions: {
        rows_in_b: { type: 'choice', instructions: 'How many rows does query B return?', criteria: { two: '2', three: '3', four: '4' } },
        kestel_total_a: { type: 'choice', instructions: 'What value does the total column have for Kestel in query A?', criteria: { zero: '0', fifty: '50', null: 'NULL' } },
        tamaris_n_c: { type: 'choice', instructions: 'What value does the n column have for Tamaris in query C?', criteria: { zero: '0', one: '1', null: 'NULL' } },
      },
    },
  },
  {
    id: 'tech-diff-sql-injection',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // Le paramètre lié (%s) est remplacé par une f-string : la valeur de request.args est insérée telle quelle dans la requête.
    // Une adresse comme « x' OR '1'='1 » renvoie le premier utilisateur, une UNION peut lire d’autres tables : injection SQL
    // exploitable sans authentification sur la table des utilisateurs → gravité élevée à critique. Le message parle de
    // simple refactorisation sans changement fonctionnel : il est faux.
    expected: { introduces_vulnerability: true, vulnerability_type: 'sql_injection', severity: [3, 4], commit_message_accurate: false },
    fr: {
      name: 'Diff : requête construite par f-string',
      description: 'Une « simplification » qui remplace un paramètre lié par une interpolation.',
      state: {
        commit_message: 'refactor(users): simplify query building, no functional change',
        context: 'Le point d’accès GET /users/lookup?email=… est public et appelle find_user_by_email.',
        diff: DIFF_SQLI,
      },
      questions: {
        introduces_vulnerability: { type: 'noul', instructions: 'Ce diff introduit-il une faille de sécurité ?' },
        vulnerability_type: {
          type: 'choice',
          instructions: 'De quel type de faille s’agit-il ?',
          criteria: { sql_injection: 'Injection SQL', xss: 'Injection de script (XSS)', ssrf: 'Falsification de requête côté serveur (SSRF)', none: 'Aucune faille' },
        },
        severity: { type: 'score', instructions: 'Gravité du problème introduit', criteria: ['Aucune', 'Faible', 'Moyenne', 'Élevée', 'Critique'] },
        commit_message_accurate: { type: 'noul', instructions: 'Le message de commit décrit-il fidèlement l’effet du diff ?' },
      },
    },
    en: {
      name: 'Diff: query built with an f-string',
      description: 'A “simplification” that replaces a bound parameter with interpolation.',
      state: {
        commit_message: 'refactor(users): simplify query building, no functional change',
        context: 'The GET /users/lookup?email=… endpoint is public and calls find_user_by_email.',
        diff: DIFF_SQLI,
      },
      questions: {
        introduces_vulnerability: { type: 'noul', instructions: 'Does this diff introduce a security vulnerability?' },
        vulnerability_type: {
          type: 'choice',
          instructions: 'What type of vulnerability is it?',
          criteria: { sql_injection: 'SQL injection', xss: 'Cross-site scripting (XSS)', ssrf: 'Server-side request forgery (SSRF)', none: 'No vulnerability' },
        },
        severity: { type: 'score', instructions: 'Severity of the problem introduced', criteria: ['None', 'Low', 'Medium', 'High', 'Critical'] },
        commit_message_accurate: { type: 'noul', instructions: 'Does the commit message faithfully describe the effect of the diff?' },
      },
    },
  },
  {
    id: 'tech-diff-authz-removed',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // La vérification invoice.account_id != user.account_id disparaît : tout utilisateur connecté peut supprimer la facture
    // d’un autre compte en devinant son identifiant (contrôle d’accès défaillant, type IDOR). La passerelle ne fait que
    // l’authentification. Aucune requête n’est supprimée : db.get est toujours exécuté, la comparaison se faisait en mémoire.
    expected: { any_user_can_delete: true, vulnerability_type: 'broken_access_control', fewer_db_queries: false, verdict: 'request_changes' },
    fr: {
      name: 'Diff : contrôle d’autorisation supprimé',
      description: 'Un commit « perf » qui retire la vérification du propriétaire.',
      state: {
        commit_message: 'perf(invoices): drop redundant DB query in delete_invoice',
        context: 'Les identifiants de facture sont des entiers séquentiels. La passerelle d’API vérifie seulement que le jeton est valide (authentification) ; les droits sont contrôlés dans chaque route.',
        diff: DIFF_AUTHZ,
      },
      questions: {
        any_user_can_delete: { type: 'noul', instructions: 'Après ce diff, un utilisateur connecté peut-il supprimer une facture appartenant à un autre compte ?' },
        vulnerability_type: {
          type: 'choice',
          instructions: 'Quelle catégorie de faille ce diff introduit-il ?',
          criteria: { broken_access_control: 'Contrôle d’accès défaillant', csrf: 'Falsification de requête intersite (CSRF)', sql_injection: 'Injection SQL', none: 'Aucune' },
        },
        fewer_db_queries: { type: 'noul', instructions: 'Ce diff réduit-il le nombre de requêtes à la base de données, comme l’annonce le message de commit ?' },
        verdict: {
          type: 'choice',
          instructions: 'Quelle décision de revue convient ?',
          criteria: { approve: 'Approuver', approve_with_nits: 'Approuver avec des remarques mineures', request_changes: 'Demander des modifications' },
        },
      },
    },
    en: {
      name: 'Diff: authorization check removed',
      description: 'A “perf” commit that removes the ownership check.',
      state: {
        commit_message: 'perf(invoices): drop redundant DB query in delete_invoice',
        context: 'Invoice IDs are sequential integers. The API gateway only checks that the token is valid (authentication); permissions are checked in each route.',
        diff: DIFF_AUTHZ,
      },
      questions: {
        any_user_can_delete: { type: 'noul', instructions: 'After this diff, can a logged-in user delete an invoice belonging to another account?' },
        vulnerability_type: {
          type: 'choice',
          instructions: 'What category of vulnerability does this diff introduce?',
          criteria: { broken_access_control: 'Broken access control', csrf: 'Cross-site request forgery (CSRF)', sql_injection: 'SQL injection', none: 'None' },
        },
        fewer_db_queries: { type: 'noul', instructions: 'Does this diff reduce the number of database queries, as the commit message claims?' },
        verdict: {
          type: 'choice',
          instructions: 'Which review decision is appropriate?',
          criteria: { approve: 'Approve', approve_with_nits: 'Approve with minor comments', request_changes: 'Request changes' },
        },
      },
    },
  },
  {
    id: 'tech-diff-committed-secret',
    category: 'Technical',
    complexity: 'simple',
    length: 'court',
    // settings.py contient la clé secrète de production (préfixe pf_live_), poussée sur un dépôt public : fuite avérée.
    // .env.example ne contient que des valeurs d’exemple (changeme, user:password@localhost) : pas une fuite.
    // Supprimer la ligne ou réécrire l’historique ne suffit pas, la clé a pu être copiée : il faut d’abord la révoquer.
    expected: { live_key_exposed: true, example_file_leak: false, first_action: 'rotate_key' },
    fr: {
      name: 'Diff : secret commité',
      description: 'Une clé de production poussée sur un dépôt public, à côté d’un fichier d’exemple.',
      state: {
        repository: 'Dépôt public sur une forge en ligne',
        context: 'Ce commit a été poussé sur la branche principale il y a deux heures. La valeur PAYFLOW_SECRET_KEY de settings.py est la clé de production du prestataire de paiement (masquée ici).',
        diff: DIFF_SECRET,
      },
      questions: {
        live_key_exposed: { type: 'noul', instructions: 'Ce commit expose-t-il un secret de production ?' },
        example_file_leak: { type: 'noul', instructions: 'Le fichier .env.example constitue-t-il, lui aussi, une fuite de secret ?' },
        first_action: {
          type: 'choice',
          instructions: 'Quelle est la première action à mener ?',
          criteria: {
            delete_line: 'Supprimer la ligne dans un nouveau commit',
            rewrite_history: 'Réécrire l’historique Git pour effacer le commit',
            rotate_key: 'Révoquer la clé et en émettre une nouvelle',
            make_private: 'Passer le dépôt en privé',
          },
        },
      },
    },
    en: {
      name: 'Diff: committed secret',
      description: 'A production key pushed to a public repository, next to an example file.',
      state: {
        repository: 'Public repository on an online code host',
        context: 'This commit was pushed to the main branch two hours ago. The PAYFLOW_SECRET_KEY value in settings.py is the payment provider’s production key (masked here).',
        diff: DIFF_SECRET,
      },
      questions: {
        live_key_exposed: { type: 'noul', instructions: 'Does this commit expose a production secret?' },
        example_file_leak: { type: 'noul', instructions: 'Is the .env.example file a secret leak as well?' },
        first_action: {
          type: 'choice',
          instructions: 'What is the first thing to do?',
          criteria: {
            delete_line: 'Remove the line in a new commit',
            rewrite_history: 'Rewrite the Git history to erase the commit',
            rotate_key: 'Revoke the key and issue a new one',
            make_private: 'Make the repository private',
          },
        },
      },
    },
  },
  {
    id: 'tech-npm-semver-ranges',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // ^1.2.3 = >=1.2.3 <2.0.0 : 1.10.0 (comparaison numérique, 10 > 9) ; la préversion 1.11.0-rc.1 est exclue, 2.0.0 aussi.
    // ~1.2.3 = >=1.2.3 <1.3.0 → 1.2.9. ^0.2.3 = >=0.2.3 <0.3.0 → 0.2.10. Une future 1.12.0 satisfait ^1.2.3.
    // Les dist-tags latest sont donnés et hors plage : npm, qui préfère latest quand il satisfait la plage, prend donc la plus haute version satisfaisante.
    expected: { chartkit_version: 'v1_10_0', dateparse_gets_1_3: false, tinyqueue_version: 'v0_2_10', future_1_12_accepted: true },
    fr: {
      name: 'Plages semver de npm',
      description: 'Caret, tilde, versions 0.x et préversions.',
      state: { tool: 'npm 10, installation sans fichier de verrouillage', ...NPM_DEPS },
      questions: {
        chartkit_version: {
          type: 'choice',
          instructions: 'Quelle version de chartkit npm installera-t-il ?',
          criteria: { v1_9_4: '1.9.4', v1_10_0: '1.10.0', v1_11_0_rc_1: '1.11.0-rc.1', v2_0_0: '2.0.0' },
        },
        dateparse_gets_1_3: { type: 'noul', instructions: 'npm installera-t-il dateparse 1.3.0 ?' },
        tinyqueue_version: {
          type: 'choice',
          instructions: 'Quelle version de tinyqueue npm installera-t-il ?',
          criteria: { v0_2_9: '0.2.9', v0_2_10: '0.2.10', v0_3_0: '0.3.0', v1_0_0: '1.0.0' },
        },
        future_1_12_accepted: { type: 'noul', instructions: 'Si chartkit publie demain une version 1.12.0, satisfera-t-elle la plage déclarée dans package.json ?' },
      },
    },
    en: {
      name: 'npm semver ranges',
      description: 'Caret, tilde, 0.x versions and prereleases.',
      state: { tool: 'npm 10, install without a lockfile', ...NPM_DEPS },
      questions: {
        chartkit_version: {
          type: 'choice',
          instructions: 'Which version of chartkit will npm install?',
          criteria: { v1_9_4: '1.9.4', v1_10_0: '1.10.0', v1_11_0_rc_1: '1.11.0-rc.1', v2_0_0: '2.0.0' },
        },
        dateparse_gets_1_3: { type: 'noul', instructions: 'Will npm install dateparse 1.3.0?' },
        tinyqueue_version: {
          type: 'choice',
          instructions: 'Which version of tinyqueue will npm install?',
          criteria: { v0_2_9: '0.2.9', v0_2_10: '0.2.10', v0_3_0: '0.3.0', v1_0_0: '1.0.0' },
        },
        future_1_12_accepted: { type: 'noul', instructions: 'If chartkit publishes a 1.12.0 version tomorrow, will it satisfy the range declared in package.json?' },
      },
    },
  },
  {
    id: 'tech-cron-schedule',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // */15 9-17 * * 1-5 : minutes 0, 15, 30, 45 de 9 h à 17 h incluses, du lundi au vendredi → vendredi 17:45 oui, samedi non.
    // 9 heures (9 à 17) × 4 = 36 exécutions par jour ouvré (et non 32 ni 40).
    // 30 7 1 * 1 : jour du mois ET jour de semaine restreints → cron les combine par OU : le 1er de chaque mois ou chaque lundi.
    // Mars 2026 : dimanche 1er + lundis 2, 9, 16, 23, 30 → 6 exécutions.
    expected: { sync_friday_1745: true, sync_saturday_10: false, sync_runs_per_weekday: 'runs_36', report_runs_march: 'six' },
    fr: {
      name: 'Expressions cron',
      description: 'Plage d’heures incluse et combinaison jour du mois / jour de semaine.',
      state: {
        scheduler: 'cron Linux (cronie), heure locale du serveur',
        calendar: 'Le 1er mars 2026 est un dimanche ; mars compte 31 jours.',
        crontab: CRONTAB,
      },
      questions: {
        sync_friday_1745: { type: 'noul', instructions: 'La synchronisation d’inventaire s’exécute-t-elle le vendredi 13 mars 2026 à 17 h 45 ?' },
        sync_saturday_10: { type: 'noul', instructions: 'La synchronisation d’inventaire s’exécute-t-elle le samedi 14 mars 2026 à 10 h 00 ?' },
        sync_runs_per_weekday: {
          type: 'choice',
          instructions: 'Combien de fois la synchronisation d’inventaire s’exécute-t-elle un mardi ?',
          criteria: { runs_32: '32', runs_36: '36', runs_40: '40', runs_44: '44' },
        },
        report_runs_march: {
          type: 'choice',
          instructions: 'Combien de fois le rapport mensuel est-il envoyé en mars 2026 ?',
          criteria: { zero: '0', one: '1', five: '5', six: '6' },
        },
      },
    },
    en: {
      name: 'Cron expressions',
      description: 'Inclusive hour range and day-of-month / day-of-week combination.',
      state: {
        scheduler: 'Linux cron (cronie), server local time',
        calendar: 'March 1, 2026 is a Sunday; March has 31 days.',
        crontab: CRONTAB,
      },
      questions: {
        sync_friday_1745: { type: 'noul', instructions: 'Does the inventory sync run on Friday, March 13, 2026 at 5:45 pm?' },
        sync_saturday_10: { type: 'noul', instructions: 'Does the inventory sync run on Saturday, March 14, 2026 at 10:00 am?' },
        sync_runs_per_weekday: {
          type: 'choice',
          instructions: 'How many times does the inventory sync run on a Tuesday?',
          criteria: { runs_32: '32', runs_36: '36', runs_40: '40', runs_44: '44' },
        },
        report_runs_march: {
          type: 'choice',
          instructions: 'How many times is the monthly report sent in March 2026?',
          criteria: { zero: '0', one: '1', five: '5', six: '6' },
        },
      },
    },
  },
  {
    id: 'tech-js-regex-pitfalls',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // (1) SKU n’est pas ancré : « XYZ-1234 » figure dans la chaîne → true. (2) [A-Z] sans drapeau i refuse « abc » → false.
    // (3) En JavaScript, sans drapeau m, $ ne correspond qu’à la toute fin de la chaîne : le \n final fait échouer → false
    // (en Python, re.match avec $ accepterait). (4)–(6) Avec le drapeau g, test() mémorise lastIndex : true (lastIndex = 4),
    // puis la recherche reprend à l’indice 4 de « v1.3 » → false et remise à 0, puis true.
    expected: { sku_accepts_long: true, sku_accepts_lowercase: false, zip_trailing_newline: false, tag_sequence: 'true_false_true' },
    fr: {
      name: 'Pièges des expressions régulières',
      description: 'Absence d’ancres, fin de chaîne et état du drapeau g en JavaScript.',
      state: { language: 'JavaScript (Node.js 22)', code: JS_REGEX },
      questions: {
        sku_accepts_long: { type: 'noul', instructions: 'L’appel (1) renvoie-t-il true ?' },
        sku_accepts_lowercase: { type: 'noul', instructions: 'L’appel (2) renvoie-t-il true ?' },
        zip_trailing_newline: { type: 'noul', instructions: 'L’appel (3) renvoie-t-il true ?' },
        tag_sequence: {
          type: 'choice',
          instructions: 'Que renvoient successivement les appels (4), (5) et (6) ?',
          criteria: { true_false_true: 'true, false, true', true_true_true: 'true, true, true', true_false_false: 'true, false, false', false_true_false: 'false, true, false' },
        },
      },
    },
    en: {
      name: 'Regular expression pitfalls',
      description: 'Missing anchors, end of string and g-flag state in JavaScript.',
      state: { language: 'JavaScript (Node.js 22)', code: JS_REGEX },
      questions: {
        sku_accepts_long: { type: 'noul', instructions: 'Does call (1) return true?' },
        sku_accepts_lowercase: { type: 'noul', instructions: 'Does call (2) return true?' },
        zip_trailing_newline: { type: 'noul', instructions: 'Does call (3) return true?' },
        tag_sequence: {
          type: 'choice',
          instructions: 'What do calls (4), (5) and (6) return, in order?',
          criteria: { true_false_true: 'true, false, true', true_true_true: 'true, true, true', true_false_false: 'true, false, false', false_true_false: 'false, true, false' },
        },
      },
    },
  },
  {
    id: 'tech-firewall-first-match',
    category: 'Technical',
    complexity: 'complexe',
    length: 'moyen',
    // 10.0.0.0/22 couvre 10.0.0.0 à 10.0.3.255. 10.0.2.15:22 → règle 1, autorisé (la règle 2 n’est jamais atteinte).
    // 10.0.4.17:22 → hors du /22, aucune règle → politique par défaut, refusé.
    // 192.168.4.20 → 10.0.10.5:5432 → règle 4 (deny ip 192.168.0.0/16) avant la règle 5 → refusé.
    // Règles mortes : 2 (10.0.2.0/24 ⊂ 10.0.0.0/22, même port) et 5 (192.168.4.0/24 ⊂ 192.168.0.0/16, ip couvre tcp).
    expected: { ssh_10_0_2_15_allowed: true, rule_for_10_0_4_17: 'default', db_from_192_168_4_20_allowed: false, dead_rules: 'both' },
    fr: {
      name: 'Pare-feu : première règle applicable',
      description: 'Ordre des règles, appartenance à un sous-réseau CIDR et règles masquées.',
      state: { firewall: 'Pare-feu à état, règles évaluées dans l’ordre, la première qui correspond décide.', rules: FIREWALL },
      questions: {
        ssh_10_0_2_15_allowed: { type: 'noul', instructions: 'Une connexion SSH (TCP 22) de 10.0.2.15 vers 10.0.10.8 est-elle autorisée ?' },
        rule_for_10_0_4_17: {
          type: 'choice',
          instructions: 'Quelle règle décide du sort d’une connexion SSH (TCP 22) de 10.0.4.17 vers 10.0.10.8 ?',
          criteria: { rule_1: 'La règle 1', rule_2: 'La règle 2', rule_4: 'La règle 4', default: 'La politique par défaut' },
        },
        db_from_192_168_4_20_allowed: { type: 'noul', instructions: 'Une connexion TCP de 192.168.4.20 vers 10.0.10.5 sur le port 5432 est-elle autorisée ?' },
        dead_rules: {
          type: 'choice',
          instructions: 'Quelles règles ne peuvent jamais décider de quoi que ce soit, parce qu’une règle plus haute intercepte toujours leur trafic ?',
          criteria: { rule_2: 'La règle 2 seulement', rule_5: 'La règle 5 seulement', both: 'Les règles 2 et 5', none: 'Aucune' },
        },
      },
    },
    en: {
      name: 'Firewall: first matching rule',
      description: 'Rule order, CIDR subnet membership and shadowed rules.',
      state: { firewall: 'Stateful firewall, rules evaluated in order, the first match decides.', rules: FIREWALL },
      questions: {
        ssh_10_0_2_15_allowed: { type: 'noul', instructions: 'Is an SSH connection (TCP 22) from 10.0.2.15 to 10.0.10.8 allowed?' },
        rule_for_10_0_4_17: {
          type: 'choice',
          instructions: 'Which rule decides an SSH connection (TCP 22) from 10.0.4.17 to 10.0.10.8?',
          criteria: { rule_1: 'Rule 1', rule_2: 'Rule 2', rule_4: 'Rule 4', default: 'The default policy' },
        },
        db_from_192_168_4_20_allowed: { type: 'noul', instructions: 'Is a TCP connection from 192.168.4.20 to 10.0.10.5 on port 5432 allowed?' },
        dead_rules: {
          type: 'choice',
          instructions: 'Which rules can never decide anything, because a rule higher up always catches their traffic?',
          criteria: { rule_2: 'Rule 2 only', rule_5: 'Rule 5 only', both: 'Rules 2 and 5', none: 'None' },
        },
      },
    },
  },
  {
    id: 'tech-config-shallow-merge',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // La décomposition { ...defaults, ...production } est superficielle : production.db remplace entièrement defaults.db
    // → db = { host: "db.internal" }, db.port et db.pool sont undefined. features est remplacé (2 éléments). PORT=9090 → 9090.
    // defaults n’est pas modifié par la décomposition : defaults.db.port vaut toujours 5432.
    expected: { db_port: 'undefined', port: 'p9090', features_count_two: true, defaults_untouched: true },
    fr: {
      name: 'Fusion de configuration superficielle',
      description: 'L’opérateur de décomposition ne fusionne pas les objets imbriqués.',
      state: { language: 'JavaScript (Node.js 22)', code: JS_MERGE },
      questions: {
        db_port: { type: 'choice', instructions: 'Que vaut config.db.port ?', criteria: { n5432: '5432', s5432: '"5432"', undefined: 'undefined', null: 'null' } },
        port: { type: 'choice', instructions: 'Que vaut config.port ?', criteria: { p8080: '8080', p9090: '9090', s9090: '"9090"' } },
        features_count_two: { type: 'noul', instructions: 'config.features contient-il exactement deux éléments ?' },
        defaults_untouched: { type: 'noul', instructions: 'Après ce code, defaults.db.port vaut-il toujours 5432 ?' },
      },
    },
    en: {
      name: 'Shallow configuration merge',
      description: 'The spread operator does not merge nested objects.',
      state: { language: 'JavaScript (Node.js 22)', code: JS_MERGE },
      questions: {
        db_port: { type: 'choice', instructions: 'What is the value of config.db.port?', criteria: { n5432: '5432', s5432: '"5432"', undefined: 'undefined', null: 'null' } },
        port: { type: 'choice', instructions: 'What is the value of config.port?', criteria: { p8080: '8080', p9090: '9090', s9090: '"9090"' } },
        features_count_two: { type: 'noul', instructions: 'Does config.features contain exactly two elements?' },
        defaults_untouched: { type: 'noul', instructions: 'After this code runs, is defaults.db.port still 5432?' },
      },
    },
  },
  {
    id: 'tech-http-status-codes',
    category: 'Technical',
    complexity: 'simple',
    length: 'court',
    // Jeton valide mais droits insuffisants : 403 (401 = non authentifié). Délai dépassé côté amont, vu par la passerelle : 504
    // (502 = réponse invalide de l’amont). Un POST de paiement non idempotent, sans clé d’idempotence, ne se rejoue pas
    // automatiquement après un 504 : le paiement a pu être exécuté.
    expected: { missing_scope_code: 'c403', gateway_timeout_code: 'c504', auto_retry_payment: false },
    fr: {
      name: 'Codes de statut HTTP',
      description: 'Authentification ou autorisation, erreurs de passerelle, rejeu d’un POST.',
      state:
        'Une passerelle d’API se place devant le service de paiement. Le client mobile envoie un jeton valide, mais ce jeton ne possède pas la permission « payments:write » exigée par POST /payments. Plus tard, un autre appel POST /payments, correctement autorisé, est transmis au service de paiement, qui ne répond pas dans le délai de 30 secondes de la passerelle ; on ignore si le paiement a été exécuté. Le client n’envoie pas d’en-tête Idempotency-Key.',
      questions: {
        missing_scope_code: { type: 'choice', instructions: 'Quel code la passerelle doit-elle renvoyer pour le jeton sans la permission requise ?', criteria: { c400: '400', c401: '401', c403: '403', c404: '404' } },
        gateway_timeout_code: { type: 'choice', instructions: 'Quel code la passerelle renvoie-t-elle quand le service de paiement ne répond pas à temps ?', criteria: { c500: '500', c502: '502', c503: '503', c504: '504' } },
        auto_retry_payment: { type: 'noul', instructions: 'Après l’erreur de délai, le client doit-il renvoyer automatiquement ce même POST /payments, sans vérifier au préalable si le paiement a été enregistré ?' },
      },
    },
    en: {
      name: 'HTTP status codes',
      description: 'Authentication or authorization, gateway errors, retrying a POST.',
      state:
        'An API gateway sits in front of the payment service. The mobile client sends a valid token, but that token lacks the “payments:write” permission required by POST /payments. Later, another POST /payments call, properly authorized, is forwarded to the payment service, which does not respond within the gateway’s 30-second timeout; whether the payment was executed is unknown. The client does not send an Idempotency-Key header.',
      questions: {
        missing_scope_code: { type: 'choice', instructions: 'Which status code should the gateway return for the token lacking the required permission?', criteria: { c400: '400', c401: '401', c403: '403', c404: '404' } },
        gateway_timeout_code: { type: 'choice', instructions: 'Which status code does the gateway return when the payment service does not respond in time?', criteria: { c500: '500', c502: '502', c503: '503', c504: '504' } },
        auto_retry_payment: { type: 'noul', instructions: 'After the timeout error, should the client automatically resend this same POST /payments, without first checking whether the payment went through?' },
      },
    },
  },
  {
    id: 'tech-alert-triage',
    category: 'Technical',
    complexity: 'complexe',
    length: 'long',
    // Seul vrai incident : le taux de 5xx du checkout en production (7,8 % puis 8,1 % pour un seuil de 2 %), apparu deux minutes
    // après le déploiement de v4.12.0, avec une exception nouvelle dans les journaux. Trafic et base de données normaux :
    // la cause probable est le déploiement. Bruit : disque du runner CI qui oscille autour de 80 %, CPU du batch résolu,
    // redémarrages en préproduction, certificat à 27 jours (à planifier, pas à réveiller quelqu’un).
    // Environ 8 % des paiements échouent : majeur ou critique.
    expected: { real_incident: 'checkout_errors', probable_cause: 'deploy', page_oncall: true, severity: [2, 3] },
    fr: {
      name: 'Tri d’alertes de monitoring',
      description: 'Une vraie panne au milieu d’alertes bruyantes, juste après un déploiement.',
      state: {
        context: 'Vous êtes de garde pour la boutique en ligne. Le service checkout traite les paiements des clients en production. Le runner CI ci-runner-3 vide son cache chaque nuit à 3 h et franchit régulièrement le seuil de disque en journée. batch-worker-1 exécute des traitements par lots ponctuels. Le certificat TLS est renouvelé automatiquement 21 jours avant expiration.',
        alerts: ALERTS,
      },
      questions: {
        real_incident: {
          type: 'choice',
          instructions: 'Quelle alerte correspond à un vrai incident à traiter maintenant ?',
          criteria: {
            ci_disk: 'Disque de ci-runner-3',
            batch_cpu: 'CPU de batch-worker-1',
            staging_restarts: 'Redémarrages de payments-api en préproduction',
            cert_expiry: 'Expiration du certificat TLS',
            checkout_errors: 'Erreurs 5xx du service checkout en production',
          },
        },
        probable_cause: {
          type: 'choice',
          instructions: 'Quelle est la cause la plus probable de cet incident ?',
          criteria: { traffic_spike: 'Un pic de trafic', database: 'Un ralentissement de la base de données', deploy: 'Le déploiement de checkout-service v4.12.0', certificate: 'Le certificat TLS' },
        },
        page_oncall: { type: 'noul', instructions: 'Faut-il déclencher l’astreinte immédiatement ?' },
        severity: { type: 'score', instructions: 'Gravité de l’incident', criteria: ['Information', 'Mineure', 'Majeure', 'Critique'] },
      },
    },
    en: {
      name: 'Monitoring alert triage',
      description: 'A real outage amid noisy alerts, right after a deployment.',
      state: {
        context: 'You are on call for the online shop. The checkout service processes customer payments in production. The CI runner ci-runner-3 clears its cache every night at 3 am and regularly crosses the disk threshold during the day. batch-worker-1 runs occasional batch jobs. The TLS certificate is renewed automatically 21 days before expiry.',
        alerts: ALERTS,
      },
      questions: {
        real_incident: {
          type: 'choice',
          instructions: 'Which alert corresponds to a real incident to handle now?',
          criteria: {
            ci_disk: 'ci-runner-3 disk',
            batch_cpu: 'batch-worker-1 CPU',
            staging_restarts: 'payments-api restarts in staging',
            cert_expiry: 'TLS certificate expiry',
            checkout_errors: 'checkout service 5xx errors in production',
          },
        },
        probable_cause: {
          type: 'choice',
          instructions: 'What is the most likely cause of this incident?',
          criteria: { traffic_spike: 'A traffic spike', database: 'A database slowdown', deploy: 'The checkout-service v4.12.0 deployment', certificate: 'The TLS certificate' },
        },
        page_oncall: { type: 'noul', instructions: 'Should the on-call engineer be paged immediately?' },
        severity: { type: 'score', instructions: 'Severity of the incident', criteria: ['Informational', 'Minor', 'Major', 'Critical'] },
      },
    },
  },
  {
    id: 'tech-js-async-foreach',
    category: 'Technical',
    complexity: 'complexe',
    length: 'court',
    // forEach n’attend pas les fonctions async : console.log s’exécute avant tout push → « count: 0 ».
    // Les trois minuteries à 0 ms passent ensuite ; var est partagé par la boucle, déjà à 3 → « i: 3 » trois fois.
    // Les push se font à 30, 20 et 10 ms pour id 1, 2, 3 → ordre 3,2,1, affiché à 100 ms.
    expected: { count_printed: 'zero', i_values_0_1_2: false, final_order: 'o321', line_after_count: 'i_line' },
    fr: {
      name: 'async dans forEach et var dans une boucle',
      description: 'Ordre d’exécution de la boucle d’événements de Node.js.',
      state: { language: 'JavaScript (Node.js 22)', code: JS_ASYNC },
      questions: {
        count_printed: { type: 'choice', instructions: 'Quelle valeur est affichée après « count: » ?', criteria: { zero: '0', one: '1', three: '3' } },
        i_values_0_1_2: { type: 'noul', instructions: 'Les lignes « i: » affichent-elles 0, 1 et 2 ?' },
        final_order: { type: 'choice', instructions: 'Qu’affiche la ligne « order: » ?', criteria: { o123: '1,2,3', o321: '3,2,1', empty: 'Une chaîne vide' } },
        line_after_count: {
          type: 'choice',
          instructions: 'Quelle ligne est affichée juste après la ligne « count: » ?',
          criteria: { order_line: 'La ligne « order: »', i_line: 'Une ligne « i: »', nothing: 'Aucune autre ligne' },
        },
      },
    },
    en: {
      name: 'async in forEach and var in a loop',
      description: 'Execution order in the Node.js event loop.',
      state: { language: 'JavaScript (Node.js 22)', code: JS_ASYNC },
      questions: {
        count_printed: { type: 'choice', instructions: 'What value is printed after “count:”?', criteria: { zero: '0', one: '1', three: '3' } },
        i_values_0_1_2: { type: 'noul', instructions: 'Do the “i:” lines print 0, 1 and 2?' },
        final_order: { type: 'choice', instructions: 'What does the “order:” line print?', criteria: { o123: '1,2,3', o321: '3,2,1', empty: 'An empty string' } },
        line_after_count: {
          type: 'choice',
          instructions: 'Which line is printed right after the “count:” line?',
          criteria: { order_line: 'The “order:” line', i_line: 'An “i:” line', nothing: 'No other line' },
        },
      },
    },
  },
  {
    id: 'tech-breaking-change-bump',
    category: 'Technical',
    complexity: 'simple',
    length: 'court',
    // A : paramètre optionnel avec valeur par défaut, les appels existants fonctionnent et (énoncé) renvoient le même résultat → mineure.
    // B : renommer un champ d’une interface publique casse les consommateurs → majeure.
    // C : correction d’arrondi sans changement d’API → correctif. La version publiée regroupe les trois : 2.4.1 → 3.0.0.
    expected: { bump_a: 'minor', bump_b: 'major', bump_c: 'patch', next_version: 'v3_0_0' },
    fr: {
      name: 'Changement cassant et version sémantique',
      description: 'Classer trois diffs d’une bibliothèque publique selon semver.',
      state: {
        package: '@acme/pricing, version actuelle 2.4.1, bibliothèque publiée sur npm et suivant le versionnage sémantique',
        context: 'La prochaine version publiée contiendra les trois diffs ci-dessous. formatPrice et Quote sont exportés publiquement. Appelé sans l’argument locale, formatPrice renvoie exactement le même résultat qu’avant.',
        diffs: DIFF_PRICING,
      },
      questions: {
        bump_a: { type: 'choice', instructions: 'Quel niveau de version le diff A exige-t-il à lui seul ?', criteria: { major: 'Majeure', minor: 'Mineure', patch: 'Correctif' } },
        bump_b: { type: 'choice', instructions: 'Quel niveau de version le diff B exige-t-il à lui seul ?', criteria: { major: 'Majeure', minor: 'Mineure', patch: 'Correctif' } },
        bump_c: { type: 'choice', instructions: 'Quel niveau de version le diff C exige-t-il à lui seul ?', criteria: { major: 'Majeure', minor: 'Mineure', patch: 'Correctif' } },
        next_version: {
          type: 'choice',
          instructions: 'Quel numéro doit porter la prochaine version publiée ?',
          criteria: { v2_4_2: '2.4.2', v2_5_0: '2.5.0', v3_0_0: '3.0.0', v3_1_0: '3.1.0' },
        },
      },
    },
    en: {
      name: 'Breaking change and semantic versioning',
      description: 'Classifying three diffs to a public library under semver.',
      state: {
        package: '@acme/pricing, current version 2.4.1, library published on npm and following semantic versioning',
        context: 'The next published version will contain the three diffs below. formatPrice and Quote are publicly exported. Called without the locale argument, formatPrice returns exactly the same output as before.',
        diffs: DIFF_PRICING,
      },
      questions: {
        bump_a: { type: 'choice', instructions: 'What version level does diff A require on its own?', criteria: { major: 'Major', minor: 'Minor', patch: 'Patch' } },
        bump_b: { type: 'choice', instructions: 'What version level does diff B require on its own?', criteria: { major: 'Major', minor: 'Minor', patch: 'Patch' } },
        bump_c: { type: 'choice', instructions: 'What version level does diff C require on its own?', criteria: { major: 'Major', minor: 'Minor', patch: 'Patch' } },
        next_version: {
          type: 'choice',
          instructions: 'What number should the next published version have?',
          criteria: { v2_4_2: '2.4.2', v2_5_0: '2.5.0', v3_0_0: '3.0.0', v3_1_0: '3.1.0' },
        },
      },
    },
  },
]
