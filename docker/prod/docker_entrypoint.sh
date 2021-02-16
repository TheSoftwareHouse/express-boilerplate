#!/usr/bin/env sh
#if [ "${LOCALDOMAIN}" != ""  ]; then echo "search ${LOCALDOMAIN}" >> /etc/resolv.conf; fi

NODE_ENV=production node /app/build/src/index.js
#case "$1" in
#    'api')
#        NODE_ENV=production node /app/build/src/index.js
#    ;;
#    *)
#    exec "$@"
#esac
#
#exit 0
