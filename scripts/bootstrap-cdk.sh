#!/bin/bash
set -e

PIPELINE_STACK_NAME=${1:-"VoltDashPipelineStack"}

echo "CDK Bootstrap with Pipeline Trust"
echo "=================================="

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=${AWS_DEFAULT_REGION:-us-east-1}

echo "Account: $ACCOUNT"
echo "Region: $REGION"

if ! aws cloudformation describe-stacks --stack-name $PIPELINE_STACK_NAME --region $REGION >/dev/null 2>&1; then
  echo "Error: Pipeline stack '$PIPELINE_STACK_NAME' does not exist"
  exit 1
fi

BUILD_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name $PIPELINE_STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`BuildRoleArn`].OutputValue' \
  --output text)

DEPLOY_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name $PIPELINE_STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`DeployRoleArn`].OutputValue' \
  --output text)

echo "BuildRole: $BUILD_ROLE_ARN"
echo "DeployRole: $DEPLOY_ROLE_ARN"

npx cdk bootstrap aws://$ACCOUNT/$REGION \
  --trust $BUILD_ROLE_ARN \
  --trust $DEPLOY_ROLE_ARN \
  --cloudformation-execution-policies "arn:aws:iam::aws:policy/AdministratorAccess"

echo ""
echo "CDK bootstrap completed successfully"
