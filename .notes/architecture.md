# System Architecture

## Overview
The Personal Financial Tracker uses a 3-tier architecture with a decoupled frontend, backend api, and database.

## Components

### 1. Database Layer
- **Engine**: PostgreSQL 17 (Alpine image) running via Docker Compose.
- **Port Mapping**: `5432:5432`
- **Volume**: `postgres_data` mapped to `/var/lib/postgresql/data` for persistent storage.
- **Role**: Stores all application data securely.

### 2. Backend API Layer
- **Type**: Modular RESTful API
- **Framework**: Go Fiber v3
- **ORM**: GORM
- **Port**: `3000`
- **Role**: Handles business logic, database transactions, requests validation, and data formatting. Runs entirely independently of the frontend.

### 3. Frontend Layer
- **Type**: Single Page Application (SPA) Admin Dashboard
- **Framework**: Svelte 5 (with TypeScript)
- **Build Server**: Vite
- **Port**: `5173`
- **Role**: User interface for recording and viewing transactions. Communicates with the Backend API via proxy setup in Vite.

## Communication Pattern
- The Frontend uses the browsers `fetch` API to reach out to endpoints.
- During development, Vite is configured with a Server Proxy to redirect all requests beginning with `/transactions` to `http://localhost:3000`. This completely avoids CORS issues.
- The Backend parses JSON requests, connects with PostgreSQL using an explicit `dsn`, maps it via GORM models, and returns standard JSON responses back to the Frontend.
