from flask import Flask, render_template, Response
from flask_cors import CORS
import cv2
import speech_recognition as sr
import numpy as np
import pyaudio
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS

# Initialize recognizer
recognizer = sr.Recognizer()

# Function to recognize speech from audio
def recognize_speech_from_mic(audio):
    try:
        text = recognizer.recognize_google(audio)
        print("You said: " + text)
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))

# Function to capture audio
def record_audio(stop_event):
    chunk = 1024  # Record in chunks of 1024 samples
    sample_format = pyaudio.paInt16  # 16 bits per sample
    channels = 1
    rate = 44100  # Record at 44100 samples per second
    p = pyaudio.PyAudio()  # Create an interface to PortAudio

    stream = p.open(format=sample_format,
                    channels=channels,
                    rate=rate,
                    input=True,
                    frames_per_buffer=chunk)

    print("Recording audio...")

    frames = []

    try:
        while not stop_event.is_set():
            data = stream.read(chunk)
            frames.append(data)
            if len(frames) >= rate / chunk * 5:  # Process every 5 seconds
                audio_data = np.frombuffer(b''.join(frames), dtype=np.int16)
                audio_data = sr.AudioData(audio_data.tobytes(), rate, 2)
                threading.Thread(target=recognize_speech_from_mic, args=(audio_data,)).start()
                frames = []
    except KeyboardInterrupt:
        pass
    finally:
        print("Stopped recording")
        stream.stop_stream()
        stream.close()
        p.terminate()

# Function to capture video
def capture_video(stop_event):
    cap = cv2.VideoCapture(0)  # Capture video from the first camera

    if not cap.isOpened():
        print("Error: Could not open video stream")
        return

    print("Press 'q' to stop recording")

    while cap.isOpened() and not stop_event.is_set():
        ret, frame = cap.read()
        if ret:
            cv2.imshow('Video', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                stop_event.set()
                break
        else:
            break

    cap.release()
    cv2.destroyAllWindows()

# Create a stop event
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
