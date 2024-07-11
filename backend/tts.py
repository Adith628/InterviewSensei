from pyht import Client, TTSOptions, Format
import os
from dotenv import load_dotenv
import pygame

load_dotenv()

playht_client = Client(os.getenv("PLAY_HT_USER_ID"), os.getenv("PLAY_HT_API_KEY"))
tts_options = TTSOptions(
    voice="s3://voice-cloning-zero-shot/f3c22a65-87e8-441f-aea5-10a1c201e522/original/manifest.json",
    format=Format.FORMAT_MP3,
    speed=1,
)
output_file = "./output.mp3"

def tts(required_text):
    with open(output_file, "wb") as f:
        for chunk in playht_client.tts(text=required_text, voice_engine="PlayHT2.0-turbo", options=tts_options):
            f.write(chunk)
    
    pygame.mixer.init()
    pygame.mixer.music.load(output_file)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(1)
    
    pygame.quit()
