# Tester Cohort Recruitment

Date: 2026-06-16

## Goal

Recruit the first closed MVP tester cohort and validate whether manual recovery keeps users moving after a broken diet day.

## Cohort Definition

Target: 50 Korean users.

Best-fit testers:

- Have tried calorie trackers, diet coaching, or meal-plan apps before.
- Want to lose weight but often break plans because of work, meals, energy, or schedule.
- Can test for 4 weeks.
- Are willing to give short feedback after onboarding and after at least one plan adjustment.

Avoid for first cohort:

- Users who need medical or clinical diet support.
- Users who only want calorie precision.
- Users who expect a full AI chat coach as the primary interface.
- Users who cannot install or open the MVP build path chosen for the test.

## Recruiting Channels

Recommended order:

1. Founder personal network.
2. Small private diet, fitness, or habit groups.
3. Coworkers or friends of friends who match the persona.
4. Small Korean communities only after the first 10 users finish observation.

## First 10 User Plan

Purpose: observe product comprehension before scaling to 50.

Watch or interview at least 5 of the first 10 users while they:

1. Start as a new user.
2. Complete onboarding.
3. Approve the first plan.
4. Find "오늘 계획 조정".
5. Approve one revised plan.

Pass signal:

- User understands this is a recovery planner, not a punishment tracker.
- User can find adjustment without being told where it is.
- User says the revised plan feels usable for the rest of the day.

## Four-Week Test Rhythm

Week 1:

- Onboard 10 users.
- Observe 5 users live or async with screen notes.
- Fix blocking onboarding, plan approval, or adjustment confusion before inviting more users.

Week 2:

- Expand to 25 users.
- Track adjustment entry rate and adjustment approval rate.
- Interview users who had a broken day but did not adjust.

Week 3:

- Expand to 50 users if the core loop is stable.
- Track return within 24 hours after approved revision.

Week 4:

- Summarize retention, recovery behavior, and copy issues.
- Decide whether to deepen AI planning, food logging, or notification loops next.

## Primary Metric

Return within 24 hours after approved plan revision.

## Secondary Metrics

- Onboarding completion rate.
- Plan approval rate.
- Adjustment entry rate.
- Adjustment approval rate.
- Next plan item completion after approved revision.
- 7-day retention.

## Feedback Questions

Ask after onboarding:

1. What did you think this app was for?
2. Was the first plan too strict, too vague, or usable?
3. Did anything feel like a normal diet app in a bad way?

Ask after a plan adjustment:

1. What happened that made you adjust?
2. Did the revised plan feel specific enough?
3. Did the app make you feel like you could continue?
4. What would have made the adjustment faster?

Ask at week end:

1. Did you come back after a broken day?
2. What made you stop opening the app, if anything?
3. Which part felt most useful?

## Recruiting Message

Short version:

```text
다이어트 앱 MVP를 4주 동안 작게 테스트하고 있어요.

이 앱은 칼로리를 완벽하게 맞추는 앱이 아니라, 회식/야근/폭식/운동 실패처럼 계획이 깨졌을 때 남은 하루 계획을 다시 맞춰서 포기하지 않게 도와주는 앱이에요.

조건은 간단해요.
- 첫 온보딩과 플랜 승인까지 해보기
- 계획이 틀어진 날 "오늘 계획 조정"을 한 번 써보기
- 짧은 피드백 몇 개 남기기

관심 있으면 테스트 링크 보내드릴게요.
```

Long version:

```text
안녕하세요. 지금 다이어트 플래너 MVP를 비공개로 테스트하고 있어요.

기존 다이어트 앱처럼 매번 음식 기록을 압박하거나 실패를 경고하는 방향이 아니라, 현실에서 계획이 깨졌을 때 "오늘 남은 플랜을 이렇게 바꾸고 계속 가자"라고 도와주는 앱입니다.

테스트에서 보고 싶은 건 딱 하나예요.
계획이 한 번 틀어진 뒤에도 사용자가 다시 앱으로 돌아와 이어갈 수 있는가.

테스트 기간은 4주이고, 처음에는 아래 흐름만 보면 됩니다.
1. 기본 정보 입력
2. 첫 7일 플랜 확인
3. 오늘 플랜 체크
4. 회식/야근/운동 미실행 같은 상황에서 오늘 계획 조정
5. 짧은 피드백 남기기

칼로리 정확도보다 "계속 이어갈 수 있는 느낌"이 중요한 테스트라, 완벽하게 다이어트 중인 분보다 계획이 자주 흔들리는 분이면 더 좋아요.

괜찮으시면 테스트 링크와 피드백 채널을 보내드릴게요.
```

## Required Decisions Before Sending

1. Distribution path
   - Recommended: TestFlight or Expo EAS preview for mobile testers.
   - Temporary option: web export for internal walkthrough only.

2. Feedback URL
   - Recommended: one Google Form, Typeform, Kakao OpenChat, Slack, or Discord link.
   - Must be added to `EXPO_PUBLIC_FEEDBACK_URL`.

3. First 10 tester list
   - Required before broad recruiting.
   - Include name, channel, persona fit, invite status, onboarding status, and adjustment status.

4. Privacy/legal review
   - Required before sending beyond close contacts.
   - Current privacy policy and terms are MVP drafts.

## Tester Tracker Template

| Tester | Channel  | Persona fit | Invited | Onboarded | Adjusted plan | Returned after revision | Feedback received | Notes |
| ------ | -------- | ----------- | ------- | --------- | ------------- | ----------------------- | ----------------- | ----- |
| T01    | personal | high        | no      | no        | no            | no                      | no                |       |
| T02    | personal | high        | no      | no        | no            | no                      | no                |       |
| T03    | personal | medium      | no      | no        | no            | no                      | no                |       |

## Current Status

Recruitment materials are ready.

Blocked before actual recruitment:

- final distribution path
- feedback channel URL
- first tester list
- privacy/legal review decision for non-close-contact users
