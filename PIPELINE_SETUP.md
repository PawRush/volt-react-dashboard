# CodePipeline Setup Complete ✅

## Pipeline Status

✅ **Pipeline Created**: VoltDashboardPipeline  
✅ **Infrastructure Deployed**: VoltReactDashboardPipelineStack  
✅ **CDK Bootstrap Updated**: Pipeline roles trusted  
✅ **Code Pushed**: Ready for GitHub webhook trigger

## Pipeline Details

**Pipeline Console URL:**  
https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/VoltDashboardPipeline/view

**Pipeline Name:** VoltDashboardPipeline  
**Repository:** PawRush/volt-react-dashboard  
**Branch:** main  
**AWS Region:** us-east-1  
**AWS Account:** 763835214576  

## Pipeline Stages

1. **Source** - GitHub CodeConnections (already AVAILABLE)
2. **Quality** - Lint & Type checks, Unit tests (parallel execution)
3. **Build** - Frontend build
4. **DeployProd** - Deploy to production environment

## Deployment Infrastructure

### S3 Artifacts Bucket
- **Name:** voltdashboard-pipeline-artifacts-763835214576
- **Purpose:** Stores build artifacts between pipeline stages
- **Retention:** 30 days
- **Encryption:** S3-managed

### CodeBuild Projects

| Project | Role | Stage | Function |
|---------|------|-------|----------|
| VoltDashboard-LintType | QualityRole | Quality | ESLint & TypeScript checks |
| VoltDashboard-UnitTests | QualityRole | Quality | Jest unit tests |
| VoltDashboard-FrontendBuild | BuildRole | Build | React app build |
| VoltDashboard-DeployFrontend | DeployRole | Deploy | Deploy to S3 + invalidate CloudFront |

### IAM Roles

**QualityRole** (Quality stage)
- CloudWatch Logs write
- S3 artifacts read/write
- Secrets Manager read

**BuildRole** (Build stage)
- CloudWatch Logs write
- S3 artifacts read/write
- Secrets Manager read
- CloudFormation read
- CDK Bootstrap permissions
- Lambda/CloudFront read-only

**DeployRole** (Deploy stage)
- CloudWatch Logs write
- S3 artifacts read/write
- Secrets Manager read
- CloudFormation read/write
- CDK Bootstrap permissions
- S3 frontend buckets write
- CloudFront invalidation

## How to Trigger the Pipeline

The pipeline is **already configured** to trigger automatically on pushes to the `main` branch via GitHub CodeConnections webhook.

### Manual Trigger

```bash
# 1. Push to main branch
git push origin main

# 2. Monitor pipeline
aws codepipeline get-pipeline-state --name VoltDashboardPipeline --region us-east-1

# 3. View live logs
aws codepipeline start-pipeline-execution --pipeline-name VoltDashboardPipeline --region us-east-1
```

### Current Setup

- ✅ CodeConnection: AVAILABLE (authenticated with GitHub)
- ✅ Pipeline: Configured for automatic webhook triggers
- ✅ CDK Bootstrap: Updated with pipeline role trust
- ✅ Buildspecs: Committed to repository (required for CodeBuild)

## Buildspec Files

All buildspecs are in the `buildspecs/` directory and are referenced by CodeBuild projects:

- `buildspecs/lint_type.yml` - ESLint & TypeScript
- `buildspecs/unit_tests.yml` - Jest unit tests
- `buildspecs/frontend_build.yml` - React build with legacy-peer-deps
- `buildspecs/deploy_frontend.yml` - CDK deploy + S3 sync + CloudFront invalidation

## Important Notes

1. **Build Output Path**: The pipeline expects `build/` directory from React build (Create React App default)

2. **NODE_OPTIONS**: The deploy buildspec sets `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with react-scripts 3.4.3

3. **Frontend Deployment**: 
   - Stack: `VoltReactDashboardFrontend-prod`
   - S3 Bucket: `voltreactdashboardfrontend-preview-jairosp-content-295685`
   - CloudFront: Invalidation automatically triggered after sync

4. **Environment Variables**:
   - Set in buildspecs (not in pipeline action configuration)
   - ENVIRONMENT=prod in deploy stage

## Monitoring

### Pipeline Status
```bash
aws codepipeline get-pipeline-state --name VoltDashboardPipeline
```

### Build Logs
```bash
# List log groups
aws logs describe-log-groups --query 'logGroups[?contains(logGroupName, `codebuild`)].logGroupName' --region us-east-1

# Tail logs
aws logs tail /aws/codebuild/VoltDashboard-FrontendBuild --follow
```

### Pipeline Execution Details
```bash
EXEC_ID=$(aws codepipeline list-pipeline-executions \
  --pipeline-name VoltDashboardPipeline \
  --query 'pipelineExecutionSummaries[0].pipelineExecutionId' \
  --output text)

aws codepipeline get-pipeline-execution \
  --pipeline-name VoltDashboardPipeline \
  --pipeline-execution-id $EXEC_ID
```

## Next Steps

1. **Push to main branch** to trigger the pipeline:
   ```bash
   git push origin main
   ```

2. **Monitor execution** in the CodePipeline console or via CLI

3. **Verify deployment** by checking CloudFormation outputs:
   ```bash
   aws cloudformation describe-stacks \
     --stack-name VoltReactDashboardFrontend-prod \
     --region us-east-1
   ```

## Troubleshooting

### Pipeline Failed at Source Stage
- Check CodeConnection status: `AVAILABLE` required
- Verify branch name matches pipeline configuration: `main`
- Check repository permissions in GitHub

### Build Failed
- Check CloudWatch logs: `/aws/codebuild/VoltDashboard-*`
- Verify buildspec files exist in repository at `buildspecs/*.yml`
- Common issues: npm dependency conflicts (resolved with --legacy-peer-deps)

### Deployment Failed
- Verify CDK bootstrap trust policies
- Check S3 bucket exists and role has permissions
- Verify CloudFront distribution ID matches

## Stack Outputs

### Pipeline Stack
- PipelineName: VoltDashboardPipeline
- BuildRoleArn: arn:aws:iam::763835214576:role/VoltReactDashboardPipelineStack-BuildRoleA9A369DE-XnOK7Aysib2j
- DeployRoleArn: arn:aws:iam::763835214576:role/VoltReactDashboardPipelineStack-DeployRole8C803698-RpWacdt1NLQQ

### Frontend Stack (Production)
- WebsiteURL: https://d3co5j0i9nbeqn.cloudfront.net
- BucketName: voltreactdashboardfrontend-preview-jairosp-content-295685
- DistributionId: E10MIDYXWBDIDU

