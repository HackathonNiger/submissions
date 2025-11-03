# Gunicorn configuration file for HealthMate AI
import os

# Server socket
bind = "0.0.0.0:5000"
backlog = 2048

# Worker processes
workers = 2  # Reduced from 4 to conserve memory
worker_class = "sync"
worker_connections = 1000
timeout = 60  # Increased timeout for OpenAI API calls
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 50

# Maximum memory usage per worker (in MB) before restart
max_memory_per_child = 512

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "healthmate-ai"

# Server mechanics
preload_app = True
daemon = False
pidfile = "/tmp/gunicorn.pid"
user = None
group = None
tmp_upload_dir = None

# SSL (if needed in future)
keyfile = None
certfile = None

# Worker process behavior
worker_tmp_dir = "/dev/shm"  # Use memory for worker temp files if available

# Graceful timeout
graceful_timeout = 30

def when_ready(server):
    server.log.info("HealthMate AI server is ready. Listening on %s", server.address)

def worker_int(worker):
    worker.log.info("Worker received INT or QUIT signal")

def pre_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)
    
def worker_abort(worker):
    worker.log.info("Worker received SIGABRT signal")