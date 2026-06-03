# backend/services/emergency.py

# A rule-based engine to detect high-risk symptom combinations.
# In a full-scale app, this could also be ML-driven.

HIGH_RISK_COMBINATIONS = [
    {"symptoms": ["chest_pain", "shortness_of_breath"], "risk_level": "Critical", "alert": "Possible Heart Attack. Seek immediate emergency medical assistance!"},
    {"symptoms": ["fever", "shortness_of_breath", "fatigue"], "risk_level": "High", "alert": "High risk of severe respiratory infection (e.g., severe COVID-19 or Pneumonia). Contact a doctor."},
    {"symptoms": ["headache", "nausea"], "risk_level": "Medium", "alert": "Could indicate a migraine or moderate infection. Rest and monitor."},
]

def check_emergency_severity(user_symptoms: list[str]) -> dict:
    """
    Checks the user's reported symptoms against high-risk combinations.
    user_symptoms: list of strings (e.g., ["chest_pain", "fever", "shortness_of_breath"])
    """
    highest_risk = {"risk_level": "Low", "alert": "No immediate critical risks detected based on common combinations. Please consult a doctor for a proper diagnosis."}
    
    # We prioritize Critical > High > Medium
    risk_weights = {"Critical": 3, "High": 2, "Medium": 1, "Low": 0}
    
    for combo in HIGH_RISK_COMBINATIONS:
        # Check if all symptoms in the combination are present in the user's symptoms
        if all(symptom in user_symptoms for symptom in combo["symptoms"]):
            if risk_weights[combo["risk_level"]] > risk_weights[highest_risk["risk_level"]]:
                highest_risk = {"risk_level": combo["risk_level"], "alert": combo["alert"]}
                
    return highest_risk
