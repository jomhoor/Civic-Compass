# E2E Encrypted Chat — Simple ECDH Approach

## Overview

Civic Compass implements end-to-end encrypted direct messaging between users who have established a mutual poke (both users poked each other). The server acts as a dumb relay — it stores and delivers encrypted blobs but **cannot read message content**.

Encryption keys are derived from each user's Ethereum wallet signature, requiring no additional key management or passwords.

---

## Threat Model

### What we protect against

- Server compromise — attacker with full DB access sees only ciphertext
- Network eavesdropping — messages encrypted before leaving the browser
- Server operator curiosity — even we cannot read user messages

### What we do NOT protect against

- Wallet private key compromise — attacker can derive chat keys and decrypt all past/future messages with all contacts
- Compromised browser/device — keys exist in JS memory during session
- Metadata analysis — server knows who talks to whom, when, and message sizes

### Acceptable for our use case

This is a civic discussion platform, not a whistleblower tool. The primary goal is ensuring the server cannot read DMs. Forward secrecy (Signal-level) is out of scope for v1.

---

## Architecture

### Key Derivation

```
User's Ethereum Wallet
         │
         │ signMessage("civic-chat-keypair-v1")
         ▼
Deterministic Signature (65 bytes)
         │
         │ SHA-256 hash
         ▼
32-byte seed
         │
         │ X25519 keypair generation
         ▼
┌────────────────────┐
│ chatPrivateKey     │ ← ephemeral, JS memory only, NEVER persisted
│ chatPublicKey      │ ← uploaded to server once (safe, public)
└────────────────────┘
```

**Why this works:**
- `signMessage` is deterministic — same wallet + same message = same signature, every time
- The wallet's private key never leaves the wallet (hardware chip / extension sandbox)
- `SHA-256(signature)` produces a consistent 32-byte seed for X25519

### Shared Secret (ECDH)

```
Alice                                    Bob
  │                                        │
  │ chatPrivateKey_A                       │ chatPrivateKey_B
  │ chatPublicKey_A  ──── server ────▶     │
  │                  ◀─── server ────  chatPublicKey_B
  │                                        │
  │ sharedSecret = X25519(               │ sharedSecret = X25519(
  │   chatPrivateKey_A,                   │   chatPrivateKey_B,
  │   chatPublicKey_B                     │   chatPublicKey_A
  │ )                                     │ )
  │                                        │
  └──── sharedSecret_A == sharedSecret_B ──┘
         (Diffie-Hellman property)
```

Both users independently compute the **same shared secret** without ever transmitting it. The server never sees it.

### Message Encryption

```
Sender:
  plaintext ──▶ AES-256-GCM(sharedSecret, random IV) ──▶ ciphertext + IV + tag
                                                              │
                                                    POST to server
                                                              │
Receiver:                                                     │
  ciphertext + IV + tag ──▶ AES-256-GCM-decrypt(sharedSecret) ──▶ plaintext
```

Each message gets a **random 12-byte IV** (nonce), ensuring identical plaintext produces different ciphertext.

---

## Key Storage

| Key | Location | Persistence | Who can access |
|-----|----------|-------------|----------------|
| Wallet private key (secp256k1) | Wallet app (MetaMask, Rainbow, hardware) | Permanent | Only the user |
| Wallet signature of `"civic-chat-keypair-v1"` | JS variable | Session only — gone on tab close | Browser JS context |
| Chat private key (X25519) | JS variable, derived from signature | Session only — gone on tab close | Browser JS context |
| Chat public key (X25519) | Server DB (`User.chatPublicKey`) | Permanent | Public — safe to expose |
| Shared secret (per contact pair) | JS variable or in-memory Map | Session only | Browser JS context |
| Message ciphertext | Server DB (`EncryptedMessage.ciphertext`) | Permanent | Anyone — but useless without keys |

**Critical rule: the chat private key and shared secrets are NEVER written to localStorage, sessionStorage, IndexedDB, cookies, or any persistent storage.**

---

## User Experience

### First time enabling chat (once per session)

```
┌──────────────────────────────────────┐
│  Civic Compass wants you to sign     │
│  this message:                       │
│                                      │
│  "civic-chat-keypair-v1"             │
│                                      │
│  This enables encrypted messaging.   │
│  No blockchain transaction will      │
│  occur and no gas fees apply.        │
│                                      │
│  [Reject]              [Sign]        │
└──────────────────────────────────────┘
```

After signing:
- Chat keypair is derived in memory
- Public key is uploaded to server (if not already stored)
- Chat tab becomes functional
- All messages encrypted/decrypted client-side

### Subsequent sessions

- User navigates to chat → wallet sign prompt appears again
- Same wallet → same signature → same keys → can decrypt all history
- No "forgot password" scenario — the wallet IS the key

### Switching wallets

- Different wallet → different signature → different keypair
- Cannot decrypt messages from the old wallet
- This is by design — identity is tied to the wallet

---

## What the Server Sees

```json
{
  "id": "msg_abc123",
  "senderId": "user_alice",
  "receiverId": "user_bob",
  "ciphertext": "7f3a9b2c...e4d1f8a0",
  "iv": "a1b2c3d4e5f6a7b8c9d0e1f2",
  "createdAt": "2026-02-23T12:34:56Z"
}
```

The server knows Alice messaged Bob at 12:34. It does **not** know what she said.

---

## Database Schema

### New column on User

```prisma
model User {
  // ... existing fields
  chatPublicKey  String?  // X25519 public key, hex-encoded
}
```

### New EncryptedMessage model

```prisma
model EncryptedMessage {
  id          String   @id @default(cuid())
  senderId    String
  receiverId  String
  ciphertext  String   // Base64-encoded encrypted content
  iv          String   // Base64-encoded 12-byte initialization vector
  createdAt   DateTime @default(now())

  sender      User     @relation("SentEncryptedMessages", fields: [senderId], references: [id])
  receiver    User     @relation("ReceivedEncryptedMessages", fields: [receiverId], references: [id])

  @@index([receiverId, createdAt])
  @@index([senderId, receiverId, createdAt])
}
```

---

## Frontend Crypto Module

File: `web/src/lib/chat-crypto.ts`

### Dependencies

- `tweetnacl` — X25519 scalar multiplication (ECDH) + key generation
- Web Crypto API — AES-256-GCM encryption (built into browsers, no dependency)
- `@noble/hashes/sha256` — SHA-256 for deriving seed from signature (or Web Crypto)

### API Surface

```typescript
// Derive chat keypair from wallet signature (called once per session)
function deriveChatKeyPair(signature: string): {
  publicKey: Uint8Array;
  privateKey: Uint8Array;  // NEVER persist this
}

// Compute shared secret with another user (cached in memory per contact)
function computeSharedSecret(
  myPrivateKey: Uint8Array,
  theirPublicKey: Uint8Array
): Uint8Array;

// Encrypt a message before sending
function encryptMessage(
  sharedSecret: Uint8Array,
  plaintext: string
): { ciphertext: string; iv: string };

// Decrypt a received message
function decryptMessage(
  sharedSecret: Uint8Array,
  ciphertext: string,
  iv: string
): string;
```

---

## Backend API Endpoints

All endpoints require JWT auth (`JwtAuthGuard`).

### Upload public key

```
POST /api/chat/public-key
Body: { publicKey: string }
→ Stores chatPublicKey on the user record
```

### Get contact's public key

```
GET /api/chat/public-key/:userId
→ { publicKey: string }
(Only returns if mutual poke exists)
```

### Send encrypted message

```
POST /api/chat/:receiverId
Body: { ciphertext: string, iv: string }
→ Stores EncryptedMessage, returns { id, createdAt }
(Only allowed if mutual poke exists)
```

### Get conversation

```
GET /api/chat/:otherUserId?cursor=<messageId>&limit=50
→ { messages: [{ id, senderId, ciphertext, iv, createdAt }], nextCursor }
```

### Get thread list

```
GET /api/chat/threads
→ [{ userId, displayName, lastMessageAt, unseenCount }]
(Metadata only — no message content, since server can't read it)
```

### Get unseen count

```
GET /api/chat/unseen-count
→ { count: number }
```

### Mark seen

```
POST /api/chat/:otherUserId/mark-seen
→ { ok: true }
```

---

## Security Properties

| Property | Status | Notes |
|----------|--------|-------|
| Confidentiality | ✅ | AES-256-GCM, server sees only ciphertext |
| Authentication | ✅ | Only mutual-poked users can exchange keys |
| Integrity | ✅ | GCM authentication tag prevents tampering |
| Forward secrecy | ❌ | Static shared secret per pair — wallet compromise exposes all history |
| Deniability | ❌ | Messages cryptographically attributable to wallet |
| Key revocation | ❌ | Cannot revoke without changing wallet |
| Replay protection | ⚠️ | Unique IVs prevent replay of identical plaintext, but server could re-deliver old messages |
| Metadata protection | ❌ | Server sees sender, receiver, timestamps, message sizes |

---

## Limitations & Future Upgrades

### V1 Limitations (current approach)

1. **No forward secrecy** — if wallet is ever compromised, all past messages are readable
2. **No key rotation** — same shared secret for the lifetime of the wallet pair
3. **No group chat** — ECDH is pairwise; group chat would need per-member encryption
4. **No multi-device** — works across devices IF the same wallet is used; but session state (in-memory keys) doesn't sync

### Potential V2 Upgrades

- **Double Ratchet** — per-message key rotation for forward secrecy (Signal protocol)
- **Key fingerprint verification** — QR code or safety number comparison
- **Message padding** — fixed-size messages to hide content length
- **Disappearing messages** — auto-delete ciphertext from server after TTL

---

## Implementation Estimate

| Component | Effort |
|-----------|--------|
| `chat-crypto.ts` (derive, encrypt, decrypt) | ~100 lines |
| Backend `ChatModule` (relay endpoints) | ~150 lines |
| Prisma schema + migration | ~20 lines |
| Frontend chat UI (restore previous design) | ~200 lines |
| Integrate crypto into chat UI | ~50 lines |
| Testing | ~2 hours |
| **Total** | **~1–2 days** |
