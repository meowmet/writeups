# Meridian Systems — Web (Medium, 500 pts)

**Flag:** `CTF{b661c08f72ccbfe15f070c88fb3bdf27}`  ✅ accepted

## Vuln: Web Cache Deception (nginx reverse proxy + Spring/Java backend)
- Backend is Java (JSESSIONID). `/account` is per-user (`Cache-Control: private, no-store`).
- Spring strips the matrix/path-parameter `;...`, so `/account;x.css` serves the
  **account page** but LOOKS like a static `.css` to nginx.
- nginx caches by extension, keyed on PATH ONLY (ignores cookies AND the backend's
  no-store): verified by priming `/account;t.css` as guest then fetching it with NO
  cookie and still getting the account page.
- `/report` sends a path to an **admin bot** that opens it while authenticated as admin.

## Exploit chain
1. Pick a fresh path `/account;adminleak<rand>.css` (do NOT fetch it yourself first).
2. POST it to `/report` → admin bot visits it → nginx caches the ADMIN's /account page.
3. GET the same path (cookieless) → cached admin account page →
   user=admin, Role=Administrator, flag `CTF{...}` in the page.

See solve run in SOLUTIONS notes.
