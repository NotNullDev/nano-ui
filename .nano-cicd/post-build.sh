CI_COMMIT_SHA=$(git rev-parse --short HEAD)

docker tag $CONTAINER_REGISTRY_URL/$CONTAINER_REGISTRY_USERNAME/$APP_NAME:latest $CONTAINER_REGISTRY_URL/$CONTAINER_REGISTRY_USERNAME/$APP_NAME:$CI_COMMIT_SHA

docker push $CONTAINER_REGISTRY_URL/$CONTAINER_REGISTRY_USERNAME/$APP_NAME:latest
docker push $CONTAINER_REGISTRY_URL/$CONTAINER_REGISTRY_USERNAME/$APP_NAME:$CI_COMMIT_SHA

echo $BASE_64_ENV_FILE | base64 -d > .env