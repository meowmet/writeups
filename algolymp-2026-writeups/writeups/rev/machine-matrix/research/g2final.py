import numpy as np, base64
TB="Fw0Omkba/fbM+v2+RMgSdq4B1MR+eqQHQ5/JIYSkln2DCfLeDZx0kgbcsVmcWty/rF4x+LnX"
enc=np.frombuffer(base64.b64decode(TB),np.uint8).astype(int)
M=[[54,60,30],[149,151,5],[207,200,124]]
def f(dot):
    q=(dot*0xff0100)>>32; return (dot-q*257)&0xff
op=[47,50,53]; x53=125
print("targets enc[47,50,53]=",[enc[o] for o in op])
hits=[]
for x47 in range(256):
    for x50 in range(256):
        o0=f(M[0][0]*x47+M[0][1]*x50+M[0][2]*x53)
        o1=f(M[1][0]*x47+M[1][1]*x50+M[1][2]*x53)
        o2=f(M[2][0]*x47+M[2][1]*x50+M[2][2]*x53)
        if o0==enc[47] and o1==enc[50] and o2==enc[53]:
            hits.append((x47,x50))
for a,b in hits:
    pr = (32<=a<127 and 32<=b<127)
    print("x47=%d x50=%d printable=%s  '%s' '%s'"%(a,b,pr, chr(a) if 32<=a<127 else '?', chr(b) if 32<=b<127 else '?'))
print("total hits:",len(hits))
