"use client";

import { useState } from "react";
import AudioRecorder from "../AudioRecorder";

export default function HomePage() {
  const [response, setResponse] = useState("");

  const handleAudioSubmit = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    try {
      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data.message || data.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>AI Audio Conversation</h1>
      <AudioRecorder onSubmit={handleAudioSubmit} />
      {response && <p>Backend Response: {response}</p>}
    </div>
  );
}
