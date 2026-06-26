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

## 2026-06-15 - Use pnpm For JavaScript Tooling

Status: accepted
Area: frontend

Decision:

- Use pnpm as the package manager for the monorepo.
- Root workspace scripts should call package scripts through pnpm filters.

Reason:

- The user explicitly prefers pnpm.
- A pnpm workspace keeps mobile, core, AI, and DB packages under one lockfile.

Tradeoff:

- Requires Node/corepack/pnpm setup on every workstation.
- Avoids npm/yarn lockfile drift.

Review Trigger:

- If the project moves to a platform or hosting setup that imposes a different package manager.

## 2026-06-15 - Use Node 20.19.4 Or Newer For Expo 56

Status: accepted
Area: frontend

Decision:

- Use Node 20.19.4 or newer for local Expo development.

Reason:

- Expo 56 rejected Node 20.11.0 during dev server startup.

Tradeoff:

- Every workstation must install a compatible Node version.
- Expo dev server starts reliably once the version requirement is met.

Review Trigger:

- When Expo SDK is upgraded.

## 2026-06-16 - Food Log Is Supporting Input, Not Product Center

Status: accepted
Area: product

Decision:

- Keep the MVP centered on plan generation, today execution, and manual adjustment.
- Treat food text/photo input as context for adjustment, not as the main product value.

Reason:

- The product is differentiated by recovery and continuity, not food recognition accuracy.
- If food recognition is weak, text input and manual correction can still preserve the core loop.

Tradeoff:

- Reduces the initial wow factor of photo recognition.
- Keeps MVP validation focused on PlanRevision and return behavior.

Review Trigger:

- After testers use the first adjustment flow and report whether food input is necessary.

## 2026-06-16 - Default Tone Is Calm Recovery, Not Hard Coaching

Status: accepted
Area: design

Decision:

- Use calm, non-judgmental recovery copy as the MVP default.
- Hard coaching copy is not allowed unless the user explicitly opts in later.

Reason:

- The product handles moments where users may already feel they failed.
- A harsh default tone can make the app feel punitive and damage retention.

Tradeoff:

- Less viral or provocative copy.
- Stronger trust and lower review risk for the first MVP.

Review Trigger:

- After testing whether users find the tone too soft, too generic, or sufficiently supportive.

## 2026-06-18 - Use Recovery Planner As The MVP Visual Direction

Status: accepted
Area: design

Decision:

- Use Recovery Planner as the primary visual direction.
- The app should feel like a calm daily planner where AI suggestions become reviewable plan cards.
- Avoid building toward a generic chatbot, calorie tracker, hospital dashboard, or neon fitness app.

Reason:

- The product promise is continuation after a broken plan.
- The selected direction balances warmth, structure, and MVP implementation speed.
- It makes the AI suggestion card feel like the signature interaction while keeping Today calm and usable.

Tradeoff:

- Easier to make the app feel trustworthy and repeatable.
- Harder to make the product feel visually loud or instantly flashy.

Review Trigger:

- After first tester feedback on whether the UI feels too plain, too system-heavy, or correctly planner-like.

## 2026-06-19 - Decide Onboarding Route For Figma Make Parity

Status: accepted
Area: product

Decision:

- Keep the current chat-first guest entry for the tester MVP.
- Do not restore a routable onboarding screen only for Figma Make parity before tester recruitment.
- Treat the non-routable onboarding screen as an intentional difference from the Figma Make source while the chat-first pivot is being tested.

Reason:

- Phase 8 made AI consultation the primary first-run path.
- Tester recruitment should validate the chat-first loop rather than reintroduce structured onboarding friction.
- Restoring onboarding now would change the product entry flow, not just visual parity.

Tradeoff:

- Easier first-run entry and cleaner validation of the chat-first MVP.
- Figma Make onboarding remains uncaptured in the routable RN app and must be documented as an intentional parity exception.

Review Trigger:

- After the first tester cohort reports whether chat-first entry lacks enough profile context.

## 2026-06-23 - Require Guided Planning Context Before Tester Recruitment

Status: accepted
Area: product

Decision:

- Before recruiting testers, add guided planning context so first-run recommendations are based on the user's management intent, food preferences and constraints, and daily routine.
- The first management-intent question should use choice chips plus optional free text.
- Food and routine questions may stay more free-form, but should include helper prompts or chips when they reduce blank-page anxiety.
- Keep counselor, nutrition, and PT as internal reasoning lenses for now instead of exposing separate visible agents.

Reason:

- The app's value is not generic AI chat; it is user-context-based meal, exercise, and recovery planning.
- Without captured context, nutrition details can still feel like polished dummy data.
- Guided choices help users answer faster while free text preserves nuance.

Tradeoff:

- Stronger first-run recommendation quality and clearer product differentiation.
- Longer first-run setup and more contract work before tester recruitment.

Review Trigger:

- After guided planning context becomes the first-run path and Figma Make parity is rechecked.

## 2026-06-26 - Keep Chat-First Entry As The Figma Parity Exception

Status: accepted
Area: product

Decision:

- Keep chat-first guest entry for tester recruitment.
- Do not restore the Figma Make single-screen onboarding route only to satisfy visual parity.
- Treat Figma Make onboarding as superseded by the current product flow: plan-basis settings gate plus first-plan preparation card inside consultation.

Reason:

- The current product thesis is that consultation is the primary surface, not a preliminary form wizard.
- Guided planning context now collects management intent, food preferences, exclusions, preferred methods, and routine before the first AI-generated plan.
- Restoring single-screen onboarding would make the app more visually aligned with the old prototype but would weaken the chat-first learning goal for testers.

Tradeoff:

- Phase 9 parity can be marked complete with a documented onboarding exception.
- The tester MVP has a clearer consultation-centered entry, but Figma Make's onboarding state will remain uncaptured unless tester feedback says the chat-first entry lacks enough profile context.

Review Trigger:

- After the first tester cohort reports whether the initial consultation flow collects enough user context without feeling confusing or too long.
