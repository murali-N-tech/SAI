import cv2
import numpy as np
import requests
import os

def download_video(video_url: str, temp_dir: str = "temp_videos") -> str:
    """
    Downloads a video from a URL and saves it to a temporary file.
    Returns the path to the downloaded file.
    """
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    # Generate a unique filename
    video_filename = os.path.join(temp_dir, f"temp_{os.urandom(8).hex()}.mp4")

    try:
        with requests.get(video_url, stream=True) as r:
            r.raise_for_status()
            with open(video_filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        return video_filename
    except requests.exceptions.RequestException as e:
        print(f"Error downloading video: {e}")
        return None


def calculate_angle(a, b, c):
    """
    Calculates the angle between three 2D points (landmarks).
    a, b, c are tuples or lists of (x, y) coordinates.
    The angle is calculated at point 'b'.
    """
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point (vertex)
    c = np.array(c)  # End point

    # Calculate vectors from the mid point
    ba = a - b
    bc = c - b

    # Calculate the angle using the dot product formula
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.arccos(cosine_angle)

    # Convert angle from radians to degrees
    return np.degrees(angle)