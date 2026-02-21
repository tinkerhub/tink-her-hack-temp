"""
WSGI entry point for Gunicorn.
Usage:  gunicorn --chdir backend wsgi:app --bind 0.0.0.0:3000
"""

from app import app, init_db

# Ensure DB + seed data exist before the first request
init_db()

if __name__ == "__main__":
    app.run()
