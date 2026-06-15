# Skills and Agents

## Purpose
This project needs persistent operating rules so Codex can keep building without losing product, design, and engineering intent.

Use project docs as local skills. Do not require global Codex skill installation.

## Recommended Local Skill Areas
### 1. Product
Trigger when making product scope, MVP priority, user flow, or roadmap decisions.

Responsibilities:
- Keep the MVP focused on the core loop.
- Reject non-MVP features.
- Maintain superpowers.
- Define acceptance criteria.
- Keep success metrics visible.

Primary references:
- `docs/mvp-execution-harness.md`
- `docs/g-stack.md`
- `docs/superpowers.md`
- `docs/mvp-todo.md`

### 2. Design
Trigger when designing screens, copy, onboarding, notification prompts, or app tone.

Responsibilities:
- Maintain the product tone.
- Make the primary interaction easy to find.
- Avoid patterns that conflict with the service concept.

Primary reference:
- `docs/design-tone-and-manner.md`

### 3. Frontend
Trigger when writing or reviewing frontend code.

Responsibilities:
- Enforce SRP, SoC, DRY, abstraction, encapsulation, domain modeling, derived-state discipline, predictable data flow, and composition.
- Keep business logic out of JSX.
- Keep future product changes cheap.

Primary reference:
- `docs/frontend-engineering-standards.md`

### 4. AI
Trigger when implementing or changing AI behavior, prompt contracts, or fixtures.

Responsibilities:
- Keep AI output structured.
- Require reviewable JSON responses.
- Prevent generic chatbot behavior unless chat is the product.
- Maintain fixture-based regression tests.

Primary references:
- `docs/ai-contracts.md`
- `tests/fixtures/`

### 5. QA and Analytics
Trigger when defining tests, release gates, event tracking, or MVP reports.

Responsibilities:
- Verify the full core loop.
- Track activation, core action, approval, and return behavior.
- Keep tests aligned to MVP validation.

Primary references:
- `docs/analytics-events.md`
- `docs/qa-checklist.md`

## Agent Operating Model
Use one lead agent and focused subagents only when the work can be split safely.

### Lead Agent
Owns product coherence, final integration, and stopping criteria.

### Product Agent
Use for MVP scope review, flow conflicts, and prioritization decisions.

### Design Agent
Use for screen concepts, copy tone, and UX critique.

### Frontend Agent
Use for app implementation, component architecture, and refactors.

### AI Agent
Use for prompt contracts, JSON schemas, and AI regression fixtures.

### QA Agent
Use for testing core flows, finding regressions, and checking analytics coverage.

