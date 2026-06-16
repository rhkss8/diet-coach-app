# New Service Starter Protocol

## Purpose

For every new service, start from the same operating structure.

The only required custom inputs are:

- Service definition.
- Target persona.
- Core user pain.
- Desired user transformation.

Everything else should be generated from the shared starter protocol.

## Required Inputs

### 1. Service Definition

Answer in one sentence:

This service helps `[persona]` achieve `[outcome]` by `[core mechanism]`.

Example:
This service helps people whose diet plans often break continue their plan by making manual adjustment fast and non-judgmental.

### 2. Persona

Define:

- Who they are.
- What situation they are in.
- What they already tried.
- Why existing solutions failed.
- What moment makes them search for a new product.

### 3. Core Pain

Use plain language.

Bad:

- "Need better AI personalization."

Good:

- "When today's plan breaks, the user feels the whole diet has failed."

### 4. Desired Transformation

Define the before and after.

Before:

- User feels stuck, judged, or forced to restart.

After:

- User feels they can continue from today.

## G-Stack

G-Stack is the default project operating stack for new services.

### G1. Goal Stack

Defines what the product must prove.

Required outputs:

- One-line MVP goal.
- Core loop.
- Primary success metric.
- Secondary metrics.
- Non-goals.

### G2. Growth Stack

Defines how the first users are acquired and learned from.

Required outputs:

- First 10 users.
- First 50 users.
- Acquisition channel.
- Feedback channel.
- Retention hypothesis.

### G3. Governance Stack

Defines rules that keep development from drifting.

Required outputs:

- Scope guardrails.
- Decision log.
- Definition of done.
- Stop conditions.
- Release gates.

### G4. Ground Truth Stack

Defines what data tells the team whether the product works.

Required outputs:

- Analytics events.
- User state model.
- Experiment dashboard questions.
- QA checklist.
- Manual observation plan.

### G5. Generation Stack

Defines how AI participates in the product.

Required outputs:

- AI functions.
- JSON contracts.
- Prompt fixtures.
- Regression checks.
- Fallback behavior.

## Superpowers

Superpowers are the few abilities the service gives the user that existing products do not.

They should be written from the user's point of view.

Rules:

- 1 to 3 superpowers only.
- Each superpower must map to a core product flow.
- Each superpower must be testable in the MVP.
- Avoid generic claims like "AI personalized experience."

Template:

```txt
As a [persona], I can [new ability], so that [meaningful outcome].
```

Diet Planner MVP superpowers:

1. As a user, I can adjust today's plan in seconds when real life changes, so that I do not have to restart my diet.
2. As a user, I can approve changes before they affect my plan, so that I stay in control.
3. As a user, I can see that adjusted days still count as continuation, so that I do not feel like I failed.

## Default Harness Output

Every new service should start with these files:

```txt
docs/
  service-definition.md
  g-stack.md
  superpowers.md
  mvp-execution-harness.md
  design-tone-and-manner.md
  frontend-engineering-standards.md
  ai-contracts.md
  analytics-events.md
  qa-checklist.md
  skills-and-agents.md
  agent-runbook.md
  mvp-todo.md
  decision-log.md
  lessons-and-rules.md
  decision-gates.md
  new-service-copy-pack.md
```

## Default Skill Set

Promote these to reusable Codex skills after the starter protocol is stable:

- `new-service-product-stack`
- `new-service-design-tone`
- `new-service-frontend-senior`
- `new-service-ai-contracts`
- `new-service-qa-analytics`

For a specific service, create thin project docs that specialize the shared skills.

## Default Agent Set

Use these roles for every new service:

- Lead Agent: owns coherence and integration.
- Product Agent: owns scope and MVP loop.
- Design Agent: owns tone, UX, and visual concept.
- Frontend Agent: owns maintainable implementation.
- AI Agent: owns structured AI behavior.
- QA Agent: owns checks, events, and release gates.

## New Project Kickoff Flow

1. Define service in one sentence.
2. Define primary persona.
3. Define the user's before/after transformation.
4. Write 1 to 3 superpowers.
5. Generate G-Stack.
6. Generate MVP todo.
7. Generate design tone.
8. Generate frontend standards.
9. Generate AI contracts if AI is part of the product.
10. Generate analytics and QA gates.
11. Start Phase 0 foundation.

For the copy/paste starter pack, use `docs/new-service-copy-pack.md`.

## Lesson-And-Run Memory

Every new service should maintain:

- `docs/decision-log.md`
- `docs/lessons-and-rules.md`

These files are the bridge between live discussion and durable reusable skills.

Promotion path:

1. Chat insight.
2. Project decision or lesson.
3. Harness rule.
4. Checklist item.
5. Skill candidate.
6. Global skill.

## Diet Planner Mapping

### Service Definition

Diet Planner helps people whose diet plans break in real life continue without restarting by making manual plan adjustment fast, calm, and reviewable.

### Persona

A user who wants to lose weight but cannot follow rigid diet plans because meals, work, energy, and schedule change often.

### Core Pain

Existing apps turn a changed day into failure. The user wants to continue, not confess failure.

### MVP Goal

Prove that users return after manually adjusting a broken plan.

### Primary Metric

Return within 24 hours after approved plan revision.
