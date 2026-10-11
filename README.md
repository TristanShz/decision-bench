# DecisionBench

**A benchmark and playground for decision models, built to answer one question: how good are they _in French_?**

Decision models (TypeSafe's Jev, OpenAI, Microsoft and Perplexity decision models, or open-weight models such as Clef served by llama.cpp) don't generate text. They take a `state` and a set of questions and return **calibrated probabilities**: yes/no (`noul`), one option among several (`choice`) or a level on a scale (`score`). They all speak the same `POST /v1/systemone` contract.

Almost every public evaluation of these models is in English. This project ships **a French benchmark suite, an English one written the same way, and a mixed multilingual suite**, a web app to run it against any endpoint, and the raw reports so you can check the numbers yourself. Suites are plain TypeScript files, so **adding a benchmark in your own language takes one folder** (see [Adding a benchmark suite](#adding-a-benchmark-suite)).

## Suites

| Suite | Cases | Questions | Content |
|---|---:|---:|---|
| `fr-native` — Français natif | 26 | 86 | Written directly in French: litotes, irony, *ne… que* and double negation, register, French date and number formats, residential lease law, co-ownership meeting minutes, bank statement. |
| `en-native` — English native | 24 | 76 | Written directly in English: understatement, idioms, US dates, phishing, expense policy, incident postmortem, sales call, support queue. |
| `multilingual` — Multilingue | 23 | 80 | The original suite: 8 French cases, 12 English, 1 German, 1 Spanish, 1 code. Frozen so the results below stay comparable. |

> [!IMPORTANT]
> `fr-native` and `en-native` **do not contain the same cases**. Neither is a translation of the other: each one is written directly in its language and tests what is hard in that language (French number formats and litotes, English understatement and US dates…). They cover the same skills (sentiment, moderation, routing, reasoning traps, long documents, a very long needle-in-a-haystack case), so their scores show how a model handles each language's pitfalls, not the effect of the language alone.

 Every expected answer was checked by an independent blind annotation pass; questions where annotators could reasonably disagree were reworded or accept a range of answers.

## Results

### French native suite

Suite `fr-native` v1 · 26 cases, 86 questions · 3 runs per case after 1 warm-up · concurrency 1 · run on 2026-10-11.

| Model | Accuracy | Quality | Stability | p50 latency | p95 latency | Cost / 1k requests | Missed questions |
|---|---:|---:|---:|---:|---:|---:|---:|
| `typesafe/jev-1.13` (OpenRouter) | **100 %** | 96.8 % | **100 %** | 252 ms | **311 ms** | $0.034 | **0** |
| `perplexity/pplx-decider-v1.1-27b` (OpenRouter) | 98.8 % | **98.8 %** | **100 %** | **237 ms** | 403 ms | $0.038 | 1 |
| `openai/gpt-6-luna-decisions` (OpenRouter) | 98.8 % | 98.2 % | **100 %** | 264 ms | 414 ms | $0.078 | 1 |
| `microsoft/microsoft-decision-1` (OpenRouter) | 97.7 % | 96.4 % | **100 %** | 315 ms | 383 ms | **$0.019** | 2 |
| Clef 27B Q8_0 (self-hosted, llama.cpp)¹ | 96.5 % | 94.7 % | **100 %** | 1 200 ms | 4 795 ms | — | 3 |

Every model got the long documents right (lease, co-ownership minutes, a 135-line bank statement). The misses are all on short cases that test French specifically, and every model was consistent across its 3 runs:

| Model | Case | What happened |
|---|---|---|
| Perplexity | Amounts in French format | Read “Total 1 234,50 €, deposit 300,00 €” as a balance above 1 000 € (it is 934,50 €). |
| OpenAI | Successive discounts | Treated −30 % then −10 % as −40 % (72 € instead of 75,60 €). |
| Microsoft | Rental listing | Did not read “1 050 € CC” as *charges comprises*, and said 68 m² is over 70 m². |
| Clef | Irony | Did not see the irony in “Bravo, quelle ponctualité légendaire” after a 45-minute delay. |
| Clef | Implicit threat | Missed the intimidation in “Je sais où se trouve votre magasin… vous feriez mieux de retirer cet avis”. |
| Clef | Logic | Answered “yes” where the statements do not allow a conclusion. |

### English native suite

Suite `en-native` v1 · 24 cases, 76 questions · same settings · run on 2026-10-11.

| Model | Accuracy | Quality | Stability | p50 latency | p95 latency | Cost / 1k requests | Missed questions |
|---|---:|---:|---:|---:|---:|---:|---:|
| `typesafe/jev-1.13` (OpenRouter) | **99.6 %** | 95.1 % | 98.7 % | **263 ms** | **332 ms** | $0.030 | 1 (1 run of 3) |
| `perplexity/pplx-decider-v1.1-27b` (OpenRouter) | 98.7 % | **98.5 %** | **100 %** | 266 ms | 389 ms | $0.028 | 1 |
| `microsoft/microsoft-decision-1` (OpenRouter) | 97.4 % | 96.0 % | **100 %** | 328 ms | 454 ms | **$0.015** | 2 |
| `openai/gpt-6-luna-decisions` (OpenRouter) | 94.7 % | 94.1 % | **100 %** | 268 ms | 425 ms | $0.070 | 4 |
| Clef 27B Q8_0 (self-hosted, llama.cpp)¹ | 93.4 % | 92.5 % | **100 %** | 1 028 ms | 4 080 ms | — | 5 |

The English misses are mostly reasoning over rules:

| Model | Case | What happened |
|---|---|---|
| Jev, OpenAI, Clef | Expense policy | Accepted a $210 hotel in Denver: the cap is $250 only in tier-1 cities, $180 elsewhere. Jev hesitated (P(yes) ≈ 0.5) and got it wrong in 1 run of 3. |
| Clef | Expense policy | Said a claim submitted 18 days after the trip was late (the deadline is 30 days). |
| OpenAI | Percentage trap | Said +20 % then −20 % brings the price back to $100 (it is $96). |
| OpenAI | Résumé screening | Accepted a candidate with 2.5 years of experience for a 3-year requirement. |
| OpenAI | Return policy | Accepted a laptop return after 20 days (electronics: 15 days). |
| Microsoft | Calibration | Answered “Fine.” with 87–89 % satisfaction, where an uncertain probability is expected. |
| Microsoft | Code review | Did not see that `forEach` with an `async` callback makes the function return 0. |
| Perplexity | Used car listing | Did not read “$18,900 OBO” (*or best offer*) as a negotiable price. |
| Clef | Sarcasm, threat | Missed the sarcasm about a “quick sync” and the conditional threat “you’ll find out what happens when I see you”. |
| Clef | Quantities | Said 7 cups of flour are enough for 4 batches of 2 cups. |

### French vs English

| Model | `fr-native` accuracy | `en-native` accuracy | `multilingual` accuracy |
|---|---:|---:|---:|
| `typesafe/jev-1.13` | **100 %** | **99.6 %** | **99.6 %** |
| `perplexity/pplx-decider-v1.1-27b` | 98.8 % | 98.7 % | 98.8 % |
| `openai/gpt-6-luna-decisions` | 98.8 % | 94.7 % | 96.3 % |
| `microsoft/microsoft-decision-1` | 97.7 % | 97.4 % | 95.4 % |
| Clef 27B Q8_0 | 96.5 % | 93.4 % | 91.3 % |

On these suites, **no model does worse in French than in English**, and the ranking is almost the same in both languages. The French and English suites cover the same skills with different content, so part of the gap comes from the cases themselves: the English suite has more multi-rule reasoning (expense and return policies, résumé screening), which is where most English misses are. A translated pair of suites would isolate the language effect, at the cost of testing translation-friendly content.

### Multilingual suite

Suite `multilingual` v1 · 23 cases, 80 questions (8 in French) · same settings · run on 2026-10-10.

| Model | Accuracy | Quality | Stability | Accuracy on French cases | p50 latency | p95 latency | Cost / 1k requests |
|---|---:|---:|---:|---:|---:|---:|---:|
| `typesafe/jev-1.13` (OpenRouter) | **99.6 %** | 96.8 % | 98.8 % | **100 %** | 268 ms | **364 ms** | $0.037 |
| `perplexity/pplx-decider-v1.1-27b` (OpenRouter) | 98.8 % | **97.9 %** | **100 %** | **100 %** | 308 ms | 523 ms | $0.043 |
| `openai/gpt-6-luna-decisions` (OpenRouter) | 96.3 % | 95.0 % | **100 %** | 94.7 % | **207 ms** | 458 ms | $0.085 |
| `microsoft/microsoft-decision-1` (OpenRouter) | 95.4 % | 95.3 % | 98.8 % | 95.6 % | 319 ms | 478 ms | **$0.022** |
| Clef 27B Q8_0 (self-hosted, llama.cpp)¹ | 91.3 % | 92.5 % | **100 %** | 92.1 % | 1 046 ms | 6 886 ms | — |

### Metrics

- **Accuracy**: share of questions where the decision is correct. It is binary: right or wrong.
- **Quality**: how much probability the model put on the right answer, from 0 to 1. It tells you how confidently the model was right.
- **Stability**: share of questions where all runs gave the same decision.
- **p50 / p95 latency**: median response time, and the time under which 95 % of requests complete.
- **Cost / 1k requests**: cost billed by OpenRouter, scaled to 1,000 requests of the suite.
- **Accuracy on French cases**: only the 8 cases of the `multilingual` suite that are written in French.

How each question type is graded:

| Type | Correct (accuracy) when… | Quality |
|---|---|---|
| Yes/no (`noul`) | the probability of “yes” is on the expected side of 0.5 | probability given to the expected answer |
| Choice | the most likely option is an expected one | total probability given to the expected options |
| Score | the returned level is within the expected range (± 0.5) | 1 − distance to the expected range, relative to the length of the scale |

**Example.** The expected answer to “Is the customer satisfied?” is *no*.

| Model answer | Accuracy | Quality |
|---|---:|---:|
| P(yes) = 0.01 | ✓ | 0.99 |
| P(yes) = 0.15 | ✓ | 0.85 |
| P(yes) = 0.49 | ✓ | 0.51 |
| P(yes) = 0.60 | ✗ | 0.40 |

All three first answers count as correct, but only the first one is a confident *no*. This is why Jev, with no missed question on the French suite, has a lower quality than Perplexity and OpenAI: it is always right, with less confidence.

Use **accuracy** if your code acts on the decision alone (`if noul > 0.5`), and **quality** if it uses the probabilities themselves: thresholds, ranking, combining several answers. On ambiguous cases (“Mouais, ça ira”), the expected answer is a probability *range*, and quality measures the distance to that range rather than certainty.

¹ Self-hosted on a Framework Desktop: AMD Ryzen AI Max+ 395, Radeon 8060S integrated GPU, 128 GB of unified memory, llama.cpp with the ROCm backend and flash attention. The model runs entirely on the integrated GPU, so latency reflects that machine, not the model: the API models above run on datacenter hardware. Setup and measurements in [docs/self-hosting.md](docs/self-hosting.md).

> [!NOTE]
> These suites are small: on the French suite, one missed question costs 1.2 points of accuracy. Treat the rankings as a first signal, and add cases if you want stronger conclusions.

The raw reports are in [`reports/`](reports/): open the app, go to **Benchmark → Saved reports**, and compare any of them side by side.

## What's inside

- **Benchmark suites** (`src/bench/suites/`): cases with expected answers, from ~100 to ~4 800 tokens. Sentiment and irony, moderation, routing, support and medical triage, arithmetic and logic traps, contracts, meeting minutes, postmortems, code review, needle-in-a-haystack, calibration on ambiguous inputs.
- **Benchmark runner**: repetitions, warm-up, concurrency, timeouts. Runs are interleaved to smooth out drift.
- **Reports**: latency percentiles, tokens/s, error rate, accuracy, quality, stability, cost, with breakdowns by length, complexity, category, **language** and question type, plus a per-case and per-question drill-down. Saved as JSON in `reports/`.
- **A/B comparison** of up to 4 reports: metric deltas, decision agreement, list of divergences, Markdown export. Warns when suites, versions or settings differ.
- **Playground**: pick a connected model, write the text to judge, add yes/no, choice and score questions, and see the probabilities. Text or JSON state, images, batch mode, request preview and a ready-to-paste `curl` example (with the API key left as `$API_KEY`).

The app's interface is currently in French.

## Getting started

Requires Node.js 22.18 or later and Yarn.

```bash
yarn
yarn dev          # http://localhost:5173
```

Run the benchmark through `yarn dev` or `yarn preview`: the Vite server saves reports to `reports/` and provides a local proxy for APIs without CORS.

### Connecting models

Click **Models** in the header (or open the model picker) to connect a model once and reuse it in the playground and the benchmark. Every System One API is configured the same way, whoever serves it. Models without a key show whether their server answers; models with a key are not probed (use **Test connection**).

| Model | API type | URL | `model` | Auth |
|---|---|---|---|---|
| Any System One-compatible API: a self-hosted server, Jev, decision models on OpenRouter… | System One | base URL, e.g. `http://localhost:8080` or `https://openrouter.ai/api` | e.g. `typesafe/jev-1.13` | optional, e.g. `Authorization: Bearer sk-or-…` |
| Regular chat models (to compare them on the same suites) | Chat adapter | `https://openrouter.ai/api` | any chat model with logprobs | `Authorization: Bearer sk-or-…` |

- `/v1/systemone` is appended to the base URL. A URL already ending in `/systemone` or `/decisions` is used as is.
- The URL of the default self-hosted model can be set with `VITE_SYSTEMONE_URL` in a `.env.local` file.
- API keys stay in your browser's local storage and are **never written to reports**.
- The **chat adapter** lets you compare a regular chat model on the same suite: each question becomes a `chat/completions` call answered in one token (yes/no, an option letter or a level digit), and probabilities are rebuilt from `top_logprobs`.

## Adding a benchmark suite

A suite is a folder in `src/bench/suites/` containing a `suite.ts` file. It is picked up automatically: no registry to edit.

```ts
// src/bench/suites/de-native/suite.ts
import type { BenchSuite } from '../../types'

export const suite: BenchSuite = {
  id: 'de-native', // must match the folder name
  name: 'Deutsch nativ',
  description: 'Decisions written in German: support, contracts, reviews…',
  lang: 'de',
  version: '1', // bump whenever a case changes
  cases: [
    {
      id: 'support-triage',
      name: 'Support-Triage',
      description: 'Urgent outage ticket.',
      category: 'Support',
      complexity: 'simple', // 'simple' | 'complexe'
      length: 'court', // 'court' | 'moyen' | 'long' | 'très long'
      lang: 'de',
      request: {
        state: 'Seit heute Morgen gibt jeder Webhook HTTP 500 zurück. Unsere Produktion steht still!',
        questions: {
          is_urgent: { type: 'noul', instructions: 'Ist die Anfrage dringend?' },
          team: {
            type: 'choice',
            instructions: 'Welches Team soll das bearbeiten?',
            criteria: { billing: 'Rechnungen, Zahlungen', technical: 'Fehler, Ausfälle', sales: 'Preise, Upgrades' },
          },
        },
      },
      expected: { is_urgent: true, team: 'technical' },
    },
  ],
}
```

Then check it:

```bash
yarn validate
```

The full guide, including expectation formats and what makes a good case, is in [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests with new suites, new cases or new reports are welcome.

## Project structure

```
src/
  bench/
    suites/            benchmark suites, one folder per suite
      fr-native/       cases written in French
      en-native/       different cases written in English
      multilingual/    original suite, mixed languages
      validate.ts      suite checks (used by the app and `yarn validate`)
    runner.ts          runs a suite against a target
    stats.ts           grading and metrics
    BenchView.tsx      benchmark UI · ReportView / CompareView: reports
  openrouter.ts        chat/completions + logprobs adapter
  App.tsx              playground
server/reports.ts      Vite middleware: report storage and CORS proxy
reports/               saved benchmark reports (JSON)
docs/self-hosting.md   llama.cpp performance notes
```

## License

[MIT](LICENSE)
