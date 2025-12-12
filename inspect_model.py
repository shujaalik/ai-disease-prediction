import joblib
import sys

try:
    model = joblib.load("backend/app/ml_models/heart_model.pkl")
    print(f"Type: {type(model)}")
    print(f"Content: {model}")
    if hasattr(model, 'steps'):
        print("Model is a Pipeline.")
        print(f"Steps: {model.steps}")
except Exception as e:
    print(f"Error loading model: {e}")
