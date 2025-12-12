import joblib
import numpy as np
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.schemas.predict import HeartDiseaseInput, PredictionResponse

router = APIRouter()

# Load model and scaler on startup (module level for simplicity)
# Dynamically resolve path relative to this file
# This file is in backend/app/api/routes/
# Models are in backend/app/ml_models/
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "ml_models" / "heart_model.pkl"
SCALER_PATH = BASE_DIR / "ml_models" / "scaler.pkl"

model = None
scaler = None

if MODEL_PATH.exists():
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print(f"Model not found at {MODEL_PATH}")

if SCALER_PATH.exists():
    try:
        scaler = joblib.load(SCALER_PATH)
        print(f"Scaler loaded from {SCALER_PATH}")
    except Exception as e:
        print(f"Error loading scaler: {e}")
else:
    print(f"Scaler not found at {SCALER_PATH}")

@router.post("/predict", response_model=PredictionResponse)
async def predict(input_data: HeartDiseaseInput):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded or unavailable")
    
    if not scaler:
        raise HTTPException(status_code=503, detail="Scaler not loaded or unavailable")
    
    # Convert input features to numpy array in correct order
    # Features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
    features = np.array([[
        input_data.age,
        input_data.sex,
        input_data.cp,
        input_data.trestbps,
        input_data.chol,
        input_data.fbs,
        input_data.restecg,
        input_data.thalach,
        input_data.exang,
        input_data.oldpeak,
        input_data.slope,
        input_data.ca,
        input_data.thal
    ]])

    try:
        # Scale features using loaded scaler
        scaled_features = scaler.transform(features)
        
        # Predict using scaled features
        prediction = model.predict(scaled_features)
        
        # Get probability if supported
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(scaled_features)
            risk_score = float(probs[0][1])  # Probability of class 1 (Disease)
        else:
            risk_score = float(prediction[0])

        risk_label = "High Risk" if prediction[0] == 1 else "Low Risk"

        return {
            "risk_score": risk_score,
            "risk_label": risk_label
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
