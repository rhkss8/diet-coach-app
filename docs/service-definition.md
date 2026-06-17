# Service Definition

## One-Line Definition

Diet Planner is a chat-first adaptive planning system that turns AI consultation into reviewable meal, exercise, and plan revision actions.

## Persona

A person who wants to lose weight but cannot follow rigid diet plans because meals, work, energy, and schedule change often.

## Core Pain

Existing diet apps turn a changed day into failure. The user wants to continue, not confess failure.

## Desired Transformation

Before:

- The user feels that one broken day ruins the whole plan.

After:

- The user feels they can adjust today and keep going.

## Core Mechanism

AI consultation with structured plan actions:

- User chats naturally about goals, meals, exercise, constraints, or a broken day.
- AI returns a JSON response with user-facing copy and a structured action.
- The app renders a confirmation card such as "식단에 추가하시겠습니까?", "운동에 추가하시겠습니까?", or "식단 플랜을 수정하시겠습니까?"
- The app only mutates the plan after user approval.
- The user can later add or revise plans from either chat or the plan screen.
