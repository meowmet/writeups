# Backwards Block Party — Reversed CBC Oracles

**Category:** Crypto  
**Flag:** `ALGOLYMP{b4ckw4rd5_bl0ck5_br34k_f45t}`

## Inverted primitives

Despite their names, the challenge used the two CBC halves in reverse:

```text
scrambleBlocks(input) = CBC-decrypt-style blocks
unwindBlocks(input)   = CBC-encrypt-style blocks
secretDump()          = scrambleBlocks(PKCS7(flag))
```

The nominal decrypt oracle in fact exposed `AES_Enc(X ⊕ IV)`. A filter rejected a block exactly equal to a secret-dump block, preventing the most straightforward inversion.

## Recovering the IV and plaintext

For a repeated input block `c|c` to the decrypt-style function:

```text
out0 = AES_Dec(c) XOR IV
out1 = AES_Dec(c) XOR c
IV   = out0 XOR out1 XOR c
```

For later secret blocks the encryption-like oracle could be queried on an adjusted input `X = s_i XOR p_{i-1} XOR IV`, yielding the next plaintext block. For the first block, which was filtered, the exploit used a **two-block oracle trick** to construct the same encryption while avoiding a direct forbidden input.

The included [`solve.py`](solve.py) implements the oracle operations and PKCS#7 unpadding. The original solver is endpoint-specific and expects the challenge's exact menu prompt strings.

## Security lesson

Exposing related encryption/decryption primitives under inconsistent names, without authenticating oracle requests, can allow algebraic inversion despite input-based filters.

