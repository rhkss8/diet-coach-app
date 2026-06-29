# Design System Spec

## Purpose

This file defines the component grammar that TARS must use before visual styling. It prevents every data shape from becoming a generic card or button.

Use with:

- `docs/harness/ui-ux-component-rules.md`
- `docs/design-tone-and-manner.md`
- `docs/design-reference-brief.md`
- `docs/interaction-principles.md`
- `apps/mobile/src/shared/ui/`

For detailed component selection, `docs/harness/ui-ux-component-rules.md` is the source of truth. This file summarizes the design-system level grammar and known primitives.

## Component Grammar

| User/Data Job                           | Default UI                                         | Avoid                                          |
| --------------------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| Navigate between primary app areas      | Bottom tab or route affordance                     | Header buttons for primary navigation          |
| Open secondary screen                   | Text/icon row or quiet button                      | Oversized CTA                                  |
| Submit/approve/generate                 | Primary button                                     | Link-like text                                 |
| Dismiss/cancel/secondary navigation     | Ghost or secondary button                          | Primary button                                 |
| Choose one from few options             | Segmented choice/radio-style chips                 | Free text, generic cards                       |
| Choose multiple tags                    | Multi-select chips                                 | Dropdown-only UX                               |
| Enter short structured text/number      | Form field with label, suffix, validation          | Chat-only input                                |
| Enter date                              | Date picker/calendar                               | Plain text field when a bounded date is needed |
| Show settings or links                  | List rows grouped by section                       | Repeated cards                                 |
| Show chat transcript                    | Chat bubbles                                       | Cards for every message                        |
| Show AI suggestion that may mutate plan | Proposal/review card with approve/dismiss          | Mutating state directly from chat              |
| Show plan item                          | Plan item card or row with completion control      | Generic text block                             |
| Show status summary                     | Compact status tile/card                           | Large decorative card                          |
| Show warning/error                      | Inline message near source, then summary if needed | Modal/card by default                          |

## Card Rules

Cards are allowed for:

- AI suggestions and approval states.
- Plan items.
- Status summaries.
- Review/comparison states.
- Repeated content objects where each item needs boundaries.

Cards are not allowed as the default wrapper for:

- Settings lists.
- Plain section groups.
- Every form group.
- Chat messages.
- Date selection controls.

Do not nest cards unless there is a clear repeated object inside a modal or framed tool.

## Existing Primitives

Prefer existing primitives before creating new UI:

- `PrimaryButton`: primary, secondary, ghost actions.
- `SegmentedChoice`: bounded single selection.
- `FormTextField`: text and numeric fields.
- `CalendarDatePicker`: bounded date selection.
- `planner-components.tsx`: app headers, chat bubbles, chat input, proposal cards, reason tiles, plan items.

If no primitive fits, first update this spec or ask for a product/design decision before inventing a new pattern.

## Verification

Before finishing UI work, check:

- Does the surface match the user's job?
- Is a card being used only where cards are allowed?
- Are buttons reserved for actions, not data display?
- Are date and selection inputs using the correct grammar?
- Does the screen still feel like a planner, not a tracker, dashboard, or generic chatbot?
