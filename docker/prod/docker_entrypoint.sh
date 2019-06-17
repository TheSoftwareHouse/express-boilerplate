#!/usr/bin/env sh
case "$1" in
    'api')
        node /src/index.js  --configKey percent_api
    ;;
    *)
    exec "$@"
esac

exit 0
