#!/usr/bin/env python
"""
Simple script to run the FastAPI app from any directory.
"""
import os
import subprocess
import sys

# Change to the backend directory
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
os.chdir(backend_dir)

# Run uvicorn
subprocess.run([sys.executable, '-m', 'uvicorn', 'app.main:app', '--reload'])
