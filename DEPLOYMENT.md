# Deployment Summary

Your app is deployed to AWS with a CloudFront URL that doesn't change when you update the code. Share this link with others.

**Deployment URL**: https://d2o79eids70vae.cloudfront.net

To connect deployments to GitHub changes, ask your coding agent to `setup a AWS CodePipeline`.

## Services Used

- **S3**: Stores static website files
- **CloudFront**: Global content delivery network (CDN)
- **CloudFormation**: Infrastructure as code management
- **IAM**: Access control

## Deployed Resources

| Resource | Name | Value |
|----------|------|-------|
| Stack | VoltDashFrontend-preview-sergeyka | arn:aws:cloudformation:us-east-1:126593893432:stack/VoltDashFrontend-preview-sergeyka/58f88980-f21a-11f0-8b4f-1264070153fd |
| CloudFront Distribution | ID | EXP9W57I7AWLJ |
| CloudFront Distribution | Domain | d2o79eids70vae.cloudfront.net |
| S3 Website Bucket | Name | voltdashfrontend-preview-se-cftos3s3bucketcae9f2be-y4hmy5q6k5gd |
| S3 Access Logs Bucket | Name | voltdashfrontend-preview--cftos3s3loggingbucket64b-aqghfff622nb |
| CloudFront Logs Bucket | Name | voltdashfrontend-preview--cftos3cloudfrontloggingb-yj9igofa9rmn |

## Quick Commands

```bash
# View deployment status
aws cloudformation describe-stacks \
  --stack-name "VoltDashFrontend-preview-sergeyka" \
  --query 'Stacks[0].StackStatus' \
  --output text

# Invalidate CloudFront cache (clears cached content)
aws cloudfront create-invalidation \
  --distribution-id "EXP9W57I7AWLJ" \
  --paths "/*"

# View CloudFront access logs (last hour)
aws s3 ls "s3://voltdashfrontend-preview--cftos3cloudfrontloggingb-yj9igofa9rmn/" --recursive | tail -20

# Redeploy (rebuild and push to S3/CloudFront)
./scripts/deploy.sh
```

## Production Readiness

For production deployments, consider implementing:

- **WAF Protection**: Add AWS WAF with managed rules (Core Rule Set, Known Bad Inputs) and rate limiting
- **Custom Domain**: Set up Route 53 and ACM certificate for custom domain
- **Monitoring**: CloudWatch alarms for 4xx/5xx errors and CloudFront metrics
- **Security Headers**: Configure Content Security Policy in CloudFront response headers
- **Auth Redirect URLs**: If using an auth provider (Auth0, Supabase, Firebase, etc.), add your CloudFront URL to allowed redirect URLs

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Stale content after deploy | Run `aws cloudfront create-invalidation --distribution-id "EXP9W57I7AWLJ" --paths "/*"` |
| Login redirects to wrong URL | Add CloudFront URL to auth provider's redirect URLs |
| 403 or 404 errors | Ensure SPA routing is configured (error responses point to index.html) |

## Rollback

To remove all deployed resources:

```bash
cd infra
npx cdk destroy --all
```

This will delete:
- CloudFront distribution
- S3 buckets and their contents
- CloudFormation stack
- Associated IAM roles and policies

## Session Log

- **Deployed**: 2026-01-15 14:04 UTC
- **Environment**: preview-sergeyka
- **Framework**: React (Create React App)
- **Deployment Time**: ~5 minutes

---

See `./DEPLOYMENT_PLAN.md` for detailed deployment plan and technical information.
