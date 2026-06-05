# Civic Compass — Engagement Strategy

## Design Philosophy

**"Companion, Not Quiz."**

The app is not a one-shot test you take and forget. It's a reflective companion that unfolds your civic identity over time. Every design decision optimizes for **return visits** and **curiosity**, not completion speed.

---

## Core Psychological Principles

| Principle | Source | Application |
|:---|:---|:---|
| **Curiosity Gap** | Loewenstein (1994) | Greyed-out axes create a desire to "complete" the compass |
| **Variable Reward** | Nir Eyal, *Hooked* | Each session reveals or shifts something unpredictably |
| **Endowed Progress** | Nunes & Drèze (2006) | "Your compass is 30% calibrated" — progress bars create commitment |
| **Identity Investment** | Sunk cost / IKEA effect | The more answers you give, the more "yours" the compass feels |
| **Micro-commitment** | Fogg Behavior Model | 45 seconds is below the effort threshold. No excuses. |
| **Zeigarnik Effect** | Zeigarnik (1927) | Incomplete tasks stay in memory. An unfinished compass nags. |

---

## User Journey

### Phase A: The Hook (Day 1 — Onboarding)

#### What happens:
1. User selects language.
2. Brief manifesto screen: *"Your beliefs evolve. Shouldn't your compass?"*
3. **8 propositions only.** One per axis. Blunt, provocative, engaging:
   - *"A government that spies on everyone to prevent one terrorist attack — worth it?"*
   - *"Billionaires should not exist."*
   - *"Nature has rights, just like people."*
   - *"The death penalty is sometimes justified."*
   - *"Borders are an outdated concept."*
   - *"AI should be developed as fast as possible, regulation can follow."*
   - *"A strong leader who ignores parliament is better than a weak democracy."*
   - *"Economic growth should never come at the cost of the environment."*
4. **Immediate partial reveal:** Show a radar chart where some axes are filled and others are **ghosted/greyed out** with a "?" label.
5. Message: *"This is your first sketch. It takes about 2 weeks to see the full picture. Ready?"*

#### Why it works:
- 8 questions = under 2 minutes. Zero friction.
- The partially-revealed compass creates a **curiosity gap** — users want to see their complete shape.
- No account required. Wallet-based login (MetaMask connect or create a smart wallet with just an email).

---

### Phase B: The Micro-Session Loop (Days 2-14 — Calibration)

#### What happens:
1. Daily notification: *"45 seconds. 3 questions. What do you think today?"*
2. **3 propositions per session.** Swipe UX (left = disagree, right = agree) or slider.
3. After each session, **one axis sharpens or unlocks:**
   - *"Your Environment axis just came into focus: you lean Ecology (72nd percentile)."*
   - The radar chart animates: a grey axis fills in with color.
4. **Every 3 sessions** → "Compass Pulse" mini-summary:
   - *"Over 3 sessions, your Economy score shifted 0.12 toward Free Market. What changed?"*
   - Optional: 1-line journal note (text input). Turns passive answering into **active reflection**.
5. Progress bar: *"Calibration: 62% complete (5 of 8 axes calibrated)."*

#### Design details:
- **Session length:** 30-60 seconds. Never more.
- **Propositions per session:** 3 (fixed). Enough to be meaningful, short enough to be effortless.
- **Card UX (Web):** Proposition displayed on a card with clear Agree/Disagree buttons + intensity slider.
  - Click Agree / Disagree
  - Drag slider for intensity (Slightly → Strongly)
  - Keyboard shortcuts: ← Disagree, → Agree, Space = Neutral (discouraged but available)
  - Animated card transitions between propositions
- **Axis unlock order:** Randomized per user to create unpredictability (variable reward).

#### Calibration math:
- 8 axes × 5-6 items each = 40-48 propositions total.
- At 3 per day = **14-16 days** to full calibration.
- 8 items answered on Day 1, so effectively **11-13 more sessions**.

---

### Phase C: The Companion (Week 3+ — Post-Calibration)

#### What happens:
1. Message: *"Your Civic Compass is calibrated. From now on, it evolves with you."*
2. Default frequency switches to **weekly** (3 questions per week).
3. User can adjust: Daily / Weekly / Monthly in settings.
4. Questions shift from calibration set to **maintenance propositions:**
   - Re-asks of calibration questions (to detect drift).
   - New propositions from freshly published "question packs."
5. **Monthly auto-snapshot:** *"Here's your February 2026 compass. Compare with January?"*
6. **Context triggers (Phase 2):** After major events, prompt re-evaluation:
   - *"After this week's election, has your view on governance shifted?"*

#### Retention mechanics:
- **$CIVIC token rewards:** Users earn $CIVIC tokens (notional value $0.10 each) for each completed session. Tokens accumulate in their connected wallet (MetaMask or in-app smart wallet). Non-tradeable in Phase 1 — redeemable for USDC in Phase 2. This gives participation tangible future value without attracting bots or farming. See [TOKENOMICS.md](TOKENOMICS.md) for full schedule.
  - Calibration Day 1 (8 Qs): 10 $CIVIC ($1.00).
  - Daily paced session (3 Qs): 5 $CIVIC ($0.50).
  - Calibration complete (all axes): 50 $CIVIC ($5.00) bonus.
  - Monthly snapshot: 10 $CIVIC ($1.00).
  - Research participation: 100 $CIVIC ($10.00).
- **Streak counter:** "You've reflected 12 weeks in a row." (Light, not punishing — no loss aversion dark patterns.)
- **Shape evolution:** Historical radar charts show how the shape has morphed. This is intrinsically interesting.
- **Monthly email/notification:** *"Your compass shifted on 2 axes this month. See what changed."*

---

### Phase D: The Viral Moment — "Civic Mirror" (Post-Calibration)

#### What happens:
After calibration completes, generate a **shareable single-image card:**

```
┌─────────────────────────────┐
│                             │
│     [Radar Chart Image]     │
│                             │
│  ── The Green Libertarian ──│
│                             │
│     civiccompass.app/share   │
│                             │
└─────────────────────────────┘
```

- Auto-generated **persona label** based on the two strongest axis leans:
  - *"The Pragmatic Libertarian"*
  - *"The Green Traditionalist"*
  - *"The Digital Sovereigntist"*
- Styled for Instagram Stories / WhatsApp / X sharing.
- **This is the organic growth engine.** MBTI-style appeal, but for civic identity.

#### Persona label generation logic:
1. Find the axis with the strongest absolute score → primary adjective.
2. Find the second strongest → secondary adjective.
3. Map pole labels to persona words:
   - Economy (+) → "Free-Market" / Economy (-) → "Collectivist"
   - Civil Liberties (+) → "Libertarian" / Civil Liberties (-) → "Securitarian"
   - Environment (+) → "Green" / Environment (-) → "Productivist"
   - etc.
4. Combine: *"The [Secondary] [Primary]"*

---

## Anti-Patterns to Avoid

| Don't | Why | Do Instead |
|:---|:---|:---|
| Force account creation on Day 1 | Friction kills onboarding | Wallet connect (MetaMask) or email-based smart wallet. No passwords. |
| Show 40 questions at once | Overwhelming. Users bounce. | 8 on Day 1, then 3/day for 2 weeks. |
| Gamify with points/badges | This isn't a game. Cheapens the reflection. | Use curiosity and identity investment instead. |
| Punish broken streaks | Loss aversion is a dark pattern | "Welcome back! Here's what you missed." |
| Default to public profiles | Privacy anxiety prevents honest answers | Default to Ghost Mode. Let users opt in to sharing. |
| Use jargon in propositions | Alienates non-academic users | Plain language, strong opinions, culturally neutral. |

---

## Notification Strategy

| Trigger | Message | Frequency |
|:---|:---|:---|
| Daily calibration | *"45 seconds. What do you think today?"* | Daily (calibration phase only) — email or browser notification |
| Weekly reflection | *"3 questions for your week. See if anything shifted."* | Weekly (post-calibration) — email |
| Monthly snapshot | *"Your January compass is ready. Compare with December?"* | Monthly |
| Axis unlock | *"New: Your Justice axis just came into focus."* | Event-driven |
| Inactivity (7 days) | *"Your compass is paused. Pick up where you left off?"* | Once, then silence. |
| Compass drift detected | *"Your Economy score shifted this month. See the change."* | Event-driven |

**Rule:** Never more than 1 notification per day. Users control frequency in settings. Respect "Do Not Disturb."

---

## Key Metrics to Track

| Metric | Target (MVP) | Why It Matters |
|:---|:---|:---|
| Day 1 → Day 2 retention | > 40% | Do users come back after the hook? |
| Calibration completion rate | > 50% | Do users finish all 40-48 propositions? |
| Average session duration | 30-60 seconds | Are sessions quick enough? |
| Weekly active users (post-cal) | > 25% of calibrated users | Are they sticking around after the compass is "done"? |
| Share rate (Civic Mirror card) | > 10% of calibrated users | Is the viral loop working? |
| Skip rate per proposition | < 15% | Are questions engaging or confusing? |
