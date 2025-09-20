import cv2
import mediapipe as mp
import numpy as np

def calculate_height(video_path: str, athlete_height_cm: float) -> float:
    """
    Calculates vertical jump height in cm.
    Requires the athlete's actual height for calibration.
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return 0.0

    pixels_per_cm = None
    hip_y_coords = []
    is_calibrated = False

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert the BGR image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        # Make detection
        results = pose.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Use landmarks for calibration and tracking
            left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
            right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
            left_heel = landmarks[mp_pose.PoseLandmark.LEFT_HEEL]
            right_heel = landmarks[mp_pose.PoseLandmark.RIGHT_HEEL]

            if left_hip.visibility > 0.8 and left_heel.visibility > 0.8:
                # --- Calibration Step ---
                # Assume the athlete stands straight in the first few valid frames
                if not is_calibrated:
                    pixel_height = abs(left_heel.y - landmarks[mp_pose.PoseLandmark.NOSE].y) * frame.shape[0]
                    if pixel_height > 0:
                        pixels_per_cm = pixel_height / athlete_height_cm
                        is_calibrated = True
                        print(f"Calibration successful. Pixels per cm: {pixels_per_cm}")

                # --- Tracking Step ---
                # Average hip Y-coordinate
                avg_hip_y = (left_hip.y + right_hip.y) / 2
                hip_y_coords.append(avg_hip_y * frame.shape[0]) # Store in pixel space

    cap.release()
    pose.close()

    if not is_calibrated or not hip_y_coords:
        print("Could not calibrate or track hips.")
        return 0.0

    # Find the lowest point (crouch) and highest point (jump peak) of the hips
    crouch_y = max(hip_y_coords)
    peak_y = min(hip_y_coords)
    
    jump_height_pixels = crouch_y - peak_y
    jump_height_cm = jump_height_pixels / pixels_per_cm

    # Return a positive value, rounded to 2 decimal places
    return round(abs(jump_height_cm), 2)