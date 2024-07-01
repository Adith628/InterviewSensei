# import the playht SDK
from pyht import Client, TTSOptions, Format
from dotenv import load_dotenv
import os
load_dotenv()

# Initialize PlayHT API with your credentials
client = Client(os.getenv("PLAY_HT_USER_ID"),os.getenv("PLAY_HT_API_KEY")) #create environment variables for PLAY_HT_USER_ID and PLAY_HT_API_KEY

# configure your stream
options = TTSOptions(
    voice="s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
    format=Format.FORMAT_MP3,
    speed=1,
)

# Define the file path where you want to save the audio
output_file = "output2.mp3"

# Open the file in binary write mode
with open(output_file, "wb") as f:
    # Start streaming
    for chunk in client.tts(text="Hey, this is Abhishek.",
                            voice_engine="PlayHT2.0-turbo", options=options):
        # Write each chunk to the file
        f.write(chunk)
