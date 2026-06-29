# Design QA Checklist

## Purpose

Use this checklist for UI, UX, copy, and visual parity work.

## Before Editing

- Identify the screen or component surface.
- Read `docs/harness/ui-ux-component-rules.md`.
- Read `docs/design-system-spec.md`.
- Read `docs/interaction-principles.md`.
- Read `docs/design-tone-and-manner.md` for copy or emotional tone.
- Read `docs/figma-make-parity-map.md` when the screen is listed there.

## During Implementation

- Use existing shared primitives where they fit.
- Do not invent a new card/button pattern without checking the component grammar.
- Keep cards reserved for allowed surfaces.
- Use calendar/date picker for bounded dates.
- Use list rows for settings and links.
- Keep primary actions singular and obvious.
- Keep secondary actions quieter.

## Before Completion

- Run typecheck and relevant tests.
- Run lint when code changed.
- Capture screenshot or manual QA notes for visual changes when practical.
- Confirm Korean labels fit in their containers.
- Confirm the screen still feels like a calm planner.
- Note any skipped visual QA and why.
