FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  curl \
  libsqlite3-0 \
  && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Configure Poetry and install dependencies
RUN poetry config virtualenvs.create false && \
  poetry install --no-interaction --no-ansi --no-root --only main

# Copy application code
COPY . .

# Create directory for ChromaDB persistent storage
RUN mkdir -p /app/chroma_db

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
  PORT=8000

# Run the application
CMD ["python", "run.py"]