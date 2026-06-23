"use client"

import { useState } from "react"

const KNOWLEDGE = [
  {
    keywords: ["what", "qlack", "qlqck", "qlaqk"],
    answer:
      "Qlack turns academic materials (PDFs, notes, screenshots, voice notes) into a structured writing framework. It does NOT write essays."
  },
  {
    keywords: ["what do i get", "output", "result", "deliver"],
    answer:
      "You receive a structured framework: introduction guide, section headings, logical flow, and writing direction."
  },
  {
    keywords: ["write my assignment", "do my assignment", "ghostwriting"],
    answer:
      "No. Qlack does not write assignments. It only structures your material so you can write it faster and clearly."
  },
  {
    keywords: ["how does it work", "how it works", "process"],
    answer:
      "You send your academic material → Qlack organizes it into a structured writing framework → you use it to write your assignment."
  }
]

function findAnswer(input) {
  const text = input.toLowerCase()

  for (const item of KNOWLEDGE) {
    if (item.keywords.some(k => text.includes(k))) {
      return item.answer
    }
  }

  return "Ask me about what Qlack is, how it works, or what you receive."
}

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Ask anything about Qlack." }
  ])
  const [input, setInput] = useState("")

  function sendMessage() {
    if (!input.trim()) return

    const userMsg = { role: "user", text: input }
    const botMsg = { role: "bot", text: findAnswer(input) }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput("")
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      
      <h2>Qlack Chat</h2>

      <div style={{
        border: "1px solid #ddd",
        padding: 10,
        height: "70vh",
        overflowY: "auto",
        marginBottom: 10
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "user" ? "right" : "left",
            margin: "10px 0"
          }}>
            <span style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 10,
              background: m.role === "user" ? "#22c55e" : "#eee",
              color: m.role === "user" ? "#fff" : "#000",
              maxWidth: "80%"
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 10 }}
          placeholder="Ask about Qlack..."
        />

        <button onClick={sendMessage} style={{ padding: "10px 16px" }}>
          Send
        </button>
      </div>

    </main>
  )
}
