import os
import shutil
from fastapi import FastAPI, Form, File, UploadFile, HTTPException, Header

# --- Import your custom analyzer modules ---
# ADD 'pushups' to the import list
from analyzers import vertical_jump, situps, endurance, shuttle_run, pushups, utils

# --- Configuration ---
# Initialize the FastAPI app with a title for the auto-generated docs
app = FastAPI(title="Khel Pratibha Analysis Service")

# Get the internal API secret from environment variables for security.
# Provide a default value for easier development.
INTERNAL_API_SECRET ="khel-pratibha-internal-secret-987xyz"


# --- API Endpoint ---
@app.post("/analyze")
async def analyze_video(
    # --- Input Parameters from the multipart/form-data request ---
    video: UploadFile = File(...),
    testType: str = Form(...),
    athleteHeightCm: float = Form(None),  # Optional, but required for vertical jump

    # --- Security Header ---
    x_internal_api_secret: str = Header(...)
):
    """
    This endpoint receives a video file directly, analyzes it based on the test type,
    and returns the calculated score to the caller (your Node.js backend).
    """
    # 1. Security Check: Ensure the request is from a trusted source.
    if x_internal_api_secret != INTERNAL_API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API secret.")

    # 2. Save Uploaded File Temporarily: OpenCV needs a file path to read from.
    # We save the uploaded file to a temporary location on the server's disk.
    temp_video_path = f"temp_{video.filename}"
    try:
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
    except Exception as e:
        print(f"Error saving temporary file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save video file for processing.")

    score = 0
    try:
        # 3. Route to the Correct Analyzer Function
        print(f"🔬 Analyzing test '{testType}' from file '{temp_video_path}'...")
        if testType == 'Vertical Jump':
            if not athleteHeightCm:
                raise HTTPException(status_code=400, detail="Athlete height (cm) is required for Vertical Jump analysis.")
            score = vertical_jump.calculate_height(temp_video_path, athleteHeightCm)
        elif testType == 'Sit-ups':
            score = situps.count_reps(temp_video_path)
        elif testType == 'Endurance Run':
            score = endurance.count_high_knees(temp_video_path)
        elif testType == 'Shuttle Run':
            score = shuttle_run.count_laps(temp_video_path)
        
        # ADD THIS 'elif' BLOCK
        elif testType == 'Push-ups':
            score = pushups.count_reps(temp_video_path)
            
        else:
            # If the test type sent from the backend is not supported
            raise HTTPException(status_code=400, detail=f"Invalid or unsupported test type: {testType}")

        print(f"🏆 Analysis complete. Score: {score}")

    except Exception as e:
        # Catch any errors during the analysis process
        print(f"❌ An error occurred during analysis: {e}")
        # Re-raise as an HTTPException to send a proper error response
        raise HTTPException(status_code=500, detail=f"Video analysis failed. Reason: {str(e)}")

    finally:
        # 4. Cleanup: This block always runs, ensuring we delete the temporary file
        # to prevent filling up the server's disk space.
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
            print(f"🗑️ Cleaned up temporary file: {temp_video_path}")

    # 5. Return the Score: Send a successful JSON response with the score
    return {"message": "Analysis successful", "score": score}