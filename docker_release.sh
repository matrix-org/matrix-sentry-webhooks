#!/usr/bin/env bash

set -e

if [[ -z "$1" ]]; then
    tag=latest
else
    tag=$1
fi

docker login
docker build -t matrixdotorg/matrix-sentry-webhooks:${tag} .
docker push matrixdotorg/matrix-sentry-webhooks:${tag}

if [[ "$tag" == "latest" ]]; then
    exit
fi

docker tag matrixdotorg/matrix-sentry-webhooks:${tag} matrixdotorg/matrix-sentry-webhooks:latest
docker push matrixdotorg/matrix-sentry-webhooks:latest
