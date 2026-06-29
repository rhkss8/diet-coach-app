# Start Session Prompt

이 프로젝트는 신규 서비스 MVP야.
docs/new-service-starter-protocol.md, docs/agent-runbook.md, docs/harness/task-router.md, docs/skills-and-agents.md, docs/lessons-quick.md를 기준으로 시작해줘.

서비스 정의:
Diet Planner is a chat-first adaptive planning system that turns AI consultation into reviewable meal, exercise, and plan revision actions.

페르소나:
A person who wants to lose weight but cannot follow rigid diet plans because meals, work, energy, and schedule change often.

핵심 pain:
Existing diet apps turn a changed day into failure. The user wants to continue, not confess failure.

원하는 변화:
Before: The user feels that one broken day ruins the whole plan. After: The user feels they can adjust today and keep going.

먼저 브레인스토밍으로 기획을 정리하고,
G-Stack, Superpowers, MVP todo, 디자인 레퍼런스, 시각 방향 2-3안, 방향 선택, 와이어프레임 계획, 디자인 시스템, 서비스 디자인, 디자인 리뷰/QA, 개발 하네스, AI/QA/analytics 기준을 만든 뒤,
중요 의사결정 지점은 물어보고,
그 외에는 MVP core loop가 끝날 때까지 계속 진행해줘.

작업별 스킬/문서 라우팅:

- 먼저 docs/harness/task-router.md에서 작업 유형을 분류한다.
- Codex skill이 없거나 Codex를 쓰지 않는 환경에서도 task-router의 Required Docs를 따른다.
- 제품, 디자인, 프론트엔드, AI, QA, Expo 작업은 task-router의 행별 문서/검증 기준을 따른다.

작업 완료 전:

- tars verify 실행
- todo 상태 갱신
- docs/decision-log.md 또는 docs/lessons-and-rules.md 업데이트가 필요한지 확인
