# DecisionBench

**A benchmark and playground for decision models, built to answer one question: how good are they _in French_?**

Decision models (TypeSafe's Jev, OpenAI, Microsoft and Perplexity decision models, or open-weight models such as Clef served by llama.cpp) don't generate text. They take a `state` and a set of questions and return **calibrated probabilities**: yes/no (`noul`), one option among several (`choice`) or a level on a scale (`score`). They all speak the same `POST /v1/systemone` contract.

Almost every public evaluation of these models is in English. This project ships **a French benchmark suite, an English one written the same way, and a mixed multilingual suite**, a web app to run it against any endpoint, and the raw reports so you can check the numbers yourself. Suites are plain TypeScript files, so **adding a benchmark in your own language takes one folder** (see [Adding a benchmark suite](#adding-a-benchmark-suite)).

## Suites

| Suite | Cases | Questions | Content |
|---|---:|---:|---|
| `fr` — Français | 26 | 86 | Written natively in French: litotes, irony, *ne… que* and double negation, register, French date and number formats, residential lease law, co-ownership meeting minutes, bank statement. |
| `en` — English | 24 | 76 | Written natively in English: understatement, idioms, US dates, phishing, expense policy, incident postmortem, sales call, support queue. |
| `mixed` — Mixte | 23 | 80 | The original suite: 8 French cases, 12 English, 1 German, 1 Spanish, 1 code. Frozen so the results below stay comparable. |

`fr` and `en` cover the same skills (sentiment, moderation, routing, reasoning traps, long documents, a very long needle-in-a-haystack case) with **different content**, so you can measure how much a model loses when it switches from English to French. Neither is a translation of the other. Every expected answer was checked by an independent blind annotation pass; questions where annotators could reasonably disagree were reworded or accept a range of answers.

## Results

Suite `mixed` v1 · 23 cases, 80 questions · 3 runs per case after 1 warm-up · concurrency 1 · run on 2026-10-10. The `fr` and `en` suites have not been run yet: reports are welcome.

| Model | Accuracy | Quality | Stability | Accuracy on French cases | p50 latency | p95 latency | Cost / 1k requests |
|---|---:|---:|---:|---:|---:|---:|---:|
| `typesafe/jev-1.13` (OpenRouter) | **99.6 %** | 96.8 % | 98.8 % | **100 %** | 268 ms | **364 ms** | $0.037 |
| `perplexity/pplx-decider-v1.1-27b` (OpenRouter) | 98.8 % | **97.9 %** | **100 %** | **100 %** | 308 ms | 523 ms | $0.043 |
| `openai/gpt-6-luna-decisions` (OpenRouter) | 96.3 % | 95.0 % | **100 %** | 94.7 % | **207 ms** | 458 ms | $0.085 |
| `microsoft/microsoft-decision-1` (OpenRouter) | 95.4 % | 95.3 % | 98.8 % | 95.6 % | 319 ms | 478 ms | **$0.022** |
| Clef 27B Q8_0 (self-hosted, llama.cpp)¹ | 91.3 % | 92.5 % | **100 %** | 92.1 % | 1 046 ms | 6 886 ms | — |

- **Accuracy**: share of questions where the decision is correct (`noul` on the right side of 0.5, expected `choice` option, `score` within the expected range).
- **Quality**: how much probability the model put on the right answer (0–1). A model that is right at 51 % scores lower than one that is right at 99 %.
- **Stability**: share of questions where all runs gave the same decision.
- **Accuracy on French cases**: only the 8 cases of the `mixed` suite that are written in French.

¹ Self-hosted on an AMD Ryzen AI Max+ 395 iGPU: latency reflects that machine, not the model. Hardware notes in [docs/self-hosting.md](docs/self-hosting.md).

> [!NOTE]
> 23 cases is small. Differences of a point or two between models are within noise. Treat this table as a first signal, and add cases if you want stronger conclusions.

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
// src/bench/suites/de/suite.ts
import type { BenchSuite } from '../../types'

export const suite: BenchSuite = {
  id: 'de', // must match the folder name
  name: 'Deutsch',
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
      fr/suite.ts      French suite
      en/suite.ts      English suite
      mixed/suite.ts   original multilingual suite
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
