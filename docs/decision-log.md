# Decision Log

## Purpose
Capture product, design, engineering, and process decisions so the project does not rely on chat memory.

Every meaningful decision should be recorded here when it changes how the MVP is built.

## Decision Format
```txt
## YYYY-MM-DD - Short Decision Title
Status: proposed | accepted | replaced
Area: product | design | frontend | ai | data | qa | process

Decision:
- What we decided.

Reason:
- Why this decision is useful now.

Tradeoff:
- What this makes easier.
- What this makes harder.

Review Trigger:
- When to revisit this decision.
```

## 2026-06-15 - Start With Repo Docs Before Global Skills
Status: accepted
Area: process

Decision:
- Use project docs as the first operating harness.
- Promote rules into global Codex skills only after the first vertical slice proves which rules are durable.

Reason:
- Early project rules may change quickly.
- Repo docs are easier to revise while product and engineering patterns are still being discovered.

Tradeoff:
- Easier to adapt during MVP discovery.
- Requires explicit promotion later so useful rules become reusable across projects.

Review Trigger:
- After the first working vertical slice: onboarding -> mock plan -> plan approval -> today adjustment -> revision approval.

## 2026-06-15 - Manual Adjustment Defines Recovery
Status: accepted
Area: product

Decision:
- The app does not need to automatically detect failure in MVP.
- A recovery event begins when the user chooses to adjust the plan.

Reason:
- This matches the product goal: make correction easy and non-judgmental.
- It avoids overbuilding automatic detection too early.

Tradeoff:
- Simpler MVP and clearer user control.
- Less automation in the first version.

Review Trigger:
- After observing whether testers can find and use "Adjust today" naturally.

