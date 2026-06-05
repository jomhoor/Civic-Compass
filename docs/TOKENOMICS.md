# Civic Compass — Tokenomics & Revenue Model

## 1. Token Overview

| Property | Value |
|:---|:---|
| **Name** | Civic Token |
| **Symbol** | $CIVIC |
| **Network** | Polygon PoS |
| **Standard** | ERC-20 |
| **Supply model** | Uncapped (mint-on-earn) |
| **Notional value** | $0.10 USD per $CIVIC |
| **Tradeable** | No (Phase 1-2). DEX listing considered in Phase 3 after legal review. |
| **Wallet type** | MetaMask / WalletConnect (bring your own) OR ERC-4337 Smart Wallet (created in-app for users without a wallet) |

---

## 2. Token Lifecycle by Phase

### Phase 1: Points on a Blockchain (MVP)

$CIVIC is **non-tradeable** and **non-redeemable**. It functions as a participation credit — a points system with an on-chain backbone.

- **Minting:** Admin-only. Tokens are minted to user wallets when they complete actions.
- **Redemption:** None. No cash-out. No USDC exchange.
- **Trading:** None. Not listed on any DEX.
- **Display:** Users see their $CIVIC balance and a notional value ($0.10/token) in the app.
- **Purpose:** Establish the token on-chain so it can be "lit up" later without migration.

**Why non-tradeable:**
- No regulatory risk (non-redeemable points ≠ securities).
- No bot/farming incentive (no money to extract = no Sybil attacks).
- Clean psychometric data (users answer honestly, not for profit).
- Users build a balance they'll value when redemption activates.

### Phase 2: Controlled Redemption

$CIVIC becomes **redeemable** via a treasury-backed exchange.

- **Redemption:** Burn $CIVIC → receive USDC from treasury wallet.
- **Rate:** Fixed at $0.10 per $CIVIC, minus 3% redemption fee.
- **Example:** User burns 100 $CIVIC → receives 9.70 USDC (you keep 0.30 USDC as fee).
- **Treasury:** Funded by subscription revenue and B2B contracts.
- **Cap:** Daily/weekly redemption limits to manage treasury liquidity.

### Phase 3: Open Economy (After Legal Review)

Options to evaluate (not committed):
- **DEX listing:** CIVIC/USDC pool on QuickSwap. Price floats.
- **Bonding curve:** Algorithmic mint/burn at a spread (buy at $0.105, sell at $0.095).
- **Governance:** $CIVIC holders vote on new question packs, axis changes, platform changes.

---

## 3. Earn Schedule

| Action | $CIVIC Earned | USD Value ($0.10) | Frequency |
|:---|:---|:---|:---|
| Calibration quiz (Day 1, 8 Qs) | 10 | $1.00 | Once |
| Daily paced session (3 Qs) | 5 | $0.50 | Daily (calibration phase) |
| Calibration complete (all axes) | 50 | $5.00 | Once (bonus) |
| Weekly session (post-calibration) | 5 | $0.50 | Weekly |
| Monthly snapshot saved | 10 | $1.00 | Monthly |
| Research Mode completion (80-96 Qs) | 100 | $10.00 | Once |

### Estimated Earnings per User

| User Type | Period | $CIVIC Earned | Notional Value |
|:---|:---|:---|:---|
| Casual (calibration only) | 2 weeks | ~120 | $12.00 |
| Active (weekly for 6 months) | 6 months | ~250 | $25.00 |
| Research participant | 1 session | 100 | $10.00 |

### Estimated Minting Costs (Phase 1)

| Scenario | Users | Tokens Minted | Notional Liability |
|:---|:---|:---|:---|
| Pilot (friends) | 20 | ~2,400 | $240 |
| Research study | 300 | ~30,000 | $3,000 |
| First year (organic) | 1,000 | ~250,000 | $25,000 |

**Note:** In Phase 1, notional liability is theoretical — tokens are non-redeemable. The liability only materializes when you activate redemption in Phase 2, and only for tokens actually redeemed.

---

## 4. Founder Allocation

| Allocation | Amount | Vesting |
|:---|:---|:---|
| **Founder reserve** | 15% of first 1,000,000 tokens minted (150,000 $CIVIC) | 12-month linear vesting, starting at Phase 2 redemption launch |
| **Team pool** | 5% of first 1,000,000 tokens minted (50,000 $CIVIC) | Reserved for future team members |
| **Treasury** | No allocation — funded by revenue, not token minting | — |

**Rules:**
- Founder tokens are minted at deployment but locked in the smart contract until vesting activates.
- Founder tokens cannot be redeemed/sold before Phase 2.
- Total founder + team allocation capped at 20%. This is visible on-chain for transparency.

---

## 5. Revenue Model

### Primary Revenue: Subscriptions (Phase 2+)

| Tier | Price | Features |
|:---|:---|:---|
| **Free** | $0 | Compass + calibration + paced sessions + 3 snapshots + $CIVIC earning |
| **Sponsor** | $4.99/month | Unlimited history, advanced analytics, compass diff tool, priority support, Civic Mirror card customization |

**Conversion target:** 5-8% of active users → Sponsor tier.

### Secondary Revenue: B2B Licenses (Phase 3)

| Client Type | Use Case | Price Range |
|:---|:---|:---|
| Think tanks | Team Polytope — visualize organizational civic alignment | $500 - $2,000/year |
| Political parties | Voter base analysis, candidate alignment mapping | $2,000 - $10,000/year |
| Universities | Research tool access, bulk data export, classroom use | $500 - $5,000/year |
| Media / pollsters | Aggregated trend data dashboards | $1,000 - $5,000/year |

### Tertiary Revenue: Token Economy (Phase 2-3)

| Source | Mechanism | Estimated Revenue |
|:---|:---|:---|
| Redemption fee | 3% on every $CIVIC → USDC burn | Scales with token volume |
| Sponsored question packs | NGOs/govts pay to distribute themed propositions | $500 - $5,000 per pack |
| Data marketplace (opt-in) | Anonymized aggregate compass trends sold to researchers | Per-query or subscription pricing |

### Revenue Projections (Conservative)

| Milestone | Users | Monthly Revenue | Source |
|:---|:---|:---|:---|
| Month 6 | 1,000 | $250 - $400 | Subscriptions (50-80 sponsors) |
| Month 12 | 5,000 | $1,250 - $2,000 | Subscriptions + first B2B contract |
| Month 18 | 10,000 | $3,000 - $7,000 | Subscriptions + B2B + redemption fees |

---

## 6. Anti-Abuse Measures

| Risk | Mitigation |
|:---|:---|
| **Sybil attacks** (multiple device IDs) | Rate-limit wallet creation per IP. Device attestation (Expo Device API). In Phase 2+, require email for redemption. |
| **Answer farming** (random fast answers) | Response time tracking. Flag sessions with avg <1 sec/item. Withhold $CIVIC for flagged sessions. |
| **Redemption drain** | Daily/weekly redemption caps. Treasury monitoring dashboard. Pause redemption if treasury balance drops below threshold. |
| **Inflation** | Earn rates adjustable via admin API. Halving events possible (e.g., earn rate drops 50% after 1M tokens minted). |

---

## 7. Legal Considerations

| Area | Status | Action |
|:---|:---|:---|
| **Securities law** | Phase 1 is safe — non-redeemable points are not securities. | Get legal opinion before activating Phase 2 redemption. |
| **Money transmission** | Redemption ($CIVIC → USDC) may trigger money transmitter licensing in some jurisdictions. | Consult crypto-native legal counsel (e.g., Anderson Kill, Paradigm Legal). |
| **Tax** | Token earnings may be taxable income in some jurisdictions once redeemable. | Add disclaimer in app. Not your responsibility to report for users. |
| **GDPR / privacy** | Wallet addresses are pseudonymous but still personal data under GDPR. | Include wallet address in data export/deletion flows. |
| **Token classification** | $CIVIC as utility token (access to platform features) vs. payment token vs. security. | Structure utility-first: tokens unlock features, not investment returns. |

**Estimated legal cost:** $2,000 - $5,000 for a crypto-native legal opinion before Phase 2 launch.

---

## 8. Technical Implementation Notes

### Smart Contract (ERC-20)

```solidity
// Simplified — actual contract will use OpenZeppelin
contract CivicToken is ERC20, Ownable {
    constructor() ERC20("Civic Token", "CIVIC") {}

    // Only the admin (backend wallet) can mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Burn for redemption (Phase 2)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

### Backend Flow (Phase 1)

```
User completes session
  → Backend validates answers (quality check)
  → Backend calls CivicToken.mint(userWalletAddress, amount)
  → Transaction submitted via admin wallet (gas paid by Paymaster)
  → Token balance updated in Wallet table (cached)
  → User sees updated balance in app
```

### Gas Costs

| Operation | Estimated Gas (Polygon) | Cost |
|:---|:---|:---|
| Token deployment | ~2M gas | ~$0.05 |
| Mint per user | ~50K gas | ~$0.001 |
| Batch mint (50 users) | ~500K gas | ~$0.01 |
| 300 research participants | — | ~$0.06 total |

**Recommendation:** Batch mints daily/hourly rather than per-session to minimize transactions.

---

## 9. References

- [ERC-4337: Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)
- [thirdweb Smart Wallet SDK](https://thirdweb.com/smart-wallet)
- [Polygon PoS Gas Tracker](https://polygonscan.com/gastracker)
- [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/5.x/erc20)
