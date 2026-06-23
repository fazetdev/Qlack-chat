"use client"

import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<
    { role: "user" | "bot"; text: string }[]
  >([])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!message.trim()) return

    const userMsg = message
    setMessage("")

    setChat((prev) => [...prev, { role: "user", text: userMsg }])
    setLoading(true)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    })

    const data = await res.json()

    setChat((prev) => [...prev, { role: "bot", text: data.reply }])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white flex flex-col">
      
      {/* HEADER */}
      <div className="p-4 border-b border-[#1f1f1f] text-center font-semibold">
        Qlack Chat
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap ${
              c.role === "user"
                ? "bg-[#22c55e] text-black ml-auto"
                : "bg-[#1f1f1f] text-white"
            }`}
          >
            {c.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Thinking...</div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-[#1f1f1f] flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about Qlack..."
          className="flex-1 p-3 rounded bg-[#1f1f1f] text-white outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-[#22c55e] text-black font-medium rounded"
        >
          Send
        </button>
      </div>
    </main>
  )
}
