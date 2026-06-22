# Decision Gates

## Purpose

The agent should continue working by default, but must ask the user at important product, cost, account, or irreversible decision points.

## Ask The User Before

### Ambiguity Or Mismatch

- The implementation detail is not clearly defined in the docs, source design, or user request.
- The current source of truth differs from the agent's memory, assumption, or previous implementation.
- A visual, copy, icon, route, or product-flow choice requires interpretation rather than direct mapping.
- The agent notices "this does not match what I expected" while reading code, docs, screenshots, or Figma Make.
- Continuing would require guessing what the user intended.

### Product Direction

- Adding a feature outside MVP scope.
- Changing the primary user persona.
- Changing the core loop.
- Changing a superpower.
- Reframing the service positioning.

### Design Direction

- Changing the main tone from calm planner to gamified, medical, social, or fitness-challenge style.
- Adding shame, urgency, or heavy streak pressure.
- Making AI chat the primary interface instead of plan adjustment.

### Technical Direction

- Switching the main stack away from Expo, TypeScript, Supabase, or structured AI contracts.
- Adding a major paid third-party service.
- Introducing a complex state management library before the core loop works.
- Replacing mock-first development with full backend-first development.
- Adding a multi-agent worker system, external orchestrator, or new CLI runtime dependency.
- Running code generation or scripts that modify broad parts of the repo.

### Cost and Accounts

- Creating paid cloud resources.
- Requiring API keys.
- Installing paid services.
- Running external deployment.
- Sending tester invites or creating external tester distribution through TestFlight, Google Play, Expo EAS, or public community channels.
- Calling external services that may consume quota or money.

### Data and Privacy

- Collecting sensitive health data beyond MVP need.
- Logging user-entered food notes or photos to analytics.
- Changing retention or storage assumptions.

### Destructive Or Broad Actions

- Deleting files or directories not created in the current task.
- Resetting, rebasing, force-pushing, or rewriting git history.
- Changing generated starter files across many projects.
- Applying automated fixes across unrelated modules.

## Do Not Ask Before

- Implementing the next todo in `docs/mvp-todo.md`.
- Refactoring code to comply with `docs/frontend-engineering-standards.md`.
- Adding tests for existing behavior.
- Updating docs to record a decision already made in conversation.
- Fixing obvious bugs.

Exception: if any item above conflicts with "Ambiguity Or Mismatch", ask the user before proceeding.

## Branch Format

When asking the user, present:

- The decision.
- Recommended option.
- Tradeoff.
- What happens next.
