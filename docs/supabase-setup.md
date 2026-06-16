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
