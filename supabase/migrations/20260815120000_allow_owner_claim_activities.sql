-- Lets a logged-in user claim their own past anonymous activities: an
-- authenticated user may update device_id-owned rows (user_id is null) to
-- attach their own user_id, but only ever to their own id, and never touch
-- rows another user already owns.
create policy "Users can claim their own anonymous activities"
  on public.activities for update
  to authenticated
  using (user_id is null)
  with check (user_id = (select auth.uid()));
