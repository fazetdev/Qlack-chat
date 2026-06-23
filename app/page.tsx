"use client"

import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<
    { role: "user" | "bot"; text: string }[]
  >([])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!message.trim() || loading) return

    const userMsg = message
    setMessage("")

    setChat((prev) => [...prev, { role: "user", text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })

      const data = await res.json()

      setChat((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No response" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* HEADER */}
      <header className="h-14 flex items-center justify-center border-b border-[#1f1f1f] text-sm font-medium tracking-wide">
        QLACK AI
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {chat.map((c, i) => (
            <div
              key={i}
              className={`flex ${
                c.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  px-4 py-3 rounded-2xl text-sm leading-relaxed
                  max-w-[80%] whitespace-pre-wrap
                  ${
                    c.role === "user"
                      ? "bg-green-500 text-black"
                      : "bg-[#1f1f1f] text-gray-100 border border-[#2a2a2a]"
                  }
                `}
              >
                {c.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm px-2">
              Thinking...
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <footer className="border-t border-[#1f1f1f] p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Qlack..."
            className="
              flex-1 px-4 py-3 rounded-xl
              bg-[#141414] text-white
              border border-[#2a2a2a]
              outline-none focus:border-green-500
            "
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="
              px-5 py-3 rounded-xl
              bg-green-500 text-black font-medium
              disabled:opacity-50
              hover:bg-green-400 transition
            "
          >
            Send
          </button>
        </div>
      </footer>

    </main>
  )
}
