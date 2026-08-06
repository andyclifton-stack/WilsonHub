# Daily update guide

The future updater should normally change only JSON under `public/data/`. It must not routinely change navigation, components, styling, build configuration or workflows.

## Editable files

- `vehicle.json`: confirmed vehicle facts and settings
- `software.json`: observed software history
- `issues.json`: faults, questions and troubleshooting
- `guides.json`: durable practical guidance
- `uk-watch.json`: time-sensitive UK records
- `sources.json`: source catalogue
- `actions.json`: explicit follow-up checks
- `change-log.json`: concise user-visible record of material changes
- `site-meta.json`: site-wide dates and schema version

## Record rules

Every ordinary record requires a stable lowercase kebab-case `id`, `title`, status, confidence, region, relevance, ISO dates, archive/supersede flags and a sources array. Valid statuses are `confirmed`, `pending`, `open`, `resolved`, `reference`, `monitoring` and `archived`. Confidence is `high`, `medium` or `low`. Store dates as `YYYY-MM-DD`; the interface formats them for the UK.

Do not create a new record when an existing stable ID describes the same fact. Update it and its `lastChecked`/`lastUpdated` dates. Prefer later verified corrections. Never upgrade uncertain information to confirmed without an adequate source. Sources must point to IDs in `sources.json`; related records and vehicle/software applicability must also use existing IDs.

Archive a no-longer-active record with `archived: true` and status `archived`. When a newer record replaces it, also set `superseded: true` and add a related reference where useful. Do not delete historical records merely because they are old.

## Today page and change log

Add one concise `change-log.json` entry for each materially useful update. Set `lastUpdated` to the day the change became visible. The Today page displays the newest non-archived entries. Minor punctuation or source-check-only changes do not need a user-facing entry, but should update `lastChecked`.

## Validation and deployment

Run `npm ci`, then `npm run validate`, `npm test` and `npm run build`. Validation rejects malformed JSON, missing or invalid required fields, duplicate IDs, invalid dates and broken references. A push to `main` triggers `.github/workflows/deploy-pages.yml`; the same workflow can be run manually in GitHub Actions. It validates and builds before deploying, so invalid data cannot replace the live Pages site.
