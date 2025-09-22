import cv2
import mediapipe as mp
import numpy as np

def count_laps(video_path: str) -> int:
    """
    Counts the number of laps in a shuttle run video.
    A "lap" is considered one length of the shuttle run (crossing from one side to the other).
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return 0

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    center_line_x = frame_width / 2

    laps = 0
    # Possible states: None (for initial frame), "left", "right"
    position_state = None 

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
        
        # Extract landmarks
        try:
            landmarks = results.pose_landmarks.landmark
            
            # Use a central landmark like the nose to track horizontal position
            nose_x = landmarks[mp_pose.PoseLandmark.NOSE.value].x * frame_width

            # Initialize the state on the first valid frame
            if position_state is None:
                position_state = "left" if nose_x < center_line_x else "right"

            # Check for crossing the center line to the left
            if nose_x < center_line_x and position_state == "right":
                laps += 1
                position_state = "left"
                print(f"Crossed to left, laps: {laps}")

            # Check for crossing the center line to the right
            elif nose_x > center_line_x and position_state == "left":
                laps += 1
                position_state = "right"
                print(f"Crossed to right, laps: {laps}")

        except Exception as e:
            # Landmark not visible, skip the current frame
            pass
            
    cap.release()
    pose.close()
    
    return laps