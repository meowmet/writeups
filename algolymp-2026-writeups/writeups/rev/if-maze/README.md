# If Maze — Inverting a Chain of Byte Constraints

**Category:** Reverse  
**Flag:** `ALGOLYMP{z3_if_chain_2026}`

## Challenge

A small ELF64 required a 26-character flag with fixed prefix `ALGOLYMP{` and closing `}`. Sixteen inner bytes were checked against three constant tables in `.rodata` at virtual addresses `0x402030`, `0x402040`, and `0x402050`.

The disassembly gave a per-character condition that was easy to invert:

```text
((T_rdi[i] XOR c) + 0x11*i) & 0xff == T_r8[i]
```

So the accepted byte was:

```text
c = T_rdi[i] XOR ((T_r8[i] - 0x11*i) & 0xff)
```

The other checks were redundant once this byte relation held. A Python extractor could read the file's tables at offsets `0x2030` and `0x2050`, calculate the sixteen bytes, and prepend/append the fixed flag format.

```python
d = open('chall', 'rb').read()
T_r8  = d[0x2030:0x2040]
T_rdi = d[0x2050:0x2060]
mid = [T_rdi[i] ^ ((T_r8[i] - i*0x11) & 0xff) for i in range(16)]
print('ALGOLYMP{' + bytes(mid).decode() + '}')
```

The binary printed `OK` for the recovered input. The challenge executable is not included here.
