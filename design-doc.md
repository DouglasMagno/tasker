# Design Document: Distributed Task Scheduler

## Overview
Este sistema é um escalonador distribuído de tarefas que permite aos clientes agendar tarefas para execução única ou recorrente (usando sintaxe cron). O protótipo é construído em TypeScript com backend em Node.js/Express e frontend em React. As tarefas são registradas (logadas) após a execução, e podem ser gerenciadas (criação, edição, exclusão) via interface.

## Arquitetura do Sistema
### Componentes
1. **Backend API Server**:
    - **Gerenciamento de Tarefas**: Endpoints REST para criação, atualização, remoção e listagem de tarefas.
    - **Serviço de Agendamento**: Um serviço que monitora e executa as tarefas usando timers e análise de expressões cron para tarefas recorrentes.
    - **Registro de Execuções**: Cada execução é logada com timestamp e detalhes do payload.
    - **Armazenamento em RedisDB**: Para o protótipo, as tarefas e logs são mantidos no RedisDB, sendo necessário uma configuração de volume para persistencia dos dados.).

2. **Frontend UI**:
    - **Formulário de Tarefas**: Permite criar tarefas (one-time e recorrentes).
    - **Lista de Tarefas**: Exibe as tarefas agendadas, com opções de edição e remoção.
    - **Visualização dos Logs**: Exibe os registros de execução das tarefas.
    - Comunica-se com o backend via requisições REST.

### Comunicação
- **HTTP/REST**: Comunicação entre frontend e backend.
- **Comunicação Interna**: No protótipo, o agendamento é feito de forma distribuído, filas de mensagens (Bullmq).

## Decisões de Design
1. **Simplicidade e Durabilidade**:
    - Armazenamento no RedisDB para simplificar o protótipo. Em produção, um banco de dados persistente é importante.

2. **Agendamento de Tarefas**:
    - **One-time**: Agendadas com base em uma data/hora exata.
    - **Recurring**: Utiliza o pacote cron-parser para calcular a próxima execução.
    - Após a execução, a tarefa (ou o log) é registrada para consulta.

3. **Alta Disponibilidade e Escalabilidade**:
    - **Backend**: Pode ser escalado horizontalmente com mais replicas.
    - **Durabilidade**: Em dev, o volume do redis garante que nada será perdido, em produção, o uso de banco de dados persistente e filas de mensagens garantirá que nenhuma tarefa seja perdida.
    - **Chokepoints**: O serviço de agendamento e execução podem se tornar gargalos e demandar particionamento ou escalonamento distribuído.

4. **Custo-Efetividade**:
    - Design simplificado com componentes mínimos.
    - Uso de containers (Docker/K8s) para facilitar a orquestração e escalabilidade.

## Trade-offs
- **Armazenamento em Memória vs. Banco de Dados**: O protótipo usa RedisDB para rapidez e simplicidade, mas não é adequado para produção.
- **Processo Único de Agendamento**: Em cenários de alta carga, um escalonador distribuído ou fila de tarefas seria mais apropriado.

## Futuras Melhorias
- Integração com um banco de dados durável.
- Uso de uma fila de mensagens para distribuição de tarefas.
- Implementação de autenticação e autorização.
- Aperfeiçoamento da interface do usuário.
