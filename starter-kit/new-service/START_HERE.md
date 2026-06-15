# New Service Starter Kit

## How To Use
Copy this folder's `docs/` directory, `tars` launcher, and optional compatibility wrappers into a new project.

Then give Codex:
- Service definition.
- Persona.
- Core pain.
- Desired transformation.

Run the CLI with no arguments to see available commands:

```bash
tars
```

Optional: activate project-local commands for the current terminal session:

```bash
source ./activate
tars
tars init
```

Install `tars` so it works from any terminal:

```bash
zsh scripts/install-tars.zsh
source ~/.zshrc
tars
```

Start a new project:

```bash
tars init
```

It will ask for the service definition, persona, core pain, and desired transformation, then write the project docs.

If the service definition already exists, use:

```bash
tars start
tars status
tars next
```

The generated kickoff prompt is:

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

## What This Kit Provides
- Product brainstorming structure.
- G-Stack.
- Superpowers.
- MVP todo loop.
- Decision gates.
- Lesson-and-run memory.
- Senior frontend standards.
- Design tone template.
- AI contract template.
- Analytics and QA templates.
- Local agent operating model.

## Local Only
This is not a global Codex skill.

Keep it as a project-local copy pack. Update it when repeated lessons prove useful across projects.
