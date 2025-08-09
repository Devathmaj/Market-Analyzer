# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code
COPY ./server /app/server

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application using Gunicorn with Uvicorn workers
# This is a production-ready setup
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8080", "server.main:app"]
