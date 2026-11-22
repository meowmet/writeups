# Meridian Systems — Web Cache Deception Between nginx and Spring

**Category:** Web · **Event:** AlgoCyber / Algolymp 2026  
**Flag:** `CTF{b661c08f72ccbfe15f070c88fb3bdf27}`

## The two interpretations of one path

The Spring backend returned a user-specific HTML account page at `/account`, authenticated by `JSESSIONID`, and marked the response `Cache-Control: private, no-store`. However, a reverse proxy reportedly treated URLs ending in `.css` as cacheable and keyed the cache by path instead of user/session.

A path such as:

```text
/account;sample.css
```

was seen differently by the two layers:

- **Spring:** `/account` plus a semicolon-style path parameter → serve the authenticated account page.
- **nginx:** a URL ending in `.css` → match a static-asset cache rule.

A guest-session test requested `/account;t.css` and then fetched the same URL without cookies; the cached guest account page was still served. This showed a shared-cache policy overriding the backend's privacy intent.

## Challenge exploit chain

1. Construct a fresh path such as `/account;adminleak<unique>.css`.
2. **Do not visit it first**, since that can poison the key with your own account page.
3. Submit that path to the challenge's `/report` function.
4. The authenticated admin reviewer loads the URL; Spring sends the admin account page.
5. nginx stores the response using the `.css`-looking path.
6. Fetch that exact path without the admin cookie to retrieve the cached administrator response, which included the flag.

This is **web cache deception**, not a direct authorization bypass. The administrator was authorized to see the account page; the intermediary wrongfully reused its private content for someone else.

## Remediation

Never cache authenticated HTML based solely on a filename-like extension. Respect backend `private` and `no-store`; account for `Cookie`/`Authorization` and response content type; normalize and route paths consistently across proxy and application; and avoid exposing privileged content to shared caches.
