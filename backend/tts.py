from pyht import Client, TTSOptions, Format
import os
from dotenv import load_dotenv
load_dotenv()

playht_client = Client(os.getenv("PLAY_HT_USER_ID"), os.getenv("PLAY_HT_API_KEY"))
tts_options = TTSOptions(
    voice="s3://voice-cloning-zero-shot/f3c22a65-87e8-441f-aea5-10a1c201e522/original/manifest.json",
    format=Format.FORMAT_MP3,
    speed=1,
)

def tts(required_text, output_file):
    with open(output_file, "wb") as f:
        for chunk in playht_client.tts(text=required_text, voice_engine="PlayHT2.0-turbo", options=tts_options):
            f.write(chunk)