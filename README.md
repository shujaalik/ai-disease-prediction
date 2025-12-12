# AI-Based Heart Disease Prediction System

A monorepo containing a Python FastAPI backend, a React frontend, and machine learning research resources for heart disease prediction.

## Structure

- `/backend`: FastAPI application for serving predictions.
- `/frontend`: React application for user interaction (Planned).
- `/ml-research`: Jupyter notebooks and datasets for model training.


## Quick Start

### Prerequisites
- Python 3.8+
- Node.js (for frontend)

### Setup & Run
1. **Install Dependencies**:
   ```bash
   make install
   ```

2. **Run Development Mode** (Backend + Frontend):
   ```bash
   make dev
   ```

3. **Run Production Mode**:
   ```bash
   make start
   ```

4. **Run Components Individually**:
   ```bash
   make backend
   make frontend
   ```
