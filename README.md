# Distributed Task Scheduler

Este projeto é um protótipo de um escalonador distribuído de tarefas que permite agendar tarefas de execução única e recorrente. As tarefas são executadas (registradas) dentro de 10 segundos do horário agendado. O sistema é construído com backend em Node.js/Express e frontend em React utilizando TypeScript.

## Funcionalidades

- **Tarefas One-Time**: Agende tarefas para execução em um horário específico (formato ISO).
- **Tarefas Recorrentes**: Agendamento usando sintaxe cron.
- **Gerenciamento de Tarefas**: Criação, listagem, edição e remoção de tarefas.
- **Logs de Execução**: Visualize os logs de execução com data/hora e payload.
- **Projeto Escalável**: Arquitetura simples, preparada para escalabilidade e alta disponibilidade.

## Estrutura do Projeto
tasker/ <br>
├── api/
│   ├── Dockerfile<br>
│   ├── package.json<br>
│   ├── tsconfig.json<br>
│   └── src/<br>
│       ├── @types/<br>
│           ├── express/<br>
│           ├──── index.d.ts/<br>
│       ├── Logs/<br>
│           ├── services/<br>
│           ├──── logService/<br>
│       ├── Worker/<br>
│           ├── worker.ts/<br>
│       ├── Task/<br>
│           ├── controllers/<br>
│           │   └── taskController.ts<br>
│           ├── models/<br>
│           │   └── Task.ts<br>
│           ├── services/<br>
│           │   └── taskHandler.ts<br>
│           │   └── taskScheduler.ts<br>
│       ├── utils/<br>
│           └── cronParser.ts<br>
│       ├── index.ts<br>
│       ├── app.ts<br>
│       ├── routes.ts<br>
├── web/<br>
│   ├── Dockerfile<br>
│   ├── package.json<br>
│   ├── tsconfig.json<br>
│   ├── public/<br>
│   │   └── index.html<br>
│   └── src/<br>
│       ├── index.tsx<br>
│       ├── App.tsx<br>
│       └── components/<br>
│           ├── TaskForm.tsx<br>
│           ├── TaskList.tsx<br>
│           └── ExecutionLog.tsx<br>
├── design-doc.md<br>
├── docker-compose.yml<br>
└── README.md<br>



## Pré-requisitos

- [Docker](https://www.docker.com/) instalado.
- [Docker Compose](https://docs.docker.com/compose/) instalado.
- [Makefile](https://www.gnu.org/software/make/manual/make.html) opcional.
- [Kubernetes](https://kubernetes.io/) opcional.

## Executando a Aplicação
- Clone esse repositorio;
- Crie um arquivo `builder/.env` com o mesmo conteudo do `builder/.env.example`;

**Comandos principais:**
- Subindo com docker compose
```bash
docker compose -f builder/docker/docker-compose.yml --env-file builder/.env up --build
```
- Usando comandos Makefile
```bash
# inicia aplicação
make all

# faz build da aplicaçao
make build

# sobe a aplicacao e acompanha os logs
up

# sobe a aplicacao de forma -d
up-silent

# sobe a aplicacao de forma --no-recreate
up-no-recreate

# remove containers
down

# entra no container da api
shell

# acompanha logs
logs

# executa testes api
test-api

# executa teste api de um arquivo 
test-api-file

# executa testes do web
test-web

# executa teste web de um arquivo 
test-web-file

# faz carregamento do docker env com o minikube para execucao em k8s
k8s-load-docker

# desvincula do docker env o minikube para execucao em docker compose
k8s-unload-docker

# aplica arquivos k8s
k8s-apply

# retornar pods k8s
k8s-pods

# conecta local servico web no k8s
k8s-web-port-forward

# conecta local servico api no k8s
k8s-api-port-forward
```

- Usando comandos uteis
```bash
# caso nao queira instalar node e outras dependencias na sua maquina mas ainda quer que sua ide consiga interpretar
# o projeto, basta copiar os node_modules do container apos iniciado
docker cp tasker-api:app/node_modules api/node_modules
docker cp tasker-web:app/node_modules web/node_modules
```

**Usando o projeto:**
Apos iniciado basta acessar a url do front end e utilizar o agendador
```bash
http://localhost:3000
```

**Dois handlers configurados:**
Foram configurados dois handelers simples, um `default` e um `curl`. O `default` apenas printa os logs de execução no
worker, os tipo `curl` fazem uma chamada get caso o payload da task seja uma url valida. Sugestão de payload:
```bash
https://ipinfo.io/json
```

**Virtualizacao:**
O projeto pode ser executado com docker ou k8s, para usar instale o minikube, execute o comando `make k8s-load-docker` e 
depois da vinculação do minikube ao seu docker faça o build e depois rode o comando `make k8s-apply` e veja os pods com
`k8s-pods`.

**Pontos importantes:**
As logicas de negócio foram implementadas nos controllers apenas para simplificar o tempo de desenvolvimento, um 
refactor aqui será necessário.