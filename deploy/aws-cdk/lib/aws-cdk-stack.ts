import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import cdk = require("@aws-cdk/core");
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as iam from "@aws-cdk/aws-iam";
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import * as logs from "@aws-cdk/aws-logs";

const APP_DOMAIN = "tshio";

export class AwsCdkStack extends cdk.Stack {

  private createSecurityGroups(vpc: ec2.Vpc) {
    const redisSecurityGroup = new ec2.SecurityGroup(this, "redisSecurityGroup", {
      allowAllOutbound: true,
      securityGroupName: "redisSecurityGroup",
      vpc: vpc,
    });

    const postgresSecurityGroup = new ec2.SecurityGroup(this, "postgresSecurityGroup", {
      allowAllOutbound: true,
      securityGroupName: "postgresSecurityGroup",
      vpc: vpc,
    });

    const boilerplateSecurityGroup = new ec2.SecurityGroup(this, "boilerplateSecurityGroup", {
      allowAllOutbound: true,
      securityGroupName: "boilerplateSecurityGroup",
      vpc: vpc,
    });


    redisSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(6379));
    postgresSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(5432));
    boilerplateSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(1337));

    return {
      redisSecurityGroup,
      postgresSecurityGroup,
      boilerplateSecurityGroup,
    }
  }

  private createFargateTasks() {
    const taskrole = new iam.Role(this, "ecsTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskrole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy"),
    );

    const redisTaskDefinition = new ecs.FargateTaskDefinition(this, "redisTaskDef", {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: taskrole,
    });

    const postgresTaskDefinition = new ecs.FargateTaskDefinition(this, "postgresTaskDef", {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: taskrole,
    });

    const boilerplateTaskDefinition = new ecs.FargateTaskDefinition(this, "boilerplateTaskDef", {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: taskrole,
    });

    return {
      redisTaskDefinition,
      postgresTaskDefinition,
      boilerplateTaskDefinition,
    }
  }

  private createLogDrivers() {
    const redisLogGroup = new logs.LogGroup(this, "redisLogGroup", {
      logGroupName: "/ecs/express-boilerplate/redis",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const postgresLogGroup = new logs.LogGroup(this, "postgresLogGroup", {
      logGroupName: "/ecs/express-boilerplate/postgres",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const boilerplateLogGroup = new logs.LogGroup(this, "boilerplateLogGroup", {
      logGroupName: "/ecs/express-boilerplate/app",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const redisLogDriver = new ecs.AwsLogDriver({
      logGroup: redisLogGroup,
      streamPrefix: "redis",
    });

    const postgresLogDriver = new ecs.AwsLogDriver({
      logGroup: postgresLogGroup,
      streamPrefix: "postgres",
    });

    const boilerplateLogDriver = new ecs.AwsLogDriver({
      logGroup: boilerplateLogGroup,
      streamPrefix: "boilerplate",
    });

    return {
      redisLogDriver,
      postgresLogDriver,
      boilerplateLogDriver,
    }
  }

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "VPC");

    const { redisSecurityGroup, postgresSecurityGroup, boilerplateSecurityGroup } = this.createSecurityGroups(vpc);

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc,
    });

    cluster.addDefaultCloudMapNamespace({ name: APP_DOMAIN });

    const { redisTaskDefinition, postgresTaskDefinition, boilerplateTaskDefinition } = this.createFargateTasks();

    const { redisLogDriver, postgresLogDriver, boilerplateLogDriver } = this.createLogDrivers();

    const apiImage = new DockerImageAsset(this, "boilerplate", {
      directory: "../..",
      file: "docker/prod/Dockerfile",
    });

    const redisContainer = redisTaskDefinition.addContainer("redisContainer", {
      image: ecs.ContainerImage.fromRegistry("redis:4-alpine"),
      logging: redisLogDriver,
    });

    const postgresContainer = postgresTaskDefinition.addContainer("postgresContainer", {
      image: ecs.ContainerImage.fromRegistry("postgres:12-alpine"),
      environment: {
        POSTGRES_PASSWORD: "password",
        POSTGRES_USERNAME: "postgres",
        POSTGRES_DB: "app",
      },
      logging: postgresLogDriver,
    });

    const boilerplateContainer = boilerplateTaskDefinition.addContainer("boilerplateContainer", {
      image: ecs.ContainerImage.fromDockerImageAsset(apiImage),
      environment: {
        REDIS_URL: `redis://redis.${APP_DOMAIN}:6379/1`,
        RDS_HOSTNAME: `postgres.${APP_DOMAIN}`,
        RDS_PORT: "5432",
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

    redisContainer.addPortMappings({
      containerPort: 6379,
    });

    postgresContainer.addPortMappings({
      containerPort: 5432,
    });

    boilerplateContainer.addPortMappings({
      containerPort: 1337,
    });

    const redisService = new ecs.FargateService(this, "redisService", {
      cluster: cluster,
      taskDefinition: redisTaskDefinition,
      desiredCount: 2,
      securityGroup: redisSecurityGroup,
      cloudMapOptions: {
        name: "redis",
      },
    });

    const postgresService = new ecs.FargateService(this, "postgresService", {
      cluster: cluster,
      taskDefinition: postgresTaskDefinition,
      desiredCount: 2,
      securityGroup: postgresSecurityGroup,
      cloudMapOptions: {
        name: "postgres",
      },
    });

    const boilerplateService = new ecs.FargateService(this, "boilerplateService", {
      cluster: cluster,
      taskDefinition: boilerplateTaskDefinition,
      desiredCount: 2,
      securityGroup: boilerplateSecurityGroup,
    });

    const boilerplateLB = new elbv2.ApplicationLoadBalancer(this, "external", {
      vpc: vpc,
      internetFacing: true,
    });

    const boilerplateListener = boilerplateLB.addListener("boilerplateListener", {
      port: 80,
      open: true,
    });

    const boilerplateTargetGroup = boilerplateListener.addTargets("boilerplateTargetGroup", {
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

    new cdk.CfnOutput(this, "ALBDNS: ", { value: boilerplateLB.loadBalancerDnsName });
  }
}
