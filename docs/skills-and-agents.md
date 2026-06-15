# Skills and Agents

## Purpose
This project needs persistent operating rules so Codex can keep building without losing product, design, and engineering intent.

Use project docs first. Promote them into Codex skills after the rules stabilize through implementation.

For future new services, start from `docs/new-service-starter-protocol.md`. It defines the reusable G-Stack and Superpowers kickoff flow.

## Recommended Skills
### 1. diet-mvp-product
Trigger when making product scope, MVP priority, user flow, or roadmap decisions.

Responsibilities:
- Keep the MVP focused on manual adjustment and plan continuity.
- Reject non-MVP features.
- Maintain the core loop.
- Define acceptance criteria.
- Keep success metrics visible.

Primary references:
- `docs/mvp-execution-harness.md`
- `docs/mvp-todo.md`

### 2. diet-design-system
Trigger when designing screens, copy, onboarding, notification prompts, or app tone.

Responsibilities:
- Maintain calm, non-judgmental UX.
- Make "Adjust today" the signature interaction.
- Keep the app feeling like a planner, not a tracker or medical tool.
- Avoid shame, pressure, or noisy gamification.

Primary reference:
- `docs/design-tone-and-manner.md`

### 3. diet-frontend-senior
Trigger when writing or reviewing frontend code.

Responsibilities:
- Enforce SRP, SoC, DRY, abstraction, encapsulation, domain modeling, derived-state discipline, predictable data flow, and composition.
- Keep business logic out of JSX.
- Keep future product changes cheap.

Primary reference:
- `docs/frontend-engineering-standards.md`

### 4. diet-ai-planner
Trigger when implementing or changing AI plan generation, plan adjustment, prompt contracts, or fixtures.

Responsibilities:
- Keep AI output structured.
- Require reviewable JSON responses.
- Prevent generic chatbot behavior.
- Maintain fixture-based regression tests.

Primary future references:
- `docs/ai-contracts.md`
- `tests/fixtures/`

### 5. diet-qa-analytics
Trigger when defining tests, release gates, event tracking, or MVP experiment reports.

Responsibilities:
- Verify the full core loop.
- Track onboarding, plan approval, adjustment, revision approval, and return behavior.
- Keep test cases aligned to 50-user MVP validation.

Primary future references:
- `docs/analytics-events.md`
- `docs/qa-checklist.md`

## Agent Operating Model
Use one lead agent and focused subagents only when the work can be split safely.

### Lead Agent
Owns product coherence, final integration, and stopping criteria.

### Product Agent
Use for:
- MVP scope review.
- Flow conflicts.
- Prioritization decisions.

Must read:
- `docs/mvp-execution-harness.md`
- `docs/mvp-todo.md`

### Design Agent
Use for:
- Screen concepts.
- Copy tone.
- UX critique.

Must read:
- `docs/design-tone-and-manner.md`

### Frontend Agent
Use for:
- Expo app implementation.
- Component architecture.
- Refactors.

Must read:
- `docs/frontend-engineering-standards.md`

### AI Agent
Use for:
- Prompt contracts.
- JSON schemas.
- AI regression fixtures.

Must read:
- `docs/mvp-execution-harness.md`
- `docs/ai-contracts.md`

### QA Agent
Use for:
- Testing core flows.
- Finding regressions.
- Checking analytics coverage.

Must read:
- `docs/mvp-execution-harness.md`
- `docs/analytics-events.md`
- `docs/qa-checklist.md`

## Promotion Plan
Do not create many global skills on day one.

Start with project docs. After the first vertical slice works, promote the stable rules into:
- `diet-mvp-product`
- `diet-frontend-senior`
- `diet-ai-planner`

This avoids freezing bad rules too early.
