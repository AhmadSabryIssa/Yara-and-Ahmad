# Ahmad & Yara — RSVP + Guestbook Database Setup

This project is prepared for a free GitHub Pages + Supabase setup.

## 1. Create the Supabase project

Create a Supabase project on the Free plan.

## 2. Create the database

Open:

Supabase Dashboard -> SQL Editor -> New query

Open `supabase-schema.sql` from this project, paste the entire file, and run it.

The schema creates:

- `rsvps` — guest confirmations
- `comments` — guestbook messages

Guests do NOT receive SELECT/UPDATE/DELETE access to these tables.

The website only calls:

- `submit_rsvp(...)`
- `submit_comment(...)`

You can see all records from your Supabase Dashboard.

## 3. Expose the two RPC functions

Because Supabase now lets you control which database objects are exposed through the Data API, make sure these two functions are exposed:

- `public.submit_rsvp`
- `public.submit_comment`

Dashboard location may appear under:

Integrations -> Data API

Do NOT expose the tables just to make this work.

## 4. Get your project URL and publishable key

In:

Supabase Dashboard -> Settings -> API Keys

Copy:

- Project URL
- Publishable key

The publishable key is designed for browser code when Row Level Security / least-privilege permissions are correctly configured.

NEVER copy a `service_role` or `sb_secret_...` key into the website.

## 5. Configure the website

Open:

`supabase.js`

Replace:

```js
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";
```

with your real values.

## 6. RSVP behavior

The guest enters their name and presses:

`Yes, I'll Be There ❤️`

The website calls `submit_rsvp()`.

The `No` button never submits anything and does not create a "not attending" record.

## 7. Guestbook behavior

The guest enters:

- Name
- Message

The website calls `submit_comment()`.

The message is stored in Supabase, but guests cannot read the comments table directly.

## Security model

The website uses the Supabase publishable key. That key is public by design.

The important protection is:

- RLS is enabled.
- Direct table permissions are revoked from `anon` and `authenticated`.
- Only the two submission functions are granted to `anon`.
- The functions validate the submitted values.
- The functions return no database rows.
- Your actual data remains visible to you in the Supabase Dashboard.

## Free hosting

The website itself can be hosted on GitHub Pages for $0.

Supabase also has a Free plan. Current Free-plan limits include a 500 MB database, 1 GB file storage, 5 GB egress, and 50,000 monthly active users. Free projects can be paused after a period of inactivity, so check the project status before the wedding.



## Updated database structure

After running the updated SQL:

- `rsvps`: `id`, `guest_name`, `created_at`
- `comments`: `id`, `guest_name`, `message`, `created_at`
- IDs are integers: 1, 2, 3, ...
- RSVP no longer stores `attending` or `language`.
- Comments no longer store `language`.

If the two RPC functions were already exposed in Supabase Data API, keep them exposed after replacing their definitions.
