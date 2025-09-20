import cv2
import numpy as np
import mediapipe as mp

def find_markers(frame):
    """
    Finds two bright orange markers in the initial frame to set the shuttle run boundaries.
    Returns the x-coordinates of the two markers.
    """
    # Convert the frame to the HSV color space, which is better for color detection
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Define the range for a bright orange color in HSV
    # This range can be adjusted if using different colored markers
    lower_orange = np.array([5, 150, 150])
    upper_orange = np.array([15, 255, 255])

    # Create a mask that isolates the orange pixels
    mask = cv2.inRange(hsv, lower_orange, upper_orange)

    # Clean up the mask with morphological operations to remove noise
    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)

    # Find the contours of the objects in the mask
    contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) < 2:
        print("Warning: Could not detect two markers. Please use bright orange cones.")
        return None, None

    # Sort contours by area and take the two largest ones
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:2]

    marker_x_coords = []
    for c in contours:
        # Calculate the center (centroid) of the contour
        M = cv2.moments(c)
        if M["m00"] > 0:
            cx = int(M["m10"] / M["m00"])
            marker_x_coords.append(cx)

    if len(marker_x_coords) == 2:
        # Sort the coordinates to have a consistent left and right marker
        return sorted(marker_x_coords)
    
    return None, None


def count_laps(video_path: str) -> int:
    """
    Counts the number of completed shuttle run laps in a video.
    It auto-detects two orange markers to define the running lanes.
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return 0

    left_marker_x, right_marker_x = None, None
    lap_counter = 0
    # State tracks which side the athlete is on. Starts outside the markers.
    state = "outside" 

    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        # --- Marker Detection on the first valid frame ---
        if left_marker_x is None and frame_count > 10: # Wait a few frames for camera to stabilize
            left_marker_x, right_marker_x = find_markers(frame)
            if left_marker_x is None:
                print("Failed to initialize markers. Aborting analysis.")
                cap.release()
                pose.close()
                return 0
            print(f"Markers detected at X-coordinates: {left_marker_x}, {right_marker_x}")

        if left_marker_x is None:
            continue # Skip analysis until markers are found

        # --- Athlete Tracking ---
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Use the midpoint of the hips as the athlete's center
            left_hip_x = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x
            right_hip_x = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x
            athlete_center_x = (left_hip_x + right_hip_x) / 2 * frame.shape[1] # Convert to pixel coordinates

            # --- State Machine for Lap Counting ---
            # This logic prevents counting a lap multiple times if an athlete hovers near a line.
            
            # Athlete crosses the right marker from the left
            if athlete_center_x > right_marker_x and state == "at_left_marker":
                lap_counter += 1
                state = "at_right_marker"
                print(f"Lap {lap_counter} completed (Right)")

            # Athlete crosses the left marker from the right
            elif athlete_center_x < left_marker_x and state == "at_right_marker":
                lap_counter += 1
                state = "at_left_marker"
                print(f"Lap {lap_counter} completed (Left)")

            # Initial state: athlete starts by crossing one of the lines
            elif state == "outside":
                if athlete_center_x > left_marker_x and athlete_center_x < right_marker_x:
                    # Determine which side they are closer to, to set the initial state
                    if abs(athlete_center_x - left_marker_x) < abs(athlete_center_x - right_marker_x):
                        state = "at_left_marker"
                    else:
                        state = "at_right_marker"
                    print(f"Athlete detected inside markers. Initial state set to: {state}")

    cap.release()
    pose.close()
    
    print(f"Total laps counted: {lap_counter}")
    return lap_counter