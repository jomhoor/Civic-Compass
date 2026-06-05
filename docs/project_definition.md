# Civic Compass - Project Definition

## 1. Project Organization (4-Repo Structure)

The project is divided into four primary components/repositories to be managed under the GitHub organization `jomhoor`.

1.  **`backend`**: The NestJS API server. (Repo: `jomhoor/civic-backend`)
2.  **`mobile`**: The React Native application for end-users. (Repo: `jomhoor/civic-mobile`)
3.  **`web`**: The Web Dashboard for stats and content creation. (Repo: `jomhoor/civic-web`)
4.  **`docs`**: Local development documentation and instructions. (Local only)

### Root Directory Structure
```
civic/
├── backend/               # NestJS Project
├── mobile/                # React Native Project
├── web/                   # Next.js / React Admin Dashboard
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # Charts & Forms
│   │   ├── services/      # API Integration
│   │   └── types/
│   └── package.json
│
├── docs/                  # Project Documentation
│   ├── project_definition.md
│   └── project_description.md
│
├── .copilotinstructions   # AI Context
└── .gitignore
```

---

## 2. Core Feature: Question Methodology

Based on research into standard political compass tests (Political Compass, PolitiScales), the app uses a **Proposition-Response Model** rather than direct questions.

*   **Format:** The user is presented with a strong statement (Proposition).
*   **Response Type:** Likert Scale (Weighted).
    *   Strongly Disagree (-1.0)
    *   Disagree (-0.5)
    *   (Neutral - Avoid if possible) (0.0)
    *   Agree (+0.5)
    *   Strongly Agree (+1.0)
*   **Vector Calculation:** Each proposition affects one or more of the 8 Axes.

### Example Propositions (Draft)
*   *Economic:* "The free market allocates resources more efficiently than the government." (Agree -> +Economic Freedom)
*   *Civil:* "Surveillance is necessary to ensure national security." (Agree -> +Security, -Liberty)
*   *Social:* "Traditional values are the bedrock of a healthy society." (Agree -> +Conservatism)

---

## 3. Backend Architecture (NestJS)

### Database Schema (Prisma / TypeORM)

#### User
*   `id`: UUID (Primary Key)
*   `email`: string (Unique, encrypted if anonymous flow allows recovery)
*   `passwordHash`: string (or Auth Provider ID)
*   `isAnonymous`: boolean
*   `createdAt`: DateTime
*   `updatedAt`: DateTime
*   `subscriptionTier`: Enum ('FREE', 'SPONSOR')
*   `frequencyPreference`: Enum ('DAILY', 'WEEKLY', 'MONTHLY') -> For paced reminders.

#### CompassEntry (The "Commit" in Version Control)
*   `id`: UUID
*   `userId`: UUID (Foreign Key)
*   `timestamp`: DateTime
*   `dimensions`: JSONB (Store scores for all 8 axes: `{ healthcare: 0.5, education: -0.2, ... }`)
*   `snapshotName`: string (Optional, e.g., "Post-Election 2025")
*   `changeLog`: string (Auto-generated summary of changes from previous entry)

#### Question
*   `id`: UUID
*   `text`: string
*   `dimension`: Enum (HEALTHCARE, EDUCATION, etc.)
*   `weight`: float (Impact on the score)
*   `active`: boolean

#### UserResponse
*   `id`: UUID
*   `userId`: UUID
*   `questionId`: UUID
*   `answerValue`: float (e.g., -1.0 to 1.0)
*   `answeredAt`: DateTime

### Core Modules

1.  **AuthModule**: Handles JWT strategies. Supports anonymous login (device ID based) which can be upgraded to an account later.
2.  **CompassModule**:
    *   `POST /compass/answer`: Submit answers to questions.
    *   `POST /compass/snapshot`: Finalize current answers into a `CompassEntry`.
    *   `GET /compass/history`: Retrieve past `CompassEntry` records for the user.
    *   `GET /compass/diff/:id1/:id2`: Compare two snapshots.
3.  **MatchmakingModule**:
    *   background task (Cron) that calculates vector similarity (Cosine Similarity or Euclidean Distance) between users' latest `CompassEntry`.
    *   `GET /matches/suggest`: Returns list of compatible anonymous users or groups.
4.  **SchedulerModule**:
    *   Checks `User.frequencyPreference`.
    *   Sends Push Notifications (via Firebase/Expo) to prompt the user to answer a new question pack (e.g., "3 quick questions for your Tuesday").

---

## 3. Frontend Architecture (React Native)

### Key Screens

1.  **Onboarding / Intro**:
    *   **Step 1: Language**: User selects preferred language (Defaults to device locale or English).
    *   **Step 2: Region (Optional)**: User selects their Country/Region (e.g., "Iran", "USA", "Global"). Can be skipped. This sets the context for specific political questions if necessary.
    *   **Step 3: Manifesto**: Introduction to the 8 dimensions. Anonymous "Guest" Login.
2.  **The Compass (Home)**:
    *   **3D Visualization**: Use `react-native-gl-model-view` or `Three.js` (via `@react-three/fiber`) to render the 8-axis shape (Polytope).
    *   **Status Bar**: 'Your Compass is 80% complete for this month'.
3.  **Survey / Answering**:
    *   Tinder-style swipe cards or Slider inputs for questions.
    *   Focus on "Paced" answering (3-5 questions at a time).
4.  **Version History (Time Travel)**:
    *   Timeline scrubber component.
    *   Visual "Diff" showing shape morphing from T-1 to T-0.
5.  **Match / Community**:
    *   List of anonymous matches with % compatibility.
    *   Option to "Connect" or "Compare Stats".
6.  **Settings**:
    *   Frequency slider: "How often do you want to reflect?"
    *   Data Export / Delete.
    *   Upgrade to Sponsor (In-App Purchase).

### State Management
*   **Zustand** or **Redux Toolkit** for global state (User Session, Current Compass Data).
*   **TanStack Query** for server state (fetching history, matches).
*   **MMKV** for secure local storage of auth tokens and cached compass data.

---

## 4. Web Dashboard Architecture (Next.js)

The web platform describes the browser-based interface for stats and content management.

### Key Features
1.  **Public Analytics Dashboard**:
    *   **Aggregate Compass**: Visualization of the "average" user shape by region or demographic (anonymized).
    *   **Trend Lines**: How specific axes are shifting over time.
2.  **Questionnaire Builder (Content Creator)**:
    *   **Proposition Editor**: Create new propositions, assign them weights on the 8 axes.
    *   **Review & Publish**: Workflow for approving new question packs.
3.  **Organization Management**:
    *   Tools for Think Tanks/Parties to view their "Team Polytope."

### Tech Stack
*   **Framework**: Next.js (App Router).
*   **UI Library**: Tailwind CSS + Shadcn/ui.
*   **Visualization**: Recharts or D3.js.

---

## 5. Privacy & Sharing Configuration

The user has granular control over their data visibility:

### Sharing Modes
1.  **Ghost Mode (Private):** "Share nothing." The user's compass is private and stored locally or encrypted on the server. No one can search for or simulate matches with this user.
2.  **Public Profile:** "Share my profile openly." The user's compass is visible to everyone in the network/search results.
3.  **Selective Sharing:**
    *   **Manual:** Share via a unique, possibly time-limited link.
    *   **Conditional (Perfect Match):** "Share only to perfect matches." Profile is only revealed to users who meet a strict compatibility threshold (e.g., >95%).
    *   **Group/Org:** Visible only within a specific team or organization context.

---

## 6. Advanced Matchmaking & Team Building

The app provides sophisticated tools for finding individuals based on civic alignment, going beyond simple "similarity."

### A. Matching Thresholds & Filters
Users can set strict filters for discovery ("Don't show me anyone unless..."):
*   **Global Threshold:** "Show me matches only above 90% overall similarity."
*   **Axis-Specific Lock:** "Show me users who have 95-100% on *Economic Freedom* AND *Civil Liberties* (regardless of other axes)."

### B. Match Methodologies

#### 1. The Mirror (Consensus/Perfect Match)
*   **Goal:** Find your "Civic Soulmate" or build a cohesive Political Party/Bloc.
*   **Methodology:** Minimize **Euclidean Distance** ($d = \sqrt{\sum(x_i - y_i)^2}$) across all 8 axes.
*   **Use Case:** Finding validation, forming a tight-knit ideological group.

#### 2. The Challenger (The Opposite)
*   **Goal:** Meaningful debate, finding blind spots, "Red Teaming."
*   **Methodology:** **Inverse Vector Matching**. Target $V_{target} \approx -1 \times V_{user}$.
*   **Use Case:** A Think Tank needing to stress-test ideas against their strongest opposing viewpoint.

#### 3. The Complement (Team Building)
*   **Goal:** Build a functional, balanced team (e.g., Executive Board, Developer Team).
*   **Methodology:** **Balanced Portfolio Approach**.
    *   *Core Alignment:* Must agree on "Mission Critical" axes (e.g., *Governance* style).
    *   *diversity Requirement:* Must have *different* strengths on "Operational" axes (e.g., One high on *Risk*, one high on *Caution*).
*   **Use Case:** "Help me build an organization." The algorithm looks for a **set** of users whose combined average vector is balanced (close to zero or a target mission profile), minimizing groupthink while maintaining cohesion.

### C. Search & Discovery
*   **Public Search Directory:** If enabled, users can search for compasses by "Shape" (e.g., "Find me a 'High Liberty, Low Regulation' profile").
*   **"Team Builder" Wizard:** A tool to simulate adding potential members to a group and visualizing the resulting "Team Polytope."

---

## 7. Development Phases

### Phase 1: MVP (The Tool)
*   [ ] Setup Monorepo.
*   [ ] Backend: User Auth & basic Compass Logic (answering questions -> calculating score).
*   [ ] Mobile: 2D Radar Chart visualization of the axes (easier than 3D for MVP).
*   [ ] Mobile: Answering flow.

### Phase 2: The Tracker (Version Control)
*   [ ] Backend: Implement `CompassEntry` snapshots.
*   [ ] Mobile: Timeline view and "Compare" feature.
*   [ ] Backend: Scheduler for notifications.

### Phase 3: The Network (Social)
*   [ ] Backend: Matchmaking algorithm (Vector Search).
*   [ ] Mobile: Community tab.
*   [ ] Monetization integration (Stripe/IAP).

---

## 5. API Logic for Compass Calculation

The Compass is an 8-dimensional vector $V = [v_1, v_2, ..., v_8]$.
Each dimension matches one of the 8 axes.
Values range from -1.0 (Pole A) to +1.0 (Pole B).

**Update Logic:**
When a user answers a question $Q$ associated with dimension $D_i$ with value $A$ (where $A \in [-1, 1]$):
$$ V_{new}[i] = (V_{old}[i] \times (1 - \alpha)) + (A \times \alpha) $$
*Where $\alpha$ is a learning rate or weight factor (e.g., 0.1), allowing the compass to evolve gradually rather than jumping erraticly.*
