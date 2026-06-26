"use client";

import { useState, KeyboardEvent } from "react";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    background: radial-gradient(
      ellipse 120% 80% at 50% 0%,
      #0c1e24 0%,
      #05070f 60%
    );
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    max-width: 440px;
    margin: 0 auto;
    padding: 24px 16px;
    justify-content: center; /* Centers the card perfectly like Fazet */
  }

  /* ── HERO ── */
  .hero {
    flex-shrink: 0;
    text-align: center;
    padding-bottom: 20px;
  }

  .orb-wrap {
    position: relative;
    width: 84px;
    height: 84px;
    margin: 0 auto 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orb-halo {
    position: absolute;
    inset: -14px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(20, 184, 166, 0.3),
      rgba(212, 175, 55, 0.1),
      transparent 70%
    );
    filter: blur(8px);
    animation: glowPulse 3.5s ease-in-out infinite;
  }

  .orb-ring-gold {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid rgba(212, 175, 55, 0.2);
    animation: spin 10s linear infinite reverse;
  }

  .orb-ring {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1px solid rgba(20, 184, 166, 0.15);
    animation: spin 6s linear infinite;
  }

  .orb {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: radial-gradient(
      circle at 35% 35%,
      #99f6e4,
      #14b8a6 55%,
      #0f766e
    );
    border: 2px solid rgba(212, 175, 55, 0.35);
    box-shadow:
      0 6px 20px rgba(20, 184, 166, 0.35),
      inset 0 -4px 16px rgba(212, 175, 55, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.06); }
  }

  .hero h1 {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, #ffffff, #99f6e4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
  }

  .hero h3 {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    background: linear-gradient(135deg, #f3e5ab, #d4af37);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* ── FIXED FAZET-STYLE CONTAINER COCKPIT ── */
  .chat-container {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    max-height: 480px; /* Constrains vertical footprint precisely matching Fazet profile */
    width: 100%;
  }

  #chat-box {
    flex: 1;
    overflow-y: auto;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  #chat-box::-webkit-scrollbar {
    width: 4px;
  }
  #chat-box::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 10px;
  }

  /* ── MESSAGE CARDS ── */
  .ai-card, .user-card {
    max-width: 88%;
    padding: 12px 16px;
    font-size: 0.92rem;
    line-height: 1.45;
    white-space: pre-wrap;
  }

  .ai-card {
    align-self: flex-start;
    background: #f0f4f8;
    color: #1e293b;
    border-radius: 18px;
  }

  .user-card {
    align-self: flex-end;
    background: #c6941f;
    color: #000000;
    font-weight: 600;
    border-radius: 18px;
  }

  .ai-title {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 4px;
  }

  /* ── TWO-TIER FAZET COMMAND DECK ── */
  .command-deck {
    background: #ffffff;
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Separate full-width standalone block input row */
  .input-row {
    width: 100%;
  }

  .command-deck textarea {
    width: 100%;
    background: #090d16;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    outline: none;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.92rem;
    padding: 14px 16px;
    resize: none;
    line-height: 1.4;
    height: 48px;
    display: flex;
    align-items: center;
    transition: border-color 0.15s ease;
  }

  .command-deck textarea:focus {
    border-color: #c6941f;
  }

  .command-deck textarea::placeholder {
    color: #475569;
  }

  /* Control line grouped nicely underneath to the right side */
  .action-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  #mic-btn {
    height: 42px;
    width: 42px;
    font-size: 1.1rem;
    border-radius: 12px;
    border: none;
    background: #1e293b;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  #mic-btn:hover {
    background: #0f172a;
  }

  #send-btn {
    height: 42px;
    padding: 0 24px;
    border-radius: 12px;
    border: none;
    background: #c6941f;
    color: #000000;
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  #send-btn:hover {
    background: #e0a92a;
  }

  #send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I'm here to answer any questions about Qlack.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userText = message.trim();
    setMessage("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: userText,
    };
    setHistory((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.reply || data.error || "No response received.",
      };
      setHistory((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: `Connection failed: ${err?.message || String(err)}`,
      };
      setHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        
        <header className="hero">
          <div className="orb-wrap">
            <div className="orb-halo"></div>
            <div className="orb-ring-gold"></div>
            <div className="orb-ring"></div>
            <div className="orb">Q</div>
          </div>
          <h1>Q-BOT</h1>
          <h3>Ask anything about Qlack</h3>
        </header>

        <main className="chat-container">
          <div id="chat-box">
            {history.map((msg) => (
              <div key={msg.id} className={msg.sender === "user" ? "user-card" : "ai-card"}>
                {msg.sender !== "user" && <div className="ai-title">Q-BOT</div>}
                <div className={msg.sender === "user" ? "user-body" : "ai-body"}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="command-deck">
            <div className="input-row">
              <textarea
                id="message"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Qlack..."
                disabled={isLoading}
              />
            </div>
            <div className="action-row">
              <div className="button-group">
                <button id="mic-btn" type="button" title="Voice Input">🎤</button>
                <button 
                  id="send-btn" 
                  type="button" 
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

        </main>

      </div>
    </>
  );
}
