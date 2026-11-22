# Operațiunea HashXOR — A Repeating-XOR Key Hidden Among MD5 Digests

**Category:** Crypto  
**Flag:** `InvataCyber{m45t3r_0f_md5_cr4ck1ng_4nd_x0r}`

## Files and observation

The challenge supplied 100 MD5 hashes of possible passwords and a 139-byte repeating-key XOR ciphertext. A wordlist attack recovered 99 out of 100 plaintexts, but none of those cracked candidates produced the expected congratulatory message.

One hash remained unmatched: `b03a894e101746d09277f1f255cc8a40`.

The candidate key `cyber` produced readable fragments beginning `Felicy...`; taking the likely Romanian known plaintext `Felicitari` against the ciphertext yielded more bytes of the key, starting `cybersecur...`. The key was **`cybersecurity`**; its MD5 matched the missing digest.

```python
key = b'cybersecurity'
plaintext = bytes(c ^ key[i % len(key)] for i, c in enumerate(ciphertext))
```

This recovered a Romanian congratulatory message with the flag. The solver is in [`research/original-solve.py`](research/original-solve.py); it can download the very large `rockyou.txt` if absent, so do not run it expecting a lightweight offline check. That wordlist is intentionally **not included** here.

## Security lesson

MD5 password hashes are weak against offline dictionary attacks, and repeating-key XOR allows plaintext guesses to recover corresponding key bytes. In this puzzle the one missing wordlist match turned out to be the intended themed key.
