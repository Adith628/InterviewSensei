from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os
from dotenv import load_dotenv
from octoai.text_gen import ChatMessage
from octoai.client import OctoAI

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Retrieve API key from environment variables
api_key = os.getenv('OCTOAI_API_KEY')

# Initialize OctoAI client
client = OctoAI(api_key=api_key)

questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why do you want to work for our company?",
    "Where do you see yourself in 5 years?",
]

def chat_with_llm(user_input, question):
    system_prompt = "You are an AI assistant conducting a mock job interview. Provide constructive feedback on the candidate's answer. Be concise but informative."
    user_prompt = f"Question: {question}\nCandidate's Answer: {user_input}\nPlease provide feedback on the candidate's answer:"

    response = ""
    for stream_response in client.text_gen.create_chat_completion_stream(
        max_tokens=150,
        messages=[
            ChatMessage(content=system_prompt, role="system"),
            ChatMessage(content=user_prompt, role="user")
        ],
        model="hermes-2-pro-llama-3-8b",
        presence_penalty=0,
        temperature=0.7,
        top_p=1,
    ):
        if stream_response.choices[0].delta.content:
            response += stream_response.choices[0].delta.content

    return response.strip()

@app.route('/api/question', methods=['GET'])
def get_question():
    question = random.choice(questions)
    return jsonify({"question": question})

@app.route('/api/answer', methods=['POST'])
def process_answer():
    data = request.json
    if 'answer' not in data or 'question' not in data:
        return jsonify({"error": "No answer or question provided"}), 400

    answer = data['answer']
    question = data['question']

    # Pass the answer to the LLM and get feedback
    llm_response = chat_with_llm(answer, question)

    return jsonify({"response": llm_response})

if __name__ == '__main__':
    app.run(debug=True)