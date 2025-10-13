# Multi-stage build for smaller final image
FROM python:3.13-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Configure Poetry to not create virtual env (we're in a container)
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-root --only main

# Final stage
FROM python:3.13-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
  libsqlite3-0 \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Create directory for ChromaDB persistent storage
RUN mkdir -p /app/chroma_db

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Run the application
CMD ["python", "run.py"]