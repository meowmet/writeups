# AlgoShare — Unicode/Base64 Reference Confusion

**Category:** Web  
**Flag:** `CTF{6d83792951f06a93db90367894856f7f}`

## Vulnerability

Files were referenced by a base64 encoding of their logical paths. A reserved-reference set prohibited sharing `internal/flag.txt` by checking for an **exact encoded string**. However, a reference validator accepted non-ASCII characters and the decoder removed non-alphabet characters before decoding. This created two unequal strings that resolved to the same logical file.

## Attack

The [`solve.py`](solve.py) registered a user, prepended a Unicode euro sign to `base64('internal/flag.txt')`, submitted that forged reference to `/api/share`, and used the app's returned `ref`, `expires`, and HMAC `sig` to request `/download`. The share endpoint itself acted as a signing oracle for a path that should have remained reserved.

The attack depends on the exact reference parser behavior; this is not a generic property of every Python base64 API.

## Fix

Validate and authorize canonical decoded identities rather than raw user strings; reject noncanonical encodings; apply identical normalization and decoding at verification, signing, and retrieval layers.

