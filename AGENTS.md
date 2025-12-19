# Agent Configuration & Deployment

## Deployment

See `./deployment_plan.md` for current deployment status and instructions.

## Build & Test

- `npm run build`: Build the frontend application
- `npm test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests with Playwright
- `npm run test:e2e:ui`: Run tests with Playwright UI
- `npm run test:e2e:headed`: Run tests in headed mode

## Deployment Commands

- `./scripts/deploy.sh`: Deploy to personal preview environment
- `./scripts/deploy.sh dev`: Deploy to dev environment
- `./scripts/deploy.sh prod`: Deploy to production environment
- `WITH_ASSETS=false ./scripts/deploy.sh`: Deploy infrastructure only

## Infrastructure

AWS CDK infrastructure is located in the `infra/` directory. See `infra/bin/infra.ts` and `infra/lib/stacks/frontend-stack.ts` for details.
