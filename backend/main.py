from octoai.text_gen import ChatMessage
from octoai.client import OctoAI
import os
import json
from dotenv import load_dotenv


# To load environment variables from .env file
load_dotenv()

# To retrieve the API key from environment variables
api_key = os.getenv('OCTOAI_API_KEY')

# To ensure the API key is loaded
if not api_key:
    raise ValueError("API key not found. Please ensure OCTOAI_API_KEY is set in the .env file.")

# Initialize the OctoAI client
client = OctoAI(
    api_key=api_key,
)

# Function to chat with the LLM
def chat_with_llm():
    user_input = ""
    history = []
    while user_input.lower() != "exit":
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        prompt = ""

        # Appending last 4 (max) prompts and answers from history to the input
        for q,a in history[-4:]:
            prompt += f" q: {q} a: {a} \n"
        prompt += f" q: {user_input} a: \n"

        n=0
        answer = ""
        print("LLM: ", end='', flush=True)
        for response in client.text_gen.create_chat_completion_stream(
            max_tokens=150,
            messages=[
                ChatMessage(
                    content="You are a helpful assistant.",
                    role="system"
                ),
                ChatMessage(
                    content=prompt,
                    role="user"
                )
            ],
            model="hermes-2-pro-llama-3-8b",
            presence_penalty=0,
            temperature=0.7,    # Adjust temperature for more creative responses
            top_p=1,
        ):
            # Condition to avoid "None" which otherwise appears at the start of the response
            if (n==0):
                n+=1
            else:
                answer += response.choices[0].delta.content
                print(response.choices[0].delta.content, end='', flush=True)
        history.append([user_input, answer])
        # print(history)    # Printing the history of prompts and answers
        print()     # Adding a new line for clarity


if __name__ == "__main__":
        chat_with_llm()
