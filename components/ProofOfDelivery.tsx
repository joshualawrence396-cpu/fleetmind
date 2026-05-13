"use client"
import { useState, useEffect } from "react"

export function ProofOfDelivery() {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState("")
  const [photo, setPhoto] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState([])

  useEffect(() => {
    fetch("/api/orders").then(r=>r.json()).then(d=>setOrders((d||[]).filter(o=>o.status==="IN_PROGRESS")))
    const saved = localStorage.getItem("podDone")
    if (saved) setDone(JSON.parse(saved))
  }, [])

  const submitPOD = async () => {
    if (!selected) return
    setSubmitting(true)
    const res = await fetch("/api/orders/"+selected.id+"/pod", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ note, photo })
    })
    if (res.ok) {
      const newDone = [...done, { ...selected, note, photo, completedAt: new Date().toLocaleString() }]
      setDone(newDone)
      localStorage.setItem("podDone", JSON.stringify(newDone))
      setOrders(orders.filter(o=>o.id!==selected.id))
      setSelected(null); setNote(""); setPhoto("")
    }
    setSubmitting(false)
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:20}}>📸 Proof of Delivery</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",marginBottom:16}}>
            <h3 style={{marginBottom:15,fontWeight:"bold"}}>🚛 Active Deliveries</h3>
            {orders.length===0 && <div style={{color:"#666",fontSize:13,padding:10}}>No active deliveries. Orders must be IN_PROGRESS to submit POD.</div>}
            {orders.map(o=>(
              <div key={o.id} onClick={()=>setSelected(o)} style={{padding:12,borderRadius:8,marginBottom:8,border:"2px solid",borderColor:selected?.id===o.id?"#667eea":"#e2e8f0",cursor:"pointer",background:selected?.id===o.id?"#f5f3ff":"white",transition:"all 0.2s"}}>
                <strong>{o.orderNumber}</strong>
                <div style={{fontSize:12,color:"#64748b"}}>{o.customerName}</div>
                <div style={{fontSize:11,color:"#10b981"}}>📍 {o.deliveryAddress}</div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
              <h3 style={{marginBottom:15,fontWeight:"bold"}}>Submit POD - {selected.orderNumber}</h3>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontWeight:"500",marginBottom:6,fontSize:13}}>📸 Upload Photo</label>
                <input type="file" accept="image/*" onChange={handlePhoto} style={{width:"100%",padding:8,border:"1px solid #e2e8f0",borderRadius:6}}/>
                {photo && <img src={photo} alt="POD" style={{width:"100%",borderRadius:8,marginTop:8,maxHeight:150,objectFit:"cover"}}/>}
              </div>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontWeight:"500",marginBottom:6,fontSize:13}}>📝 Delivery Note</label>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Left at door, signed by recipient, etc..." style={{width:"100%",padding:10,border:"1px solid #e2e8f0",borderRadius:6,minHeight:80,fontSize:14,boxSizing:"border-box"}}/>
              </div>
              <button onClick={submitPOD} disabled={submitting} style={{width:"100%",padding:12,background:submitting?"#94a3b8":"#10b981",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontSize:15}}>
                {submitting?"Submitting...":"✅ Confirm Delivery"}
              </button>
            </div>
          )}
        </div>

        <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
          <h3 style={{marginBottom:15,fontWeight:"bold"}}>✅ Completed Deliveries ({done.length})</h3>
          {done.length===0 && <div style={{color:"#666",fontSize:13}}>No completed deliveries yet.</div>}
          {done.map((d,i)=>(
            <div key={i} style={{padding:12,borderRadius:8,marginBottom:10,background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
              <div style={{fontWeight:"bold"}}>{d.orderNumber}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{d.customerName}</div>
              {d.photo && <img src={d.photo} alt="POD" style={{width:"100%",borderRadius:6,marginTop:8,maxHeight:120,objectFit:"cover"}}/>}
              {d.note && <div style={{fontSize:12,color:"#065f46",marginTop:6}}>📝 {d.note}</div>}
              <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>✅ {d.completedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}