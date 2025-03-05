# Distributed Task Scheduler

This project is a prototype of a distributed task scheduler that allows scheduling tasks for one-time or recurring execution. Tasks are executed (and logged) within 10 seconds of their scheduled time. The system is built with a backend in Node.js/Express and a frontend in React using TypeScript.

## Features

- **One-Time Tasks**: Schedule tasks for execution at a specific time (ISO format).
- **Recurring Tasks**: Schedule tasks using cron syntax.
- **Task Management**: Create, list, edit, and delete tasks.
- **Execution Logs**: View execution logs with timestamps and payload details.
- **Scalable Project**: A simple architecture designed for scalability and high availability.

## Project Structure

```
tasker/
├── api/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── @types/
│       │   └── express/
│       │       └── index.d.ts
│       ├── Logs/
│       │   └── services/
│       │       └── logService.ts
│       ├── Worker/
│       │   └── worker.ts
│       ├── Task/
│       │   ├── controllers/
│       │   │   └── taskController.ts
│       │   ├── models/
│       │   │   └── Task.ts
│       │   └── services/
│       │       ├── taskHandler.ts
│       │       └── taskScheduler.ts
│       ├── utils/
│       │   └── cronParser.ts
│       ├── index.ts
│       ├── app.ts
│       └── routes.ts
├── web/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.tsx
│       ├── App.tsx
│       └── components/
│           ├── TaskForm.tsx
│           ├── TaskList.tsx
│           └── ExecutionLog.tsx
├── design-doc.md
├── docker-compose.yml
└── README.md
```

## Prerequisites

- [Docker](https://www.docker.com/) installed.
- [Docker Compose](https://docs.docker.com/compose/) installed.
- [Makefile](https://www.gnu.org/software/make/manual/make.html) (optional).
- [Kubernetes](https://kubernetes.io/) (optional).

## Running the Application

- Clone this repository.
- Create a file `builder/.env` with the same content as `builder/.env.example`.

**Main Commands:**
- To bring up the application with Docker Compose:
  ```bash
  docker compose -f builder/docker/docker-compose.yml --env-file builder/.env up --build
  ```
- Using the Makefile commands:
  ```bash
  # start application
  make all

  # build the application
  make build

  # bring up the application and follow logs
  make up

  # bring up the application in detached mode
  make up-silent

  # bring up the application with --no-recreate
  make up-no-recreate

  # remove containers
  make down

  # enter the API container
  make shell

  # follow logs
  make logs

  # run API tests
  make test-api

  # run API tests for a single file
  make test-api-file

  # run web tests
  make test-web

  # run web tests for a single file
  make test-web-file

  # load Docker environment from minikube for Kubernetes deployment
  make k8s-load-docker

  # unload minikube docker env to use docker compose
  make k8s-unload-docker

  # apply Kubernetes manifests
  make k8s-apply

  # list Kubernetes pods
  make k8s-pods

  # port-forward local web service from Kubernetes
  make k8s-web-port-forward

  # port-forward local API service from Kubernetes
  make k8s-api-port-forward
  ```

- **Using the Project:**
  After starting the application, simply access the frontend URL:
  ```bash
  http://localhost:3000
  ```

**Two Handlers Configured:**
Two simple handlers are configured: a `default` and a `curl` handler. The `default` handler only prints the execution logs in the worker, while the `curl` handler makes a GET request if the task payload is a valid URL. Suggested payload example:
```bash
https://ipinfo.io/json
```

**Virtualization:**
The project can be executed either with Docker or Kubernetes. To use Kubernetes, install Minikube, run the command `make k8s-load-docker` to bind Minikube to your Docker environment, build the images, then run `make k8s-apply` and check the pods with `make k8s-pods`.

**Important Points:**
The business logic was implemented in the controllers to expedite development. A refactor will be necessary in the future.

---