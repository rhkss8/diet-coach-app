# Diet Coach App

AI 상담에서 나온 식단, 운동, 플랜 수정 제안을 사용자가 승인하면 오늘 플랜에 반영하는 다이어트 플래너 MVP입니다.

핵심 루프는 다음 흐름입니다.

```text
채팅 상담 -> AI JSON 제안 -> 사용자 승인 -> 오늘 플랜 반영 -> 실행 체크 -> 채팅/플랜에서 수정 -> 계속 진행
```

## 1. 처음 시작할 때

### 필수 도구

- Node `20.19.4` 이상
- pnpm `10.15.1`
- Expo CLI는 프로젝트 스크립트에서 실행합니다.

권장 세팅:

```bash
source ~/.zshrc >/dev/null 2>&1
nvm use 20.19.4
corepack enable
corepack prepare pnpm@10.15.1 --activate
pnpm install
```

설치 확인:

```bash
node -v
pnpm -v
```

## 2. 환경 변수

로컬에서 `.env.example`을 기준으로 `.env`를 만듭니다.

```bash
cp .env.example .env
```

MVP 테스트에서 필요한 주요 값:

- `OPENAI_API_KEY`: 실제 AI 호출을 붙일 때 사용
- `EXPO_PUBLIC_SUPABASE_URL`: 모바일 앱에서 읽는 Supabase URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: 모바일 앱에서 읽는 Supabase anon key
- `EXPO_PUBLIC_PRIVACY_POLICY_URL`: 설정 화면 개인정보 처리방침 링크
- `EXPO_PUBLIC_TERMS_URL`: 설정 화면 이용약관 링크
- `EXPO_PUBLIC_FEEDBACK_URL`: 설정 화면 피드백 채널 링크

실제 `.env` 파일은 커밋하지 않습니다.

## 3. 앱 실행

Expo 실행은 프로젝트 로컬 스크립트를 우선 사용합니다.

```bash
./script/build_and_run.sh --help
```

기본 실행:

```bash
./script/build_and_run.sh
```

8081 포트가 이미 사용 중이면 다른 포트로 실행합니다.

```bash
PORT=8082 ./script/build_and_run.sh
```

휴대폰 Expo Go에서 QR이 열리지 않거나 같은 네트워크 접속이 불안정하면 tunnel 모드를 씁니다.

```bash
PORT=8082 ./script/build_and_run.sh --tunnel
```

웹 실행:

```bash
./script/build_and_run.sh --web
```

iOS 시뮬레이터:

```bash
./script/build_and_run.sh --ios
```

Android:

```bash
./script/build_and_run.sh --android
```

Expo 진단:

```bash
./script/build_and_run.sh --doctor
```

## 4. 웹 빌드와 QA

반복 가능한 로컬 웹 export:

```bash
pnpm mobile:build:web
```

또는:

```bash
./script/build_and_run.sh --export-web
```

빌드 결과는 `dist/mobile-web-qa/`에 생성됩니다. 이 폴더는 빌드 산출물이므로 Git에 커밋하지 않습니다.

정적 서버로 확인:

```bash
python3 -m http.server 19009 --bind 127.0.0.1 --directory dist/mobile-web-qa
```

브라우저에서 엽니다.

```text
http://127.0.0.1:19009
```

수동 QA 기준은 [docs/qa-checklist.md](/Users/user/Desktop/projects/diet-coach-app/docs/qa-checklist.md)를 따릅니다.

## 5. 개발 체크

작업 후 반드시 아래 체크를 통과시킵니다.

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
```

자동 포맷이 필요하면:

```bash
pnpm format
```

현재 테스트 스위트는 모바일 앱, core domain, AI contract, DB schema, analytics coverage를 포함합니다.

## 6. TARS 작업 흐름

이 프로젝트는 TARS 기준으로 MVP todo를 계속 진행합니다.

현재 상태 확인:

```bash
tars status
```

다음 todo 확인:

```bash
tars next
```

작업 시작 프롬프트:

```bash
tars start
```

작업 완료 후:

```bash
tars done
```

TARS 원칙:

- `docs/mvp-todo.md`의 첫 번째 미완료 todo부터 진행합니다.
- 작업 단위는 vertical slice로 끝냅니다.
- 완료 전 `typecheck`, `lint`, `test`, `format:check`를 통과시킵니다.
- 완료한 slice는 커밋합니다.
- 외부 계정, 배포, tester 초대처럼 사용자 결정이 필요한 지점에서만 멈춥니다.

## 7. Expo Skill 기준

Expo 관련 작업은 먼저 프로젝트 로컬 skill을 확인합니다.

[.codex/skills/expo-mvp-delivery/SKILL.md](/Users/user/Desktop/projects/diet-coach-app/.codex/skills/expo-mvp-delivery/SKILL.md)

이 skill은 다음 상황에서 사용합니다.

- Expo 실행 루프
- EAS/TestFlight/Play Store 배포
- dev client 또는 실기기 QA
- Expo SDK 업그레이드
- 모바일 네트워크/API 작업
- Codex Run action 설정

EAS Build, TestFlight, Play Store, 외부 tester 배포는 사용자 결정 없이 실행하지 않습니다.

## 8. Supabase

로컬 Supabase 스크립트:

```bash
pnpm supabase:start
pnpm supabase:status
pnpm supabase:stop
```

초기 스키마는 `supabase/migrations/` 아래에 있습니다.

## 9. 다른 PC에서 이어서 작업하기

근무지와 집 PC를 오가며 작업할 때는 Git을 기준으로 이어갑니다.

작업을 마치기 전:

```bash
tars handoff
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
git status
git add .
git commit -m "fix: 변경 내용 한글 요약"
git push
```

다른 PC에서 시작:

```bash
git pull
source ~/.zshrc >/dev/null 2>&1
nvm use 20.19.4
pnpm install
tars status
tars next
```

그 다음 Codex에게 이렇게 요청하면 됩니다.

```text
tars 기준으로 다음 todo 진행해줘.
```

## 10. 현재 남은 출시 준비

현재 제품 방향은 채팅 상담 기반 플랜 생성/수정으로 피벗되었습니다. 출시 준비 전에는 Phase 8의 채팅 플랜 루프를 기준으로 QA를 다시 통과시켜야 합니다.

남은 TARS todo:

```text
Chat-First Pivot
Recruit first tester cohort
```

`Recruit first tester cohort`는 실제 tester 초대와 배포 결정이 필요합니다.

결정해야 할 것:

- 배포 방식: EAS preview/dev build, TestFlight, Android internal, 또는 web export
- 피드백 URL: Google Form, Typeform, Kakao, Discord, Slack 등
- 첫 10명 tester 명단
- 가까운 지인 외 모집 시 개인정보/약관 초안 검토 여부

모집 문구와 운영 기준은 [docs/tester-cohort-recruitment.md](/Users/user/Desktop/projects/diet-coach-app/docs/tester-cohort-recruitment.md)에 정리되어 있습니다.
