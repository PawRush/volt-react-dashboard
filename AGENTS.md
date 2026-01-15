# Agent Deployment Information

This document tracks deployment information managed by coding agents.

## Deployment

See [`./DEPLOYMENT.md`](./DEPLOYMENT.md) for full deployment status, resource details, quick commands, and troubleshooting information.

- **Status**: ✅ Deployed
- **URL**: https://d2o79eids70vae.cloudfront.net
- **Stack**: VoltDashFrontend-preview-sergeyka
- **Environment**: preview-sergeyka
- **Deployed**: 2026-01-15 14:04 UTC

## Infrastructure

- **Framework**: React (Create React App)
- **Build Output**: `build/`
- **Package Manager**: npm
- **CDK Stack**: `infra/lib/stacks/frontend-stack.ts`
- **Deployment Script**: `scripts/deploy.sh`

## Quick Links

- Deployment Plan: [`./DEPLOYMENT_PLAN.md`](./DEPLOYMENT_PLAN.md)
- CloudFormation Stack: [AWS Console](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/detail?stackId=arn:aws:cloudformation:us-east-1:126593893432:stack/VoltDashFrontend-preview-sergeyka/58f88980-f21a-11f0-8b4f-1264070153fd)
- CloudFront Distribution: [AWS Console](https://console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/EXP9W57I7AWLJ)

## Resuming Deployment

If you're continuing a deployment:

1. Check [`DEPLOYMENT_PLAN.md`](./DEPLOYMENT_PLAN.md) for current progress
2. Run `./scripts/deploy.sh` to redeploy with latest changes
3. See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for troubleshooting
