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
- Web bundle: `_expo/static/js/web/index-a7b2d4276cdb2474b48056be0919a747.js`
- Bundle size: 2.7MB
- Generated files: `index.html`, `metadata.json`, `favicon.ico`, and static JS assets.

## Notes

- This build is suitable for local browser QA and product walkthroughs.
- This build includes the chat-first consultation pivot, attachment input updates, and nutrition-detail plan cards.
- Fresh Playwright screenshot capture was not completed in this environment because the CLI wrapper attempted a network fetch for `@playwright/cli`.
- Native iOS or Android tester distribution still requires an external Expo EAS setup, Apple Developer or Google Play account decisions, and release credentials.
- Do not mark external tester distribution as ready until a native fresh-install path has passed on a real device.
