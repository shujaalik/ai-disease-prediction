# AI-Based Heart Disease Prediction System

A robust machine learning-powered application designed to predict the likelihood of heart disease based on medical attributes. This project features a FastAPI backend serving a scikit-learn model, organized in a scalable monorepo structure.

## 🚀 Features

- **Accurate Predictions**: Utilizes a trained Machine Learning model to assess heart disease risk.
- **FastAPI Backend**: High-performance, asynchronous REST API for serving predictions.
- **Scalable Architecture**: Monorepo structure separating backend application code, ML research, and (future) frontend.
- **Interactive Documentation**: Auto-generated Swagger UI for easy API testing and integration.

## 🛠️ Tech Stack

- **Language**: Python 3.8+
- **Framework**: FastAPI
- **ML Libraries**: Scikit-learn, Pandas, NumPy, Joblib
- **Server**: Uvicorn

## 📂 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── core/           # Core configuration & settings
│   │   ├── ml_models/      # Serialized ML models
│   │   ├── schemas/        # Pydantic models for data validation
│   │   └── main.py         # Application entry point
│   ├── requirements.txt    # Backend dependencies
│   └── run.py              # Script to run the server
├── ml-research/
│   ├── datasets/           # Training datasets
│   ├── saved_models/       # Model artifacts during research
│   └── model_training.ipynb # Jupyter notebook for model training
└── README.md
```

## ⚡ Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone <repository-url>
    cd ai-disease-prediction
    ```

2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

3.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

4.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the application**:
    ```bash
    python run.py
    ```
    Or directly with uvicorn:
    ```bash
    uvicorn app.main:app --reload
    ```

The API will be available at `http://localhost:8000`.

## 📖 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

- **GET /**: Health check/Welcome message.
- **POST /api/v1/predict**: Make a prediction.
    - **Body**: JSON object containing patient data (age, sex, cp, trestbps, etc.).

## 🔬 Model Training

The machine learning model logic is located in `ml-research/`.
To retain the model:
1.  Navigate to `ml-research/`.
2.  Open `model_training.ipynb` in Jupyter Notebook or VS Code.
3.  Run the cells to train and save the new model to `backend/app/ml_models/`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
