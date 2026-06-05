# Civic Compass — Psychometric Validity Plan

## Purpose

This document outlines the plan for ensuring the Civic Compass questionnaire is scientifically valid, reliable, and defensible. Without validation, the compass is a toy. With it, it's a tool.

---

## Stage 1: Theoretical Foundation (Pre-Development)

### 1.1 Axis Definition
- Define 8 axes with clear bipolar labels grounded in political science literature.
- Reference: See [axes_definition.md](axes_definition.md).
- Each axis must map to real-world policy debates, not abstract philosophy.

### 1.2 Item Writing
- Write **10-12 propositions per axis** (80-96 total draft items).
- Follow IPIP item-writing guidelines:
  - Each proposition should clearly load on **one primary axis**.
  - Avoid double-barrelled statements (testing two concepts at once).
  - Mix polarity: ~50% of items per axis should be reverse-scored (agreement = Pole A, not always Pole B).
  - Use clear, jargon-free language.
- Source items from:
  - IPIP (Public Domain) for personality-adjacent items.
  - PolitiScales / SapplyValues (MIT) for structural inspiration.
  - **Original writing** for final propositions (this is our IP).

### 1.3 Expert Review
- Have **2-3 reviewers** (political scientists, psychometricians, or experienced survey designers) rate each item for:
  - **Clarity:** Is the proposition unambiguous?
  - **Face validity:** Does it obviously measure what it claims to?
  - **Axis assignment:** Does it belong on the intended axis?
- Channels: Academic contacts, Prolific academic panel, or Upwork specialists ($200-500).
- **Deliverable:** Revised item pool of 80-96 propositions with expert sign-off.

---

## Stage 2: Pilot Study (Using the App)

Instead of an external survey tool, the app itself serves as the research instrument via **Research Mode**. This validates both the psychometric properties and the real UX simultaneously.

### 2.1 Research Mode in the App
- **Platform:** The Civic Compass web app (civiccompass.app — accessible from any browser, no install required).
- **Entry:** Participant visits the URL, connects wallet (MetaMask or creates a smart wallet), and enters an invite code (e.g., `CIVIC-RESEARCH-2026`) which activates Research Mode.
- **Research Mode behavior:**
  - Informed consent screen (required for publishable research).
  - Demographics collection (age range, gender, country, self-reported left-right placement as validity anchor).
  - **All 80-96 propositions served in one session** (no pacing), randomized order.
  - Full radar chart + persona label shown as reward at the end.
  - Response time per item is logged automatically (`answeredAt` timestamps on `UserResponse`).
- **Participants:** 200-300 via Prolific (~$2/participant = $400-600), social media, or university networks.
- **Compensation:** Participants earn **$CIVIC tokens** (notional value $0.10 each, non-redeemable in Phase 1) directly to their in-app smart wallet (ERC-4337 on Polygon). Research participants earn 100 $CIVIC ($10 notional). Tokens become redeemable for USDC in Phase 2. See [TOKENOMICS.md](TOKENOMICS.md).
- **Estimated completion time:** 15-20 minutes (swipe UX is faster than form-based surveys).
- **Data export:** `GET /admin/export/responses` dumps all research-mode responses as CSV for analysis.

### 2.1.1 Advantages Over External Surveys
- Validates the **actual instrument and UX** together — skip rates and response times in the real swipe interface, not a proxy.
- Participants get a meaningful reward (their radar chart), leading to higher-quality responses.
- Zero extra tooling — no Typeform, no data migration. Everything lives in one database.
- Response time tracking comes free, enabling detection of low-effort responses (< 1 second = suspicious).

### 2.2 Exploratory Factor Analysis (EFA)
- **Tool:** Python (`factor_analyzer` library) or R (`psych` package).
- **Method:** Principal Axis Factoring with Oblimin rotation (axes may correlate).
- **Key questions:**
  - Do items cluster into 8 distinct factors?
  - Which items cross-load (load >0.30 on multiple factors)?
  - Are any factors redundant (correlation >0.70)?
- **Decision rules:**
  - If only 6-7 factors emerge → merge or drop axes. **That's fine.** The data decides.
  - Drop items with primary factor loading < 0.40.
  - Drop items that cross-load on multiple factors (difference <0.15 between top two loadings).

### 2.3 Internal Consistency
- Calculate **Cronbach's α** for each axis.
- **Target:** α > 0.70 (acceptable), α > 0.80 (good).
- If α is too low for an axis:
  - Check inter-item correlations. Remove items with low item-total correlation (<0.30).
  - Consider whether the axis is too broad (split it) or items are poorly written (rewrite).

### 2.4 Item Reduction
- **Target:** 5-6 high-quality items per axis after pruning.
- **Final calibration set:** 40-48 propositions.
- This becomes the **Calibration Quiz** in the app.

---

## Stage 3: Validation (Post-MVP Launch)

### 3.1 Test-Retest Reliability
- **Method:** Re-survey ~50-100 participants after **2-3 weeks**.
- **Metric:** Pearson correlation between Time 1 and Time 2 scores per axis.
- **Target:** r > 0.80.
- If reliability is low → the axis may be measuring mood, not stable beliefs. Investigate and stabilize items.

### 3.2 Convergent Validity
- Include a known, validated scale in the survey alongside your items:
  - **PolitiScales 8values** (for political axis validation).
  - **IPIP markers** (for personality-adjacent axes like Justice/Society).
- **Expected:** Your Economy axis correlates r > 0.50 with PolitiScales Economy axis.
- Low convergent validity → your items may not be measuring what you think.

### 3.3 Discriminant Validity
- Axes that should be independent should show low inter-correlations (r < 0.30).
- Example: Economy and Justice should be weakly correlated. If they correlate at r = 0.70, they're measuring the same underlying construct → merge them.

### 3.4 Normalization
- With 300+ responses, compute **population means and standard deviations** per axis.
- Convert raw scores (-1.0 to +1.0) into **percentile ranks**.
- This makes scores meaningful to users: *"You lean more toward Liberty than 78% of users."*
- Recalculate norms periodically as the user base grows.

---

## Stage 4: Ongoing Quality (Post-Launch)

### 4.1 Item Response Theory (IRT) — Optional Advanced
- Fit a Graded Response Model to the Likert data.
- Identify items with poor discrimination or extreme difficulty.
- Replace weak items over time (treated as "question pack updates").

### 4.2 Differential Item Functioning (DIF)
- Check if items behave differently across demographics (e.g., does a Justice item mean something different in Iran vs. USA?).
- Flag items with DIF for localization or replacement.

### 4.3 Feedback Loop
- Track **skip rates** and **response time** per item in the app.
- Items with high skip rates or very fast response times (< 1 second) may be confusing or low-effort.
- Replace underperforming items quarterly.

---

## Timeline

| Phase | When | Depends On |
|:---|:---|:---|
| Stage 1 (Theory) | Weeks 1-3 | Nothing. Start immediately. |
| App MVP + Research Mode | Weeks 1-4 | Built in parallel with Stage 1. |
| Stage 2 (Pilot via App) | Weeks 4-6 | App functional with all 80-96 items loaded + research mode. |
| Item pruning → Normal Mode | Week 6 | Stage 2 analysis complete. Update app with validated 40-48 items. |
| Stage 3 (Validation) | Weeks 8-14 | App live with validated item set. |
| Stage 4 (Ongoing) | Continuous | Stage 3 baseline established. |

---

## Budget Estimate

| Item | Cost |
|:---|:---|
| Expert review (2-3 reviewers) | $200 - $500 |
| Pilot participants (200-300 via Prolific or organic) | $400 - $600 in $CIVIC tokens (or $0 with organic recruitment) |
| Retest participants (50-100) | $100 - $200 in $CIVIC tokens |
| Survey platform | $0 (the app itself) |
| App distribution (TestFlight / Expo Go) | $0 |
| $CIVIC token deployment (Polygon) | ~$5 one-time gas |
| Paymaster gas sponsorship | ~$20-50 for 300 wallet creations |
| **Total** | **$325 - $1,350** (as low as $225 with organic recruitment) |

---

## Tools & Resources

- **Factor Analysis:** Python `factor_analyzer`, R `psych` package
- **Reliability:** Python `pingouin`, R `ltm`
- **Survey Platform:** The Civic Compass app (Research Mode) + Prolific (participant recruitment)
- **Reference:** IPIP item writing guide at [ipip.ori.org](https://ipip.ori.org)
- **Reference:** PolitiScales source at [github.com/Conobi/politiscales](https://github.com/Conobi/politiscales)
