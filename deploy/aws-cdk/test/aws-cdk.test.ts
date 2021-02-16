import { expect as expectCDK, matchTemplate, MatchStyle } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as AwsCdk from "../lib/aws-cdk-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsCdk.AwsCdkStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT,
    ),
  );
});
