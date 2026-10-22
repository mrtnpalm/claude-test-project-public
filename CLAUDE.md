# CLAUDE.md

## Deployment

- This web app runs on Railway, not on the local computer.
- Railway deploys automatically from the `main` branch of the GitHub repo https://github.com/mrtnpalm/claude-test-project-public.

## Database

- The database is a Railway PostgreSQL database.
- It is available only through the `DATABASE_URL` environment variable on Railway.

## Local development

- Do not set up a local database.
- Do not set up or run a local server.

## Workflow

- Before every push, run `npm run build` to make sure the app builds.
- After each finished task, commit and push to https://github.com/mrtnpalm/claude-test-project-public (branch `main`) so that Railway deploys the new version.
