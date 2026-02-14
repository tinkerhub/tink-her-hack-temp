# Use the Python 3 slim official image for better compatibility with scientific libraries
# https://hub.docker.com/_/python
FROM python:3.11-slim

# Install system dependencies for scientific libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image.
COPY . .

# Install project dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# uvicorn is used to run the FastAPI app on port 8001 (matching main.py configuration)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8001"]