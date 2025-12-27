.PHONY: backend frontend dev start install

install: install-backend install-frontend

install-backend:
	@echo "Installing backend dependencies..."
	cd backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

backend:
	@echo "Starting Backend..."
	./backend/venv/bin/python backend/run.py

frontend:
	@echo "Starting Frontend..."
	cd frontend && npm run dev

dev:
	@echo "Starting Development Mode..."
	make -j 2 backend frontend

start:
	@echo "Starting Production Mode..."
	./backend/venv/bin/uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
