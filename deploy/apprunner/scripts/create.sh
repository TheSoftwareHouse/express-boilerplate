#!/bin/bash

source "$(dirname $0)/common.sh"

APP_RUNNER_ARN=""

function create() {
    buildAndPushDockerImage
    envsubst < ./deploy/apprunner/service-configuration.template.json > service-configuration.json
    STATUS=$(aws apprunner create-service --cli-input-json file://service-configuration.json --region $AWS_REGION)
    APP_RUNNER_ARN=$(jq --raw-output '.Service.ServiceArn' <<<$STATUS)

    if [[ $APP_RUNNER_ARN == "" ]]; then
      die "The service failed to create"
    fi

    log "***** ***** ***** ***** ***** ***** ***** ***** *****"
    log "ARN: $APP_RUNNER_ARN"
    log "USE THIS ARN AS ENV VARIABLE WITH NAME APP_RUNNER_ARN"
    log "***** ***** ***** ***** ***** ***** ***** ***** *****"
}

create && waitForDeployment && log "Creation finished." || die "Create didn't succeed."
