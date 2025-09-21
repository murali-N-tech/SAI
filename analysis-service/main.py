import os
import shutil
import requests
from fastapi import FastAPI, Form, File, UploadFile, HTTPException, Header, BackgroundTasks

# --- Import your custom analyzer modules ---
from analyzers import vertical_jump, situps, endurance, shuttle_run, utils

# --- Configuration ---
app = FastAPI(title="Khel Pratibha Analysis Service")

INTERNAL_API_SECRET = "khel-pratibha-internal-secret-987xyz"
BACKEND_CALLBACK_URL = "http://localhost:5000/api/v1/submissions/update-score"

async def analyze_video_in_background(temp_video_path: str, testType: str, submissionId: str, athleteHeightCm: float = None):
    score = -1  # Default to -1 to indicate an error
    try:
        processed_video_path = utils.preprocess_video(temp_video_path)
        
        print(f"🔬 Analyzing test '{testType}' for submission '{submissionId}'...")
        if testType == 'Vertical Jump':
            score = vertical_jump.calculate_height(processed_video_path, athleteHeightCm)
        elif testType == 'Sit-ups':
            score = situps.count_reps(processed_video_path)
        elif testType == 'Endurance Run':
            score = endurance.count_high_knees(processed_video_path)
        elif testType == 'Shuttle Run':
            score = shuttle_run.count_laps(processed_video_path)
        else:
            raise ValueError(f"Unsupported test type: {testType}")
        
        print(f"🏆 Analysis complete for {submissionId}. Score: {score}")

    except Exception as e:
        print(f"❌ An error occurred during analysis for {submissionId}: {e}")
    
    finally:
        try:
            print(f"📞 Calling back backend for submission {submissionId} with score {score}")
            requests.patch(BACKEND_CALLBACK_URL, json={"submissionId": submissionId, "score": score})
        except Exception as cb_error:
            print(f"🚨 Failed to send score back to backend for {submissionId}: {cb_error}")

        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
        if 'processed_video_path' in locals() and os.path.exists(processed_video_path):
            os.remove(processed_video_path)

@app.post("/analyze")
async def analyze_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    testType: str = Form(...),
    submissionId: str = Form(...),
    athleteHeightCm: float = Form(None),
    x_internal_api_secret: str = Header(...)
):
    if x_internal_api_secret != INTERNAL_API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API secret.")

    temp_video_path = f"temp_{video.filename}"
    try:
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
    except Exception as e:
        # If saving the file fails, return an error immediately
        raise HTTPException(status_code=500, detail=f"Failed to save video file: {e}")


    background_tasks.add_task(analyze_video_in_background, temp_video_path, testType, submissionId, athleteHeightCm)
            
    return {"message": "Analysis has been started in the background."}