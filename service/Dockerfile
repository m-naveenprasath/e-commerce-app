FROM python:3.13.5-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install netcat (for waiting on PostgreSQL)
RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy all project files
COPY . .

RUN chmod +x /app/entrypoint.sh

