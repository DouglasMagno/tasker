CONTAINER_NAME=tasker-api
SERVICE_NAME=tasker-api
DOCKER_COMPOSE=docker compose -f builder/docker/docker-compose.yml --env-file builder/.env

all: build up

build:
	@${DOCKER_COMPOSE} build --pull

up:
	@${DOCKER_COMPOSE} up

up-silent:
	@${DOCKER_COMPOSE} up -d

up-no-recreate:
	@${DOCKER_COMPOSE} up -d --no-recreate

down:
	@${DOCKER_COMPOSE} down

shell:
	@docker exec -it ${CONTAINER_NAME} bash

logs:
	${DOCKER_COMPOSE} logs -f

test-api: up-no-recreate
	${DOCKER_COMPOSE} run --rm ${SERVICE_NAME} npm run test src/tests

test-api-file: up-no-recreate
	${DOCKER_COMPOSE} run --rm ${SERVICE_NAME} npm run test -- "${TEST}"

test-web: up-no-recreate
	${DOCKER_COMPOSE} run --rm tasker-web npm run test src/tests

test-web-file: up-no-recreate
	${DOCKER_COMPOSE} run --rm tasker-web npm run test -- "${TEST}"

k8s-load-docker:
	@eval $(minikube docker-env)

k8s-unload-docker:
	@eval $(minikube docker-env --unset)

k8s-apply: k8s-load-images build
	kubectl apply -f builder/k8s/redis
	kubectl apply -f builder/k8s/api
	kubectl apply -f builder/k8s/web
	kubectl apply -f builder/k8s/worker

k8s-pods:
	kubectl get pods

k8s-web-port-forward:
	kubectl port-forward service/tasker-web-service 3000:80

k8s-api-port-forward:
	kubectl port-forward service/tasker-api-service 5000:80