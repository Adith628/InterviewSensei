from octoai.text_gen import ChatMessage
from octoai.client import OctoAI
import os
from dotenv import load_dotenv
from tts import tts

# Load environment variables from .env file
load_dotenv()

# Retrieve API key from environment variables
api_key = os.getenv('OCTOAI_API_KEY')

# Initialize OctoAI client
client = OctoAI(api_key=api_key)

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
