import * as ec2 from "@aws-cdk/aws-ec2";
import { Stack } from "@aws-cdk/core";
import { AppConfig } from "../../config/config";
import * as cdk from "@aws-cdk/core";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  StorageType,
} from "@aws-cdk/aws-rds";

export interface PostgresRdsServiceProperties {
  vpc: ec2.Vpc;
  config: AppConfig;
  stack: Stack;
}

export class PostgresRdsService {
  public readonly postgresRDSInstance: DatabaseInstance;

  constructor(private props: PostgresRdsServiceProperties) {
    const postgresRDSSecurityGroup = new ec2.SecurityGroup(props.stack, "postgresRDSSecurityGroup", {
      allowAllOutbound: true,
      securityGroupName: "postgresRDSSecurityGroup",
      vpc: props.vpc,
    });

    this.postgresRDSInstance = new DatabaseInstance(props.stack, "postgres-rds-instance", {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_12_4,
      }),
      vpc: props.vpc,
      storageEncrypted: true,
      multiAz: false,
      autoMinorVersionUpgrade: props.config.postgresRds.autoMinorVersionUpgrade,
      allocatedStorage: props.config.postgresRds.allocatedStorage,
      storageType: StorageType.GP2,
      backupRetention: cdk.Duration.days(props.config.postgresRds.backupRetention),
      deletionProtection: false,
      databaseName: props.config.postgresRds.databaseName,
      credentials: Credentials.fromPassword(
        props.config.postgresRds.username,
        cdk.SecretValue.plainText(props.config.postgresRds.password),
      ),
      port: props.config.postgresRds.port,
      securityGroups: [postgresRDSSecurityGroup],
    });
  }
}
