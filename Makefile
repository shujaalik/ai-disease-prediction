.PHONY: backend frontend dev start install

install:
	@echo "Installing backend dependencies..."
	cd backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt

backend:
	@echo "Starting Backend..."
	./backend/venv/bin/python backend/run.py

frontend:
	@echo "Frontend not implemented yet."

dev:
	@echo "Starting Development Mode..."
	make -j 2 backend frontend

start:
	@echo "Starting Production Mode..."
	./backend/venv/bin/uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
