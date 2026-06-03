import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# Synthetic dataset for demonstration purposes. 
# In a real scenario, this would be loaded from a CSV (like the Kaggle Disease Symptom dataset)
data = {
    'fever': [1, 1, 1, 0, 0, 1, 0, 0, 1, 1],
    'cough': [1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    'fatigue': [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    'chest_pain': [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    'shortness_of_breath': [0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
    'headache': [1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
    'nausea': [0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    'disease': ['Common Cold', 'COVID-19', 'Malaria', 'Bronchitis', 'Heart Attack', 'COVID-19', 'Common Cold', 'Heart Attack', 'Dengue', 'Malaria']
}

def train_model():
    print("Training Symptom Prediction Model...")
    df = pd.DataFrame(data)
    
    X = df.drop('disease', axis=1)
    y = df['disease']
    
    # Store feature names for later use
    feature_names = X.columns.tolist()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    
    # Save the model and feature names
    joblib.dump({'model': model, 'features': feature_names}, os.path.join(os.path.dirname(__file__), 'symptom_model.joblib'))
    print("Model saved to symptom_model.joblib")

if __name__ == "__main__":
    train_model()
