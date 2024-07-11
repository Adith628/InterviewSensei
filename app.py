from flask import Flask, render_template
from flask_cors import CORS
from octoai.text_gen import ChatMessage
from octoai.client import OctoAI
from pyht import Client, TTSOptions, Format
import threading
import cv2
import pyaudio
import numpy as np
import speech_recognition as sr
from dotenv import load_dotenv
import os
import pygame

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize speech recognizer and stop event
recognizer = sr.Recognizer()
stop_event = threading.Event()

# Retrieve API key from environment variables
api_key = os.getenv('OCTOAI_API_KEY')

# Initialize OctoAI client
client = OctoAI(api_key=api_key)

# Initialize PlayHT client with TTS options
playht_client = Client(os.getenv("PLAY_HT_USER_ID"), os.getenv("PLAY_HT_API_KEY"))
tts_options = TTSOptions(
    voice="s3://voice-cloning-zero-shot/f3c22a65-87e8-441f-aea5-10a1c201e522/original/manifest.json",
    format=Format.FORMAT_MP3,
    speed=1,
)
output_file = "./audio/output.mp3"

def tts(required_text):
    # Write TTS output to file
    with open(output_file, "wb") as f:
        for chunk in playht_client.tts(text=required_text, voice_engine="PlayHT2.0-turbo", options=tts_options):
            f.write(chunk)
    
    # Play the audio file using pygame
    pygame.mixer.init()
    pygame.mixer.music.load(output_file)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(1)
    
    pygame.quit()

def chat_with_llm(user_input):
    history = []

    while user_input.lower() != "exit":
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        
        prompt = "\n".join([f"q: {q} a: {a}" for q, a in history[-4:]]) + f"\nq: {user_input} a: "
        answer = ""
        print("LLM: ", end='', flush=True)

        for response in client.text_gen.create_chat_completion_stream(
            max_tokens=150,
            messages=[
                ChatMessage(content="You are a helpful assistant.", role="system"),
                ChatMessage(content=prompt, role="user")
            ],
            model="hermes-2-pro-llama-3-8b",
            presence_penalty=0,
            temperature=0.7,
            top_p=1,
        ):
            if response.choices[0].delta.content:
                answer += response.choices[0].delta.content
                print(response.choices[0].delta.content, end='', flush=True)
        
        history.append([user_input, answer])
        print()
        tts(history[-1][1])

def recognize_speech_from_mic(audio, results):
    try:
        text = recognizer.recognize_google(audio)
        results.append(text)
    except (sr.UnknownValueError, sr.RequestError):
        pass

def stt(stop_event):
    chunk = 1024
    sample_format = pyaudio.paInt16
    channels = 1
    rate = 44100
    p = pyaudio.PyAudio()
    results = []

    stream = p.open(format=sample_format, channels=channels, rate=rate, input=True, frames_per_buffer=chunk)
    print("Recording audio... Press Ctrl+C to stop.")
    frames = []

    try:
        while not stop_event.is_set():
            data = stream.read(chunk)
            frames.append(data)
            if len(frames) >= rate / chunk * 5:
                audio_data = np.frombuffer(b''.join(frames), dtype=np.int16)
                audio_data = sr.AudioData(audio_data.tobytes(), rate, 2)
                recognize_speech_from_mic(audio_data, results)
                frames = []
    except KeyboardInterrupt:
        pass
    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()

        if frames:
            audio_data = np.frombuffer(b''.join(frames), dtype=np.int16)
            audio_data = sr.AudioData(audio_data.tobytes(), rate, 2)
            recognize_speech_from_mic(audio_data, results)

    return " ".join(results)

def record_audio():
    try:
        recognized_text = stt(stop_event)
        print("Recognized text:", recognized_text)
        chat_with_llm(recognized_text)
    except KeyboardInterrupt:
        stop_event.set()
        print("Recording stopped by user.")

def capture_video(stop_event):
    cap = cv2.VideoCapture(0)

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start')
def start_capture():
    video_thread = threading.Thread(target=capture_video, args=(stop_event,))
    audio_thread = threading.Thread(target=record_audio)

    video_thread.start()
    audio_thread.start()

    return "Started capturing audio and video."

@app.route('/api/stop')
def stop_capture():
    stop_event.set()
    return "Stopped capturing audio and video."

if __name__ == '__main__':
    app.run(debug=True)
