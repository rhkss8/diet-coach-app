# Supabase Project

This folder contains the local Supabase project scaffold for the Diet Coach MVP.

## Local Commands

- `pnpm supabase:start`
- `pnpm supabase:status`
- `pnpm supabase:stop`

These commands require the Supabase CLI to be installed on the machine.

## Cloud Setup

Create the cloud project manually in Supabase, then copy the project values into `.env`:

- `SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Do not commit real `.env` values.

## Auth Providers

Enable these providers in Supabase Auth for the MVP login surface:

- Email magic link
- Kakao OAuth
- Google OAuth

Register the Expo app redirect URL in Supabase and in each provider console before testing native
login. Keep email enabled as the fallback path for QA and users who cannot complete social OAuth.

## Server Secrets

Store `OPENAI_API_KEY` as a server-side secret only. Do not add it to `EXPO_PUBLIC_*` variables or
commit it to `.env.example`; mobile builds should call a server boundary such as a Supabase Edge
Function instead of calling OpenAI directly with a bundled key.

The app calls the `ai-plan` Edge Function for chat planning and adjustment generation. Configure the
function with:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional)

Local example:

```sh
supabase secrets set OPENAI_API_KEY=... OPENAI_MODEL=gpt-4.1-mini
```

The current local function config allows unauthenticated calls so the guest MVP flow can still ask
for a plan. Before public testing, add an abuse guard such as authenticated-only access, rate
limiting, or a server-side usage budget.

## Storage

The `chat-attachments` bucket stores files uploaded from plan consultation messages. The bucket is
private, limited to 10 MB per file, and scoped by the first path segment:

```txt
{auth.users.id}/{attachment-id}-{safe-file-name}
```

Keep message previews local in the app, but persist only attachment metadata and `storagePath` in
`chat_messages.attachments`.
