#!/bin/bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR_URL
docker build -t $AWS_ECR_URL:$BITBUCKET_COMMIT -f ./docker/prod/Dockerfile .
docker push $AWS_ECR_URL:$BITBUCKET_COMMIT