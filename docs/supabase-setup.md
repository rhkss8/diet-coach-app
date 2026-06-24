# Supabase Setup

## Goal

Supabase stores the MVP data needed for a 50-user test:

- users
- goals
- plans
- plan items
- plan revisions
- daily check-ins
- analytics events or provider identifiers

## Local First

The repository includes `supabase/config.toml` so every workstation can run the same local project once the Supabase CLI is installed.

Use:

```sh
pnpm supabase:start
pnpm supabase:status
pnpm supabase:stop
```

## Environment Variables

Copy `.env.example` to `.env` on each machine and fill local or cloud values:

```sh
cp .env.example .env
```

Mobile code must use the `EXPO_PUBLIC_` values. Server-side scripts and future DB tooling can use the non-public values.

## Cloud Project Decision Gate

Creating or linking the real Supabase cloud project requires a user decision because it touches an external account and organization.

Before linking cloud:

- choose Supabase organization
- choose project region
- choose pricing tier
- confirm the project id
- confirm who owns production credentials

## MVP Default

Until cloud is linked, development should continue against local Supabase config and checked-in migrations.

## Auth Provider Setup

The app already routes Supabase OAuth callbacks through:

```text
dietcoach://auth/callback
```

When the cloud project is ready, enable these providers in Supabase Dashboard > Authentication >
Providers:

- Email
- Kakao
- Google

Register `dietcoach://auth/callback` as an allowed redirect URL in Supabase Dashboard >
Authentication > URL Configuration. Keep the local Expo redirect URL for local web/native testing:

```text
exp://127.0.0.1:8081
```

Provider console checklist:

- Kakao Developers: register the Supabase callback URL shown in the Kakao provider settings, then
  copy the REST API key and client secret into Supabase.
- Google Cloud Console: create OAuth credentials, register the Supabase callback URL shown in the
  Google provider settings, then copy the client id and client secret into Supabase.
- Email: keep magic-link enabled as the fallback login path for QA and users who cannot finish
  social OAuth.

Do not mark social login complete until it has been tested on the target build type:

- Expo dev client or local Expo run
- iOS build
- Android build
