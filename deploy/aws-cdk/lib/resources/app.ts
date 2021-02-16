import * as ec2 from "@aws-cdk/aws-ec2";
import { Stack } from "@aws-cdk/core";
import { AppConfig } from "../../config/config";
import * as iam from "@aws-cdk/aws-iam";
import * as ecs from "@aws-cdk/aws-ecs";
import * as logs from "@aws-cdk/aws-logs";
import * as cdk from "@aws-cdk/core";
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";

export interface AppServiceProperties {
  vpc: ec2.Vpc;
  config: AppConfig;
  stack: Stack;
  cluster: ecs.Cluster;
  dbInstanceEndpointAddress: string;
  dbInstanceEndpointPort: string;
  taskRole: iam.Role;
}

export class AppService {
  constructor(private props: AppServiceProperties) {
    const boilerplateSecurityGroup = new ec2.SecurityGroup(props.stack, "boilerplateSecurityGroup", {
      allowAllOutbound: true,
      securityGroupName: "boilerplateSecurityGroup",
      vpc: props.vpc,
    });

    boilerplateSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(1337));

    const boilerplateTaskDefinition = new ecs.FargateTaskDefinition(props.stack, "boilerplateTaskDef", {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: props.taskRole,
    });

    const boilerplateLogGroup = new logs.LogGroup(props.stack, "boilerplateLogGroup", {
      logGroupName: "/ecs/express-boilerplate/app",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const boilerplateLogDriver = new ecs.AwsLogDriver({
      logGroup: boilerplateLogGroup,
      streamPrefix: "boilerplate",
    });

    const apiImage = new DockerImageAsset(props.stack, "boilerplate", {
      directory: "../..",
      file: "docker/prod/Dockerfile",
    });

    const boilerplateContainer = boilerplateTaskDefinition.addContainer("boilerplateContainer", {
      image: ecs.ContainerImage.fromDockerImageAsset(apiImage),
      environment: {
        REDIS_URL: `redis://redis.${props.config.appDomain}:${props.config.redis.port}/1`,
        RDS_HOSTNAME: props.dbInstanceEndpointAddress,
        RDS_PORT: props.dbInstanceEndpointPort,
        RDS_DB_NAME: "app",
        RDS_USERNAME: "postgres",
        RDS_PASSWORD: "password",
        APP_NAME: "express-boilerplate",
        RAD_SECURITY_HOSTNAME: "localhost",
        RAD_SECURITY_PORT: "50050",
        AUTH_API_KEY: "b6cfcd8f-db8e-2cb5-cb34-e1a8900067fe",
      },
      logging: boilerplateLogDriver,
    });

    boilerplateContainer.addPortMappings({
      containerPort: 1337,
    });

    const boilerplateService = new ecs.FargateService(props.stack, "boilerplateService", {
      cluster: props.cluster,
      taskDefinition: boilerplateTaskDefinition,
      desiredCount: 2,
      securityGroup: boilerplateSecurityGroup,
    });

    const boilerplateLB = new elbv2.ApplicationLoadBalancer(props.stack, "external", {
      vpc: props.vpc,
      internetFacing: true,
    });

    const boilerplateListener = boilerplateLB.addListener("boilerplateListener", {
      port: 80,
      open: true,
    });

    boilerplateListener.addTargets("boilerplateTargetGroup", {
      port: 80,
      healthCheck: {
        path: "/health",
      },
      targets: [
        boilerplateService.loadBalancerTarget({
          containerName: boilerplateContainer.containerName,
          containerPort: 1337,
        }),
      ],
    });

    this.loadBalancerDnsName = boilerplateLB.loadBalancerDnsName;
  }

  public loadBalancerDnsName = "";
}
