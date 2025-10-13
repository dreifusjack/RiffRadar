FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
  libsqlite3-0 \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

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