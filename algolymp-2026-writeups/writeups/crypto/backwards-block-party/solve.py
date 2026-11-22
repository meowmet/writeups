#!/usr/bin/env python3
import socket, sys, re

HOST, PORT = sys.argv[1], int(sys.argv[2])
BS = 16
def xor(a,b): return bytes(x^y for x,y in zip(a,b))

class Conn:
    def __init__(s):
        s.s = socket.create_connection((HOST,PORT),timeout=10); s.buf=b""
    def until(s, tok, t=6):
        s.s.settimeout(t)
        try:
            while tok not in s.buf:
                d=s.s.recv(4096)
                if not d: break
                s.buf+=d
        except socket.timeout: pass
        i=s.buf.find(tok);
        out=s.buf[:i+len(tok)]; s.buf=s.buf[i+len(tok):]
        return out
    def menu(s): s.until(b"[3] Get Flag\n")
    def line_hex(s):
        d=s.until(b"\n");
        m=re.search(rb"([0-9a-f]+)\s*$", d.strip())
        return bytes.fromhex(m.group(1).decode())
    def send(s,x): s.s.sendall(x)

c=Conn(); c.until(b"Welcome to Backwards Block Party\n")

def op1(data):  # scrambleBlocks = CBC-Dec
    c.menu(); c.send(b"1\n"); c.until(b"(hex): "); c.send(data.hex().encode()+b"\n")
    return c.line_hex()
def op2(data):  # unwindBlocks = CBC-Enc, filtered
    c.menu(); c.send(b"2\n"); c.until(b"(hex): "); c.send(data.hex().encode()+b"\n")
    d=c.until(b"\n")
    if b"Nope" in d or b"error" in d or b"Invalid" in d:
        return None
    m=re.search(rb"([0-9a-f]+)\s*$", d.strip()); return bytes.fromhex(m.group(1).decode())
def op3():      # secretDump
    c.menu(); c.send(b"3\n"); d=c.until(b"\n")
    return bytes.fromhex(re.search(rb"flag = ([0-9a-f]+)",d).group(1).decode())

secret = op3()
n = len(secret)//BS
s_blocks=[secret[i*BS:(i+1)*BS] for i in range(n)]
print("secretDump blocks:", n)

# 1) recover IV
cc=b"\x00"*BS
r=op1(cc+cc)
out0,out1=r[:BS],r[BS:2*BS]
iv=xor(xor(out0,out1),cc)
print("IV:", iv.hex())

p=[None]*n
# p0 via 2-block trick: q1 [A] -> out0A=Enc(A^iv); q2 [A,B], B=s0^iv^out0A -> out1=Enc(s0^iv)=p0
A=b"\x11"*BS
rA=op2(A); out0A=rA[:BS]
B=xor(xor(s_blocks[0],iv),out0A)
rAB=op2(A+B)
p[0]=rAB[BS:2*BS]
print("p0:", p[0].hex())

# p_i (i>=1): single block X=s_i^p_{i-1}^iv -> Enc(X^iv)=Enc(s_i^p_{i-1})=p_i
for i in range(1,n):
    X=xor(xor(s_blocks[i],p[i-1]),iv)
    out=op2(X)
    if out is None:   # X collided with a secret block; use 2-block fallback
        rA=op2(A); o0=rA[:BS]; Bb=xor(xor(s_blocks[i],p[i-1]),o0)
        out=op2(A+Bb)[BS:2*BS]
    p[i]=out
    print(f"p{i}:", p[i].hex())

padded=b"".join(p)
padlen=padded[-1]
flag=padded[:-padlen] if 1<=padlen<=16 else padded
print("FLAG:", flag.decode(errors="replace"))
c.send(b"3\n")
