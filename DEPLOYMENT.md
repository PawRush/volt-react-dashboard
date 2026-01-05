# Deployment Summary

Your app is deployed to AWS with a preview URL that doesn't change when you update code, so you can share this link with others.

**Live URL:** https://d2gbabtd2x0uia.cloudfront.net

To redeploy after changes: `./scripts/deploy.sh`

Services used: S3, CloudFront, Lambda (for deployment), CloudFormation, IAM

Questions? Ask follow-ups like:
- What resources were deployed to AWS?
- How do I set up a custom domain?
- How do I set up CI/CD with CodePipeline?

---

## Deployment Details

| Resource | Value |
|----------|-------|
| Stack Name | VoltDashFrontend-preview-sergeyka |
| S3 Bucket | voltdashfrontend-preview-sergeyka-625164594347 |
| CloudFront Distribution | E1LKDAD8SSRR4O |
| Region | us-east-1 |

## Commands

```bash
# Deploy to preview environment
./scripts/deploy.sh

# Deploy to dev/prod
./scripts/deploy.sh dev
./scripts/deploy.sh prod

# Destroy resources
cd infra && npx cdk destroy --all

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E1LKDAD8SSRR4O --paths "/*"
```
