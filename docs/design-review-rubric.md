# Design Review Rubric

## Purpose

Use this rubric before approving user-visible UI changes.

## Review Questions

### Product Fit

- Does the change support plan continuity rather than tracking guilt?
- Does it preserve chat as an input layer and plan objects as the product layer?
- Does it avoid non-MVP expansion?

### Component Grammar

- Does each data type use the correct component grammar from `docs/design-system-spec.md`?
- Are cards reserved for suggestions, plan items, status, or review states?
- Are buttons used for actions rather than passive data display?

### Flow Clarity

- Can the user tell what state they are in?
- Is the primary action clear?
- Are secondary actions visually quieter?
- Does navigation match the screen's importance?

### Tone

- Is the copy calm, practical, and non-judgmental?
- Does it avoid failure, shame, medical warning, and calorie-audit language?

### Implementation

- Does the implementation reuse existing primitives?
- Does text fit on mobile?
- Are disabled, loading, error, and empty states handled when relevant?

## Required Outcome

If any answer is "no" for a user-visible change, either fix the issue or document the decision gate before continuing.
