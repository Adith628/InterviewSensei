from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/api/ai', methods=['POST'])
def ai_response():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['file']
    if audio_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    return jsonify({'message': 'Audio file received successfully', 'filename': audio_file.filename})

if __name__ == '__main__':
    app.run(debug=True)
