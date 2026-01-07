#!/bin/bash
set -e

ENVIRONMENT="${1:-preview-$(whoami)}"
WITH_ASSETS="${WITH_ASSETS:-true}"

if [[ "$ENVIRONMENT" != "prod" ]]; then
    export overrideWarningsEnabled=false
fi

echo "Starting AWS CDK deployment to environment: $ENVIRONMENT"

if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "AWS CLI not configured. Run 'aws configure' first."
    exit 1
fi

if [ "$WITH_ASSETS" = "true" ]; then
    echo "Building frontend..."
    npm run build
fi

echo "Installing CDK dependencies..."
cd infra
npm install --no-progress
npm run build

echo "Bootstrapping CDK..."
npx cdk bootstrap --progress events

echo "Deploying CDK stacks..."
DEPLOY_CMD=(npx cdk deploy --all --context "environment=$ENVIRONMENT" --require-approval never --progress events)

if [ "$WITH_ASSETS" = "false" ]; then
    DEPLOY_CMD+=(--context withAssets=false)
fi

if [[ "$ENVIRONMENT" == "preview-"* ]]; then
    DEPLOY_CMD+=(--hotswap-fallback)
fi

"${DEPLOY_CMD[@]}"

FRONTEND_URL=$(aws cloudformation describe-stacks \
    --stack-name "VoltDashFrontend-${ENVIRONMENT}" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

echo ""
echo "Deployment complete!"
echo "Frontend URL: $FRONTEND_URL"
