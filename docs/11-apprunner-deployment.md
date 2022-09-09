## Apprunner

This section contains alternative way of deploying the project
using AWS thing called [App Runner](https://aws.amazon.com/apprunner/).

In order to deploy the entire express-boilerplate via App Runner CLI,
we need to configure a couple of things in advance.

*All the files that are being referenced here can be found inside `deploy/apprunner/` directory*

*By default App Runner is configured to NOT be auto deployed.*

## Pre-deployment requirements

In order to be able to setup the App Runner we need to have IAM role and VPC Connector created. In some cases you will have those already created instead.

You also have to have necessary environment variables set:
- AWS_REGION - a region you want to deploy to
- AWS_ECR_URL - an URL to ECR you wan to push docker images to
- AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID - a secret key and id of your AWS account

### Creating IAM role for App Runner

Now, we need to create a role that can be used by App Runner.
The role needs to have List & Read access to private ECR where our
docker image will be hosted.

Let's start by creating a role itself with a trust policy for App Runner:

```bash
aws iam create-role --role-name app-runner-ecr-access-role --assume-role-policy-document file://apprunner-trust-policy.json
```

Since we have a role, now we can attach the proper policy to it:

```bash
aws iam put-role-policy --role-name app-runner-ecr-access-role --policy-name AllowReadAccessToEcr --policy-document file://allow-read-acces-to-ecr-policy.json
```

### Creating VPC Connector Profile

Lastly, we have to create something called VPC Connector Profile.
This thingy will enable our service sending outgoing messages 
to resources that sit inside VPC. In our case those are RDS and ElastiCache
which should sit inside private subnets

Grab all the subnets IDs of a VPC where RDS and ElastiCache sit and hit the below command. 

```bash
aws apprunner create-vpc-connector --vpc-connector-name dummy-vpc-connector --subnets <space separated list of all subnets IDs inside VPC>
```

## Deployment and environment creation

Boilerplate comes with CI/CD set for App Runner deployment. As long as you have a IAM Role and VPC Connector, you're free to use it.

For that you need to set required environment variables:
- APP_RUNNER_IAM_ROLE_ARN - ARN of created IAM role for app runner Deployment
- APP_RUNNER_VPC_CONNECTOR_ARN - ARN of vpc connector for app runner Deployment
- ENVIRONMENT_NAME - Unique environment name for example my-app-staging

You also need to have an ARN of an actual App Runner instance, but this is created after the environment creation.

Also remember to:
- create private repository (ECR) and set proper AWS_ECR_URL environment,
- set your AWS credentials:
  - AWS_SECRET_ACCESS_KEY
  - AWS_ACCESS_KEY_ID

    which are used to auto sign-in (AWS CLI detects these variables names).


### Environment creation

By default, we are set to create staging environment in form of create-staging custom job in bitbucket pipelines. This will build the App Runner instance and return its ARN. That ARN has to be put as value of APP_RUNNER_ARN environemnt variable.

#### Environment Deploy

After environment is created you're free to use deploy-staging BB job.