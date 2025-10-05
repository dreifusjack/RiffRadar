# RiffRadar
## About
RiffRadar is a guitar chord recommendation platform that helps users discover songs they can learn based on chords they already know. Users input a chord progression, and the system uses vector similarity search with ChromaDB to find songs with similar chord patterns, along with YouTube tutorial links for each recommendation. The backend is built with FastAPI and uses circle of fifths encoding for chord embeddings, while the frontend is built with Next.js, TypeScript, and TailwindCSS.

## Setup
### Frontend
Navigate to the frontend directory and install dependencies: 
```
cd frontend
npm i
```
Start development app (on localhost:3000):
```
npm run dev
```

### Backend 
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
