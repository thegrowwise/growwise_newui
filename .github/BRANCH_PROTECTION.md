# Branch Protection Rules — `main`

Configure under **Settings → Branches → Add rule → Branch name pattern: `main`**.

## Required settings

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ Enabled |
| → Required approvals | 1 |
| → Dismiss stale reviews when new commits are pushed | ✅ Enabled |
| Require status checks to pass before merging | ✅ Enabled |
| → Require branches to be up to date before merging | ✅ Enabled |
| Require conversation resolution before merging | ✅ Enabled |
| Do not allow bypassing the above settings | ✅ Enabled (even for admins) |

## Required status check

Add this check name exactly as shown (matches the `name:` field in `pr-gate.yml`):

```
Frontend — Jest + Playwright
```

> This check only appears in the selector after the first PR has run against `main`.

## How the gate works

1. Developer opens a PR from `dev` → `main`.
2. `pr-gate.yml` runs Jest + Playwright automatically.
3. If either fails, GitHub blocks the merge.
4. After merge, `deploy.yml` triggers the Amplify prod deployment.

## AWS Amplify branch configuration

In the Amplify console (**App settings → General → Branches**):

- **Production branch (`main`):** disable "Auto-build" so only the `deploy.yml` workflow triggers deploys — prevents double deployments on push.
- **Staging branch (`dev`):** enable auto-build so every push to `dev` deploys to the staging Amplify environment automatically.
- Set `NEXT_PUBLIC_API_BASE` as an Amplify environment variable:
  - `main` → production API URL
  - `dev` → value of `STAGING_API_URL`

## Required GitHub secrets

Add under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | Already exists |
| `AWS_SECRET_ACCESS_KEY` | Already exists |
| `AMPLIFY_APP_ID` | Amplify app ID — last segment of the App ARN in Amplify console |
| `STAGING_API_URL` | Dev backend URL — used during PR gate builds and nightly tests |
| `GH_TOKEN` | GitHub PAT with `repo` scope — for auto-creating issues on nightly failure |
