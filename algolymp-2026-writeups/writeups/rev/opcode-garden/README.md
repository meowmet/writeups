# Opcode Garden — Finding the Accept Path Through Symbolic Execution

**Category:** Reverse  
**Flag:** `ALGOLYMP{vms_h1de_th3_truth}`

## Analysis

The challenge provided a stripped PIE x86-64 executable with a small custom bytecode VM. The program read candidate input and printed `accepted` or `rejected`. Disassembly identified the success and failure output paths at relative code offsets `0x1592` and `0x1552`.

With an angr project loaded at the expected PIE base (`0x400000` in the analysis), the solver built a full-entry state with symbolic stdin and explored paths reaching the success branch while avoiding failure.

```python
proj = angr.Project(BIN, auto_load_libs=False)
base = proj.loader.main_object.min_addr
st = proj.factory.full_init_state()
sm = proj.factory.simulation_manager(st)
sm.explore(find=base + 0x1592, avoid=base + 0x1552)
print(sm.found[0].posix.dumps(0))
```

The symbolic execution recovered the flag, which the binary accepted (`candidate: accepted`).

The solver is in [`research/og_angr.py`](research/og_angr.py); it has a machine-specific hardcoded binary path and needs the `BIN` path adjusted to the location of the challenge binary.

## Lesson

A program's decision path can be inverted with symbolic execution even when hand-tracing every VM opcode would be tedious. Choosing accurate find/avoid addresses and initial state is essential.
