"use client";

import { useState } from "react";

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
    max-width: 820px;
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
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, #ffffff, #99f6e4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero h3 {
    font-size: 1rem;
    margin-top: 4px;
    letter-spacing: 0.04em;
    font-weight: 600;
    background: linear-gradient(135deg, #f3e5ab, #d4af37, #aa7c11);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── CHAT CONTAINER (WHOLE CONTAINER WHITE) ── */
  .chat-container {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  }

  #chat-box {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  #chat-box::-webkit-scrollbar {
    width: 5px;
  }
  #chat-box::-webkit-scrollbar-track {
    background: transparent;
  }
  #chat-box::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  /* ── CARDS (AI & USER) ── */
  .ai-card, .user-card {
    max-width: 85%;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    animation: fadeIn 0.2s ease-out;
  }

  .ai-card {
    align-self: flex-start;
    background: #f1f5f9;
    color: #0f172a;
    border-radius: 16px 16px 16px 4px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .user-card {
    align-self: flex-end;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #f8fafc;
    border-radius: 16px 16px 4px 16px;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  .ai-title, .user-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .ai-title { color: #64748b; }
  .user-title { color: #d4af37; text-align: right; }

  .ai-body, .user-body {
    font-size: 1rem;
    line-height: 1.6;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── INPUT AREA (WHITE CONTAINER ALIGNED) ── */
  .input-box {
    flex-shrink: 0;
    display: flex;
    gap: 12px;
    padding: 14px 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    background: #f8fafc;
  }

  .input-box input {
    flex: 1;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 1rem;
    color: #0f172a;
    outline: none;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .input-box input::placeholder {
    color: #94a3b8;
  }

  .input-box input:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  }

  .input-box button {
    flex-shrink: 0;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 700;
    color: #05070f;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .input-box button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.35);
  }

  .input-box button:active {
    transform: translateY(0);
  }

  /* ── RESPONSIVE ADAPTATIONS ── */
  @media (max-width: 640px) {
    .app { padding: 12px; }
    .hero h1 { font-size: 1.6rem; }
    .ai-card, .user-card { max-width: 90%; padding: 10px 14px; }
    .ai-body, .user-body { font-size: 0.95rem; }
    .input-box { padding: 10px 12px; gap: 8px; }
    .input-box input { padding: 10px 12px; font-size: 0.95rem; }
    .input-box button { padding: 10px 18px; font-size: 0.95rem; }
  }
`;

export default function Home() {
  const [message, setMessage] = useState("");

  return (
    <>
      <style>{styles}</style>
      <main className="app">
        {/* HERO */}
        <section className="hero">
          <div className="orb-wrap">
            <div className="orb-halo"></div>
            <div className="orb-ring-gold"></div>
            <div className="orb-ring"></div>
            <div className="orb">Q</div>
          </div>
          <h1>Q-BOT</h1>
          <h3>Ask anything about Qlack</h3>
        </section>

        {/* CHAT */}
        <section className="chat-container">
          <div id="chat-box">
            {/* System Message */}
            <div className="ai-card">
              <div className="ai-title">Q-BOT</div>
              <div className="ai-body">
                Hi! I'm here to answer any questions about Qlack.?
              </div>
            </div>
          </div>

          <div className="input-box">
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Qlack..."
            />
            <button id="send-btn">Send</button>
          </div>
        </section>
      </main>
    </>
  );
}
