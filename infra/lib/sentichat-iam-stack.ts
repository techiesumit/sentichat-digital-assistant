import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class SentiChatIamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── GitHub Actions Deploy User ────────────────────────────
    const githubActionsUser = iam.User.fromUserName(
      this, 'GitHubActionsUser', 'github-actions-deploy'
    );

    // ── Lambda Execution Role ─────────────────────────────────
    const lambdaRole = new iam.Role(this, 'SentiChatLambdaRole', {
      roleName: 'SentiChatLambdaRole',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonDynamoDBFullAccess'
        ),
      ],
    });

    // ── GitHub Actions Deploy Policy ──────────────────────────
    const githubDeployPolicy = new iam.ManagedPolicy(
      this, 'GitHubActionsDeployPolicy', {
        managedPolicyName: 'GitHubActionsDeployPolicy',
        description: 'Reusable CI/CD policy for all SentiChat GitHub Actions',
        statements: [
          // Lambda
          new iam.PolicyStatement({
            sid: 'LambdaDeploy',
            effect: iam.Effect.ALLOW,
            actions: [
              'lambda:CreateFunction',
              'lambda:UpdateFunctionCode',
              'lambda:UpdateFunctionConfiguration',
              'lambda:GetFunction',
              'lambda:GetFunctionConfiguration',
              'lambda:PublishVersion',
              'lambda:PublishLayerVersion',
              'lambda:GetLayerVersion',
              'lambda:ListLayerVersions',
              'lambda:AddPermission',
              'lambda:RemovePermission',
              'lambda:ListFunctions',
            ],
            resources: ['*'],
          }),
          // DynamoDB
          new iam.PolicyStatement({
            sid: 'DynamoDBAccess',
            effect: iam.Effect.ALLOW,
            actions: [
              'dynamodb:CreateTable',
              'dynamodb:DescribeTable',
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:ListTables',
            ],
            resources: ['*'],
          }),
          // Lex V2
          new iam.PolicyStatement({
            sid: 'LexV2Access',
            effect: iam.Effect.ALLOW,
            actions: [
              'lexv2-models:*',
              'lex:*',
            ],
            resources: ['*'],
          }),
          // IAM PassRole only (not full IAM)
          new iam.PolicyStatement({
            sid: 'IAMPassRole',
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:PassRole',
              'iam:GetRole',
              'iam:ListRoles',
            ],
            resources: ['*'],
          }),
          // CloudWatch Logs
          new iam.PolicyStatement({
            sid: 'CloudWatchLogs',
            effect: iam.Effect.ALLOW,
            actions: [
              'logs:CreateLogGroup',
              'logs:DescribeLogGroups',
              'logs:PutRetentionPolicy',
            ],
            resources: ['*'],
          }),
        ],
      }
    );

    // ── Attach policy to GitHub Actions user ──────────────────
    githubActionsUser.addManagedPolicy(githubDeployPolicy);

    // ── Outputs ───────────────────────────────────────────────
    new cdk.CfnOutput(this, 'LambdaRoleArn', {
      value: lambdaRole.roleArn,
      description: 'SentiChat Lambda execution role ARN',
      exportName: 'SentiChatLambdaRoleArn',
    });

    new cdk.CfnOutput(this, 'GitHubDeployPolicyArn', {
      value: githubDeployPolicy.managedPolicyArn,
      description: 'GitHub Actions deploy policy ARN',
      exportName: 'GitHubDeployPolicyArn',
    });
  }
}