import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import { appConfig } from "../config/config";
import { RedisService } from "./resources/redis";
import { PostgresRdsService } from "./resources/postgres-rds";
import { AppService } from "./resources/app";

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "VPC");

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc,
    });

    cluster.addDefaultCloudMapNamespace({ name: appConfig.appDomain });

    const taskRole = new iam.Role(this, "ecsTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy"),
    );

    new RedisService({
      vpc,
      config: appConfig,
      stack: this,
      cluster,
      taskRole,
    });

    const postgresRds = new PostgresRdsService({
      vpc,
      config: appConfig,
      stack: this,
    });

    const app = new AppService({
      vpc,
      config: appConfig,
      stack: this,
      cluster,
      taskRole,
      dbInstanceEndpointAddress: postgresRds.postgresRDSInstance.dbInstanceEndpointAddress,
      dbInstanceEndpointPort: postgresRds.postgresRDSInstance.dbInstanceEndpointPort,
    });

    new cdk.CfnOutput(this, "ALBDNS: ", { value: app.loadBalancerDnsName });
  }
}
