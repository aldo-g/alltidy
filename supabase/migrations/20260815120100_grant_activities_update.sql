-- authenticated needs table-level UPDATE privilege to claim anonymous
-- activities; RLS (20260815120000) narrows this to the owner-claim case.
grant update on public.activities to authenticated;
