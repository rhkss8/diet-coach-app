# Interaction Principles

## Purpose

Use this file to choose interaction behavior before choosing visual style.

## Principles

### Make State Changes Reviewable

Any AI-generated meal, exercise, or plan revision must be reviewed and approved before it changes durable plan state.

### Match Control To Input Shape

- Few fixed choices: segmented control or chips.
- Multiple tags: multi-select chips.
- Free response: text area or chat input.
- Date: calendar/date picker.
- Confirmation: primary action plus dismiss/secondary action when reversible.

### Keep Navigation Predictable

Primary app areas should use primary navigation, such as tabs. Do not hide major destinations in a one-off header action.

### Keep Chat As Input

Chat can gather context and request suggestions. It should not become the only visible model of the product.

### Avoid Decorative Friction

Do not wrap content in cards or buttons solely to make it look designed. Use spacing, section headers, and list rows first.

## Decision Gate

If the interaction pattern is not covered here or in `docs/design-system-spec.md`, pause before implementing user-visible UI.
