# Design Document: Distributed Task Scheduler

## Overview
This system is a distributed task scheduler that allows clients to schedule tasks for one-time or recurring execution (using cron syntax). The prototype is built in TypeScript with a backend in Node.js/Express and a frontend in React. Tasks are logged after execution and can be managed (created, edited, deleted) through a user interface.

## System Architecture
### Components
1. **Backend API Server**:
   - **Task Management**: REST endpoints for creating, updating, deleting, and listing tasks.
   - **Scheduling Service**: A service that monitors and executes tasks using timers and cron expression parsing for recurring tasks.
   - **Execution Logging**: Each execution is logged with a timestamp and payload details.
   - **Storage in Redis**: For the prototype, tasks and logs are stored in Redis. A volume configuration is required to persist data.

2. **Frontend UI**:
   - **Task Form**: Allows users to create tasks (both one-time and recurring).
   - **Task List**: Displays the scheduled tasks with options to edit or delete them.
   - **Log Viewer**: Shows the execution logs of tasks.
   - The frontend communicates with the backend via REST requests.

### Communication
- **HTTP/REST**: Communication between the frontend and backend.
- **Internal Communication**: In the prototype, scheduling is handled in a distributed manner using message queues (BullMQ).

## Design Decisions
1. **Simplicity and Durability**:
   - Using Redis for storage simplifies the prototype. In production, a persistent database would be critical.

2. **Task Scheduling**:
   - **One-time**: Scheduled based on a specific date/time.
   - **Recurring**: Uses the cron-parser package to calculate the next execution.
   - After execution, the task (or its log) is recorded for later reference.

3. **High Availability and Scalability**:
   - **Backend**: Can be scaled horizontally by increasing replicas.
   - **Durability**: In development, mounting a volume to Redis ensures that data is not lost. In production, using a persistent database and message queues will guarantee that no tasks are lost.
   - **Chokepoints**: The scheduling and execution service might become a bottleneck and may require partitioning or distributed scaling.

4. **Cost-Effectiveness**:
   - A simplified design with minimal components.
   - Use of containers (Docker/Kubernetes) to facilitate orchestration and scalability.

## Trade-offs
- **In-Memory Storage vs. Database**: The prototype uses Redis for speed and simplicity, but this approach is not sufficient for production environments.
- **Single-Process Scheduling**: Under high load, a distributed scheduler or task queue would be more appropriate.

## Future Improvements
- Integration with a durable database.
- Use of a message queue for task distribution.
- Implementation of authentication and authorization.
- Enhancement of the user interface.

---