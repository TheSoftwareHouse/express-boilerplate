import * as cdk from '@aws-cdk/core';

export interface AwsCdkProps {
  // Define construct properties here
}

export class AwsCdk extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: AwsCdkProps = {}) {
    super(scope, id);

    // Define construct contents here
  }
}
