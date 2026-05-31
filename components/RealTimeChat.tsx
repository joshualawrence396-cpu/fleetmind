"use client"
import { useState, useEffect, useRef } from "react"

export function RealTimeChat() {
  const [messages, setMessages] = useState([
    { id:"1", sender:"Josh Driver", role:"driver", text:"On my way to delivery address, ETA 20 mins", time:"09:10", mine:false },
    { id:"2", sender:"Admin", role:"admin", text:"Great, customer has been notified", time:"09:11", mine:true },
    { id:"3", sender:"Jake Driver", role:"driver", text:"Completed Order ORD-002, returning to depot", time:"09:25", mine:false },
  ])
  const [input, setInput] = useState("")
  const [activeChat, setActiveChat] = useState("all")
  const bottomRef = useRef(null)

  const contacts = [
    { id:"all", name:"📢 All Staff", role:"group" },
    { id:"drivers", name:"🚛 All Drivers", role:"group" },
    { id:"josh", name:"Josh Driver", role:"driver" },
    { id:"jake", name:"Jake Driver", role:"driver" },
  ]

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}) }, [messages])

  const send = () => {
    if (!input.trim()) return
    setMessages(prev=>[...prev, { id:Date.now().toString(), sender:"Admin", role:"admin", text:input.trim(), time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), mine:true }])
    setInput("")
  }

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:20}}>💬 Team Chat</h2>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,height:600}}>
        <div style={{background: "transparent",borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",overflowY:"auto"}}>
          <div style={{fontWeight:"bold",fontSize:13,color:"#64748b",marginBottom:12}}>CHANNELS</div>
          {contacts.map(c=>(
            <div key={c.id} onClick={()=>setActiveChat(c.id)} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",marginBottom:4,background:activeChat===c.id?"#f1f5f9":"transparent",fontWeight:activeChat===c.id?"600":"400",fontSize:14}}>
              {c.name}
            </div>
          ))}
        </div>
        <div style={{background: "transparent",borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid #e2e8f0",fontWeight:"bold"}}>
            {contacts.find(c=>c.id===activeChat)?.name || "Chat"}
          </div>
          <div style={{flex:1,padding:16,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
            {messages.map(m=>(
              <div key={m.id} style={{display:"flex",justifyContent:m.mine?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"70%"}}>
                  {!m.mine && <div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>{m.sender}</div>}
                  <div style={{padding:"10px 14px",borderRadius:m.mine?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.mine?"#3b82f6":"#f1f5f9",color:m.mine?"white":"#1e293b",fontSize:14}}>
                    {m.text}
                  </div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:3,textAlign:m.mine?"right":"left"}}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <div style={{padding:16,borderTop:"1px solid #e2e8f0",display:"flex",gap:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." style={{flex:1,padding:10,border:"1px solid #e2e8f0",borderRadius:8,fontSize:14,outline:"none"}}/>
            <button onClick={send} style={{padding:"10px 20px",background:"#3b82f6",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:"500"}}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}