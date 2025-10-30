#!/usr/bin/env bash
# scripts/dev.sh
# Start local development environment:
# - Docker services (Mongo, Redis)
# - Backend dependencies
# - Seed admin user
# - Run backend in dev mode

set -euo pipefail

echo -e "\033[1;34m[DEV] Starting docker-compose (mongo, redis)...\033[0m"

if ! command -v docker >/dev/null 2>&1; then
  echo -e "\033[1;31m[ERROR] Docker is required. Please install Docker and Docker Compose.\033[0m"
  exit 1
fi

# Start services
docker-compose up -d mongo redis

cd backend

echo -e "\033[1;34m[DEV] Installing backend dependencies...\033[0m"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# Wait for Mongo to be ready
echo -e "\033[1;34m[DEV] Waiting for MongoDB to be ready...\033[0m"
for i in {1..10}; do
  if docker exec "$(docker-compose ps -q mongo)" mongo --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo -e "\033[1;32m[DEV] MongoDB is ready.\033[0m"
    break
  fi
  echo -n "."
  sleep 2
done

# Seed admin user
echo -e "\033[1;34m[DEV] Seeding admin user...\033[0m"
node scripts/seedAdmin.js || echo -e "\033[1;33m[WARN] Seeding skipped (maybe already exists).\033[0m"

# Start dev server
echo -e "\033[1;34m[DEV] Starting backend in development mode...\033[0m"
npm run dev
