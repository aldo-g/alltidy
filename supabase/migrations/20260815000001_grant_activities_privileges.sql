-- Recent Supabase projects no longer auto-expose new tables to the API roles
-- (see auto_expose_new_tables in config.toml). RLS policies alone aren't
-- enough — the roles also need table-level privileges, which RLS then narrows.
grant select, insert on public.activities to anon, authenticated;

-- service_role bypasses RLS but still needs table-level privileges under the
-- new stricter default; needed for any future admin/moderation tooling.
grant select, insert, update, delete on public.activities to service_role;
