#!/bin/bash

# UweTalk Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    print_status "Docker is running ✓"
}

# Build and start services
start() {
    print_status "Starting UweTalk services..."
    check_docker
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_warning "Creating .env file from template..."
        cp env.example .env
    fi
    
    # Build and start containers
    docker-compose up --build -d
    
    print_status "Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "API Docs: http://localhost:8000/docs"
}

# Stop services
stop() {
    print_status "Stopping UweTalk services..."
    docker-compose down
    print_status "Services stopped ✓"
}

# Restart services
restart() {
    print_status "Restarting UweTalk services..."
    stop
    start
}

# View logs
logs() {
    if [ -n "$1" ]; then
        docker-compose logs -f "$1"
    else
        docker-compose logs -f
    fi
}

# Clean up
clean() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker-compose down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed ✓"
    else
        print_status "Cleanup cancelled"
    fi
}

# Show status
status() {
    print_status "UweTalk Services Status:"
    docker-compose ps
}

# Show help
help() {
    echo "UweTalk Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Build and start all services"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  logs      Show logs (optionally specify service name)"
    echo "  status    Show service status"
    echo "  clean     Remove all containers and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 status"
}

# Main script logic
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac
