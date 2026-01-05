import * as cdk from "aws-cdk-lib";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { CodeBuildRole, ArtifactsBucket } from "../constructs/shared-constructs";

export interface PipelineStackProps extends cdk.StackProps {
  codeConnectionArn: string;
  repositoryName: string;
  branchName: string;
}

export class PipelineStack extends cdk.Stack {
  public readonly pipeline: codepipeline.Pipeline;
  public readonly artifactsBucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    this.artifactsBucket = new ArtifactsBucket(this, "ArtifactsBucket").bucket;

    const buildRole = new CodeBuildRole(this, "BuildRole", {
      allowSecretsManager: true,
      allowS3Artifacts: true,
      allowCloudFormation: true,
      allowCdkBootstrap: true,
      additionalPolicies: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["cloudfront:GetDistribution", "cloudfront:GetDistributionConfig"],
          resources: ["*"],
        }),
      ],
    });

    const deployRole = new CodeBuildRole(this, "DeployRole", {
      allowSecretsManager: true,
      allowS3Artifacts: true,
      allowCloudFormation: true,
      allowCdkBootstrap: true,
      additionalPolicies: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["s3:ListBucket", "s3:GetBucketLocation", "s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
          resources: ["arn:aws:s3:::*-frontend-*", "arn:aws:s3:::*-frontend-*/*"],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["cloudfront:CreateInvalidation", "cloudfront:GetDistribution"],
          resources: ["*"],
        }),
      ],
    });

    const frontendBuildProject = new codebuild.PipelineProject(this, "FrontendBuildProject", {
      projectName: "VoltDash-FrontendBuild",
      role: buildRole.role,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspecs/frontend_build.yml"),
    });

    const deployFrontendProject = new codebuild.PipelineProject(this, "DeployFrontendProject", {
      projectName: "VoltDash-DeployFrontend",
      role: deployRole.role,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspecs/deploy_frontend.yml"),
    });

    const artifacts = {
      source: new codepipeline.Artifact("SourceOutput"),
      frontendBuild: new codepipeline.Artifact("FrontendBuildOutput"),
    };

    const [owner, repo] = props.repositoryName.split("/");

    this.pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "VoltDashPipeline",
      pipelineType: codepipeline.PipelineType.V2,
      artifactBucket: this.artifactsBucket,
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.CodeStarConnectionsSourceAction({
              actionName: "Source",
              owner,
              repo,
              branch: props.branchName,
              connectionArn: props.codeConnectionArn,
              output: artifacts.source,
              triggerOnPush: true,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "FrontendBuild",
              project: frontendBuildProject,
              input: artifacts.source,
              outputs: [artifacts.frontendBuild],
            }),
          ],
        },
        {
          stageName: "DeployProd",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "DeployFrontend",
              project: deployFrontendProject,
              input: artifacts.source,
              extraInputs: [artifacts.frontendBuild],
              environmentVariables: {
                ENVIRONMENT: { value: "prod" },
              },
            }),
          ],
        },
      ],
    });

    new cdk.CfnOutput(this, "PipelineName", {
      value: this.pipeline.pipelineName,
      description: "CodePipeline Name",
    });

    new cdk.CfnOutput(this, "BuildRoleArn", {
      value: buildRole.role.roleArn,
      description: "CodeBuild Build Role ARN",
      exportName: `${this.stackName}-BuildRoleArn`,
    });

    new cdk.CfnOutput(this, "DeployRoleArn", {
      value: deployRole.role.roleArn,
      description: "CodeBuild Deploy Role ARN",
      exportName: `${this.stackName}-DeployRoleArn`,
    });

    cdk.Tags.of(this).add("Stack", "Pipeline");
  }
}
