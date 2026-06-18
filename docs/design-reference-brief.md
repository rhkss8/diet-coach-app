# Design Reference Brief

## Product Intent

Design problem:

- Diet Coach must feel like a recovery planner, not a calorie tracker, hospital app, or generic AI chatbot.

Primary user emotion:

- The user feels tired, guilty, and unsure how to continue after a diet plan breaks.

Desired user emotion:

- The user feels calm, organized, and in control because today's plan can be adjusted without restarting.

Signature interaction:

- AI turns chat into reviewable meal, exercise, or plan-revision cards.
- The user approves before the plan changes.

What the screen must prove:

- This is a plan-adjustment system with AI assistance, not an infinite chat window.

What the screen must avoid looking like:

- Calorie spreadsheet.
- Medical dashboard.
- Neon fitness app.
- Cute habit tracker.
- Generic chat assistant.

## Reference Scan

### Direct Competitors

Product/category: Noom, MyFitnessPal, food trackers

- Relevant because: users know these as diet apps.
- What works: clear daily status, food/task completion, repeated-use structure.
- What fails: guilt-heavy tracking, calorie precision focus, weak recovery path.
- Should borrow: daily continuity and task clarity.
- Should avoid: red/green judgment, "you exceeded" language, dense nutrition tables.

Product/category: ChatGPT-style AI chat

- Relevant because: chat is the main input.
- What works: low-friction natural language.
- What fails: weak state, weak plan ownership, generic transcript feel.
- Should borrow: conversational input.
- Should avoid: endless undifferentiated message bubbles.

### Adjacent Products

Product/category: Calendar and planner apps

- Relevant interaction: plans change, but the day continues.
- What works: date context, today board, rescheduling mental model.
- Applicable pattern: show plan items as movable/revisable blocks.

Product/category: Finance and budgeting apps

- Relevant interaction: trusted status summary plus recommended action.
- What works: compact status cards, clear state labels, calm authority.
- Applicable pattern: "current plan" summary and approved change cards.

Product/category: Linear/Notion-like productivity tools

- Relevant interaction: structured work objects rather than decorative cards.
- What works: hierarchy, restrained surfaces, action objects.
- Applicable pattern: AI suggestion as a plan patch, not just a chat message.

### Emotional Tone References

Reference/category: warm planner and journaling products

- Feeling: quiet, personal, low-pressure.
- Transferable design move: soft paper-like backgrounds, restrained accents, clear daily sections.
- Risk if copied too closely: too lifestyle/editorial and not enough system.

Reference/category: calm productivity dashboards

- Feeling: organized, capable, reusable.
- Transferable design move: compact status tiles, section headers, stable layout rhythm.
- Risk if copied too closely: too work-tool-like for a health context.

### Anti-References

Reference/category: neon fitness challenge apps

- Why wrong: turns recovery into pressure and performance.
- Avoid: black/red neon palette, aggressive streaks, body-transformation visual language.

Reference/category: hospital portals

- Why wrong: makes everyday planning feel clinical.
- Avoid: cold blue-white tables, medical warning hierarchy, diagnosis-like copy.

Reference/category: generic AI chatbot shells

- Why wrong: hides the product's plan state behind a transcript.
- Avoid: full-screen chat-only composition with no structured approval object.

## Visual Territory Decision

Chosen territory: Recovery Planner

One-line description:

- A calm daily planner where AI suggestions become clear, reviewable plan cards.

Best fit:

- MVP users who feel one broken day ruins the plan and need a low-pressure way to continue.

Risk:

- If too quiet, it may feel plain or not differentiated.

Non-negotiable visual rules:

- The AI suggestion card is the visual hero of the product.
- Today is a board for continuing, not a diary or dashboard.
- Warm planner surfaces are allowed; guilt, warning, and calorie-heavy UI are not.
- Chat is an input layer; approved plan objects are the product layer.
- Use at least one warm accent and one structural accent so the palette does not become one-note green.

Rejected territory: Adaptive OS

- Reason: strong differentiation, but too system-heavy for early diet users.

Rejected territory: Human Coach Desk

- Reason: emotionally soft, but risks becoming another coaching/chat app.

## Wireframe Plan

### AI Consultation

User job:

- Explain goals, constraints, meals, exercise intent, or broken plans in natural language.

Primary action:

- Send a message to receive a structured suggestion.

Secondary actions:

- Open Today's Plan.
- Approve a suggestion.

Information priority:

1. Product promise: AI suggests; user approves.
2. Current conversation.
3. Pending structured suggestion card.
4. Message input.

Sections:

- Header with product promise.
- Conversation stream.
- Suggestion card when available.
- Input/action bar.

Review state:

- Suggestion card shows type, summary, affected items, and approval action.

### Today Board

User job:

- See what remains today and continue without recalculating everything manually.

Primary action:

- Complete or skip today's item.

Secondary actions:

- Start AI consultation.
- Adjust today manually.
- Open settings.

Information priority:

1. Today continuity message.
2. Progress and pending count.
3. Current plan summary.
4. Meal and exercise blocks.
5. Recovery/adjustment action.

Sections:

- Today hero.
- Status tiles.
- Current plan card.
- Progress bar.
- Notification recommendation, if visible.
- Meal section.
- Exercise section.
- Adjustment entry.

### Revision Review

User job:

- Understand what changes before approving.

Primary action:

- Approve revision.

Secondary action:

- Dismiss and keep current plan.

Information priority:

1. Why the plan changed.
2. Number of affected items.
3. Changed items.
4. Approval/dismissal.

## High-Fidelity Screen Plan

Palette:

- Paper background: warm off-white.
- Primary ink: deep green-black.
- Primary action: grounded green.
- Warm accent: clay/coral for recovery and suggestion emphasis.
- Structural accent: muted blue-gray for system/status moments.

Typography:

- Strong screen titles.
- Compact section headers.
- Readable body copy.
- Small uppercase labels only for state/category.
- Tabular numbers for progress and counters.

Spacing:

- Use 8/12/16/24/32 rhythm.
- Keep screen sections distinct without floating every section.
- Suggestion and plan cards get more internal breathing room than simple list rows.

Surface rules:

- Dark hero for first-view product promise.
- Warm paper background for calm continuity.
- Cards reserved for suggestions, plan items, status, and review states.
- Avoid nested cards.

Button hierarchy:

- Primary: approve, generate, continue.
- Ghost: dismiss, secondary navigation.
- Small pill buttons: header actions and status actions.

Design QA focus:

- Does consultation feel like a planner workspace rather than generic chat?
- Does Today feel like a continuation board rather than a food diary?
- Is the suggestion card visually important enough?
- Are warm and structural accents balanced?
- Do Korean labels fit on mobile without cramped controls?
