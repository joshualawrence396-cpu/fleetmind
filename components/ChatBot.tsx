"use client"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Truck, Minimize2, Phone } from "lucide-react"

interface Message { role: "user" | "assistant"; content: string; time?: string }

const SALES_STARTERS = [
  "What does FleetMind cost?",
  "How does GPS tracking work?",
  "Which couriers do you support?",
  "Can I get a free trial?",
  "How does AI routing save fuel?",
]

const DASHBOARD_STARTERS = [
  "How many vehicles on route?",
  "Summarize pending orders",
  "Tips to reduce fuel costs?",
  "How to optimize routes?",
]

export function ChatBot({ context = "sales" }: { context?: "sales" | "dashboard" }) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: context === "dashboard"
        ? "Hi! I'm your FleetMind AI assistant powered by Cloudflare AI. Ask me anything about your fleet operations, routes, or orders!"
        : "Hi there! I'm FleetMind AI, powered by Cloudflare. I can answer questions about our platform, pricing, and features. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [configured, setConfigured] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
      // Check if CF AI is configured
      fetch("/api/chat").then(r => r.json()).then(d => setConfigured(d.configured)).catch(() => {})
    }
  }, [open])

  const send = async (msg?: string) => {
    const text = (msg || input).trim()
    if (!text || loading) return
    setInput("")

    const userMsg: Message = { role: "user", content: text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          context
        })
      })
      const data = await res.json()
      const response = data.response || "Sorry, I could not respond. Please email sales@fleetmind.co.za"
      setMessages(prev => [...prev, { role: "assistant", content: response, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please email sales@fleetmind.co.za for help!", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }])
    }
    setLoading(false)
  }

  const starters = context === "dashboard" ? DASHBOARD_STARTERS : SALES_STARTERS

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: 28, right: 28, width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(99,102,241,0.55)", zIndex: 9999 }}>
          <MessageCircle size={26} color="white" />
          <div style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#10b981", border: "2px solid #080d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }}></div>
          </div>
          {context === "sales" && (
            <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 8, background: "white", color: "#1e293b", padding: "6px 12px", borderRadius: "12px 12px 0 12px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}>
              Talk to Sales AI 👋
            </div>
          )}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{ position: "fixed", bottom: 28, right: 28, width: 380, zIndex: 9999, borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.25)", display: "flex", flexDirection: "column", background: "linear-gradient(180deg,#0d1526 0%,#080d1a 100%)", maxHeight: "80vh" }}>

          {/* Header */}
          <div style={{ padding: "14px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Truck size={19} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                  {context === "dashboard" ? "FleetMind AI Assistant" : "FleetMind Sales AI"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: configured ? "#10b981" : "#f59e0b", boxShadow: configured ? "0 0 6px #10b981" : "0 0 6px #f59e0b" }}></div>
                  {configured ? "Cloudflare AI · Online" : "Fallback mode · Online"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {context === "sales" && (
                <a href="mailto:sales@fleetmind.co.za"
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textDecoration: "none" }}
                  title="Email Sales">
                  <Phone size={13} />
                </a>
              )}
              <button onClick={() => setMinimized(!minimized)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                <Minimize2 size={13} />
              </button>
              <button onClick={() => setOpen(false)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                <X size={13} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 280, maxHeight: 380 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                    {m.role === "assistant" && (
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 16 }}>
                        <Truck size={13} color="white" />
                      </div>
                    )}
                    <div>
                      <div style={{ maxWidth: 260, padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.07)", border: m.role === "assistant" ? "1px solid rgba(99,102,241,0.15)" : "none", fontSize: 13, color: "white", lineHeight: 1.6, wordBreak: "break-word" as const }}>
                        {m.content}
                      </div>
                      <div style={{ fontSize: 10, color: "#334155", marginTop: 3, textAlign: m.role === "user" ? "right" : "left", paddingLeft: m.role === "assistant" ? 4 : 0, paddingRight: m.role === "user" ? 4 : 0 }}>{m.time}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Truck size={13} color="white" />
                    </div>
                    <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px", border: "1px solid rgba(99,102,241,0.15)", display: "flex", gap: 4, alignItems: "center" }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: `bounce 1s ease ${i*0.15}s infinite` }}></div>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick starters - show only at beginning */}
              {messages.length <= 1 && (
                <div style={{ padding: "0 14px 12px", display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
                  {starters.map(q => (
                    <button key={q} onClick={() => send(q)}
                      style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, fontSize: 11, color: "#a5b4fc", cursor: "pointer", fontFamily: "system-ui", transition: "all 0.2s" }}
                      onMouseOver={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; e.currentTarget.style.color = "white" }}
                      onMouseOut={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#a5b4fc" }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Sales CTA */}
              {context === "sales" && messages.length > 2 && (
                <div style={{ padding: "8px 14px", background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Ready to get started?</span>
                  <a href="/login" style={{ padding: "5px 12px", background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: 8, color: "white", textDecoration: "none", fontSize: 11, fontWeight: 700 }}>
                    Free Trial →
                  </a>
                </div>
              )}

              {/* Input */}
              <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", gap: 8, flexShrink: 0 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder={context === "sales" ? "Ask about pricing, features..." : "Ask about your fleet..."}
                  style={{ flex: 1, padding: "10px 14px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, fontSize: 13, color: "#e2e8f0", outline: "none", fontFamily: "system-ui" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"}
                />
                <button onClick={() => send()} disabled={!input.trim() || loading}
                  style={{ width: 42, height: 42, borderRadius: 12, background: input.trim() && !loading ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.15)", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  <Send size={15} color="white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
    </>
  )
}