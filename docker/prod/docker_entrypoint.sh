#!/usr/bin/env sh
case "$1" in
    'api')
        NODE_ENV=production node /app/build/src/index.js
    ;;
    *)
    exec "$@"
esac

exit 0
