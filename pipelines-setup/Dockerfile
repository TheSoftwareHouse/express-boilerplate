FROM atlassian/default-image:latest
MAINTAINER Rafał Kucharski <rafal.kucharski@tsh.io>

RUN NODE_VERSION=13.13.4 curl -L https://github.com/docker/compose/releases/download/1.24.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && \
  chmod +x /usr/local/bin/docker-compose