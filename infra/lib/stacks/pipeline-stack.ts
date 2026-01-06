import * as cdk from "aws-cdk-lib";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as pipelines from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { FrontendStack } from "./frontend-stack";

export interface PipelineStackProps extends cdk.StackProps {
  codeConnectionArn: string;
  repositoryName: string;
  branchName: string;
}

export class PipelineStack extends cdk.Stack {
  public readonly pipeline: pipelines.CodePipeline;

  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const source = pipelines.CodePipelineSource.connection(
      props.repositoryName,
      props.branchName,
      {
        connectionArn: props.codeConnectionArn,
        triggerOnPush: true,
      }
    );

    const synth = new pipelines.ShellStep("Synth", {
      input: source,
      commands: [
        // Quality gates
        "npm ci",
        "npm run lint",

        // Build frontend
        "npm run build",

        // Build and synth CDK
        "cd infra && npm ci",
        "cd infra && npm run build",
        "cd infra && npx cdk synth",
      ],
      primaryOutputDirectory: "infra/cdk.out",
      env: {
        // Disables the ESLint plugin that react-scripts runs during build.
        DISABLE_ESLINT_PLUGIN: "true",
        // In Create React App, when CI=true, warnings are treated as errors and the build fails.
        // Setting it to false allows the build to succeed even with warnings.
        CI: "false",
      },
    });

    this.pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: "VoltDashPipelineV2",
      selfMutation: true,
      pipelineType: codepipeline.PipelineType.V2,
      synth,
      synthCodeBuildDefaults: {
        buildEnvironment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          computeType: codebuild.ComputeType.MEDIUM,
        },
      },
    });

    // Deploy stage
    const deployStage = new cdk.Stage(this, "Deploy", {
      env: { account: this.account, region: this.region },
    });
    new FrontendStack(deployStage, "Frontend", {
      environment: "prod",
      buildOutputPath: "../build",
    });
    this.pipeline.addStage(deployStage);

    cdk.Tags.of(this).add("Stack", "Pipeline");
  }
}
