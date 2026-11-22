# Machine Matrix — Reverse (Medium, 500 pts)

**Flag:** `ALGOLYMP{machine_id_w4s_d3riv3d_w1th_matrix_cipher}`  ✅ accepted

## It's a Hill cipher over GF(257) (NOT mod 256)
Rust binary reads the flag from stdin, pads to a multiple of 9 with `~`, encrypts,
base64-encodes, and `bcmp`s against the hardcoded `enc.txt`. Anti-debug checks
`/proc/self/status` TracerPid in a thread (LD_PRELOAD doesn't trip it).

Each 9-byte block splits into 3 interleaved groups {i, i+3, i+6}; each group's 3 bytes
are `output_j = f(M[j]·input) ` with the SAME 3×3 matrix `M` (derived from
`/etc/machine-id` via SHA-256). The reduction, from the disassembly:
`q = (dot * 0xff0100) >> 32 ; out = (dot - q*257) & 0xff`  →  **mod 257** (257 is prime).
The magic-number division occasionally yields byte = (value+1) — the "noise" that
misled a naive mod-256 reading.

The recovered matrix (constant for all groups):
`M = [[54,60,30],[149,151,5],[207,200,124]]`  (det 52, invertible mod 257)

## Method
1. Oracle: LD_PRELOAD a `bcmp` hook to capture the candidate ciphertext; fake
   `/etc/machine-id = aaf1c3523c98ad11bcf2b1f3ca11ab38` via a rootless mount namespace
   (`unshare -rm` + `mount --bind`).
2. Probe single-byte `+1` flips to read `M` columns (col257), reimplement `f` + matrix
   offline, brute each group over printable ASCII → recover all bytes.
3. Last group (positions 47,50,53) held the `}` and padding: bruting all (x47,x50,x53)
   gave `h`, `}`, `~` → the flag's `}` is at position 50, padding `~` fills 51-53.
4. Verified: 51-char flag → binary prints `Correct!`.
