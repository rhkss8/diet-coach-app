# Design Philosophy

## Product Shape

Diet Planner is a recovery planner. It helps users continue after real life breaks a rigid diet plan.

The interface should make the user feel:

- Calm.
- Oriented.
- Able to continue.
- In control of plan changes.

It should not make the user feel:

- Judged.
- Audited.
- Trapped in an infinite chatbot.
- Forced through decorative cards or generic dashboards.

## Product Layer Rule

Chat is an input layer. Approved plan objects are the product layer.

This means:

- A chat message can collect context or request help.
- A suggestion that changes meals, exercise, or revisions must become a reviewable object.
- The user approves before durable plan state changes.

## Surface Rule

Use the quietest surface that expresses the job.

- Plain section: explanation, grouping, context.
- List row: settings, links, repeated metadata.
- Form field: typed user input.
- Choice group: bounded selection.
- Calendar/date picker: date choice.
- Card: suggestion, plan item, status summary, review/approval state.

Cards are intentionally special. If every block is a card, the product loses hierarchy.

## Continuity Rule

The main emotional promise is:

Plans change. You can still continue.

Never lead with failure, punishment, shame, or calorie precision unless a later explicit product decision changes the tone.
