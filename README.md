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
