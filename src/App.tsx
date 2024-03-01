import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const connectWebsocket = () => {
      ws.current = new WebSocket("ws://localhost:8080");
      ws.current.onopen = () => {
        console.log("WebSocket Connected");
      };
      ws.current.onmessage = (event) => {
        const timestamp = new Date().toLocaleString();
        setMessages(prevMessages => [`${prevMessages.length + 1}: ${event.data} (${timestamp})`, ...prevMessages]);
      };
      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
      ws.current.onclose = () => {
        console.log("WebSocket Connection Closed");
      };
    };
    setTimeout(connectWebsocket, 1);
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  const sendMessage = () => {
    if (ws.current) {
      ws.current.send(inputMessage);
      setInputMessage("");
    }
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    const handleScroll = () => {
      if (messagesContainer) {
        console.log("Scroll Top: ", messagesContainer.scrollTop.toFixed(1));
      }
    };
    messagesContainer?.addEventListener('scroll', handleScroll);
    return () => {
      messagesContainer?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Messages</h2>
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <input
          type="text"
          name="messageInput"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter a message"
        />
        <button onClick={sendMessage}>Send Message</button>
      </header>
    </div>
  );
};

export default App;
