# Civic Compass — Phase 1 Plan (MVP)

## Goal

Ship the **atomic loop**: Answer questions → See your compass → Save snapshot → See history.  
Plus a **Research Mode** so the app itself can serve as the psychometric validation instrument.  
Every user connects a wallet (MetaMask) or gets a smart wallet created for them, and earns **$CIVIC tokens** for participation.  
**Web-only for Phase 1** (Next.js). Mobile deferred to Phase 2.
Nothing else. No matchmaking, no sharing, no 3D, no push notifications.

---

## What's IN Phase 1

| # | Task | Component | Depends On |
|:---|:---|:---|:---|
| 1 | Define 8 axes formally | Docs | — |
| 2 | Write calibration propositions (8-10 per axis) | Docs | #1 |
| 3 | Scaffold NestJS + Prisma + Postgres | Backend | — |
| 4 | Wallet-based auth (SIWE or smart wallet → JWT) | Backend | #3 |
| 5 | Question & UserResponse CRUD | Backend | #3 |
| 6 | Compass calculation endpoint | Backend | #5 |
| 7 | Snapshot save & history | Backend | #6 |
| 8 | Scaffold Next.js app (App Router + Tailwind + Shadcn) | Web | — |
| 9 | Wallet connection (RainbowKit: MetaMask + smart wallet) | Web | #8 |
| 10 | Onboarding (language select + manifesto) | Web | #8 |
| 11 | Calibration quiz flow (Day 1: 8 Qs) | Web | #8, #5 |
| 12 | 2D radar chart compass view | Web | #8, #6 |
| 13 | Paced question session (3 Qs) | Web | #5, #11 |
| 14 | Basic snapshot history page | Web | #7, #12 |
| 15 | Wallet page (balance, tx history, address) | Web | #9 |
| 16 | Research Mode: invite code + consent + demographics | Backend + Web | #4, #5, #11 |
| 17 | Research Mode: CSV export endpoint | Backend | #16 |
| 18 | Deploy $CIVIC ERC-20 token on Polygon | Blockchain | — |
| 19 | Token reward distribution for answered questions | Backend | #18, #4, #5 |

---

## What's OUT (Deferred)

| Feature | Deferred To | Reason |
|:---|:---|:---|
| Mobile app (React Native) | Phase 2 | Web-first. Mobile adds reach after validation. |
| Matchmaking / community | Phase 3 | Needs validated compass first |
| Push notifications / scheduler | Phase 2 | Web uses email reminders instead |
| 3D polytope visualization | Phase 2 | 2D radar chart is sufficient for MVP |
| Privacy / sharing modes | Phase 2 | Default to private-only |
| Region-specific questions | Phase 2 | Start with universal propositions |
| Team builder | Phase 3 | Requires matchmaking |
| Civic Mirror shareable card | Phase 2 | Needs calibration flow working first |
| i18n / RTL support | Phase 1.5 | Build the hooks, defer translations |

**Notes:**
- Research Mode is IN Phase 1 because the app *is* the validation instrument. See [psychometric_validity.md](psychometric_validity.md).
- The smart wallet and $CIVIC token are IN Phase 1 because they enable anonymous participant compensation and establish the token economy from day one. Users can connect MetaMask or get a smart wallet created for them.
- $CIVIC is **non-tradeable and non-redeemable** in Phase 1 — it's a points system on a blockchain backbone. See [TOKENOMICS.md](TOKENOMICS.md).

---

## Backend: Database Schema (Phase 1)

```prisma
model User {
  id                    String         @id @default(uuid())
  walletAddress         String         @unique  // Polygon address (MetaMask or smart wallet)
  isSmartWallet         Boolean        @default(false) // true if we created the wallet for them
  isResearchParticipant Boolean        @default(false)
  inviteCode            String?        // e.g. "CIVIC-RESEARCH-2026"
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
  responses             UserResponse[]
  compassEntries        CompassEntry[]
  demographics          Demographics?
  wallet                Wallet?
}

model Demographics {
  id             String  @id @default(uuid())
  userId         String  @unique
  ageRange       String? // "18-24", "25-34", "35-44", "45-54", "55-64", "65+"
  gender         String? // free text
  country        String?
  selfPlacement  Float?  // -1.0 (far left) to +1.0 (far right) — validity anchor
  user           User    @relation(fields: [userId], references: [id])
}

model Question {
  id        String         @id @default(uuid())
  text      String
  weights   Json           // e.g. { "economy": 0.8, "civil_liberties": -0.3 }
  active    Boolean        @default(true)
  order     Int            @default(0)
  createdAt DateTime       @default(now())
  responses UserResponse[]
}

model UserResponse {
  id          String   @id @default(uuid())
  userId      String
  questionId  String
  answerValue Float    // -1.0 to 1.0
  answeredAt  DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  question    Question @relation(fields: [questionId], references: [id])

  responseTimeMs Int?     // milliseconds to answer (for research quality filtering)

  @@unique([userId, questionId]) // One answer per question (latest wins)
}

model CompassEntry {
  id           String   @id @default(uuid())
  userId       String
  dimensions   Json     // { economy: 0.5, governance: -0.2, ... }
  confidence   Json     // { economy: 6, governance: 3, ... } (answer count per axis)
  snapshotName String?
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
}

model Wallet {
  id               String          @id @default(uuid())
  userId           String          @unique
  polygonAddress   String          @unique  // Same as User.walletAddress for MetaMask users; smart wallet address for others
  walletType       String          @default("metamask") // "metamask", "walletconnect", "smart_wallet"
  tokenBalance     Float           @default(0) // Cached $CIVIC balance (source of truth is on-chain)
  createdAt        DateTime        @default(now())
  user             User            @relation(fields: [userId], references: [id])
  transactions     TokenTransfer[]
}

model TokenTransfer {
  id          String   @id @default(uuid())
  walletId    String
  amount      Float    // $CIVIC tokens
  reason      String   // "calibration_complete", "daily_session", "research_participation"
  txHash      String?  // Polygon transaction hash (null if pending/batched)
  status      String   @default("pending") // "pending", "confirmed", "failed"
  createdAt   DateTime @default(now())
  wallet      Wallet   @relation(fields: [walletId], references: [id])
}
```

**Key changes from original design:**
- `Question.weights` is now `Json` (multi-axis) instead of `dimension: Enum` + `weight: Float`.
- `Wallet` and `TokenTransfer` track the $CIVIC token economy.
- `User.walletAddress` replaces `deviceId` — authentication is wallet-based (SIWE for MetaMask, or session-based for smart wallets).
- `User.isSmartWallet` distinguishes users who connected MetaMask from those who got an in-app smart wallet.

---

## Backend: API Endpoints (Phase 1)

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/auth/wallet` | Authenticate via SIWE (Sign-In With Ethereum). Verifies wallet signature, returns JWT. |
| `POST` | `/auth/smart-wallet` | Create a smart wallet (ERC-4337) for users without MetaMask, return JWT. |
| `POST` | `/auth/research` | Authenticate + activate research mode via invite code. |
| `GET` | `/questions/calibration` | Get the 8 onboarding questions (1 per axis) |
| `GET` | `/questions/next` | Get next 3 unanswered questions for paced session |
| `GET` | `/questions/all` | *Research Mode only:* Get all 80-96 propositions (randomized) |
| `POST` | `/responses` | Submit an array of answers `[{ questionId, answerValue, responseTimeMs? }]` |
| `POST` | `/demographics` | *Research Mode only:* Submit demographics `{ ageRange, gender, country, selfPlacement }` |
| `GET` | `/compass` | Get current calculated compass vector + confidence |
| `POST` | `/compass/snapshot` | Save current state as a named snapshot |
| `GET` | `/compass/history` | List all snapshots for the user |
| `GET` | `/admin/export/responses` | *Admin:* Export all research-mode responses as CSV |
| `GET` | `/wallet` | Get user's wallet address and $CIVIC balance |
| `GET` | `/wallet/transactions` | List token transfer history |
| `POST` | `/admin/distribute` | *Admin:* Batch-distribute $CIVIC tokens to eligible wallets |

---

## Web App: Page Map (Phase 1)

```
civiccompass.app
├── / (Landing page — manifesto + "Connect Wallet" or "Get Started")
│
├── /connect
│   ├── RainbowKit modal: MetaMask / WalletConnect / Coinbase Wallet
│   └── "No wallet?" → Create smart wallet (email-based, no extension needed)
│
├── /onboarding (shown once after first wallet connect)
│   ├── LanguageSelect
│   ├── InviteCode (optional — entering a valid code activates Research Mode)
│   └── Manifesto ("Your beliefs evolve. Shouldn't your compass?")
│
├── [Research Mode Branch]
│   ├── /research/consent
│   ├── /research/demographics
│   ├── /research/quiz (all 80-96 propositions, card UI, no pacing)
│   └── /research/results (full radar chart + persona label)
│
├── [Normal Mode]
│   ├── /calibration (shown until 8 initial Qs answered)
│   │   └── Card-based propositions (click Agree/Disagree or use slider)
│   └── /dashboard (main view after calibration)
│       ├── Compass tab: RadarChart (2D, 8 axes) + CalibrationProgress
│       ├── Session tab: Answer 3 propositions (card UI)
│       ├── History tab: Snapshot list (date, name, mini-chart)
│       └── Wallet tab: $CIVIC balance, transaction history, address
│
└── /settings
    └── Reset compass / Disconnect wallet / About
```

---

## Tech Stack (Phase 1)

| Layer | Choice | Reason |
|:---|:---|:---|
| Backend framework | NestJS | Modular, TypeScript, scalable |
| ORM | Prisma | Type-safe, great DX, migrations |
| Database | PostgreSQL | JSONB support for dimensions |
| Web framework | Next.js (App Router) | SSR, file-based routing, already in project spec |
| UI library | Tailwind CSS + Shadcn/ui | Consistent design system, accessible components |
| State management | Zustand | Simple, lightweight, no boilerplate |
| Server state | TanStack Query | Caching, refetching, optimistic updates |
| Charts | Recharts or D3.js | Radar chart rendering (SVG-based, web-native) |
| Wallet connection | RainbowKit + wagmi + viem | MetaMask, WalletConnect, Coinbase Wallet, smart wallet fallback |
| Smart Wallets | thirdweb Embedded Wallet or ZeroDev | ERC-4337 for users without MetaMask (email-based creation) |
| Blockchain | Polygon PoS | Low gas (~$0.01/tx), established ecosystem |
| Token | Custom ERC-20 ($CIVIC) | Deployed on Polygon, minted by admin wallet. Non-tradeable in Phase 1. See [TOKENOMICS.md](TOKENOMICS.md). |
| Auth | SIWE (Sign-In With Ethereum) | Wallet-based auth. No passwords, no email required. |

---

## Definition of Done (Phase 1)

### Normal Mode
- [ ] A user can visit the web app, connect their wallet (MetaMask) or create a smart wallet, and start answering.
- [ ] A user can answer 8 onboarding questions and see a partial radar chart.
- [ ] A user can return and answer 3 more questions until all axes are calibrated.
- [ ] The radar chart visually distinguishes calibrated vs. tentative axes.
- [ ] A user can save a named snapshot of their current compass.
- [ ] A user can view a list of past snapshots.
- [ ] All data persists across sessions (server-side, wallet-based auth).
- [ ] The app works in all modern browsers (Chrome, Firefox, Safari, Edge).

### Research Mode
- [ ] A user can enter an invite code during onboarding to activate Research Mode.
- [ ] A consent screen is shown before any data collection.
- [ ] A demographics form captures age range, gender, country, and self-reported left-right placement.
- [ ] All 80-96 propositions are served in one session (randomized, card UI).
- [ ] Response time per item is recorded.
- [ ] A full radar chart + persona label is shown at the end as reward.
- [ ] An admin can export all research-mode responses as CSV.

### Wallet & Token
- [ ] A user can connect MetaMask (or WalletConnect-compatible wallet) via RainbowKit.
- [ ] A user without a wallet can create a smart wallet (email-based, no browser extension).
- [ ] The user can see their wallet address and $CIVIC balance on the Wallet page.
- [ ] The user earns $CIVIC tokens for completing question sessions.
- [ ] Token transfers are visible in a transaction history.
- [ ] The admin can batch-distribute tokens to wallets via API.

---

## Timeline Estimate

| Week | Focus |
|:---|:---|
| Week 1 | Axis definitions finalized. Propositions drafted. Backend scaffolded. Deploy $CIVIC token on Polygon. |
| Week 2 | Backend: wallet auth (SIWE) + questions + responses. Web: scaffold Next.js + wallet connect (RainbowKit). |
| Week 3 | Backend: compass calculation + snapshots + token distribution. Web: calibration quiz + card UI. |
| Week 4 | Web: radar chart + paced session + history + wallet page. Integration testing. |
| Week 5 | Research mode integration. Polish, bug fixes, internal test (~20 friends). |
| Week 6 | Pilot study via the web app (Prolific / social media, 200-300 participants). Factor analysis. |

---

## Parallel Workstreams

```
Week 1 ──────────────────────────────────────────────
  [Docs] Define axes + write propositions
  [Backend] Scaffold NestJS + Prisma + DB
  [Blockchain] Deploy $CIVIC ERC-20 token on Polygon

Week 2 ──────────────────────────────────────────────
  [Backend] Wallet auth (SIWE) + Question CRUD + Response CRUD
  [Web] Scaffold Next.js + RainbowKit wallet connect + onboarding pages

Week 3 ──────────────────────────────────────────────
  [Backend] Compass calculation + snapshot API + token distribution logic
  [Web] Calibration quiz (card UI) + API integration

Week 4 ──────────────────────────────────────────────
  [Web] Radar chart + paced sessions + history + wallet page
  [Integration] End-to-end testing (including token flow)

Week 5 ──────────────────────────────────────────────
  [Backend] Research auth + demographics + CSV export
  [Web] Research mode pages (consent, demographics, full quiz)
  [All] Internal test with ~20 friends

Week 6 ──────────────────────────────────────────────
  [Research] Pilot study via web app (200-300 participants, paid in $CIVIC)
  [Analysis] Factor analysis → prune to 40-48 validated items
  [App] Update question set with validated items → Normal mode ready
```
