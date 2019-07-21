#!/usr/bin/env sh
case "$1" in
    'api')
        node /app/build/src/index.js
    ;;
    *)
    exec "$@"
esac

exit 0
