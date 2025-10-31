#!/bin/bash

# HealthMate AI Production Startup Script
# This script is used by Render to start the application

echo "Starting HealthMate AI Backend..."
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Environment: ${ENVIRONMENT:-production}"

# Check if required environment variables are set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "WARNING: OPENAI_API_KEY not set. Using fallback content only."
fi

if [ -z "$SUPABASE_URL" ]; then
    echo "WARNING: SUPABASE_URL not set. Database features may not work."
fi

if [ -z "$SUPABASE_KEY" ]; then
    echo "WARNING: SUPABASE_KEY not set. Database features may not work."
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the application with gunicorn using the configuration file
echo "Starting Gunicorn with optimized configuration..."
exec gunicorn --config gunicorn.conf.py app:app