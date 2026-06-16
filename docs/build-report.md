# Build Report

Date: 2026-06-16

## Result

Passed for local web export build.

## Command

```bash
pnpm mobile:build:web
```

## Artifact

- `dist/mobile-web-qa/`

The build artifact is intentionally ignored by Git because it is machine-generated.

## Output Summary

- Bundled entry: `apps/mobile/index.ts`
- Web bundle: `_expo/static/js/web/index-6809172b6a8f9896a7ac112a72b661be.js`
- Bundle size: 815KB
- Generated files: `index.html`, `metadata.json`, `favicon.ico`, and static JS assets.

## Notes

- This build is suitable for local browser QA and product walkthroughs.
- Native iOS or Android tester distribution still requires an external Expo EAS setup, Apple Developer or Google Play account decisions, and release credentials.
- Do not mark external tester distribution as ready until a native fresh-install path has passed on a real device.
