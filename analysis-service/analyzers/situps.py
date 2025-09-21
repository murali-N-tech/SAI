import cv2
import mediapipe as mp
from .utils import calculate_angle

def count_reps(video_path: str) -> int:
    """
    Counts the number of sit-ups performed in a video.
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return 0
    
    counter = 0
    state = "down"  # Start in the 'down' position

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = pose.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        try:
            landmarks = results.pose_landmarks.landmark
            
            # Get coordinates for shoulder, hip, and knee
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            
            # Calculate angle
            angle = calculate_angle(shoulder, hip, knee)
            
            # State machine logic
            if angle < 100:  # Threshold for 'up' position
                if state == "down":
                    counter += 1
                    state = "up"
            
            if angle > 160:  # Threshold for 'down' position
                if state == "up":
                    state = "down"
        except:
            # Landmark not visible, skip frame
            pass
            
    cap.release()
    pose.close()
    
    return counter