# Service Design Blueprint

## Purpose

This blueprint keeps product flow, UI states, data, AI behavior, and QA connected while building the MVP.

## Core Service Flow

1. User enters through consultation or onboarding gate.
2. User provides plan basis and planning context.
3. AI generates a draft plan.
4. User reviews and approves.
5. User sees today's plan.
6. User requests adjustment when reality changes.
7. AI proposes a revision.
8. User reviews and approves.
9. Plan history and analytics record the loop.

## Surface Responsibilities

- Consultation: gather context and create reviewable suggestions.
- Settings: store stable plan basis and account/release settings.
- Plan approval: explain generated plan before durable approval.
- Today: help the user continue the current plan.
- Adjustment: collect why reality changed.
- Revision review: compare and approve changes.

## Backstage Responsibilities

- Persist plan basis, approved plans, revisions, and chat messages when available.
- Keep AI outputs structured and schema-validated.
- Emit analytics for the core loop.
- Avoid changing approved plans without explicit user approval.

## Failure Handling

When AI, persistence, or auth is unavailable:

- Keep the user oriented.
- Preserve local state where practical.
- Explain the next action without blame or technical noise.
