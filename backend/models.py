from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    role = Column(String, default="patient") # 'patient' or 'doctor'
    
    # Patient specific fields
    address = Column(String, nullable=True)
    contact_no = Column(String, nullable=True)
    current_doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    hospital_name = Column(String)
    hospital_address = Column(String)
    specialist = Column(String)
    degree = Column(String)
    years_of_experience = Column(Integer)
    rating = Column(Float, default=4.5)
    is_available = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="doctor_profile")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String) # YYYY-MM-DD
    time = Column(String) # HH:MM AM/PM
    symptoms = Column(Text)
    patient_contact = Column(String)
    status = Column(String, default="pending") # pending, confirmed, completed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symptoms_input = Column(Text)
    predicted_disease = Column(String, index=True)
    confidence_score = Column(Float)
    severity_level = Column(String)
    precautions = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String)
    extracted_text = Column(Text)
    ai_summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
