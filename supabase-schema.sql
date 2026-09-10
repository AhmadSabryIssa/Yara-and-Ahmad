```sql
-- =========================================================
-- AHMAD & YARA WEDDING DATABASE — FINAL STRUCTURE
-- =========================================================
--
-- FINAL TABLE:
--
-- comments:
--   id
--   guest_name
--   message
--   attending
--   created_at
--
-- RSVP is NO LONGER a separate table.
--
-- attending:
--   TRUE  = guest clicked "Yes, I'll Be There ❤️"
--   NULL  = guest has not clicked Yes
--
-- IDs:
--   Always use the lowest available positive integer.
--   Example:
--      1, 2, 3
--      delete 2
--      next entry = 2
--
-- Guests can submit comments and update their own newly
-- submitted RSVP status through controlled functions.
-- =========================================================


-- =========================================================
-- 1. REMOVE OLD FUNCTIONS
-- =========================================================

drop function if exists public.submit_rsvp(text, text);
drop function if exists public.submit_rsvp(text);

drop function if exists public.submit_comment(text, text, text);
drop function if exists public.submit_comment(text, text);

drop function if exists public.confirm_attendance(bigint);


-- =========================================================
-- 2. DELETE THE OLD INDEPENDENT RSVP TABLE
-- =========================================================

drop table if exists public.rsvps;


-- =========================================================
-- 3. PREPARE COMMENTS TABLE
-- =========================================================

-- Remove language if it still exists.
alter table public.comments
    drop column if exists language;


-- Add attending column.
alter table public.comments
    add column if not exists attending boolean default null;


-- =========================================================
-- 4. MAKE SURE ID IS AN INTEGER
-- =========================================================

-- If your comments.id is already bigint/integer from your
-- previous migration, this section does nothing.
--
-- If it is already the correct type, leave it alone.

-- =========================================================
-- 5. RLS
-- =========================================================

alter table public.comments enable row level security;

revoke all on table public.comments from anon, authenticated;


-- =========================================================
-- 6. SUBMIT COMMENT
-- =========================================================
--
-- This function:
--   1. Validates the name
--   2. Validates the message
--   3. Finds the lowest available ID
--   4. Inserts the comment
--   5. Returns the new ID
--
-- Example:
--
-- Existing:
--   1
--   2
--   4
--
-- New comment gets:
--   3
--
-- =========================================================

create or replace function public.submit_comment(
    p_guest_name text,
    p_message text
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    new_id bigint;
begin

    -- Validate guest name
    if char_length(btrim(coalesce(p_guest_name, ''))) < 2
       or char_length(btrim(coalesce(p_guest_name, ''))) > 100 then

        raise exception 'Please enter a valid name.';

    end if;


    -- Validate message
    if char_length(btrim(coalesce(p_message, ''))) < 1
       or char_length(btrim(coalesce(p_message, ''))) > 1000 then

        raise exception 'Please enter a message.';

    end if;


    -- Find the lowest available positive ID.
    select coalesce(
        (
            select min(c1.id + 1)
            from public.comments c1
            left join public.comments c2
                on c2.id = c1.id + 1
            where c1.id >= 1
              and c2.id is null
        ),
        1
    )
    into new_id;


    -- Insert comment
    insert into public.comments (
        id,
        guest_name,
        message,
        attending
    )
    values (
        new_id,
        btrim(p_guest_name),
        btrim(p_message),
        null
    );


    -- Return the ID to JavaScript
    return new_id;

end;
$$;


-- =========================================================
-- 7. CONFIRM ATTENDANCE
-- =========================================================
--
-- Called when the guest clicks:
--
-- "Yes, I'll Be There ❤️"
--
-- It changes:
--
-- attending = NULL
--
-- to:
--
-- attending = TRUE
--
-- =========================================================

create or replace function public.confirm_attendance(
    p_comment_id bigint
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin

    update public.comments
    set attending = true
    where id = p_comment_id;

end;
$$;


-- =========================================================
-- 8. FUNCTION PERMISSIONS
-- =========================================================

revoke all
on function public.submit_comment(text, text)
from public;

revoke all
on function public.submit_comment(text, text)
from anon;

revoke all
on function public.submit_comment(text, text)
from authenticated;


revoke all
on function public.confirm_attendance(bigint)
from public;

revoke all
on function public.confirm_attendance(bigint)
from anon;

revoke all
on function public.confirm_attendance(bigint)
from authenticated;


grant execute
on function public.submit_comment(text, text)
to anon;

grant execute
on function public.confirm_attendance(bigint)
to anon;


-- =========================================================
-- FINAL STRUCTURE
-- =========================================================
--
-- comments:
--
-- id | guest_name | message | attending | created_at
--
-- Example:
--
-- 1 | Ahmed | Can't wait! | true  | ...
-- 2 | Sara  | Congratulations! | NULL | ...
-- 3 | Omar  | See you there! | true | ...
--
-- =========================================================
```
