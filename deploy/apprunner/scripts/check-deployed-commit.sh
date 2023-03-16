#!/bin/bash

source "$(dirname $0)/common.sh"

function checkDeployedCommit() {
    CURRENTLY_DEPLOYED_COMMIT=$(curl "$API_URL/health" | jq '.deployedCommit')
    TARGET_COMMIT="\"$BITBUCKET_COMMIT\""

    if [ "$TARGET_COMMIT" != "$CURRENTLY_DEPLOYED_COMMIT" ]; then
        return 1
    fi
}

apk update && apk add curl jq

checkDeployedCommit && log "A new version of the application was successfully deployed." || die "Deployed commit does not match target commit."
