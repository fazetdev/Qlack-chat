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
    height: 100dvh; /* Dynamic viewport for clean mobile layout */
    overflow: hidden;
    max-width: 440px; /* Constrained for mobile cockpit profile */
    margin: 0 auto;
    padding: 16px;
  }

  /* ── HERO ── */
  .hero {
    flex-shrink: 0;
    text-align: center;
    padding: 4px 0 12px;
  }

  .orb-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 8px;
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
    width: 64px;
    height: 64px;
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
      0 0 40px rgba(20, 184, 166, 0.15),
      inset 0 -4px 16px rgba(212, 175, 55, 0.1);
    animation: orbPulse 3.5s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 2px 16px rgba(0,0,0,0.3);
    position: relative;
    z-index: 2;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes orbPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.08); }
  }

  .hero h1 {
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, #ffffff, #99f6e4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero h3 {
    font-size: 0.95rem;
    margin-top: 4px;
    letter-spacing: 0.04em;
    font-weight: 600;
    background: linear-gradient(135deg, #f3e5ab, #d4af37, #aa7c11);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── CHAT CONTAINER (DYNAMIC WHITE COCKPIT) ── */
  .chat-container {
    flex: 1 1 0;
    min-height: 260px;
    max-height: 65vh;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    transition: height 0.2s ease;
  }

  #chat-box {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  #chat-box::-webkit-scrollbar {
    width: 4px;
  }
  #chat-box::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  /* ── CARDS (AI & USER) ── */
  .ai-card, .user-card {
    max-width: 90%;
    padding: 12px 16px;
    animation: fadeIn 0.2s ease-out;
  }

  .ai-card {
    align-self: flex-start;
    background: #f0f4f9;
    color: #1e293b;
    border-radius: 16px;
  }

  .user-card {
    align-self: flex-end;
    background: #c6941f;
    color: #000000;
    font-weight: 600;
    border-radius: 16px;
  }

  .ai-title, .user-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .ai-title { color: #556987; }
  .user-title { color: #000000; opacity: 0.6; text-align: right; display: none; }

  .ai-body, .user-body {
    font-size: 0.92rem;
    line-height: 1.45;
    white-space: pre-wrap;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── CLEAN WHITE COMMAND DECK (INPUT SEPARATED, ACTIONS TIGHTLY GROUPED) ── */
  .command-deck {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px 16px;
    border-top: 1px solid #f1f5f9;
  }

  /* Solid Stark Black Input Window Box */
  .command-deck textarea {
    width: 100%;
    background: #090d16;
    border: 1px solid #1e293b;
    border-radius: 12px;
    outline: none;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.92rem;
    padding: 12px;
    resize: none;
    line-height: 1.45;
    transition: all 0.2s ease;
  }

  .command-deck textarea:focus {
    border-color: rgba(198, 148, 31, 0.6);
  }

  .command-deck textarea::placeholder {
    color: #64748b;
  }

  .action-row {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 🎤 High-contrast Speaker Button */
  #mic-btn {
    height: 40px;
    width: 40px;
    font-size: 1.15rem;
    border-radius: 10px;
    border: none;
    background: #1e293b;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  #mic-btn:hover {
    background: #0f172a;
    transform: translateY(-1px);
  }

  /* Gold Send Button */
  #send-btn {
    height: 40px;
    padding: 0 22px;
    border-radius: 10px;
    border: none;
    background: #c6941f;
    color: #000000;
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  #send-btn:hover {
    background: #e0a92a;
    transform: translateY(-1px);
  }

  #send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  #send-btn:active, #mic-btn:active {
    transform: scale(0.97);
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
                <div className={msg.sender === "user" ? "user-title" : "ai-title"}>
                  {msg.sender === "user" ? "You" : "Q-BOT"}
                </div>
                <div className={msg.sender === "user" ? "user-body" : "ai-body"}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="command-deck">
            <textarea
              id="message"
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Qlack..."
              disabled={isLoading}
            />
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
