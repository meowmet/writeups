import angr, logging
logging.getLogger('angr').setLevel('ERROR')
BIN="/mnt/c/Users/meowm/Documents/lil fun/ctf/challenges/rev/opcodegarden/extract/opcode_garden"
proj=angr.Project(BIN, auto_load_libs=False)
base=proj.loader.main_object.min_addr
accept=base+0x1592; reject=base+0x1552
print("base",hex(base),"accept",hex(accept))
st=proj.factory.full_init_state()   # default symbolic stdin
sm=proj.factory.simulation_manager(st)
sm.explore(find=accept, avoid=reject, num_find=1)
if sm.found:
    out=sm.found[0].posix.dumps(0)
    print("FOUND repr:", repr(out))
    print("printable:", out.decode('latin-1','replace'))
else:
    print("no solution; stashes:", {k:len(v) for k,v in sm.stashes.items() if v})
