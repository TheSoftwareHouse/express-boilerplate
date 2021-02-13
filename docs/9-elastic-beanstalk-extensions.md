## Elastic Beanstalk Extensions

Elastic Beanstalk has also advanced configuration options, so called extensions. 

In order to use them you need to create a directory `.ebextensions` inside `docker/elastic-beanstalk` directory. 

Each file ending with `.config` is going to be parsed and used as an extensions source.

The most common use-case is to configure CloudWatch logs and load balancer. Let's start with a load balancing.

### Load Balancer configuration

There are two common changes to load balancer you might want to do.

- changing default healthcheck path
- adding additional ports to be available

The default API config has healthcheck on `/health` endpoint so it is wise to configure your EB deployment to use those. In order to do that let's create `load-balancer.config` file inside `docker/elastic-beanstalk/.ebextensions` directory. 

Every config is an yaml like file.

What we are going to do is to configure values on `option_settings` key.

```
option_settings:
  aws:elasticbeanstalk:application:
    Application Healthcheck URL: /health
  aws:elb:listener:8025:
    ListenerProtocol: HTTP
    InstancePort: 8025
    InstanceProtocol: HTTP  
```

Those are two simple examples of what can be configured. 

`aws:elasticbeanstalk:application` is about configuration of classic load balancer, while `Application Healthcheck URL` allows us to change the healthcheck url.

`aws:elb:listener:8025` is a little bit different. It allows us to configure additional port listeners. In this case we're configuring port `8025`, but general syntax is as follows `aws:elb:listener:<port>`.

You can read more about possible options on https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options.html.

### Logs configuration

The second common extensions are logs. By default EB does not stream logs to CloudWatch. What's more the default configuration does not stream containers logs.

In order to fix that, we need to add additional config - `logs.config`.

This time we need to configure not only `option_settings` to enable logs streaming, but also configure a special file that will contain containers logs.

```
option_settings:
  aws:elasticbeanstalk:cloudwatch:logs:
    StreamLogs: true
    DeleteOnTerminate: false
    RetentionInDays: 30
files:
  "/etc/awslogs/config/stdout.conf":
    mode: "000755"
    owner: root
    group: root
    content: |
      [<container-name>-stdout]
      log_group_name=/aws/elasticbeanstalk/<environment-name>/<container-name>-stdout
      log_stream_name={instance_id}
      file=/var/log/containers/<container-name>-*-stdouterr.log
```

`aws:elasticbeanstalk:cloudwatch:logs:` allows us do configure CloudWatch logs streaming, while `files` allows us to configure a files that will be created on our instances.

For every container we should add additional content definition section.

```
[<container-name>-stdout]
log_group_name=/aws/elasticbeanstalk/<environment-name>/<container-name>-stdout
log_stream_name={instance_id}
file=/var/log/containers/<container-name>-*-stdouterr.log
```

This simple change should put logs into CloudWatch.

`aws:ec2:vpc` allow us to configure VPC settings for our app. For example we could specify what VPC it should use, which Subnets should be used for EC2 isntances, Load Balancer and also if load balancer should be put to public subnet and if we should associate public ips to instances.

```
option_settings:
  aws:ec2:vpc:
    VPCId: vpc-0e144febd1c97a428
    Subnets: subnet-050c76ec846a24a6a
    ELBSubnets: subnet-050c76ec846a24a6a
    AssociatePublicIpAddress: 'true'
    ELBScheme: public
```    

`aws:autoscaling:launchconfiguration` is used to define starting security groups and associated ssh key.

```
option_settings:
  aws:autoscaling:launchconfiguration:
    SecurityGroups: sg-08fe2ef810f4fe01a
    EC2KeyName: some-key-name
```    

You can assign multiple subnets / security groups by separating them with comma.