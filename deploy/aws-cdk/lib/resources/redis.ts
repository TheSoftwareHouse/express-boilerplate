import * as ec2 from "@aws-cdk/aws-ec2";
import { Stack } from "@aws-cdk/core";
import { AppConfig } from "../../config/config";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as logs from "@aws-cdk/aws-logs";
import * as cdk from "@aws-cdk/core";

export interface RedisServiceProperties {
  vpc: ec2.Vpc;
  config: AppConfig;
  stack: Stack;
  cluster: ecs.Cluster;
  taskRole: iam.Role;
}

export class RedisService {
  constructor(private props: RedisServiceProperties) {
    const redisSecurityGroup = new ec2.SecurityGroup(props.stack, "redisSecurityGroup", {
      allowAllOutbound: true,
      securityGroupName: "redisSecurityGroup",
      vpc: props.vpc,
    });

    redisSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(6379));

    const redisTaskDefinition = new ecs.FargateTaskDefinition(props.stack, "redisTaskDef", {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: props.taskRole,
    });

    const redisLogGroup = new logs.LogGroup(props.stack, "redisLogGroup", {
      logGroupName: `${props.config.logPrefix}/redis`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const redisLogDriver = new ecs.AwsLogDriver({
      logGroup: redisLogGroup,
      streamPrefix: "redis",
    });

    const redisContainer = redisTaskDefinition.addContainer("redisContainer", {
      image: ecs.ContainerImage.fromRegistry("redis:4-alpine"),
      logging: redisLogDriver,
    });

    redisContainer.addPortMappings({
      containerPort: 6379,
    });

    new ecs.FargateService(props.stack, "redisService", {
      cluster: props.cluster,
      taskDefinition: redisTaskDefinition,
      desiredCount: 2,
      securityGroup: redisSecurityGroup,
      cloudMapOptions: {
        name: "redis",
      },
    });
  }
}
