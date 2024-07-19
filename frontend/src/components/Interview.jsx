"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Interview = () => {
  const [question, setQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const audioRef = useRef(null);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchQuestion();
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ... (keep the initializeSpeechRecognition function as is)
  const initializeSpeechRecognition = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setError("");
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(`Speech recognition error: ${event.error}`);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        if (isRecording) {
          recognitionRef.current.start();
        }
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = transcriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        transcriptRef.current = finalTranscript;
        setTranscript(finalTranscript + interimTranscript);
      };
    } else {
      setError("Speech recognition not supported in this browser");
    }
  };

  const fetchQuestion = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/question");
      setQuestion(res.data.question);
      speakText(res.data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Error fetching question. Please try again.");
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript("");
    transcriptRef.current = "";
    setError("");
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (transcriptRef.current.trim() === "") {
      setError("No speech detected. Please try again.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/answer", {
        answer: transcriptRef.current,
        question: question,
      });
      setResponse(res.data.response);
      setAudioUrl(res.data.audio_url);
      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = res.data.audio_url;
        audioRef.current.play();
      }
      // Fetch the next question after receiving feedback
      fetchQuestion();
    } catch (error) {
      console.error("Error sending answer:", error);
      setError("Error sending answer. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        } transition-colors duration-300`}
    >
      <div className="container mx-auto min-w-[700px] px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mock Interview</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${darkMode
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-800 text-white"
              }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div
          className={`bg-white ${darkMode ? "bg-opacity-10" : "bg-opacity-100"
            } rounded-lg shadow-lg p-6 mb-6`}
        >
          <h2 className="text-xl font-semibold mb-4">Question:</h2>
          <p className="text-lg mb-4">{question}</p>
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`${isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
              } 
            text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          {isRecording && (
            <p className="mt-2 text-sm text-gray-500">Recording... </p>
          )}
        </div>

        {transcript && (
          <div
            className={`bg-white ${darkMode ? "bg-opacity-10" : "bg-opacity-100"
              } rounded-lg shadow-lg p-6 mb-6`}
          >
            <h2 className="text-xl font-semibold mb-4">Your Answer:</h2>
            <p className="text-lg">{transcript}</p>
          </div>
        )}

        {response && (
          <div
            className={`bg-white ${darkMode ? "bg-opacity-10" : "bg-opacity-100"
              } rounded-lg shadow-lg p-6 mb-6`}
          >
            <h2 className="text-xl font-semibold mb-4">Feedback:</h2>
            <p className="text-lg">{response}</p>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        <audio ref={audioRef} style={{ display: 'none' }} controls />
      </div>
    </div>
  );
};

export default Interview;
