#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { execSync } from "child_process";
import { FrontendStack } from "../lib/stacks/frontend-stack";

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

const buildOutputPath = app.node.tryGetContext("buildPath") || "../build";

// Create frontend stack
new FrontendStack(app, `VoltReactDashboardFrontend-${environment}`, {
  env: { account, region },
  environment,
  buildOutputPath,
  description: `Static website hosting - ${environment}`,
  // Enable termination protection for production
  terminationProtection: environment === "prod",
});

// Global tags
cdk.Tags.of(app).add("Project", "VoltReactDashboard");
cdk.Tags.of(app).add("ManagedBy", "CDK");
cdk.Tags.of(app).add("Environment", environment);
