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

- "When [specific situation] happens, the user feels [specific pain]."

### 4. Desired Transformation

Define the before and after.

Before:

- What the user feels or does today.

After:

- What the user can do after the product works.

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

Rules:

- 1 to 3 superpowers only.
- Each superpower must map to a core product flow.
- Each superpower must be testable in the MVP.
- Avoid generic claims like "AI personalized experience."

Template:

```txt
As a [persona], I can [new ability], so that [meaningful outcome].
```

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

## Lesson-And-Run Memory

Every new service should maintain:

- `docs/decision-log.md`
- `docs/lessons-and-rules.md`

Promotion path:

1. Chat insight.
2. Project decision or lesson.
3. Harness rule.
4. Checklist item.
5. Reusable starter update.
