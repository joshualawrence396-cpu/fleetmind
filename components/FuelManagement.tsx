"use client"
import { useState, useEffect } from "react"
import { Fuel, Plus, TrendingDown } from "lucide-react"

export function FuelManagement() {
  const [logs, setLogs] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ vehicleId:"", driverId:"", litres:"", costPerLitre:"", station:"", date: new Date().toISOString().split("T")[0] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/vehicles").then(r=>r.json()).then(v=>setVehicles(v||[]))
    fetch("/api/drivers").then(r=>r.json()).then(d=>setDrivers(d||[]))
    fetch("/api/fuel").then(r=>r.json()).then(f=>setLogs(f||[]))
  }, [])

  const addLog = async () => {
    if (!form.vehicleId || !form.litres || !form.costPerLitre) return
    setLoading(true)
    const res = await fetch("/api/fuel", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) })
    if (res.ok) {
      const entry = await res.json()
      setLogs((prev: any[]) => [entry, ...prev])
      setShowForm(false)
      setForm({ vehicleId:"", driverId:"", litres:"", costPerLitre:"", station:"", date: new Date().toISOString().split("T")[0] })
    }
    setLoading(false)
  }

  const totalCost = logs.reduce((s,l)=>s+(l.totalCost||0),0)
  const totalLitres = logs.reduce((s,l)=>s+(l.litres||0),0)
  const avgPrice = totalLitres > 0 ? totalCost/totalLitres : 0

  const inp = { width:"100%",padding:"10px 14px",marginBottom:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,fontSize:14,color:"#e2e8f0",outline:"none",boxSizing:"border-box" as const }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:10,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><Fuel size={20} color="#6366f1"/></div>
          <div><div style={{fontSize:18,fontWeight:"700",color:"white"}}>Fuel Management</div><div style={{fontSize:12,color:"#475569"}}>Track fuel costs and consumption</div></div>
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,color:"white",cursor:"pointer",fontSize:13,fontWeight:"600",display:"flex",alignItems:"center",gap:6}}><Plus size={14}/> Add Fuel Log</button>
      </div>

      {showForm && (
        <div style={{background:"rgba(99,102,241,0.05)",borderRadius:14,padding:20,marginBottom:20,border:"1px solid rgba(99,102,241,0.2)"}}>
          <div style={{fontSize:15,fontWeight:"600",color:"white",marginBottom:16}}>New Fuel Log</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <select value={form.vehicleId} onChange={e=>setForm({...form,vehicleId:e.target.value})} style={inp}>
              <option value="">Select Vehicle *</option>
              {vehicles.map(v=><option key={v.id} value={v.id}>{v.registration} - {v.make} {v.model}</option>)}
            </select>
            <select value={form.driverId} onChange={e=>setForm({...form,driverId:e.target.value})} style={inp}>
              <option value="">Select Driver (Optional)</option>
              {drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input type="number" placeholder="Litres *" value={form.litres} onChange={e=>setForm({...form,litres:e.target.value})} style={inp}/>
            <input type="number" step="0.01" placeholder="Cost per Litre (R) *" value={form.costPerLitre} onChange={e=>setForm({...form,costPerLitre:e.target.value})} style={inp}/>
            <input type="text" placeholder="Station Name" value={form.station} onChange={e=>setForm({...form,station:e.target.value})} style={inp}/>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/>
          </div>
          {form.litres && form.costPerLitre && (
            <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",padding:"10px 14px",borderRadius:8,marginBottom:12,color:"#34d399",fontWeight:"600"}}>
              Total Cost: R{(parseFloat(form.litres)*parseFloat(form.costPerLitre)).toFixed(2)}
            </div>
          )}
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowForm(false)} style={{flex:1,padding:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#94a3b8",cursor:"pointer"}}>Cancel</button>
            <button onClick={addLog} disabled={loading} style={{flex:1,padding:10,background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:8,color:"white",cursor:"pointer",fontWeight:"600"}}>{loading?"Saving...":"Save Log"}</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
        {[
          {label:"Total Cost",value:"R"+totalCost.toFixed(2),icon:<TrendingDown size={20} color="#ef4444"/>,color:"#ef4444"},
          {label:"Total Litres",value:totalLitres.toFixed(1)+"L",icon:<Fuel size={20} color="#6366f1"/>,color:"#6366f1"},
          {label:"Avg per Litre",value:"R"+avgPrice.toFixed(2),icon:<Fuel size={20} color="#f59e0b"/>,color:"#f59e0b"},
        ].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:18,border:"1px solid rgba(99,102,241,0.1)",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,borderRadius:10,background:s.color+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
            <div><div style={{fontSize:20,fontWeight:"700",color:s.color}}>{s.value}</div><div style={{fontSize:12,color:"#475569"}}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,overflow:"hidden",border:"1px solid rgba(99,102,241,0.1)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:8,padding:"12px 16px",borderBottom:"1px solid rgba(99,102,241,0.1)",fontSize:11,fontWeight:"700",color:"#475569",letterSpacing:"0.5px"}}>
          <span>DATE</span><span>VEHICLE</span><span>DRIVER</span><span>LITRES</span><span>COST</span><span>STATION</span>
        </div>
        {logs.length === 0 && <div style={{padding:40,textAlign:"center",color:"#334155",fontSize:14}}>No fuel logs yet. Add your first log above.</div>}
        {logs.map((l,i)=>(
          <div key={l.id||i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:8,padding:"12px 16px",borderBottom:"1px solid rgba(99,102,241,0.05)",fontSize:13,alignItems:"center"}}>
            <span style={{color:"#94a3b8"}}>{l.date ? new Date(l.date).toLocaleDateString() : "-"}</span>
            <span style={{color:"#a5b4fc",fontWeight:"500"}}>{l.vehicle?.registration||"-"}</span>
            <span style={{color:"#e2e8f0"}}>{l.driver?.name||"-"}</span>
            <span style={{color:"#e2e8f0"}}>{l.litres}L</span>
            <span style={{color:"#34d399",fontWeight:"600"}}>R{(l.totalCost||0).toFixed(2)}</span>
            <span style={{color:"#475569"}}>{l.station||"-"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
