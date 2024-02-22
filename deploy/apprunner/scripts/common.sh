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

function isRunning() {
    [ "true" = "$(jq '.Service.Status == "RUNNING"')" ]
}

function isError() {
    [ "true" = "$(jq '.Service.Status == "CREATE_FAILED"')" ]
}

function describe() {
    DESCRIPTION=$(aws apprunner describe-service --service-arn $APP_RUNNER_ARN --region $AWS_REGION)
    cat <<<$DESCRIPTION
}

function waitForDeployment() {
    TIMEOUT=300
    INTERVAL=10
    START_TIME=$(now)

    while true; do
        SERVICE=$(describe)
        ELAPSED=$(( $(now) - START_TIME ))
        log "Wait for deployment. Elapsed: $ELAPSED seconds"
        if isRunning <<<$SERVICE; then
            return 0
        elif isError <<<$SERVICE; then
            log "The service failed to create"
            return 1
        elif (( ELAPSED > TIMEOUT )); then
            log "Timeout $TIMEOUT seconds. (actual: $ELAPSED)"
            return 1
        else
            sleep $INTERVAL
        fi
    done
}

function buildAndPushDockerImage() {
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR_URL
    docker build -t $AWS_ECR_URL:$BITBUCKET_COMMIT -f ./docker/prod/Dockerfile .
    docker push $AWS_ECR_URL:$BITBUCKET_COMMIT
}
