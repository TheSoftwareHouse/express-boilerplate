## Elastic Beanstalk Deploment

Elastic Beanstalk is an AWS service allowing you to deploy your app easier (https://aws.amazon.com/elasticbeanstalk/).

This boilerplate is configured to work with EB after a simple configuration.

EB deployment requires few things to be pre-configured:
- you need to have AWS account
- you need to have AWS Access Key and AWS Secret Key for 
programming (API) access to AWSCLI (ask your administrator for one)
- you need to have AWS CLI and EB CLI installed (https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html, https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- you need to either create your own AWS Policy for Elastic Beanstalk or attach additional policy to EBS Role (https://stackoverflow.com/a/61729693)

Since our boilerplate is docker based we will need an registry. AWS offers a service called ECR that will work for us. Create one following this guide (https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html).

Remember to save repository url - we will need it.

Go to deploy/elastic-beanstalk directory - this is where the whole EB configuration is available.

First we need to create an application. We're going to use so called "Multi-container" platform. This will allows us to host multiple docker containers on single EC2 instance.

```
eb init --region eu-west-1 --platform "Multi-container Docker running on 64bit Amazon Linux" <APP_NAME>
```

If you're using out bitbucket pipeline setting remember to set APP_NAME variable on repository settings.

Now we need to create environemnt. We're going with a cheapest one:
- single instance
- no load balancer
- smallest RDS instance
- smallest EC2 instance

In order to do that you need to run:

```
eb create <unique-environment-name> --database --database.engine postgres --database.password <RDS_PASSWORD> --database.username <RDS_USERNAME> --envvars REDIS_URL=redis://redis:6379/1,APP_NAME=<APP_NAME> --instance_type t2.micro --elb-type classic --min-instances 1 --max-instances 1
```

Once again, if you're using Bitbucket remember to set proper environment variables.

So far we created an application and staging environemnt. OF course you can create more environments if necessary.

The only thing that left is to build production docker image and push it to ECR.

First we need to build an image. You can do that by typing:

```
docker build -t <AWS_ECR_URL>:<VERSION_TAG> -f ./docker/prod/Dockerfile .
````

Remember to run this command on root level of boilerplate.

Now we need to login into the ECR. This will require AWS Access Key and AWS Secret Key.

Let's configure our AWS CLI:

```
aws --profile default configure set aws_access_key_id <AWS_ACCESS_KEY_ID>
aws --profile default configure set aws_secret_access_key <AWS_SECRET_ACCESS_KEY>
```

Once again, if you're using Bitbucket remember to set proper environment variables.

Now we need to get ECR credentials. You can do that with a simple command:

```
aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <AWS_ECR_URL>
```

The only thing that left is to push our image to the registry.

```
docker push <AWS_ECR_URL>:<VERSION_TAG>
```

To deploy your code you should go to deploy/elastic-beanstalk directory and just type:

```
eb deploy <name_of_an_environment>
```

### Debugging

If for some reason you'd like to have access to the isntance. Tha you can type:

```
eb ssh
```

Docker is available only for root user. You can switch to one using:

```
sudo su
```

### Maintenance

We're using Multi-container platform, meaning we're bound to Dockerrun V2 syntax.

Read more about it on: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_v2config.html

### Bitbucket environmental variables

If you are using Bitbucket and you would like to pass an environmental variable that contains special characters to your EB environment, please keep in mind that:
1. EB has some limitations over possible characters - please see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html#environments-cfg-softwaresettings-console
2. you will have to pass the variable to EB using the following syntax: `"${KEY_NAME}"`, e.g. `eb create hello-world --envvars SIMPLE_KEY=$SIMPLE_KEY,SPECIAL_KEY="${SPECIAL_KEY}"`
