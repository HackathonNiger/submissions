# main.py
"""
Main runner for UweTalk demo: starts both
- Gradio web demo (port 7860)
- FastAPI API + WebSocket (port 8000)

Usage:
    python main.py
"""

import os
import threading
import time
import logging

# import Gradio demo and FastAPI app
# web.py must expose a variable named `demo` (gradio.Interface)
# api.py must expose a variable named `app` (FastAPI)
from web import demo    # gradio interface
from api import app     # fastapi app

import uvicorn

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uwetalk.main")


def run_uvicorn():
    """Run FastAPI (uvicorn) server in this thread."""
    logger.info("Starting FastAPI on port 8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")


def run_gradio():
    """Run Gradio demo (blocks until closed)."""
    logger.info("Starting Gradio demo on port 7860 ...")
    # demo.launch is blocking — run it in the main thread
    demo.launch(server_name="0.0.0.0", server_port=7860, share=False)


def main():
    # quick environment check
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        logger.warning(
            "HF_TOKEN environment variable not set. "
            "Hugging Face calls will fail without it. "
            "Set HF_TOKEN in your environment or in a .env file for local testing."
        )

    # start FastAPI in a daemon thread
    uv_thread = threading.Thread(target=run_uvicorn, daemon=True)
    uv_thread.start()

    # give uvicorn a second to bind ports (not required but nicer UX)
    time.sleep(1.0)

    try:
        # run Gradio in the foreground (so logs print to console)
        run_gradio()
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt received — shutting down.")
    except Exception as e:
        logger.exception("Unhandled exception in main: %s", e)
    finally:
        logger.info("Main exiting. If FastAPI is still running, it will exit when process ends.")


if __name__ == "__main__":
    main()
