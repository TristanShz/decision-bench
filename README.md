# DecisionBench

**A benchmark and playground for decision models, built to answer one question: how good are they _in French_?**

Decision models (TypeSafe's Jev, OpenAI, Microsoft and Perplexity decision models, or open-weight models such as Clef served by llama.cpp) don't generate text. They take a `state` and a set of questions and return **calibrated probabilities**: yes/no (`noul`), one option among several (`choice`) or a level on a scale (`score`). They all speak the same `POST /v1/systemone` contract.

Almost every public evaluation of these models is in English. This project ships **a 325-question benchmark in French and the same one translated into English**, plus a smaller mixed multilingual suite, a web app to run it against any endpoint, and the raw reports so you can check the numbers yourself. Suites are plain TypeScript files, so **adding a benchmark in your own language takes one folder** (see [Adding a benchmark suite](#adding-a-benchmark-suite)).

## Suites

| Suite | Cases | Questions | Content |
|---|---:|---:|---|
| `core-fr` / `core-en` — Core | 90 + 90 | 325 + 325 | **The same cases in French and in English, simply translated.** Built to separate strong models: multi-condition policies, arithmetic on tables, dates and units, negation and quantifiers, reported speech, implicature, calibration, subtle phishing and payment fraud, distress signals, routing at the border of two teams, email threads where a later message overrides an earlier one, contracts with a distant exception clause, changelogs, incident timelines, and long JSON datasets with planted needles. |
| `multilingual` — Multilingue | 23 | 80 | The original suite: 8 French cases, 12 English, 1 German, 1 Spanish, 1 code. Frozen so the results below stay comparable. |

**Naming convention:** `<name>-<lang>` suites contain the same cases translated (`core-fr` = `core-en`), so comparing them isolates the effect of the language.

Every expected answer was checked by an independent blind annotation pass; questions where annotators could reasonably disagree were reworded or accept a range of answers.

## Results

Models are ranked by **quality**, the most informative metric (see [Metrics](#metrics)). Numbers in parentheses are **95 % confidence intervals**: when two models’ intervals overlap, the difference between them is not statistically significant. Tables are generated from `reports/` with `yarn results` and `yarn paired`.

### Core, in French

Suite `core-fr` v2 · 90 cases, 325 questions · 3 runs per case after 1 warm-up · concurrency 1 · run on 2026-10-11.

| Model | Quality (95 % CI) | Accuracy (95 % CI) | Stability | p50 latency | p95 latency | Cost / 1k requests | Missed questions |
|---|---:|---:|---:|---:|---:|---:|---:|
| `perplexity/pplx-decider-v1.1-27b` (OpenRouter) | 88.2 % (86–91) | 87.9 % (84–91) | 100.0 % | 387 ms | 4 255 ms | $0.048 | 40 |
| `openai/gpt-6-luna-decisions` (OpenRouter) | 84.6 % (82–88) | 85.5 % (81–89) | 100.0 % | 256 ms | 345 ms | $0.093 | 47 |
| `microsoft/microsoft-decision-1` (OpenRouter) | 83.8 % (81–87) | 84.3 % (80–88) | 97.5 % | 336 ms | 452 ms | $0.025 | 54 |
| `typesafe/jev-1.13` (OpenRouter) | 82.3 % (80–85) | 85.1 % (81–89) | 96.3 % | 269 ms | 359 ms | $0.044 | 54 |
| Clef 27B Q8_0 (self-hosted, llama.cpp)¹ | 81.4 % (78–84) | 84.9 % (81–88) | 100.0 % | 1 676 ms | 4 492 ms | — | 49 |

### Core, in English

Suite `core-en` v2 · the same 90 cases, translated · same settings · run on 2026-10-11.

| Model | Quality (95 % CI) | Accuracy (95 % CI) | Stability | p50 latency | p95 latency | Cost / 1k requests | Missed questions |
|---|---:|---:|---:|---:|---:|---:|---:|
| `perplexity/pplx-decider-v1.1-27b` (OpenRouter) | 88.5 % (86–91) | 87.7 % (84–91) | 100.0 % | 307 ms | 509 ms | $0.044 | 40 |
| `openai/gpt-6-luna-decisions` (OpenRouter) | 84.4 % (81–87) | 85.8 % (82–89) | 100.0 % | 252 ms | 371 ms | $0.088 | 46 |
| `microsoft/microsoft-decision-1` (OpenRouter) | 83.8 % (81–87) | 85.1 % (81–89) | 97.8 % | 327 ms | 403 ms | $0.022 | 52 |
| `typesafe/jev-1.13` (OpenRouter) | 83.0 % (80–86) | 86.1 % (82–89) | 96.9 % | 279 ms | 363 ms | $0.040 | 50 |
| Clef 27B Q8_0 (self-hosted, llama.cpp)¹ | 80.9 % (78–84) | 82.8 % (78–86) | 100.0 % | 1 649 ms | 4 130 ms | — | 56 |

**Perplexity’s decider leads in both languages.** Its lead over Jev and Clef is significant; over OpenAI and Microsoft, the intervals still overlap by one or two points. The four others are statistically tied. Jev is a good illustration of the gap between the two metrics: second on accuracy in English (86.1 %), fourth on quality (83.0 %), because it is often right with little confidence.

### French vs English

Every question exists in both languages, so each model can be compared with itself, question by question. This paired comparison removes the effect of the content and gives intervals much narrower than the tables above.

| Model | Quality, FR − EN (95 % CI) | Accuracy, FR − EN (95 % CI) | Right only in French | Right only in English |
|---|---:|---:|---:|---:|
| `perplexity/pplx-decider-v1.1-27b` | −0.3 pt (−1.3 to +0.8) | +0.2 pt (−2.1 to +2.6) | 8 | 7 |
| `openai/gpt-6-luna-decisions` | +0.2 pt (−1.4 to +1.8) | −0.3 pt (−3.1 to +2.5) | 10 | 11 |
| `microsoft/microsoft-decision-1` | 0.0 pt (−1.4 to +1.4) | −0.8 pt (−3.4 to +1.7) | 8 | 11 |
| `typesafe/jev-1.13` | −0.7 pt (−1.5 to +0.1) | −0.9 pt (−2.6 to +0.8) | 5 | 8 |
| Clef 27B Q8_0 | +0.5 pt (−0.7 to +1.7) | +2.2 pt (−0.6 to +4.9) | 14 | 7 |

**None of these models is worse in French.** Every difference is within about one point of quality, and every interval contains zero. The questions a model gets right in one language only (last two columns) are few and balanced: they are borderline cases where the model hesitates, not a language effect. The ranking is the same in both languages.

### Where the models fail

Quality by theme, averaged over French and English:

| Theme | Questions per language | Perplexity | OpenAI | Microsoft | Jev | Clef |
|---|---:|---:|---:|---:|---:|---:|
| Long documents (email threads, contracts, changelogs, JSON datasets) | 48 | 99.1 % | 97.1 % | 97.7 % | 97.6 % | 96.7 % |
| Support and security (phishing, IBAN fraud, distress, routing) | 53 | 97.7 % | 95.3 % | 94.1 % | 94.0 % | 91.4 % |
| Original cases (sentiment, moderation, routing, needle in a haystack…) | 59 | 96.4 % | 94.9 % | 94.7 % | 94.1 % | 93.6 % |
| Fine-grained language (negation, quantifiers, reported speech, irony) | 56 | 96.5 % | 90.2 % | 90.0 % | 90.8 % | 90.9 % |
| Multi-condition rules (pricing tiers, policies, eligibility) | 52 | 79.6 % | 76.5 % | 72.9 % | 68.9 % | 64.4 % |
| Arithmetic on tables, dates and units | 57 | 62.3 % | 54.7 % | 55.2 % | 52.2 % | 51.2 % |

Reading is solved: every model finds the needle in a 45-order JSON dataset or the exception clause at the end of a contract. **Computing is not.** As soon as the answer requires chaining two or three operations, quality drops to 51–62 % for every model, in both languages. A few questions that all five models miss, in French and in English:

| Case | Expected | What the models answered |
|---|---|---|
| A €80 jacket, −25 %, then −10 % off the sale price; shipping €4.90, free from €60 | €58.90 (54 + 4.90) | €54 or €56.90: they apply the discounts but forget that €54 is below the free-shipping threshold, or add the discounts up. |
| A crêpe recipe for 4 (300 g of flour) scaled to 10 people, with 0.7 kg of flour at home | Not enough flour (750 g needed) | “She has everything”, sometimes “eggs” or “butter”. |
| 3 notebooks at €2.40 and a pen at €1.90, paid with €10; €1.10 given back | Too much change (€0.90 was due) | “Exact amount” or “too little”. |
| A hotel review praising the room and staff, and thanking the wifi for giving time to finish a novel | Main complaint: the wifi | “Breakfast” or “none”: only Clef, and only in French, read the irony. |

These are the questions that separate the models. If you use a decision model on rules that involve amounts, compute the amounts in your code and pass them in the `state`.

<details>
<summary>Results on the <code>multilingual</code> suite</summary>

The original suite: 80 questions, mostly in English, frozen so older reports stay comparable. It is smaller and easier than core: every model scores above 91 % and no difference between models is significant.

| Model | Quality (95 % CI) |
|---|---:|
| `perplexity/pplx-decider-v1.1-27b` | 97.9 % (96–100) |
| `typesafe/jev-1.13` | 96.8 % (95–98) |
| `microsoft/microsoft-decision-1` | 95.3 % (92–99) |
| `openai/gpt-6-luna-decisions` | 95.0 % (91–99) |
| Clef 27B Q8_0 | 92.5 % (88–97) |

Full table: `yarn results multilingual`.

</details>

### Metrics

- **Accuracy**: share of questions where the decision is correct. It is binary: right or wrong.
- **Quality**: how much probability the model put on the right answer, from 0 to 1. It tells you how confidently the model was right.
- **Stability**: share of questions where all runs gave the same decision.
- **p50 / p95 latency**: median response time, and the time under which 95 % of requests complete.
- **Cost / 1k requests**: cost billed by OpenRouter, scaled to 1,000 requests of the suite.

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

All three first answers count as correct, but only the first one is a confident *no*. This is why Jev ranks higher on accuracy than on quality: it is often right, with less confidence.

Use **accuracy** if your code acts on the decision alone (`if noul > 0.5`), and **quality** if it uses the probabilities themselves: thresholds, ranking, combining several answers. On ambiguous cases (a customer who only replies “Ok.”), the expected answer is a probability *range*, and quality measures the distance to that range rather than certainty.

¹ Self-hosted on a Framework Desktop: AMD Ryzen AI Max+ 395, Radeon 8060S integrated GPU, 128 GB of unified memory, llama.cpp with the ROCm backend and flash attention. The model runs entirely on the integrated GPU, so latency reflects that machine, not the model: the API models above run on datacenter hardware. Setup and measurements in [docs/self-hosting.md](docs/self-hosting.md).

> [!NOTE]
> With 325 questions, the confidence intervals of the core suites are about ±3 points for accuracy and ±2.5 for quality: enough to separate the leader from the pack, not to rank models that are a point apart. Contributions of new cases are welcome.

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
// src/bench/suites/de-support/suite.ts
import type { BenchSuite } from '../../types'

export const suite: BenchSuite = {
  id: 'de-support', // must match the folder name
  name: 'Kundensupport (DE)',
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
    core/              core benchmark, one file per theme, each case with its French and English version
    suites/            benchmark suites, one folder per suite
      core-fr/         core benchmark in French
      core-en/         same cases in English
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
