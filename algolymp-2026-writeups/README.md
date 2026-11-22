# AlgoCyber / Algolympiad CTF 2026 — Write-ups

Write-ups and solution scripts from the **13–15 November 2026 AlgoCyber CTF**, covering web exploitation, binary exploitation, reverse engineering, cryptography, and Linux privilege escalation.

## Challenges

| Category | Challenge | Technique |
|:--|:--|:--|
| Privilege Escalation | [Escalate Me](writeups/privesc/escalate-me/README.md) | GNU tar wildcard injection in a root cron job |
| Pwn | [Oracle of setjmp](writeups/pwn/oracle-of-setjmp/README.md) | Heap overwrite of a saved `jmp_buf` and `longjmp` control flow |
| Web | [SignalDesk](writeups/web/signaldesk/README.md) | Unicode NFKC, prototype pollution, stored XSS |
| Reverse | [Machine Matrix](writeups/rev/machine-matrix/README.md) | Rust binary and GF(257) matrix cipher |
| Web | [Meridian Systems](writeups/web/meridian-systems/README.md) | Web cache deception across nginx and Spring |
| Web | [AlgoShare](writeups/web/algoshare/README.md) | Noncanonical Base64 and reference validation mismatch |
| Crypto | [Backwards Block Party](writeups/crypto/backwards-block-party/README.md) | CBC oracle inversion and IV recovery |
| Reverse | [Opcode Garden](writeups/rev/opcode-garden/README.md) | Custom VM and symbolic execution with angr |
| Reverse | [If Maze](writeups/rev/if-maze/README.md) | Inverting byte constraints |
| Crypto | [Operațiunea HashXOR](writeups/crypto/hashxor/README.md) | MD5 candidates and repeating-key XOR |

## Repository layout

```text
writeups/
├── crypto/
├── privesc/
├── pwn/
├── rev/
└── web/
```

Each challenge has its own `README.md`. Where applicable, solution scripts appear alongside the write-up, terminal screenshots are under `assets/`, and supporting analysis files are under `research/`.
