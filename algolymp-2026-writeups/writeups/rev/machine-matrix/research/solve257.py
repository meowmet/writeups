import numpy as np
d=np.load("mmdata.npz"); c0=d["c0"].astype(int); cols=d["cols"].astype(int); enc=d["enc"].astype(int)
P0=bytearray(b"ALGOLYMP{"+b"A"*44+b"}")
P=257
def inv(a): return pow(int(a)%P, P-2, P)
# actual output bytes for each free-input flip
out_c0=c0.copy()
col257={}
for i in range(9,53):
    out_i=(c0+cols[i])%256
    col257[i]=(out_i-out_c0)%P   # M[:,i] over GF(257)
flag=bytearray(P0)
def solve(M, t):   # M: list of column-vectors (each len R), t: len-R target. unknown=len(M). GF(257)
    R=len(t); K=len(M)
    A=[[M[c][r] for c in range(K)]+[t[r]] for r in range(R)]  # R x (K+1)
    # gaussian elim mod P
    row=0; piv=[]
    for col in range(K):
        pr=None
        for r in range(row,R):
            if A[r][col]%P!=0: pr=r;break
        if pr is None: continue
        A[row],A[pr]=A[pr],A[row]
        iv=inv(A[row][col]); A[row]=[(x*iv)%P for x in A[row]]
        for r in range(R):
            if r!=row and A[r][col]%P!=0:
                f=A[r][col]; A[r]=[(A[r][k]-f*A[row][k])%P for k in range(K+1)]
        piv.append(col); row+=1
    sol=[0]*K
    for idx,col in enumerate(piv): sol[col]=A[idx][K]%P
    return sol
ok=True
for b in range(6):
    for g in range(3):
        ip=[9*b+g,9*b+g+3,9*b+g+6]; op=[9*b+g,9*b+g+3,9*b+g+6]
        free=[p for p in ip if 9<=p<53]
        if not free: continue
        M=[[col257[p][o] for o in op] for p in free]  # columns
        t=[(enc[o]-c0[o])%P for o in op]
        delta=solve(M,t)
        for k,p in enumerate(free):
            v=(P0[p]+delta[k])%P
            if v>255: ok=False; print("byte 256 at",p)
            flag[p]=v%256
print("FLAG:", bytes(flag).decode('latin-1','replace'))
