# Frontend scripts

AWS Amplify / env helper scripts. Run from **`growwise_newui/`** (e.g. `./scripts/DEPLOY_AMPLIFY.sh`). All `.sh` files for ops live **only** in this folder.

| Script | Purpose |
|--------|---------|
| `DEPLOY_AMPLIFY.sh` | Amplify CLI init / publish flow |
| `UPDATE_BACKEND_URL.sh` | Set `NEXT_PUBLIC_BACKEND_URL` on Amplify branches |
| `UPDATE_ENV_AMPLIFY.sh` | Interactive Amplify env update (backend URL) |
| `UPDATE_STRIPE_PRODUCTION.sh` | Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` on Amplify |

Run from `growwise_newui/` (or use the root wrappers).
