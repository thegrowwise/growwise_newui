# CI/CD Runbook — GrowWise Frontend

A plain-English guide to how the pipeline works, where to add keys, and how to debug failures.

---

## What the pipeline does (plain English)

```
You push code to dev
        │
        ▼
Amplify auto-builds staging  ◄── you can preview the site here
        │
        ▼
You open a PR  dev → main
        │
        ▼
GitHub Actions runs tests automatically (pr-gate.yml)
  ├── Jest unit tests
  └── Playwright E2E tests
        │
   pass? ──► merge is allowed
   fail? ──► merge is BLOCKED until fixed
        │
        ▼
You merge the PR
        │
        ▼
GitHub Actions deploys to production (deploy.yml)
  └── Triggers Amplify prod build
        │
        ▼
Every night at 02:15 UTC (nightly-frontend.yml)
  ├── Jest
  ├── Playwright E2E against staging
  └── Lighthouse performance smoke
       └── If anything fails → GitHub issue auto-created
```

---

## Where to add tokens and keys

**All secrets live in one place:**

> `github.com/thegrowwise/growwise_newui`  
> → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Secrets to add right now (pipeline won't work without these)

| Secret name | What it is | Where to get it |
|---|---|---|
| `STAGING_API_URL` | The URL of your dev/staging backend (e.g. `https://dev.api.growwiseschool.org`) | Your AWS Elastic Beanstalk dev environment URL, or the Lambda dev endpoint |
| `AMPLIFY_APP_ID` | Your Amplify app's ID | AWS Console → Amplify → your app → **App settings** → **General** → copy the value after the last `/` in the App ARN (looks like `d1abc2defg`) |
| `GH_TOKEN` | GitHub Personal Access Token | GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → New token → give it `repo` read/write for Issues |

### Secrets already configured (no action needed)

| Secret name | Used by |
|---|---|
| `AWS_ACCESS_KEY_ID` | Amplify prod deploy |
| `AWS_SECRET_ACCESS_KEY` | Amplify prod deploy |

---

## How to add a secret (step by step)

1. Go to `github.com/thegrowwise/growwise_newui`
2. Click **Settings** (top menu of the repo)
3. Left sidebar → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Paste the secret name exactly as shown in the table above (case-sensitive)
6. Paste the value
7. Click **Add secret**

> Never put secrets in code files or `.env` files that get committed. GitHub secrets are encrypted and only exposed to workflows at run time.

---

## How to manually trigger a workflow (no waiting until 2am)

1. Go to `github.com/thegrowwise/growwise_newui/actions`
2. Click **Nightly Tests — Frontend** in the left list
3. Click **Run workflow** (top right)
4. Leave branch as `dev` → click **Run workflow**

Use this to verify the pipeline works before relying on the nightly schedule.

---

## How to set up branch protection on `main`

Do this once after merging PR #227 into `dev`.

1. Go to `github.com/thegrowwise/growwise_newui` → **Settings** → **Branches**
2. Click **Add branch ruleset** (or **Add rule** on older GitHub UI)
3. Branch name pattern: `main`
4. Enable these settings:
   - ✅ Require a pull request before merging (1 approval)
   - ✅ Dismiss stale reviews when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing (even for admins)
5. Under **Required status checks** → search for and add:
   ```
   Frontend — Jest + Playwright
   ```
   > This only appears after the first PR has run the `pr-gate.yml` workflow.

---

## How to set up Amplify environments

In **AWS Console → Amplify → your app**:

| Branch | Auto-build | `NEXT_PUBLIC_API_BASE` value |
|---|---|---|
| `dev` | ✅ On | Your staging backend URL |
| `main` | ❌ Off | Your production API URL |

Turn off auto-build on `main` so only the `deploy.yml` workflow triggers prod deployments — otherwise every push fires two deploys.

---

## Debugging a failed workflow run

1. Go to `github.com/thegrowwise/growwise_newui/actions`
2. Click the failed run (red ✗)
3. Click the failed job name
4. Expand the failed step — the error is printed there

### Common failures and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `secret not found` or build uses wrong URL | `STAGING_API_URL` not set | Add the secret (see above) |
| Jest passes, Playwright fails | Server didn't start in time | Check if `npm run start` output shows an error in the logs |
| Amplify deploy step fails | `AMPLIFY_APP_ID` wrong or IAM permissions missing | Verify the App ID in Amplify console; ensure the AWS key has `amplify:StartJob` permission |
| Nightly issue not created | `GH_TOKEN` not set or missing `repo` scope | Recreate the token with `repo` scope |
| Lighthouse step fails | `perf:ci` script missing or Chrome install failed | Check `package.json` has a `perf:ci` script |

---

## Day-to-day workflow for the team

```
1. Create a feature branch from dev
2. Make changes, test locally (npm test + npm run test:e2e)
3. Push branch → open PR into dev
4. Merge into dev → staging auto-deploys via Amplify
5. When ready to ship → open PR from dev → main
6. PR gate runs automatically — fix anything red
7. Get 1 approval → merge
8. deploy.yml fires → production updates automatically
```

---

## File reference

| File | Purpose |
|---|---|
| `.github/workflows/pr-gate.yml` | Blocks merge to main if tests fail |
| `.github/workflows/nightly-frontend.yml` | Nightly test run against staging |
| `.github/workflows/deploy.yml` | Triggers Amplify prod deploy on merge to main |
| `.github/BRANCH_PROTECTION.md` | Branch protection settings reference |
| `.github/CICD_RUNBOOK.md` | This file |
