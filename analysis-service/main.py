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


# --- Score Scaling Function ---
def scale_score(score: float, test_type: str) -> float:
    """
    Scales the raw score to a value between 1 and 10.
    
    NOTE: The max_scores are placeholders. You should replace them with realistic
    maximum values for each test to ensure accurate scaling.
    """
    max_scores = {
        'Vertical Jump': 100.0,  # in cm
        'Sit-ups': 50.0,
        'Endurance Run': 150.0, # High knees in 60s
        'Shuttle Run': 20.0, # Laps in given time
        'Push-ups': 50.0,
    }

    max_score = max_scores.get(test_type)

    if max_score is None:
        # If test type is not in the map, return a default score to avoid errors.
        return 5.0

    # Ensure score doesn't exceed max_score for scaling purposes
    score = min(score, max_score)
    
    # Scale score from 0-max_score to 1-10 range
    # The formula is: 1 + (score / max_score) * 9
    scaled_score = 1 + (score / max_score) * 9
    
    return round(scaled_score, 2)


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

    raw_score = 0
    try:
        # 3. Route to the Correct Analyzer Function
        print(f"🔬 Analyzing test '{testType}' from file '{temp_video_path}'...")
        if testType == 'Vertical Jump':
            if not athleteHeightCm:
                raise HTTPException(status_code=400, detail="Athlete height (cm) is required for Vertical Jump analysis.")
            raw_score = vertical_jump.calculate_height(temp_video_path, athleteHeightCm)
        elif testType == 'Sit-ups':
            raw_score = situps.count_reps(temp_video_path)
        elif testType == 'Endurance Run':
            raw_score = endurance.count_high_knees(temp_video_path)
        elif testType == 'Shuttle Run':
            raw_score = shuttle_run.count_laps(temp_video_path)
        
        # ADD THIS 'elif' BLOCK
        elif testType == 'Push-ups':
            raw_score = pushups.count_reps(temp_video_path)
            
        else:
            # If the test type sent from the backend is not supported
            raise HTTPException(status_code=400, detail=f"Invalid or unsupported test type: {testType}")

        print(f"🏆 Analysis complete. Raw Score: {raw_score}")
        
        # 4. Scale the Score
        scaled_score = scale_score(raw_score, testType)
        print(f" scaled score: {scaled_score}")


    except Exception as e:
        # Catch any errors during the analysis process
        print(f"❌ An error occurred during analysis: {e}")
        # Re-raise as an HTTPException to send a proper error response
        raise HTTPException(status_code=500, detail=f"Video analysis failed. Reason: {str(e)}")

    finally:
        # 5. Cleanup: This block always runs, ensuring we delete the temporary file
        # to prevent filling up the server's disk space.
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
            print(f"🗑️ Cleaned up temporary file: {temp_video_path}")

    # 6. Return the Scaled Score: Send a successful JSON response with the scaled score
    return {"message": "Analysis successful", "score": scaled_score}