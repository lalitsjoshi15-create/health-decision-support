import pytesseract
from PIL import Image
import io

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extracts text from an image byte stream using Tesseract OCR.
    Ensure Tesseract is installed on the system environment.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # In a real production setup, we might need to do image pre-processing
        # (grayscale, thresholding) using OpenCV to improve OCR accuracy on medical reports.
        
        extracted_text = pytesseract.image_to_string(image)
        return extracted_text.strip()
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""
