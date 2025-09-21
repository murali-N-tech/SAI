import cv2
import numpy as np
import mediapipe as mp

def find_lines(frame):
    """
    Finds two vertical lines in the initial frame to set the shuttle run boundaries.
    Returns the x-coordinates of the two lines.
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi / 180, 200)

    if lines is None:
        return None, None
    
    x_coords = []
    for rho, theta in lines[0]:
        if np.isclose(theta, 0) or np.isclose(theta, np.pi):
            a = np.cos(theta)
            x0 = a * rho
            x_coords.append(x0)

    if len(x_coords) < 2:
        return None, None
    
    x_coords = sorted(x_coords)
    return x_coords[0], x_coords[-1]


def count_laps(video_path: str) -> int:
    """
    Counts the number of completed shuttle run laps in a video.
    It auto-detects two vertical lines to define the running lanes.
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return 0

    left_line_x, right_line_x = None, None
    lap_counter = 0
    # State tracks which side the athlete is on. Starts outside the markers.
    state = "outside" 

    # Kalman filter for predictive tracking
    kalman = cv2.KalmanFilter(4, 2)
    kalman.measurementMatrix = np.array([[1, 0, 0, 0], [0, 1, 0, 0]], np.float32)
    kalman.transitionMatrix = np.array([[1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0], [0, 0, 0, 1]], np.float32)
    kalman.processNoiseCov = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], np.float32) * 0.03
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        # --- Line Detection on the first valid frame ---
        if left_line_x is None and frame_count > 10: # Wait a few frames for camera to stabilize
            left_line_x, right_line_x = find_lines(frame)
            if left_line_x is None:
                print("Failed to initialize lines. Aborting analysis.")
                cap.release()
                pose.close()
                return 0
            print(f"Lines detected at X-coordinates: {left_line_x}, {right_line_x}")

        if left_line_x is None:
            continue # Skip analysis until lines are found

        # --- Athlete Tracking ---
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Use the midpoint of the hips as the athlete's center
            left_hip_x = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x
            right_hip_x = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x
            athlete_center_x = (left_hip_x + right_hip_x) / 2 * frame.shape[1] # Convert to pixel coordinates

            # Use Kalman filter to predict and correct the position
            prediction = kalman.predict()
            measurement = np.array([[np.float32(athlete_center_x)], [np.float32(0)]])
            kalman.correct(measurement)
            
            predicted_x = prediction[0][0]

            # --- State Machine for Lap Counting ---
            # This logic prevents counting a lap multiple times if an athlete hovers near a line.
            
            # Athlete crosses the right marker from the left
            if predicted_x > right_line_x and state == "at_left_marker":
                lap_counter += 1
                state = "at_right_marker"
                print(f"Lap {lap_counter} completed (Right)")

            # Athlete crosses the left marker from the right
            elif predicted_x < left_line_x and state == "at_right_marker":
                lap_counter += 1
                state = "at_left_marker"
                print(f"Lap {lap_counter} completed (Left)")

            # Initial state: athlete starts by crossing one of the lines
            elif state == "outside":
                if predicted_x > left_line_x and predicted_x < right_line_x:
                    # Determine which side they are closer to, to set the initial state
                    if abs(predicted_x - left_line_x) < abs(predicted_x - right_line_x):
                        state = "at_left_marker"
                    else:
                        state = "at_right_marker"
                    print(f"Athlete detected inside markers. Initial state set to: {state}")

    cap.release()
    pose.close()
    
    print(f"Total laps counted: {lap_counter}")
    return lap_counter