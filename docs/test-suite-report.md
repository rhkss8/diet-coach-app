# Test Suite Report

Date: 2026-06-17

Command: `pnpm test`

Result: Passed.

## Summary

- Test files: 36 passed.
- Tests: 119 passed.
- Duration: 1.98s.

## Coverage Areas

- Core domain models: plans, adjustments, check-ins, analytics events.
- AI contracts: prompts, fixtures, schema validation, invalid output fallback, regression cases, telemetry guardrails.
- DB: schema and persistence mapping.
- Mobile onboarding legacy units: basic profile, goal setup, lifestyle setup.
- Mobile consultation: chat action application and mock chat planner responses.
- Mobile plan flow: plan approval, approved plan persistence, revision application.
- Today screen logic: item grouping, progress, status events, post-revision completion.
- Adjustment flow: reason options, review summary, revision snapshot persistence.
- Auth and settings: auth gate state, release links, feedback channel.
- Notifications and analytics coverage.
