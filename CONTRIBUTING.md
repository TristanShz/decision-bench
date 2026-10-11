# Contributing

The most useful contributions are **benchmark suites in new languages**, **new cases** for existing suites, and **reports** for models that are not in the results table yet.

## Adding a suite

1. Create a folder named after your suite in `src/bench/suites/`, e.g. `src/bench/suites/es-legal/`. Use lowercase letters, digits and dashes, and pick a name that says what the suite contains. Two conventions:
   - `<name>-<lang>` for the **same cases translated** into several languages (`core-fr`, `core-en`). Add `core-es` by translating the files of [`src/bench/core/`](src/bench/core/): add an `es` side to every case, keep the question ids, types and option keys, and create `core-es/suite.ts` like `core-fr/suite.ts`. The comparison screen then pairs each case with its translation.
   - any other descriptive name for cases written directly in one language, which are not translations of another suite (`es-legal`, `pt-br-support`).
2. Add a `suite.ts` exporting `suite` (see the example in the [README](README.md#adding-a-benchmark-suite), or start from [`multilingual/suite.ts`](src/bench/suites/multilingual/suite.ts)).
3. Run `yarn validate`, then `yarn dev` and pick your suite in the **Benchmark** tab.

The suite is discovered automatically. If it fails validation, the app skips it and logs the reason in the browser console.

### Suite fields

| Field | Meaning |
|---|---|
| `id` | Same as the folder name. Saved in every report. |
| `name`, `description` | Shown in the suite picker. |
| `lang` | Main language, ISO 639-1 code (`fr`, `es`, `ja`…), or `mul` for a multilingual suite. The report breaks results down by language and lists this one first. |
| `version` | Bump it whenever you change, add or remove a case. Comparisons warn when two reports used different versions. |
| `author` | Optional. |
| `cases` | The benchmark cases. |

### Case fields

| Field | Meaning |
|---|---|
| `id` | Unique within the suite. Reports are matched case by case on this id, so don't rename it. |
| `name`, `description`, `category` | Free text. Results are grouped by `category`. |
| `complexity` | `simple` or `complexe` (hard). |
| `length` | `court` (short), `moyen` (medium), `long` or `très long` (very long). In `core-fr` (input tokens with Jev, roughly): ~300–450, ~500–650, ~1 000–1 500 and ~3 500–4 800. |
| `lang` | Language of this case. Control cases in another language are fine: set their own `lang`. |
| `request` | The System One request without `model`: `state` (string or JSON), `questions`, optional `images`. |
| `expected` | One expectation per question id. |

### Expectations

| Question type | `expected` | Example |
|---|---|---|
| `noul` | `true` / `false` | `is_urgent: true` |
| `noul` | `[min, max]` probability range, for ambiguous or calibration cases | `is_satisfied: [0.15, 0.85]` |
| `choice` | the expected option key | `team: 'technical'` |
| `choice` | a list of acceptable option keys | `topic: ['billing', 'refund']` |
| `score` | the expected level index (0-based) | `priority: 3` |
| `score` | a `[min, max]` range of acceptable levels | `sentiment: [3, 4]` |

`choice` criteria are an object `{ key: description }` (description may be `null`). `score` criteria are an array of levels, lowest first.

## What makes a good case

- **One defensible answer.** If two careful native speakers could disagree, use a range or a list of acceptable answers, or drop the question.
- **Get the answers checked.** Ask someone (or a model) to answer your questions blind, then look at every disagreement: either the expected answer is wrong, or the question needs a clearer wording or a range.
- **Translate idiomatically.** When adding a language to core, adapt names, currencies, date and number formats as a native speaker would write them, without changing the answers. For a suite of your own, write natively: idioms, irony, politeness conventions and legal concepts are where models struggle in a given language.
- **Mix difficulty.** A few easy cases catch broken setups; the hard ones (sarcasm, negation, numbers, long context with a detail buried in the middle) separate models.
- **Vary length.** Latency and accuracy both depend on the number of input tokens.
- **Explain non-obvious answers** in a comment next to `expected`, e.g. the arithmetic behind it.
- **No personal data.** Use invented names, addresses and numbers.
- **Deterministic content.** If you generate a long state (logs, catalogs), use a seeded generator as in [`core/documents.ts`](src/bench/core/documents.ts), so every run sends exactly the same request.

## Contributing reports

Run a suite with at least 3 runs per case and 1 warm-up, then add the JSON file from `reports/` to your pull request. Mention in the report notes (or the PR) anything that affects latency: hardware, quantization, server flags, region. API keys are never written to reports, but check the file before committing it.

## Checks

```bash
yarn validate   # suites
yarn build      # type check + build
yarn lint
```

The same checks run on every pull request.
