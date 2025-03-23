FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY poetry.lock .
COPY pyproject.toml .

RUN pip3 install poetry --no-cache-dir && poetry install

# Copy application code
COPY /src .

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=src/main.py
ENV FLASK_ENV=production

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:src.main"]
