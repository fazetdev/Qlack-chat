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
    height: 100dvh; /* Dynamic mobile viewport tracking */
    overflow: hidden;
    max-width: 440px;
    margin: 0 auto;
    padding: 12px;
  }

  /* ── HERO ── */
  .hero {
    flex-shrink: 0;
    text-align: center;
    padding: 8px 0 12px;
  }

  .orb-wrap {
    position: relative;
    width: 72px;
    height: 72px;
    margin: 0 auto 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orb-halo {
    position: absolute;
    inset: -12px;
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
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(212, 175, 55, 0.2);
    animation: spin 10s linear infinite reverse;
  }

  .orb-ring {
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 1px solid rgba(20, 184, 166, 0.15);
    animation: spin 6s linear infinite;
  }

  .orb {
    width: 56px;
    height: 56px;
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
    font-size: 1.6rem;
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
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    background: linear-gradient(135deg, #ffffff, #99f6e4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero h3 {
    font-size: 0.88rem;
    margin-top: 2px;
    font-weight: 600;
    background: linear-gradient(135deg, #f3e5ab, #d4af37);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* ── CLOSED GAP COCKPIT CARD CONTAINER ── */
  .chat-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
  }

  #chat-box {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 14px 4px 14px; /* Tight bottom padding removes blank spacing */
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  #chat-box::-webkit-scrollbar {
    width: 4px;
  }
  #chat-box::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  /* ── MESSAGE BUBBLES ── */
  .ai-card, .user-card {
    max-width: 85%;
    padding: 10px 14px;
    animation: fadeIn 0.15s ease-out;
  }

  .ai-card {
    align-self: flex-start;
    background: #f1f5f9;
    color: #0f172a;
    border-radius: 14px 14px 14px 4px;
  }

  .user-card {
    align-self: flex-end;
    background: #c6941f;
    color: #000000;
    font-weight: 600;
    border-radius: 14px 14px 4px 14px;
  }

  .ai-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 3px;
  }

  .ai-body, .user-body {
    font-size: 0.9rem;
    line-height: 1.4;
    white-space: pre-wrap;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── INLINE BOTTOM DECK (TIGHT INTEGRATION) ── */
  .command-deck {
    background: #ffffff;
    padding: 8px 12px 12px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    align-items: flex-end; /* Base alignment handles auto-expanding sizes gracefully */
    gap: 8px;
  }

  /* Expandable inline clean text input box */
  .command-deck textarea {
    flex: 1;
    background: #090d16;
    border: 1px solid #1e293b;
    border-radius: 10px;
    outline: none;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.9rem;
    padding: 10px 12px;
    resize: none;
    line-height: 1.35;
    min-height: 40px;
    max-height: 120px; /* Restricts maximum expansion size on typing overload */
  }

  .command-deck textarea:focus {
    border-color: #c6941f;
  }

  .command-deck textarea::placeholder {
    color: #475569;
  }

  /* Compact inline gold click target button */
  #send-btn {
    height: 40px;
    padding: 0 18px;
    border-radius: 10px;
    border: none;
    background: #c6941f;
    color: #000000;
    font-weight: 700;
    font-size: 0.88rem;
    cursor: pointer;
    transition: background 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
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

  // Automated textarea expansion tracker mimicking premium interfaces
  const handleTextareaChange = (e: any) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
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
            <textarea
              id="message"
              rows={1}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Qlack..."
              disabled={isLoading}
            />
            <button 
              id="send-btn" 
              type="button" 
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
            >
              Send
            </button>
          </div>

        </main>

      </div>
    </>
  );
}
