# Webhook-Driven Task Processing Pipeline

## 🚀 Overview

This project is a webhook-driven task processing system inspired by tools like Zapier.

It allows users to define **pipelines** that:
- Receive incoming webhooks
- Process the data
- Deliver results to multiple subscribers

The system is designed with **asynchronous processing**, ensuring scalability and reliability.

---

## ⚙️ Features

- ✅ CRUD API for pipelines
- ✅ Webhook ingestion endpoint
- ✅ Background worker for processing jobs
- ✅ Multiple processing actions:
  - `uppercase`
  - `add_timestamp`
  - `filter_field`
- ✅ Retry logic for failed jobs
- ✅ Delivery tracking (per subscriber)
- ✅ PostgreSQL-backed job queue
- ✅ Dockerized setup 
- ✅ CI pipeline using GitHub Actions

---

## 🧱 Architecture

The system consists of three main components:

### 1. API Server (Express + TypeScript)
- Handles HTTP requests
- Creates pipelines
- Receives webhooks
- Stores jobs in the database

### 2. Worker (Background Processor)
- Polls the database for pending jobs
- Processes data based on pipeline action
- Sends results to subscribers
- Handles retries and failures

### 3. Database (PostgreSQL)
Stores:
- pipelines
- subscribers
- jobs
- deliveries

---

## 🔄 Flow

1. User creates a pipeline
2. Webhook is sent to `/webhooks/:pipelineId`
3. System stores a job in DB (`pending`)
4. Worker picks up the job
5. Processes payload
6. Sends result to subscribers
7. Tracks delivery attempts
8. Retries if needed

---

## 🗄️ Database Schema

### pipelines
- id
- name
- action
- created_at

### subscribers
- id
- pipeline_id
- url

### jobs
- id
- pipeline_id
- original_payload
- processed_payload
- status
- attempts
- next_run_at
- locked_at

### deliveries
- id
- job_id
- subscriber_url
- status
- attempt_count
- last_error

---

## 🛠️ Tech Stack

- TypeScript
- Express.js
- PostgreSQL
- Drizzle ORM
- Docker & Docker Compose
- GitHub Actions (CI)

---

## 🧪 Running Locally (Without Docker)

```bash
npm install
npm run build
npm run start

---

## 🐳 Running with Docker

Run the full system using Docker:

```bash
docker compose up --build

---

## 🔌 API Endpoints :

```md
## 🔌 API Endpoints

### Pipelines
POST /pipelines  
GET /pipelines  
GET /pipelines/:id  
PATCH /pipelines/:id  
DELETE /pipelines/:id  

### Webhooks
POST /webhooks/:pipelineId  

### Jobs
GET /jobs  
GET /jobs/:id  
GET /jobs/:id/deliveries

---

## 🧠 Design Decisions

### PostgreSQL as Queue
I used PostgreSQL instead of Redis/BullMQ to simplify the system and reduce external dependencies, while still supporting job scheduling and locking.

### Background Worker
The worker is separated from the API to ensure asynchronous processing and avoid blocking incoming requests.

### Delivery Tracking
Each delivery attempt is stored to provide visibility into success/failure and enable debugging.

### Retry Strategy
Retry logic is implemented using attempts count and nextRunAt scheduling to handle failures gracefully.

### Docker Compose
Docker Compose is used to run the entire system with a single command, ensuring consistent environments.

---

## ⚙️ CI Pipeline

The project includes a GitHub Actions CI pipeline that runs on push and pull requests.

It performs:
- Lint checks
- TypeScript build
- Tests
- PostgreSQL service setup
- Database migrations
- Docker image build

---

## 🔁 Retry Logic

- Each job has a maximum number of attempts
- Failed jobs are retried with delay
- Delay increases with each attempt
- After max attempts, job is marked as failed
