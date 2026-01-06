# Pipeline Migration Guide: aws-codepipeline → aws-cdk-lib/pipelines

## Overview

Migrated from low-level `aws-codepipeline` to modern `aws-cdk-lib/pipelines` (CDK Pipelines).

## New Pipeline Structure

```
Source (GitHub) → Synth (Lint + Build + CDK Synth) → UpdatePipeline → Assets → Deploy
```

## What Changed

| Aspect | Before | After |
|--------|--------|-------|
| Pipeline construct | `codepipeline.Pipeline` | `pipelines.CodePipeline` |
| Source | `CodeStarConnectionsSourceAction` | `CodePipelineSource.connection()` |
| Build steps | Separate CodeBuild projects + buildspecs | Inline `ShellStep` commands |
| IAM roles | Custom `CodeBuildRole` construct | Managed by CDK Pipelines |
| Self-mutation | None | Automatic |
| Quality gates | None | Linting in synth step |
| Asset deployment | Manual S3 sync + CloudFront invalidation | CDK `BucketDeployment` |

## Files Changed

| File | Change |
|------|--------|
| `infra/lib/stacks/pipeline-stack.ts` | Rewritten with CDK Pipelines |
| `infra/lib/stages/frontend-stage.ts` | New - Stage wrapper for FrontendStack |
| `infra/lib/stacks/frontend-stack.ts` | Removed `withAssets` conditional |
| `infra/bin/infra.ts` | Simplified - removed `pipelineOnly` flag |

## Files to Delete (After Verification)

- `buildspecs/frontend_build.yml`
- `buildspecs/deploy_frontend.yml`
- `infra/lib/constructs/shared-constructs.ts` (if only used by old pipeline)

## Deployment

### Prerequisites

1. Create a CodeStar Connection in AWS Console (Settings → Connections)
2. Authorize the connection with GitHub
3. Copy the connection ARN

### Deploy Pipeline

```bash
cd infra
npx cdk deploy VoltDashPipelineStack \
  --context codeConnectionArn=arn:aws:codeconnections:REGION:ACCOUNT:connection/ID \
  --context repositoryName=owner/repo \
  --context branchName=main
```

### Deploy Frontend Directly (Local Dev)

```bash
cd infra
npx cdk deploy VoltDashFrontend-preview-username
```

## Note on CodeStar Connections

CodeStar Connections **cannot be created via CDK** — they require OAuth authorization through the AWS Console. The ARN must always be passed as a context parameter.
