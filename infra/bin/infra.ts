#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { execSync } from "child_process";
import { FrontendStack } from "../lib/stacks/frontend-stack";
import { PipelineStack } from "../lib/stacks/pipeline-stack";

const app = new cdk.App();

// Context values
const codeConnectionArn = app.node.tryGetContext("codeConnectionArn");
const repositoryName = app.node.tryGetContext("repositoryName") || "themesberg/volt-react-dashboard";
const branchName = app.node.tryGetContext("branchName") || "deploy-to-aws-3";

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || "us-east-1";

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
const buildOutputPath = app.node.tryGetContext("buildPath") || "../build";

// Deploy existing stacks directly (for local dev or preview environments)
if (!codeConnectionArn) {
  // Create frontend stack
  new FrontendStack(app, `VoltReactDashboardFrontend-${environment}`, {
    env: { account, region },
    environment,
    buildOutputPath,
    description: `Static website hosting - ${environment}`,
    // Enable termination protection for production
    terminationProtection: environment === "prod",
  });
}

// Deploy Pipeline (when codeConnectionArn is provided)
if (codeConnectionArn) {
  new PipelineStack(app, "VoltReactDashboardPipelineStack", {
    env: { account, region },
    description: "CI/CD Pipeline for VoltReactDashboard",
    codeConnectionArn,
    repositoryName,
    branchName,
    terminationProtection: true,
  });
}

// Global tags
cdk.Tags.of(app).add("Project", "VoltReactDashboard");
cdk.Tags.of(app).add("ManagedBy", "CDK");
cdk.Tags.of(app).add("Environment", environment);
