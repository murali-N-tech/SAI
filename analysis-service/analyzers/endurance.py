import cv2
import mediapipe as mp

def count_high_knees(video_path: str) -> int:
    """
    Counts high knees as a proxy for an endurance test.
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return 0

    counter = 0
    left_leg_state = "down"
    right_leg_state = "down"

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        try:
            landmarks = results.pose_landmarks.landmark

            # Get coordinates for hips and knees
            left_hip_y = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
            left_knee_y = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
            right_hip_y = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
            right_knee_y = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y

            # Left leg logic
            if left_knee_y < left_hip_y and left_leg_state == "down":
                left_leg_state = "up"
                counter += 1
            elif left_knee_y > left_hip_y:
                left_leg_state = "down"

            # Right leg logic
            if right_knee_y < right_hip_y and right_leg_state == "down":
                right_leg_state = "up"
                counter += 1
            elif right_knee_y > right_hip_y:
                right_leg_state = "down"
        except:
            pass

    cap.release()
    pose.close()

    return counter