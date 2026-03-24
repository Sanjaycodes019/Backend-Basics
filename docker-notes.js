/*
================================================================================
                    DOCKER DEPLOYMENT - NOTES
================================================================================

TABLE OF CONTENTS:
1. What is Docker?
2. Dockerfile
3. docker-compose.yml
4. .dockerignore
5. Multi-stage Builds
6. Commands

================================================================================
1. WHAT IS DOCKER?
================================================================================

- Container platform
- Packages app with all dependencies
- Runs consistently across environments
- Lightweight compared to VMs

KEY CONCEPTS:
  Image   → Blueprint/template
  Container → Running instance of image
  Dockerfile → Instructions to build image
  docker-compose.yml → Multi-container setup

================================================================================
2. DOCKERFILE
================================================================================

Create file: Dockerfile (no extension)

# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "server.js"]

================================================================================
3. DOCKER-COMPOSE.YML
================================================================================

Create file: docker-compose.yml

version: '3.8'

services:
  # App service
  app:
    build: .
    container_name: node-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/mydb
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis
    networks:
      - app-network

  # MongoDB service
  mongo:
    image: mongo:6
    container_name: mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  # Redis service
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  mongo-data:
  redis-data:

networks:
  app-network:
    driver: bridge

================================================================================
4. .DOCKERIGNORE
================================================================================

Create file: .dockerignore

node_modules
npm-debug.log
.git
.env
.env.local
.env.*.local
coverage
.nyc_output
logs
*.log
.vscode
.idea
dist
build
tests
*.test.js
*.spec.js
README.md
LICENSE

================================================================================
5. MULTI-STAGE BUILD (Production Optimized)
================================================================================

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm prune --production

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package.json ./
EXPOSE 3000
USER node
CMD ["node", "server.js"]

================================================================================
6. DOCKER COMMANDS
================================================================================

# Build image
docker build -t myapp:1.0 .

# Run container
docker run -d -p 3000:3000 --name myapp myapp:1.0

# Run with env vars
docker run -d -p 3000:3000 -e PORT=3000 myapp

# Docker Compose
docker-compose up           # Start all services
docker-compose up -d        # Detached mode
docker-compose down         # Stop all
docker-compose down -v      # Stop and remove volumes
docker-compose ps           # List running
docker-compose logs app     # View app logs
docker-compose build        # Rebuild images
docker-compose restart app  # Restart service

# View logs
docker logs myapp
docker logs -f myapp        # Follow logs

# Execute command in container
docker exec -it myapp sh    # Open shell

# Remove
docker stop myapp
docker rm myapp
docker rmi myapp:1.0

================================================================================
7. NGINX CONFIG
================================================================================

Create file: nginx.conf

events {
    worker_connections 1024;
}

http {
    upstream node-app {
        server app:3000;
    }

    server {
        listen 80;
        
        location / {
            proxy_pass http://node-app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_cache_bypass $http_upgrade;
        }
    }
}

================================================================================
8. ENVIRONMENT VARIABLES
================================================================================

// config.js
const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydb',
    redisHost: process.env.REDIS_HOST || 'localhost',
    jwtSecret: process.env.JWT_SECRET || 'default-secret'
};

module.exports = config;

// Dockerfile
ENV NODE_ENV=production
ENV PORT=3000

================================================================================
*/

console.log('=== DOCKER DEPLOYMENT NOTES ===');
console.log('Files needed: Dockerfile, docker-compose.yml, .dockerignore');
console.log('Install Docker Desktop first');
console.log('');
console.log('Quick start:');
console.log('1. docker-compose up -d');
console.log('2. docker-compose ps');
console.log('3. docker-compose logs app');

module.exports = {};
