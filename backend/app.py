from flask import Flask, render_template
from flask_cors import CORS
import threading
from audio import record_audio
from video import capture_video
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize stop event
stop_event = threading.Event()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start')
def start_capture():
    video_thread = threading.Thread(target=capture_video, args=(stop_event,))
    audio_thread = threading.Thread(target=record_audio, args=(stop_event,))

    video_thread.start()
    audio_thread.start()

    return "Started capturing audio and video."

@app.route('/api/stop')
def stop_capture():
    stop_event.set()
    return "Stopped capturing audio and video."

if __name__ == '__main__':
    app.run(debug=True)
