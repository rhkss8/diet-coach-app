# Design Production Pipeline

## Purpose

Use this pipeline when creating or changing user-visible screens, flows, copy, visual hierarchy, or interaction patterns.

The source of truth is environment-independent. Codex skills may route to this file, but the rules must also be usable by humans and non-Codex tools.

## Pipeline

1. Identify the surface.
   - New screen, existing screen correction, copy change, component primitive, flow state, or visual QA.
2. Read the minimum source set.
   - Product intent: `docs/mvp-execution-harness.md`
   - Tone and visual territory: `docs/design-tone-and-manner.md`
   - Screen reference and surface rules: `docs/design-reference-brief.md`
   - Component and interaction rules: `docs/harness/ui-ux-component-rules.md`, `docs/design-system-spec.md`, `docs/interaction-principles.md`
   - Existing Figma Make parity when the screen is listed: `docs/figma-make-parity-map.md`
3. Map the user job.
   - What is the user trying to decide, enter, review, approve, or resume?
4. Choose UI grammar before styling.
   - Follow `docs/harness/ui-ux-component-rules.md` before choosing cards, buttons, rows, fields, date pickers, or chat surfaces.
5. Implement the smallest vertical slice.
   - Preserve existing flow behavior outside the changed surface.
6. Verify.
   - Run automated checks.
   - For visual or interaction changes, capture a screenshot or write manual QA notes when practical.

## Stop Conditions

Stop and ask before implementation when:

- The source design, docs, and current code disagree.
- A user-visible component choice is not covered by `docs/design-system-spec.md`.
- The change alters the core product loop or first-run path.
- The screen is outside Figma Make parity and no product owner decision exists.
