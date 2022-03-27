#!/bin/bash

APP_RUNNER_ARN=""

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

function create() {
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR_URL
    docker build -t $AWS_ECR_URL:$BITBUCKET_COMMIT -f ./docker/prod/Dockerfile .
    docker push $AWS_ECR_URL:$BITBUCKET_COMMIT
    cat ./deploy/apprunner/service-configuration.template.json | envsubst > service-configuration.json
    STATUS=$(aws apprunner create-service --cli-input-json file://service-configuration.json --region $AWS_REGION)
    APP_RUNNER_ARN=$(jq --raw-output '.Service.ServiceArn' <<<$STATUS)
    log "ARN: $APP_RUNNER_ARN"
    log "USE THIS ARN AS ENV VARIABLE WITH NAME APP_RUNNER_ARN"
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

create && waitForDeployment && log "Creation finished." || die "Create didn't succeed."
