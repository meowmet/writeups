# Machine Matrix — Reverse-Engineering a Machine-ID-Derived GF(257) Cipher

**Category:** Reverse · **Event:** AlgoCyber / Algolymp 2026  
**Flag:** `ALGOLYMP{machine_id_w4s_d3riv3d_w1th_matrix_cipher}`

## What the binary checked

The provided Rust binary accepted a flag from stdin, padded it to multiples of nine with `~`, encrypted it through a matrix-derived transformation, base64-encoded the output, and compared the result with a fixed encoded target. An anti-debug thread checked `/proc/self/status` for `TracerPid`. The matrix depended on SHA-256 of `/etc/machine-id`, which made experiments sensitive to the execution environment.

The recovered 3×3 matrix was recorded as:

```text
M = [ [ 54,  60,  30],
      [149, 151,   5],
      [207, 200, 124] ]
```

The input was processed in nine-byte blocks and groups of interleaved indices `(i, i+3, i+6)`. The crucial realization was that the arithmetic operated over **GF(257)** rather than ordinary 8-bit reduction modulo 256.

The decompiled constant-division idiom was recorded as:

```text
q = (dot * 0xff0100) >> 32
out = (dot - q*257) & 0xff
```

Interpreting all observations naively modulo 256 led to occasional off-by-one artifacts.

## Solving the cipher

1. Run a candidate-ciphertext oracle by interposing on `bcmp`, without tripping the binary's `TracerPid` check.
2. Use a throwaway `machine-id` file (`aaf1c3523c98ad11bcf2b1f3ca11ab38`) within a rootless mount namespace to keep the derived matrix stable.
3. Flip one input byte at a time to infer matrix columns, solve groups over GF(257), and compare the predicted output with the target.
4. Treat the final group containing the closing brace and padding separately. The final-position search recovered `h`, `}`, `~`, with `}` at zero-based position 50.
5. The 51-character flag was accepted by the binary (`Correct!`).

## Solver notes

The matrix was recovered by probing the comparison oracle and solving the resulting linear equations over GF(257). The last group needed separate brute-force work because it contained the closing brace and padding. [`research/solve257.py`](research/solve257.py) is an **intermediate matrix solver**, not the complete last-block recovery; the additional files in [`research/`](research/) document that investigation. Running the intermediate solver alone will not output the final flag.

The original setup used an isolated `/etc/machine-id` binding and an interposed comparison hook. Reproducing the same ciphertext requires the same machine-id context; the challenge binary is not bundled here.

## Defensive insight

Machine-bound secrets or keys may complicate debugging but do not protect an invertible mathematical comparison. Static target data, observable candidate comparisons, and a reversible transform can reveal the accepted input even with basic anti-debugging.
