# 🚀 Advanced Backend & Docker Masterclass

A comprehensive, step-by-step repository demonstrating **Production-Ready Backend Engineering**, **Containerization with Docker**, and **Distributed System Patterns** including Redis In-Memory Caching, Custom IP-based Rate Limiting, and Asynchronous Message Queuing with BullMQ.

---

## 📌 Repository Overview

This repository is structured in progressive levels, moving from foundational containerization to advanced, high-scale distributed backend patterns.

```
Docker/
├── level-1/                                # Level 1: Containerization & Orchestration
│   ├── phase-1/                            # Single Container Node.js Dockerization
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   └── package.json
│   └── phase-2/                            # Multi-Container Setup (Full Stack + Redis)
│       ├── docker-compose.yml
│       ├── backend/
│       └── frontend/
│
├── level-2/                                # Level 2: Advanced Backend & Scalability Patterns
│   ├── docker-compose.yml                  # Infrastructure services (Redis)
│   └── phase-1/                            # Production Patterns Implementation
│       ├── index.js                        # Main Express server & API routes
│       ├── queue.js                        # BullMQ Queue instance
│       ├── worker.js                       # Background Worker process
│       ├── middleware/
│       │   └── ratelimit.js                # Custom Redis Rate Limiter middleware
│       ├── lib/
│       │   └── db.js                       # MongoDB connection
│       └── model/
│           └── user.model.js               # Mongoose Schema
│
├── level-3/                                # Level 3: Microservices & Load Balancing
│   ├── phase-1/                            # Multi-Server Load Balancing with Nginx
│   │   ├── docker-compose.yml
│   │   ├── nginx/
│   │   └── server/
│   └── phase-2/                            # Microservices & API Gateway Load Balancing
│       ├── docker-compose.yml
│       ├── nginx/
│       └── backend/
│           ├── gateway/
│           └── services/
│               ├── auth/
│               ├── order/
│               └── product/
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack & Tools

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Reverse Proxy & Load Balancer:** Nginx
- **Database:** MongoDB (Mongoose ODM)
- **In-Memory Store & Cache:** Redis (`ioredis`)
- **Job & Message Queue:** BullMQ
- **Containerization:** Docker & Docker Compose

---

## 🌟 Key Features & Architectures

### 1. 🐳 Containerization (Level 1)
- **Single-Container Dockerfile (`level-1/phase-1`):** Efficient layering, dependency isolation, and lightweight container creation for Node.js apps.
- **Multi-Service Orchestration (`level-1/phase-2`):** `docker-compose` setup managing Frontend, Backend, and Redis services under a unified internal network.

---

### 2. ⚡ In-Memory Caching with Redis (`level-2/phase-1`)
- **Read-Through Caching:** MongoDB queries are cached in Redis (`user:all`), returning responses in sub-milliseconds and slashing database load.
- **Cache Invalidation:** When a new user is created via `POST /create`, the cache is automatically invalidated (`redis.del("user:all")`) to prevent stale data.

---

### 3. 🛡️ Custom IP-Based Rate Limiting Middleware (`level-2/phase-1`)
- Prevents DDoS attacks, brute-force attempts, and spam.
- Utilizes Redis atomic `INCR` and `EXPIRE` operations.
- Restricts requests to **5 requests per 60 seconds per IP**, returning `429 Too Many Requests` when exceeded.
- Can be applied **globally** (`app.use`) or on **specific sensitive routes** (e.g., `/create`, `/login`).

---

### 4. 📬 Asynchronous Job Queues & Background Workers (`level-2/phase-1`)
- Decouples time-consuming tasks (like email sending) from the main request-response cycle using **BullMQ** and **Redis**.
- **Non-Blocking Architecture:** Users receive instant `201 Created` responses while background workers asynchronously process emails.

```
[ Client (Postman) ]
        │  POST /create
        ▼
[ Express Server (Producer) ] ──▶ (Instant Response: 201 Created)
        │
        │ emailQueue.add("sendWelcomeEmail", { email, name })
        ▼
[ Redis (Queue Storage) ]
        │
        ▼
[ Worker Process (Consumer) ] ──▶ (Processes Job & Sends Email asynchronously)
```

---

### 5. ⚖️ Load Balancing & Microservices Architecture (Level 3)
- **Nginx Reverse Proxy:** Distributes incoming traffic across multiple API Gateway instances.
- **API Gateway Pattern:** Unified entry point (`express-http-proxy`) routing traffic to individual microservices (`auth`, `product`, `order`).

---

## 🚦 Getting Started

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### Running Level 3 Phase 2 (Microservices & Gateway Load Balancing)
```bash
cd level-3/phase-2
docker compose up --build
```

---

## 📜 License
This project is open-source under the ISC License.
