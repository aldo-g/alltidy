# alltidy

## Ticket System

This project uses **GitHub Issues** for tracking work.

- Reference issues as `#42` in branch names and PR descriptions
- The `/new-work` skill will ask for an issue number when starting work
- The `/pr-ship` skill will link PRs to issues automatically
- Bug fixes should include `Closes #N` in the PR body to auto-close on merge

To create an issue before starting work:
```bash
gh issue create --title "Short title" --body "Description"
```

## Workflow

1. `/new-work` — start a ticket, create a branch
2. Code the thing
3. `/pr-ship` — open a PR linked to the ticket
4. Get a review, merge

## Branch naming

`{type}/{issue-number}-short-description`

Examples:
- `feat/gh-42-add-auth`
- `fix/gh-99-broken-login`
- `chore/gh-12-upgrade-deps`

## Skills

- `/new-work` — start work on a ticket, create a branch
- `/pr-ship` — wrap up work, open a PR with gitmoji and ticket link
