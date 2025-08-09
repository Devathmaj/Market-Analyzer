# Stage 1: Build the React frontend
FROM node:18-alpine AS build

WORKDIR /app/client

# Copy client source code and package files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client source code
COPY client/ .

# Build the React app
RUN npm run build

# Stage 2: Build the Python backend
FROM python:3.9-slim

WORKDIR /app

# Copy Python server requirements and install dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend from the build stage
COPY --from=build /app/client/dist /app/static

# Copy the Python server code
COPY server /app/server

EXPOSE 5000

# Run the FastAPI server with Gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:5000", "server.main:app"]