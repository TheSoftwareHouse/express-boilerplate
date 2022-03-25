#!/bin/bash

function now() {
    date +%s
}

function die() {
    log "$1"
    exit 1
}

function log() {
    echo "$1" >&2
}

function deploy() {
    aws apprunner start-deployment --service-arn $APP_RUNNER_ARN --region $AWS_REGION
}

function update() {
    cat ./deploy/apprunner/service-configuration.template.json | envsubst > service-configuration-tmp.json
    jq 'del(.ServiceName)' service-configuration-tmp.json > service-configuration.json
    aws apprunner update-service --cli-input-json file://service-configuration.json --region $AWS_REGION --service-arn $APP_RUNNER_ARN
}

function describe() {
    # TODO: change to checked list-operations
    DESCRIPTION=$(aws apprunner describe-service --service-arn $APP_RUNNER_ARN --region $AWS_REGION)
    cat <<<$DESCRIPTION
}

function isRunning() {
    [ "true" = "$(jq '.Service.Status == "RUNNING"')" ]
}

function isError() {
    [ "true" = "$(jq '.Service.Status == "CREATE_FAILED"')" ]
}

function waitForDeployment() {
    TIMEOUT=300
    INTERVAL=10
    START_TIME=$(now)

    while true; do
        SERVICE=$(describe)
        let "ELAPSED=$(now) - START_TIME"
        log "Wait for deployment. Elapsed: $ELAPSED seconds"
        if isRunning <<<$SERVICE; then
            return 0
        elif isError <<<$SERVICE; then
            log "The service failed to create"
            return 1
        elif ((ELAPSED > TIMEOUT)); then
            log "Timeout $TIMEOUT seconds. (actual: $ELAPSED)"
            return 1
        else
            let "COUNT++"
            sleep $INTERVAL
        fi
    done

}

update && waitForDeployment && log "Update finished." || die "Update didn't succeed."
deploy && waitForDeployment && log "Deployment finished." || die "Deployment didn't succeed."
