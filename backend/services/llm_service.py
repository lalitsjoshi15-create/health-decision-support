import os
import requests
import json

# In production, securely load this from environment variables (.env)
# For the prototype, we assume it's set in the environment or passed directly
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

def analyze_medical_report(ocr_text: str) -> str:
    """
    Sends the extracted OCR text to the Gemini Free Tier API to get a plain-language summary.
    """
    if not GEMINI_API_KEY:
        return "Gemini API key is not configured. Here is the raw text extracted:\n\n" + ocr_text

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    You are a helpful AI assistant. A user has uploaded a medical report. Here is the raw text extracted via OCR:
    
    ---
    {ocr_text}
    ---
    
    Please provide a simple, easy-to-understand summary of this report. 
    Highlight any abnormal values or important notes.
    Keep the language very simple, suitable for someone without a medical background, potentially from a rural area.
    End with a strict disclaimer: "For educational and decision-support purposes only. Please consult a qualified medical professional."
    """
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        # Extract the generated text from the response
        generated_text = result["candidates"][0]["content"]["parts"][0]["text"]
        return generated_text
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "Failed to analyze the report with AI. Here is the raw text: \n\n" + ocr_text

def extract_and_translate_symptoms(natural_language_input: str, valid_features: list) -> list:
    """
    Uses Gemini to translate Hindi/Marathi/English natural language into a structured 
    list of medical symptoms that exactly match the ML model's valid feature names.
    """
    if not GEMINI_API_KEY:
        # Fallback for prototype without API key: naive English matching
        words = natural_language_input.lower().replace(",", " ").split()
        return [w for w in words if w in valid_features]

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    valid_features_str = ", ".join(valid_features)
    
    prompt = f"""
    You are a medical NLP translator. A patient has described their symptoms in natural language (possibly in Hindi or Marathi):
    "{natural_language_input}"
    
    Your task is to translate their description into standard medical terminology and match it EXACTLY to one or more of the following valid feature names:
    [{valid_features_str}]
    
    Return ONLY a JSON array of the matched strings. No other text. For example: ["high_fever", "chest_pain"]
    """
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        generated_text = result["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean up Markdown JSON formatting if present
        cleaned_text = generated_text.replace("```json", "").replace("```", "").strip()
        matched_symptoms = json.loads(cleaned_text)
        
        if isinstance(matched_symptoms, list):
            return [sym for sym in matched_symptoms if sym in valid_features]
        return []
    except Exception as e:
        print(f"Error in symptom translation: {e}")
        # Fallback naive matching
        words = natural_language_input.lower().replace(",", " ").split()
        return [w for w in words if w in valid_features]

def chat_with_health_assistant(user_message: str) -> str:
    """
    Conversational AI assistant for general health queries.
    """
    if not GEMINI_API_KEY:
        return "I am the HealthAI Assistant. (Gemini API key missing, this is a mock response). How can I help you today?"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    prompt = f"""
    You are 'HealthAI', a compassionate and highly professional virtual medical assistant for a rural healthcare platform.
    A user has asked: "{user_message}"
    
    Provide a helpful, polite, and brief response (max 3 sentences). 
    If they ask for medical advice, provide general first-aid or wellness info but ALWAYS end with: "Please consult a doctor for a professional diagnosis."
    Do NOT use complex markdown, keep it readable.
    """
    
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Error calling Gemini Chat: {e}")
        return "I'm having trouble connecting to my medical database right now. Please try again later."

def generate_smart_prescription(patient_name: str, symptoms: str) -> str:
    """
    Generates a professional medical prescription based on symptoms.
    """
    if not GEMINI_API_KEY:
        return f"Rx:\n- Paracetamol 500mg (1-0-1) for 3 days.\n- Drink warm water.\n(Mock Prescription for {patient_name})"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    prompt = f"""
    You are an AI assistant to a Doctor. Generate a formal medical prescription for a patient named '{patient_name}' who presented with the following symptoms: '{symptoms}'.
    
    Format the output elegantly like a real prescription pad:
    1. A brief diagnosis impression.
    2. Rx (Medicines with dosage, e.g., 1-0-1 for 3 days).
    3. General Advice (Diet, Rest).
    4. A disclaimer that this is AI-generated for doctor review.
    
    Keep it extremely concise and professional. Do not invent dangerous drugs. Use common OTC/standard treatments for the symptoms.
    """
    
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Error calling Gemini Prescription: {e}")
        return "Error generating prescription. Please write manually."

def analyze_medical_image(image_bytes: bytes, report_type: str) -> str:
    """
    Uses Gemini Vision to analyze X-Rays, MRIs, or CT scans.
    """
    if not GEMINI_API_KEY:
        return f"AI Vision Analysis (Mock): The {report_type} scan appears normal. No structural abnormalities detected. (API Key missing)"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    import base64
    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = f"You are a highly skilled radiologist AI. Please analyze this {report_type} image. Provide a concise, professional diagnostic summary (max 4 sentences) of any potential abnormalities, fractures, or notable observations. End with a disclaimer that this is an AI preliminary analysis."
    
    data = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": encoded_image
                    }
                }
            ]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Error calling Gemini Vision: {e}")
        return f"Could not analyze the {report_type} image at this time."
