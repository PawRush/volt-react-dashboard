#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { execSync } from "child_process";
import { FrontendStack } from "../lib/stacks/frontend-stack";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

// Environment detection
const getDefaultEnvironment = (): string => {
  try {
    const username = process.env.USER || execSync("whoami").toString().trim();
    return `preview-${username}`;
  } catch {
    return "preview-local";
  }
};

const environment = app.node.tryGetContext("environment") || getDefaultEnvironment();
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || "us-east-1";

// Pipeline configuration
const codeConnectionArn = app.node.tryGetContext("codeConnectionArn");
const repositoryName = app.node.tryGetContext("repositoryName") || "PawRush/volt-react-dashboard";
const branchName = app.node.tryGetContext("branchName") || "main";
const pipelineOnly = app.node.tryGetContext("pipelineOnly") === "true";

// Detect build output path
const buildOutputPath = app.node.tryGetContext("buildPath") || "../build";

// Create infrastructure stacks only if not pipeline-only mode
if (!pipelineOnly) {
  new FrontendStack(app, `VoltReactDashboardFrontend-${environment}`, {
    env: { account, region },
    environment,
    buildOutputPath,
    description: `Volt React Dashboard static website hosting - ${environment}`,
  });
}

// Create pipeline stack if CodeConnection ARN is provided
if (codeConnectionArn) {
  new PipelineStack(app, "VoltReactDashboardPipelineStack", {
    env: { account, region },
    description: "CI/CD Pipeline for Volt React Dashboard",
    codeConnectionArn,
    repositoryName,
    branchName,
  });
} else if (pipelineOnly) {
  console.warn("⚠️  CodeConnection ARN not provided. Pipeline stack will not be created.");
  console.warn("   Use: --context codeConnectionArn=arn:aws:codeconnections:...");
}

// Global tags
cdk.Tags.of(app).add("Project", "VoltReactDashboard");
cdk.Tags.of(app).add("ManagedBy", "CDK");
if (!pipelineOnly) {
  cdk.Tags.of(app).add("Environment", environment);
}
