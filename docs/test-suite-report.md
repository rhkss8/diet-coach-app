# Test Suite Report

Date: 2026-06-16

Command: `pnpm test`

Result: Passed.

## Summary

- Test files: 34 passed.
- Tests: 106 passed.
- Duration: 1.48s.

## Coverage Areas

- Core domain models: plans, adjustments, check-ins, analytics events.
- AI contracts: prompts, fixtures, schema validation, invalid output fallback, regression cases, telemetry guardrails.
- DB: schema and persistence mapping.
- Mobile onboarding: basic profile, goal setup, lifestyle setup.
- Mobile plan flow: plan approval, approved plan persistence, revision application.
- Today screen logic: item grouping, progress, status events, post-revision completion.
- Adjustment flow: reason options, review summary, revision snapshot persistence.
- Auth and settings: auth gate state, release links, feedback channel.
- Notifications and analytics coverage.
