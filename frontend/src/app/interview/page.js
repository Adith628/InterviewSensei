"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const page = () => {
    const [qno, setQno] = useState(0);
    const [question, setQuestion] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [response, setResponse] = useState("");
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");

    const router = useRouter();
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

    const initializeSpeechRecognition = () => {
        if (
            "SpeechRecognition" in window ||
            "webkitSpeechRecognition" in window
        ) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
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
            setQno((prevQno) => prevQno + 1);
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
        <div className="bg-black h-screen">
            <Navbar className="top-2 dark border rounded-full border-gray-700/50" />
            <div className="absolute top-0 left-0 mx-5">
                <Image
                    src="/logo2.svg"
                    width={50}
                    height={50}
                    className="h-[100%] w-[100px]"
                />
            </div>
            <div className="w-full h-full p-20  pb-10 flex flex-col gap-4 text-white justify-center items-center ">
                <div className="w-full mt-5">
                    <button
                        onClick={() => router.push("/")}
                        className="flex hover:bg-black items-center gap-2 bg-gray-800/20 border rounded-full border-gray-600/50 px-4 py-1"
                    >
                        <Image src="/back.svg" width={10} height={10} />
                        <span className="text-gray-300">Back</span>
                    </button>
                </div>
                <div className="border flex flex-col gap-2 justify-start items-center border-gray-600/50 bg-slate-600/20 rounded-2xl h-full w-full ">
                    <div className="text-white p-5 font-medium block self-start">
                        Question {qno}
                    </div>
                    <div className="text-white max-w-5xl text-3xl text-center">
                        {/* Can you walk me through a project where you had to design and
            implement user interfaces for a digital platform? What challenges
            did you face and how did you address them? */}
                        {question}
                    </div>
                    <div className="my-5">
                        <button
                            onClick={
                                isRecording
                                    ? handleStopRecording
                                    : handleStartRecording
                            }
                            className={`py-2 px-4  rounded-full ${
                                isRecording
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                            } `}
                        >
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </button>
                    </div>
                    <div className="text-xs flex gap-2 self-start  max-w-4xl">
                        <div className="ml-40">Transcript : </div>
                        <div className=""> {transcript}</div>
                    </div>
                    <div className="text-lg mt-10 flex gap-2 self-start  max-w-4xl">
                        <div className="ml-40">Feedback : </div>
                        <div className=""> {response}</div>
                    </div>
                    <audio
                        ref={audioRef}
                        style={{ display: "none" }}
                        controls
                    />
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default page;
