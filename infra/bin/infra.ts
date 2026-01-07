#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { execSync } from "child_process";
import { FrontendStack } from "../lib/stacks/frontend-stack";
import { PipelineStack } from "../lib/stacks/pipeline-stack";

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION || "us-east-1";

// Pipeline context
const codeConnectionArn = app.node.tryGetContext("codeConnectionArn");
const repositoryName = app.node.tryGetContext("repositoryName") || "PawRush/volt-react-dashboard";
const branchName = app.node.tryGetContext("branchName") || "sergeyka/deploy-to-aws2";

// Deploy existing stacks directly (for local dev or preview environments)
if (!codeConnectionArn) {
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

  new FrontendStack(app, `VoltDashFrontend-${environment}`, {
    env: { account, region },
    environment,
    buildOutputPath,
    description: `Volt React Dashboard - ${environment}`,
    terminationProtection: environment === "prod",
  });

  cdk.Tags.of(app).add("Environment", environment);
}

// Deploy Pipeline (when codeConnectionArn is provided)
if (codeConnectionArn) {
  new PipelineStack(app, "VoltDashPipelineStack", {
    env: { account, region },
    description: "CI/CD Pipeline for VoltDash",
    codeConnectionArn,
    repositoryName,
    branchName,
    terminationProtection: true,
  });
}

cdk.Tags.of(app).add("Project", "VoltDash");
cdk.Tags.of(app).add("ManagedBy", "CDK");
