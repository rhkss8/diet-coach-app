# New Service Copy Pack

## Purpose
These are the files to copy into a new project before asking Codex to brainstorm and build a new service.

The reusable local starter kit lives at:

```txt
starter-kit/new-service/
```

Prefer copying from that folder, not from the Diet Planner-specific `docs/` folder.

Copy:

```txt
starter-kit/new-service/docs/
starter-kit/new-service/README.md
starter-kit/new-service/HOW_IT_WORKS.md
starter-kit/new-service/tars
starter-kit/new-service/start
starter-kit/new-service/activate
starter-kit/new-service/scripts/install-tars.zsh
```

Then run:

```bash
tars
tars init
```

Or activate bare local commands for the current shell:

```bash
source ./activate
tars
tars init
```

To install the command on another PC:

```bash
zsh scripts/install-tars.zsh
source ~/.zshrc
tars
```

To continue work between office and home PCs:

```bash
tars handoff
git add .
git commit -m "Complete current slice"
git push
```

On the other PC:

```bash
git pull
tars doctor
tars status
tars next
```

## Minimum Copy Pack
Copy these files:

```txt
docs/new-service-starter-protocol.md
docs/agent-runbook.md
docs/decision-log.md
docs/lessons-and-rules.md
docs/frontend-engineering-standards.md
docs/decision-gates.md
```

Then provide:
- Service definition.
- Persona.
- Core pain.
- Desired transformation.

## Full Copy Pack
Copy the whole `starter-kit/new-service/docs/` folder into the new project as `docs/` when the project should begin with product, design, AI, analytics, QA, and todo structure already present.

```txt
docs/new-service-starter-protocol.md
docs/service-definition.md
docs/g-stack.md
docs/superpowers.md
docs/mvp-execution-harness.md
docs/design-tone-and-manner.md
docs/frontend-engineering-standards.md
docs/ai-contracts.md
docs/analytics-events.md
docs/qa-checklist.md
docs/skills-and-agents.md
docs/agent-runbook.md
docs/mvp-todo.md
docs/decision-log.md
docs/lessons-and-rules.md
docs/decision-gates.md
```

## Kickoff Prompt
Use this prompt in a new project:

```txt
이 프로젝트는 신규 서비스 MVP야.
docs/new-service-starter-protocol.md와 docs/agent-runbook.md를 기준으로 시작해줘.

서비스 정의:
[한 줄 정의]

페르소나:
[타겟 유저]

핵심 pain:
[사용자가 겪는 문제]

원하는 변화:
[before -> after]

먼저 브레인스토밍으로 기획을 정리하고,
G-Stack, Superpowers, MVP todo, 디자인 톤앤매너, 개발 하네스, AI/QA/analytics 기준을 만든 뒤,
중요 의사결정 지점은 물어보고,
그 외에는 MVP core loop가 끝날 때까지 계속 진행해줘.
```
