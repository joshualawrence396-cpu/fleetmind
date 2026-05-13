"use client"
import { useState, useEffect } from "react"
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export function MaintenanceScheduling() {
  const [tasks, setTasks] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ vehicleId:"", type:"OIL_CHANGE", description:"", scheduledDate:"", priority:"NORMAL", cost:"" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/vehicles").then(r=>r.json()).then(v=>setVehicles(v||[]))
    fetch("/api/maintenance").then(r=>r.json()).then(m=>setTasks(m||[]))
  }, [])

  const addTask = async () => {
    if (!form.vehicleId || !form.scheduledDate) return
    setLoading(true)
    const res = await fetch("/api/maintenance", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) })
    if (res.ok) {
      const task = await res.json()
      setTasks([task, ...tasks])
      setShowForm(false)
      setForm({ vehicleId:"", type:"OIL_CHANGE", description:"", scheduledDate:"", priority:"NORMAL", cost:"" })
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const res = await fetch("/api/maintenance/"+id, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) })
    if (res.ok) { const updated = await res.json(); setTasks(tasks.map(t=>t.id===id?updated:t)) }
  }

  const inp = { width:"100%",padding:"10px 14px",marginBottom:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,fontSize:14,color:"#e2e8f0",outline:"none",boxSizing:"border-box" as const }
  const scheduled = tasks.filter(t=>t.status==="SCHEDULED").length
  const inProgress = tasks.filter(t=>t.status==="IN_PROGRESS").length
  const completed = tasks.filter(t=>t.status==="COMPLETED").length

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:10,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><Wrench size={20} color="#6366f1"/></div>
          <div><div style={{fontSize:18,fontWeight:"700",color:"white"}}>Maintenance Scheduling</div><div style={{fontSize:12,color:"#475569"}}>Track vehicle maintenance and repairs</div></div>
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{padding:"9px 18px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,color:"white",cursor:"pointer",fontSize:13,fontWeight:"600",display:"flex",alignItems:"center",gap:6}}><Plus size={14}/> Schedule</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
        {[
          {label:"Scheduled",value:scheduled,icon:<Clock size={20} color="#f59e0b"/>,color:"#f59e0b"},
          {label:"In Progress",value:inProgress,icon:<Wrench size={20} color="#6366f1"/>,color:"#6366f1"},
          {label:"Completed",value:completed,icon:<CheckCircle size={20} color="#10b981"/>,color:"#10b981"},
        ].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:18,border:"1px solid rgba(99,102,241,0.1)",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,borderRadius:10,background:s.color+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
            <div><div style={{fontSize:24,fontWeight:"700",color:s.color}}>{s.value}</div><div style={{fontSize:12,color:"#475569"}}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{background:"rgba(99,102,241,0.05)",borderRadius:14,padding:20,marginBottom:20,border:"1px solid rgba(99,102,241,0.2)"}}>
          <div style={{fontSize:15,fontWeight:"600",color:"white",marginBottom:16}}>New Maintenance Task</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <select value={form.vehicleId} onChange={e=>setForm({...form,vehicleId:e.target.value})} style={inp}>
              <option value="">Select Vehicle *</option>
              {vehicles.map(v=><option key={v.id} value={v.id}>{v.registration} - {v.make} {v.model}</option>)}
            </select>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inp}>
              <option value="OIL_CHANGE">Oil Change</option>
              <option value="TIRE_ROTATION">Tire Rotation</option>
              <option value="BRAKE_SERVICE">Brake Service</option>
              <option value="ENGINE_SERVICE">Engine Service</option>
              <option value="INSPECTION">General Inspection</option>
              <option value="OTHER">Other</option>
            </select>
            <input type="date" value={form.scheduledDate} onChange={e=>setForm({...form,scheduledDate:e.target.value})} style={inp}/>
            <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} style={inp}>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <input type="number" step="0.01" placeholder="Estimated Cost (R)" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} style={inp}/>
            <input type="text" placeholder="Description / Notes" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={inp}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowForm(false)} style={{flex:1,padding:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#94a3b8",cursor:"pointer"}}>Cancel</button>
            <button onClick={addTask} disabled={loading} style={{flex:1,padding:10,background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:8,color:"white",cursor:"pointer",fontWeight:"600"}}>{loading?"Saving...":"Schedule"}</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gap:12}}>
        {tasks.length === 0 && <div style={{padding:40,textAlign:"center",color:"#334155",background:"rgba(255,255,255,0.02)",borderRadius:12,border:"1px solid rgba(99,102,241,0.1)"}}>No maintenance tasks. Schedule your first one above.</div>}
        {tasks.map(t=>(
          <div key={t.id} style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:16,border:"1px solid rgba(99,102,241,0.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontWeight:"700",color:"white"}}>{t.vehicle?.registration||"Unknown"}</span>
                  <span style={{padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:"600",background:t.status==="COMPLETED"?"rgba(16,185,129,0.15)":t.status==="IN_PROGRESS"?"rgba(99,102,241,0.15)":"rgba(245,158,11,0.1)",color:t.status==="COMPLETED"?"#34d399":t.status==="IN_PROGRESS"?"#a5b4fc":"#f59e0b"}}>{t.status}</span>
                  <span style={{padding:"2px 8px",borderRadius:10,fontSize:11,color:"white",background:t.priority==="URGENT"?"rgba(239,68,68,0.2)":t.priority==="HIGH"?"rgba(245,158,11,0.2)":"rgba(99,102,241,0.1)"}}>{t.priority}</span>
                </div>
                <div style={{fontSize:13,fontWeight:"500",color:"#e2e8f0"}}>{t.type?.replace(/_/g," ")}</div>
                {t.description && <div style={{fontSize:12,color:"#475569",marginTop:2}}>{t.description}</div>}
                <div style={{fontSize:12,color:"#475569",marginTop:4}}>
                  {t.performedAt && new Date(t.performedAt).toLocaleDateString()}
                  {t.cost && <span style={{color:"#34d399",fontWeight:"600",marginLeft:12}}>R{t.cost}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {t.status==="SCHEDULED" && <button onClick={()=>updateStatus(t.id,"IN_PROGRESS")} style={{padding:"6px 12px",background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:8,color:"#a5b4fc",cursor:"pointer",fontSize:12}}>Start</button>}
                {t.status==="IN_PROGRESS" && <button onClick={()=>updateStatus(t.id,"COMPLETED")} style={{padding:"6px 12px",background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:8,color:"#34d399",cursor:"pointer",fontSize:12}}>Complete</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}