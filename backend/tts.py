# import necessary libraries
from pyht import Client, TTSOptions, Format
from dotenv import load_dotenv
import os
import pygame  # import pygame for audio playback

# Load environment variables
load_dotenv()

# Initialize PlayHT API with your credentials
client = Client(os.getenv("PLAY_HT_USER_ID"), os.getenv("PLAY_HT_API_KEY"))

# Configure your stream
options = TTSOptions(
    voice="s3://voice-cloning-zero-shot/f3c22a65-87e8-441f-aea5-10a1c201e522/original/manifest.json",
    format=Format.FORMAT_MP3,
    speed=1,
)

# Define the file path where you want to save the audio
output_file = "./audio/output.mp3"

def tts(required_text):
    # Open the file in binary write mode
    with open(output_file, "wb") as f:
        # Start streaming
        for chunk in client.tts(text=required_text,
                                voice_engine="PlayHT2.0-turbo", options=options):
            # Write each chunk to the file
            f.write(chunk)

    # Initialize pygame mixer for audio playback
    pygame.mixer.init()

    # Load the output file for playback
    pygame.mixer.music.load(output_file)

    # Play the audio file
    pygame.mixer.music.play()

    # Wait until the music finishes playing
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(1)  # Adjust the delay to control playback rate

    # Exit the program
    pygame.quit()
    # exit(0)

# if __name__ == "__main__":
#     tts()