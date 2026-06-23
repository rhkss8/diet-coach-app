# Build Report

Date: 2026-06-22

## Result

Passed for local web export build after chat input and nutrition-detail updates.

## Command

```bash
pnpm mobile:build:web
```

## Artifact

- `dist/mobile-web-qa/`

The build artifact is intentionally ignored by Git because it is machine-generated.

## Output Summary

- Bundled entry: `apps/mobile/index.ts`
- Web bundle: `_expo/static/js/web/index-3513fa1a9d0b81d011fa67f94da610a8.js`
- Bundle size: 2.7MB
- Generated files: `index.html`, `metadata.json`, `favicon.ico`, and static JS assets.

## Notes

- This build is suitable for local browser QA and product walkthroughs.
- This build includes the chat-first consultation pivot, attachment input updates, nutrition-detail plan cards, chat proposal nutrition details, and slot-safe approval of chat meal suggestions.
- Fresh post-fix Playwright screenshot capture was not completed in this environment because the CLI wrapper depends on `@playwright/cli`, which is not available in the local npm cache and cannot be fetched reliably in the restricted environment.
- Native iOS or Android tester distribution still requires an external Expo EAS setup, Apple Developer or Google Play account decisions, and release credentials.
- Do not mark external tester distribution as ready until a native fresh-install path has passed on a real device.
