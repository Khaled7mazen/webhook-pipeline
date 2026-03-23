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
- ✅ CI/CD pipeline using GitHub Actions

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
- GitHub Actions (CI/  CD)

---

## 🧪 Running Locally (Without Docker)

```bash
npm install
npm run build
npm run start

Apply database schema:
npm run db:push

Run the API server:
npm run dev

Run the worker in a separate terminal
npm run worker:dev

---

## 🐳 Running with Docker

Run the full system using Docker:

```bash
docker compose up --build

---

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

Example Usage
Create a pipeline:

curl -X POST http://localhost:3000/pipelines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Uppercase Pipeline",
    "action": "uppercase",
    "subscribers": ["http://localhost:4000/test"]
  }'

Send a webhook

curl -X POST http://localhost:3000/webhooks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "text": "hello world"
  }'

---

## 🧠 Design Decisions

### PostgreSQL as a Queue
I used PostgreSQL instead of a dedicated queue system such as Redis/BullMQ to reduce infrastructure complexity and keep the project aligned with the assignment stack.

### Separation of Concerns
The codebase is split into controllers, services, repositories, models, and database schema files. This keeps responsibilities clear and improves maintainability.

### Background Worker
Webhook ingestion is intentionally lightweight. The API stores jobs only, while the worker handles processing and delivery asynchronously.

### Delivery Tracking
Each delivery attempt is stored in the database so job history can be inspected and successful deliveries can be skipped on retries.

### Retry Strategy
Retries are implemented using attempts, maxAttempts, and nextRunAt. Failed jobs are rescheduled with increasing delay until they either succeed or reach the maximum retry limit.

---

## ⚙️ CI/CD Pipeline

The project uses GitHub Actions for CI/CD.

### CI
The CI workflow runs on push and pull requests and performs:
- dependency installation
- type checking
- TypeScript build
- PostgreSQL service setup
- database migrations
- Docker image build

### CD
The CD workflow runs after CI succeeds on the main branch and publishes the Docker image to GitHub Container Registry (GHCR).

---

## 🔁 Retry Logic

- Each job has a maximum number of attempts
- Failed jobs are retried with delay
- Delay increases with each attempt
- After max attempts, job is marked as failed

---

## 🦾  Future Improvements

pagination and filtering can be added to jobs APIs
authentication and webhook signature verification can be added
rate limiting and observability/metrics can be added
