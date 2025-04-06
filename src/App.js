import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleSpeak = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleStartListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setText(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleReset = () => {
    setText("");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    speechSynthesis.cancel();
  };

  return (
    <div className="container">
      <h2>🎤 Voice ↔ Text Converter</h2>

      <textarea
        rows="6"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or speak here..."
      />

      <div className="button-container">
        <button onClick={handleSpeak} className="button">
          🔊 Speak Text
        </button>
        {!isListening ? (
          <button onClick={handleStartListening} className="button">
            🎙️ Start Listening
          </button>
        ) : (
          <button onClick={handleStopListening} className="button button-red">
            🛑 Stop Listening
          </button>
        )}
        <button onClick={handleReset} className="button button-gray">
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default App;
