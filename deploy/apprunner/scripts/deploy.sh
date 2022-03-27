#!/bin/bash

source "$(dirname $0)/common.sh"

function deploy() {
    aws apprunner start-deployment --service-arn $APP_RUNNER_ARN --region $AWS_REGION
}

function update() {
    envsubst < ./deploy/apprunner/service-configuration.template.json > service-configuration.tmp.json
    jq 'del(.ServiceName)' service-configuration.tmp.json > service-configuration.json
    aws apprunner update-service --cli-input-json file://service-configuration.json --region $AWS_REGION --service-arn $APP_RUNNER_ARN
}

update && waitForDeployment && log "Update finished." || die "Update didn't succeed."
deploy && waitForDeployment && log "Deployment finished." || die "Deployment didn't succeed."
