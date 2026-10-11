# Self-hosting Clef with llama.cpp

Measurements from 2026-10-10.

## Setup

- **Machine:** Framework Desktop, AMD Ryzen AI Max+ 395 (16 Zen 5 cores)
- **GPU:** Radeon 8060S integrated GPU (`gfx1151`), all layers offloaded (`-ngl all`)
- **Memory:** 128 GB of unified memory shared by the CPU and the GPU, enough to hold the 27B model in Q8_0 with room to spare
- **Backend:** ROCm, with flash attention (see the Vulkan comparison below)
- **Model:** Clef 27B, Q8_0 (26.75 GiB)
- **Server:** llama-server, build `1623d8ce4` (b11546), API `POST /v1/systemone`

Clef does not generate tokens (`output_tokens` = 0). Response time depends only on prompt processing ("pp").

## llama-bench: Vulkan vs ROCm

`-ngl 99 -n 0`. Throughput in tokens/s.

| Backend | FA | pp512 | pp1536 |
|---|---|---|---|
| Vulkan (RADV, KHR_coopmat) | off | 363 | 343 |
| Vulkan | on | 369 | 351 |
| ROCm | off | 381 | 365 |
| ROCm | on | **387** | **381** |

- `-ub 2048` and `-ub 8192` give the same results.
- ROCm + FA is 5 % faster than Vulkan + FA at pp512, and 9 % faster at pp1536.

## `/v1/systemone` latency

Short state, `noul` questions. Median of 5 runs for ROCm where given.

| Request | Tokens | Vulkan | ROCm + FA |
|---|---|---|---|
| 1 question | 162 | 664 ms | 591–652 ms |
| 4 questions | 430 | 1 302 ms | 1 224 ms |
| 8 questions | 790 | 2 344 ms | 2 300 ms |
| 16 questions | 1 550 | 4 838 ms | 4 438 ms |
| Long state, 1 question | 1 150 | 3 254 ms | 3 034 ms |
| 8 requests in a row | — | 10.5 s | 9.8 s |
| **Effective throughput** | | **~320 tok/s** | **~350 tok/s** |

## Findings

- **Latency follows input tokens:** about 2.9 ms per token. Each `noul` question adds about 90 tokens, roughly 0.25 s.
- **Parallel requests (4 slots):** no gain, the iGPU is saturated.
- **Prompt cache:** no reuse, even for an identical request.
- **Micro-batch size must cover the whole request.** With `-ub 512`, a 535-token request is rejected ("increase the physical batch size"). Raise `-b` and `-ub` to at least your largest request.

## Retained configuration

```
build-rocm/bin/llama-server -m Clef-Q8_0.gguf --mmproj mmproj-Clef-Q8_0.gguf \
  --port 8080 --host 0.0.0.0 -c 8192 -b 8192 -ub 8192 -fa on -ngl all
```

`--mmproj` is only needed to send images.

## Not tested yet

- Power mode (TDP)
- Q4/Q5 quantization (check that probabilities stay close to Q8)
