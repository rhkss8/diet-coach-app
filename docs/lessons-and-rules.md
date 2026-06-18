# Lessons and Rules

## Purpose

This file turns discussion, implementation friction, and repeated review feedback into durable project rules.

Use it for lesson-and-run operation:

1. Learn something.
2. Record it.
3. Apply it in the next work cycle.
4. Promote it into a checklist, runbook, or skill when it repeats.

## Categories

### Lesson

Something we learned from building, testing, or discussing the product.

### Rule

A decision that should guide future implementation.

### Anti-Pattern

A mistake or drift pattern to actively avoid.

### Skill Candidate

A rule that may deserve promotion into a reusable global Codex skill.

## Entry Format

```txt
## YYYY-MM-DD - Title
Type: lesson | rule | anti-pattern | skill-candidate
Area: product | design | frontend | ai | data | qa | process
Source: discussion | implementation | QA | user feedback | metrics

Observation:
- What happened or what we noticed.

Rule:
- What we should do next time.

Applies To:
- Where this should be used.

Promotion:
- none | update-doc | add-checklist | skill-candidate | global-skill
```

## 2026-06-15 - Good Discussion Must Become Project Memory

Type: rule
Area: process
Source: discussion

Observation:

- Important product and engineering decisions emerged through back-and-forth discussion.
- If they remain only in chat, future scheduled work may lose them.

Rule:

- Convert meaningful discussion outcomes into `decision-log.md`, `lessons-and-rules.md`, or the relevant harness doc before continuing implementation.

Applies To:

- All scheduled work cycles.
- All MVP scope, design, frontend, AI, analytics, and QA decisions.

Promotion:

- update-doc

## 2026-06-15 - Promote Skills After Patterns Survive Implementation

Type: rule
Area: process
Source: discussion

Observation:

- Creating many global skills before implementation may freeze immature rules.

Rule:

- Keep rules in repo docs first.
- Promote a rule into a global skill only after it is used in at least one real vertical slice or repeated across projects.

Applies To:

- `new-service-starter`
- `diet-frontend-senior`
- `diet-ai-planner`
- future reusable project skills

Promotion:

- skill-candidate

## 2026-06-15 - Superpowers Should Drive MVP Scope

Type: rule
Area: product
Source: discussion

Observation:

- The product is strongest when framed around user superpowers, not feature inventory.

Rule:

- For every MVP feature, ask which superpower it supports.
- If a feature does not support a superpower, defer it.

Applies To:

- MVP planning.
- Feature prioritization.
- QA acceptance criteria.

Promotion:

- add-checklist

## 2026-06-15 - Avoid Accidental Expo Router Detection

Type: lesson
Area: frontend
Source: implementation

Observation:

- Expo detected an empty `src/app` directory as an Expo Router root even though routing was not intentionally installed.

Rule:

- Do not create `src/app` unless Expo Router is intentionally adopted.
- Use `src/root` for the app shell until the routing decision is explicit.

Applies To:

- Expo React Native apps.
- Phase 0 route/app-shell setup.

Promotion:

- update-doc

## 2026-06-15 - Verify Node Version Before Expo Development

Type: rule
Area: frontend
Source: implementation

Observation:

- Expo 56 requires Node 20.19.4 or newer and failed under Node 20.11.0.

Rule:

- On every workstation, run `node -v` before starting Expo.
- Use `nvm install 20.19.4` or newer if Expo rejects the current version.

Applies To:

- Local development.
- Work/home PC handoff.

Promotion:

- add-checklist

## 2026-06-16 - First Screen Must Signal Plan Continuity

Type: rule
Area: design
Source: planning review

Observation:

- If the first post-onboarding screen feels like a food diary, the product becomes another tracking app.

Rule:

- Make Today Plan the first post-onboarding screen.
- Lead with continuation and adjustment, not logging or calorie audit.

Applies To:

- Today screen.
- Plan approval flow.
- Adjustment entry point.

Promotion:

- add-checklist

## 2026-06-18 - Do Not Infer Figma Make Visual Details

Type: rule
Area: design
Source: user feedback

Observation:

- Figma Make already defines icons, headers, cards, and state-specific layouts.
- Replacing a Figma Make icon with a hand-drawn approximation caused visible brand drift.
- Adding or removing headers by interpretation made screens diverge from the published reference.

Rule:

- Treat `figma_make/src/app/App.tsx` as the source of truth for publishing parity.
- Do not infer icon shape, header presence, card layout, or button color when the Figma Make file defines it.
- Build a screen-by-screen parity map before implementation, then fix one screen group at a time.

Applies To:

- Figma Make publishing work.
- Design QA.
- Shared UI primitive changes.

Promotion:

- update-doc
