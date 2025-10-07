import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_audio(filepath: str) -> str:
    """
    Transcribes a .wav audio file using Groq Whisper model.
    Returns transcribed text.
    """
    with open(filepath, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            response_format="verbose_json",
            temperature=0.0
        )
    
    # Safely extract text depending on the object type
    if hasattr(transcription, "text"):
        return transcription.text
    elif hasattr(transcription, "data") and "text" in transcription.data:
        return transcription.data["text"]
    else:
        # fallback — if object is dict-like
        try:
            return transcription["text"]
        except Exception:
            print("⚠️ Could not extract text field from transcription response.")
            print("Full response:", transcription)
            return ""
