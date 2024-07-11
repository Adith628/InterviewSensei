import pyaudio
import numpy as np
import speech_recognition as sr
from chat import chat_with_llm

recognizer = sr.Recognizer()

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

def record_audio(stop_event):
    try:
        recognized_text = stt(stop_event)
        print("Recognized text:", recognized_text)
        chat_with_llm(recognized_text)
    except KeyboardInterrupt:
        stop_event.set()
        print("Recording stopped by user.")
