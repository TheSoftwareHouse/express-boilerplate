#!/bin/bash

source "$(dirname $0)/common.sh"

buildAndPushDockerImage && log "Successfully built and pushed application image to ECR." || die "Building/Uploading of Docker image didn't succeed."
