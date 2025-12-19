import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface CodeBuildRoleProps {
  allowSecretsManager?: boolean;
  allowS3Artifacts?: boolean;
  allowCloudFormation?: boolean;
  allowCdkBootstrap?: boolean;
  additionalPolicies?: iam.PolicyStatement[];
}

export class CodeBuildRole extends Construct {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: CodeBuildRoleProps = {}) {
    super(scope, id);

    this.role = new iam.Role(this, "Role", {
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      description: `CodeBuild role for ${id}`,
    });

    // CloudWatch Logs permissions (always needed)
    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["arn:aws:logs:*:*:*"],
      })
    );

    // S3 artifacts permissions
    if (props.allowS3Artifacts) {
      this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "s3:GetObject",
            "s3:PutObject",
            "s3:ListBucket",
            "s3:GetBucketLocation",
          ],
          resources: ["arn:aws:s3:::*-pipeline-artifacts-*", "arn:aws:s3:::*-pipeline-artifacts-*/*"],
        })
      );
    }

    // Secrets Manager permissions
    if (props.allowSecretsManager) {
      this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret",
          ],
          resources: ["arn:aws:secretsmanager:*:*:secret:*"],
        })
      );
    }

    // CloudFormation permissions
    if (props.allowCloudFormation) {
      this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "cloudformation:DescribeStacks",
            "cloudformation:DescribeStackEvents",
            "cloudformation:GetTemplate",
            "cloudformation:ListStackResources",
          ],
          resources: ["arn:aws:cloudformation:*:*:stack/*"],
        })
      );
    }

    // CDK Bootstrap permissions
    if (props.allowCdkBootstrap) {
      this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "cloudformation:CreateStack",
            "cloudformation:UpdateStack",
            "cloudformation:DeleteStack",
            "s3:CreateBucket",
            "s3:PutBucketVersioning",
            "s3:PutLifecycleConfiguration",
            "s3:PutBucketPolicy",
            "iam:CreateRole",
            "iam:AttachRolePolicy",
            "iam:PutRolePolicy",
          ],
          resources: ["*"],
        })
      );

      // ECR access for CDK
      this.role.addToPrincipalPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:PutImage",
            "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart",
            "ecr:CompleteLayerUpload",
          ],
          resources: ["*"],
        })
      );
    }

    // Additional policies
    if (props.additionalPolicies) {
      props.additionalPolicies.forEach((policy) => {
        this.role.addToPrincipalPolicy(policy);
      });
    }
  }
}

export interface ArtifactsBucketProps {
  bucketNamePrefix?: string;
  retentionDays?: number;
}

export class ArtifactsBucket extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: ArtifactsBucketProps = {}) {
    super(scope, id);

    const account = cdk.Stack.of(this).account;
    const prefix = props.bucketNamePrefix || "voltdashboard";
    const retentionDays = props.retentionDays || 30;

    this.bucket = new s3.Bucket(this, "Bucket", {
      bucketName: `${prefix}-pipeline-artifacts-${account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          id: "DeleteOldVersions",
          noncurrentVersionExpiration: cdk.Duration.days(7),
        },
        {
          id: "DeleteArtifacts",
          expiration: cdk.Duration.days(retentionDays),
          prefix: "artifacts/",
        },
        {
          id: "AbortIncompleteUploads",
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
        },
      ],
    });
  }
}

export class EnvironmentSecrets extends Construct {
  public readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, environment: string) {
    super(scope, id);

    const secretName = `VoltDashboard/${environment}/secrets`;

    this.secret = new secretsmanager.Secret(this, "Secret", {
      secretName,
      description: `Secrets for ${environment} environment`,
    });
  }
}
