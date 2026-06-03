import os
import joblib
import pandas as pd
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import engine, Base, get_db
import models
from services.emergency import check_emergency_severity
from services.ocr_service import extract_text_from_image
from services.llm_service import analyze_medical_report

# Create DB Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Healthcare AI Decision Support API")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load the trained model and features
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_models", "symptom_model.joblib")
ml_data = joblib.load(MODEL_PATH)
symptom_model = ml_data["model"]
feature_names = ml_data["features"]

class Vitals(BaseModel):
    bpm: int
    spo2: int

class SymptomRequest(BaseModel):
    user_id: int
    symptoms: List[str]
    vitals: Optional[Vitals] = None

class PatientSignup(BaseModel):
    email: str
    password: str
    name: str
    age: int
    gender: str
    address: str
    contact_no: str

class DoctorSignup(BaseModel):
    email: str
    password: str
    name: str
    age: int
    gender: str
    hospital_name: str
    hospital_address: str
    specialist: str
    degree: str
    years_of_experience: int

class LoginRequest(BaseModel):
    email: str
    password: str

class AppointmentBooking(BaseModel):
    patient_id: int
    doctor_id: int
    date: str
    time: str
    symptoms: str
    patient_contact: str

@app.get("/")
def read_root():
    return {"status": "Healthcare AI API is running."}

@app.post("/api/signup/patient")
def signup_patient(patient: PatientSignup, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == patient.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        email=patient.email,
        password_hash=pwd_context.hash(patient.password),
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        role="patient",
        address=patient.address,
        contact_no=patient.contact_no
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Patient registered successfully", "user_id": new_user.id}

@app.post("/api/signup/doctor")
def signup_doctor(doc: DoctorSignup, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == doc.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        email=doc.email,
        password_hash=pwd_context.hash(doc.password),
        name=doc.name,
        age=doc.age,
        gender=doc.gender,
        role="doctor"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    doc_profile = models.DoctorProfile(
        user_id=new_user.id,
        hospital_name=doc.hospital_name,
        hospital_address=doc.hospital_address,
        specialist=doc.specialist,
        degree=doc.degree,
        years_of_experience=doc.years_of_experience
    )
    db.add(doc_profile)
    db.commit()
    return {"message": "Doctor registered successfully", "user_id": new_user.id}

@app.post("/api/login")
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user or not pwd_context.verify(creds.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": user.id, "role": user.role, "name": user.name}

@app.get("/api/doctors")
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(models.DoctorProfile).all()
    result = []
    for d in doctors:
        user_info = db.query(models.User).filter(models.User.id == d.user_id).first()
        result.append({
            "id": d.user_id,
            "name": user_info.name,
            "hospital_name": d.hospital_name,
            "specialist": d.specialist,
            "rating": d.rating,
            "experience": d.years_of_experience
        })
    return result

@app.post("/api/appointments")
def book_appointment(booking: AppointmentBooking, db: Session = Depends(get_db)):
    new_apt = models.Appointment(
        patient_id=booking.patient_id,
        doctor_id=booking.doctor_id,
        date=booking.date,
        time=booking.time,
        symptoms=booking.symptoms,
        patient_contact=booking.patient_contact,
        status="pending"
    )
    db.add(new_apt)
    db.commit()
    db.refresh(new_apt)
    
    doctor_info = db.query(models.User).filter(models.User.id == booking.doctor_id).first()
    return {
        "message": "Appointment booked successfully",
        "appointment_id": new_apt.id,
        "doctor_name": doctor_info.name
    }

@app.get("/api/doctor/{doctor_id}/appointments")
def get_doctor_appointments(doctor_id: int, db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).filter(models.Appointment.doctor_id == doctor_id).all()
    result = []
    for apt in appointments:
        patient_info = db.query(models.User).filter(models.User.id == apt.patient_id).first()
        result.append({
            "id": apt.id,
            "patient_name": patient_info.name if patient_info else "Unknown",
            "date": apt.date,
            "time": apt.time,
            "symptoms": apt.symptoms,
            "patient_contact": apt.patient_contact,
            "status": apt.status
        })
    return result

@app.post("/api/predict-disease")
def predict_disease(request: SymptomRequest, db: Session = Depends(get_db)):
    raw_symptoms_str = ", ".join(request.symptoms)
    
    # 1. NLP Bridge: Translate natural language (Hindi/Marathi/English) to standard ML features
    from services.llm_service import extract_and_translate_symptoms
    standardized_symptoms = extract_and_translate_symptoms(raw_symptoms_str, feature_names)
    
    # If the AI couldn't extract anything, fallback to a safe default to prevent crash
    if not standardized_symptoms:
        standardized_symptoms = ["headache", "fever"] # minimal fallback
        
    # 2. Rule-based Severity Check
    severity_info = check_emergency_severity(standardized_symptoms)
    
    # Override severity if vitals are abnormal
    if request.vitals:
        if request.vitals.spo2 < 94 or request.vitals.bpm > 110 or request.vitals.bpm < 50:
            severity_info["risk_level"] = "Critical"
            severity_info["alert"] = "EMERGENCY: Abnormal vitals detected. Seek immediate medical attention."
    
    # 3. Prepare data for ML model
    input_data = {feature: [0] for feature in feature_names}
    for sym in standardized_symptoms:
        if sym in input_data:
            input_data[sym][0] = 1
            
    df_input = pd.DataFrame(input_data)
    predicted_disease = symptom_model.predict(df_input)[0]
    probabilities = symptom_model.predict_proba(df_input)[0]
    confidence = max(probabilities) * 100
    
    history_record = models.PredictionHistory(
        user_id=request.user_id,
        symptoms_input=raw_symptoms_str,
        predicted_disease=predicted_disease,
        confidence_score=confidence,
        severity_level=severity_info["risk_level"],
        precautions=["Drink plenty of fluids", "Rest", "Consult a doctor if symptoms persist."] 
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)
    
    # Generate detailed analysis based on severity
    if severity_info["risk_level"] in ["High", "Critical"]:
        analysis = f"Based on your symptoms ({', '.join(standardized_symptoms)}), the AI has detected a potential {predicted_disease} condition with a {severity_info['risk_level']} severity level. {severity_info['alert']} Please seek immediate medical attention."
    else:
        analysis = f"The AI predicts a possible {predicted_disease} condition based on the symptoms provided. While not immediately critical, it is highly recommended to monitor your symptoms closely and book an appointment."

    return {
        "prediction_id": history_record.id,
        "predicted_disease": predicted_disease,
        "analysis": analysis,
        "confidence": round(confidence, 2),
        "severity": severity_info,
        "precautions": history_record.precautions,
        "understood_symptoms": standardized_symptoms, # Expose this to the frontend
        "disclaimer": "For educational and decision-support purposes only."
    }

@app.post("/api/upload-report")
async def upload_medical_report(
    user_id: int = Form(...),
    report_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        
        # 1. Check if it's a Vision-based scan (X-Ray/MRI)
        if report_type.lower() in ["xray", "mri", "ct scan"]:
            from services.llm_service import analyze_medical_image
            ai_summary = analyze_medical_image(contents, report_type)
            extracted_text = "N/A - Image Scan"
        else:
            # 2. Otherwise it's a text report (Blood Test), use OCR
            extracted_text = extract_text_from_image(contents)
            if not extracted_text:
                raise HTTPException(status_code=400, detail="Could not extract text.")
            ai_summary = analyze_medical_report(extracted_text)
            
        report_record = models.MedicalReport(
            user_id=user_id,
            report_type=report_type,
            extracted_text=extracted_text,
            ai_summary=ai_summary
        )
        db.add(report_record)
        db.commit()
        db.refresh(report_record)
        return {
            "report_id": report_record.id,
            "ai_summary": ai_summary,
            "disclaimer": "For educational purposes only."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat(request: ChatRequest):
    from services.llm_service import chat_with_health_assistant
    response = chat_with_health_assistant(request.message)
    return {"reply": response}

class PrescriptionRequest(BaseModel):
    patient_name: str
    symptoms: str

@app.post("/api/generate-prescription")
def generate_prescription(request: PrescriptionRequest):
    from services.llm_service import generate_smart_prescription
    prescription_text = generate_smart_prescription(request.patient_name, request.symptoms)
    return {"prescription": prescription_text}

