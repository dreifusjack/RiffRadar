# RiffRadar

## About

RiffRadar is a guitar chord recommendation platform that helps users discover songs they can learn based on chords they already know. Users input a chord progression, and the system uses vector similarity search with ChromaDB to find songs with similar chord patterns, along with YouTube tutorial links for each recommendation. The backend is built with FastAPI and uses circle of fifths encoding for chord embeddings, while the frontend is built with Next.js, TypeScript, and TailwindCSS.

## Architecture

**Frontend**

- Framework: Next.js
- Language: TypeScript
- Data Layer: TanStack Query

**Backend**

- Framework: FastAPI (Python)
- Cache: Redis
- Vector Database: ChromaDB

## Setup

### 1. Run with Docker (recommended)

The simplest way to run RiffRadar is with Docker Compose.

`docker compose up`

This will start both the frontend and backend containers

To stop and remove containers:

`docker compose down`

After the containers start:

Frontend: http://localhost:3000

Backend API docs: http://localhost:8000

### 2. Manual Setup

#### Frontend

Navigate to the frontend directory and install dependencies:

```
cd frontend
npm i
```

Start development app (http://localhost:3000):

```
npm run dev
```

#### Backend

Naviagte to the backend directory and set up the environment:

```
cd backend
poetry install --no-root
```

Create a `.env` file using `.env.example`

Seed the databse with songs:

```
poetry run python -m seed_songs.py --reset
```

Start the development server (on localhost:8000):

```
poetry run python run.py
```

After running the server, API documentation is available at http://localhost:8000
