# Use official Python 3.13.5 image
FROM python:3.13.5-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependenciesw
COPY service/ /app/
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Collect static files (optional)
# RUN mkdir -p /app/static /app/media

CMD ["gunicorn", "service.wsgi:application", "--bind", "0.0.0.0:8000"]
