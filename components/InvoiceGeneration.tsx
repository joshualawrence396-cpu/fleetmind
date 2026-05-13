"use client"
import { useState, useEffect } from "react"

export function InvoiceGeneration() {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    fetch("/api/invoices").then(r=>r.json()).then(d=>setOrders(d||[]))
  }, [])

  const generateInvoice = (order) => { setSelected(order); setPreview(true) }

  const printInvoice = () => window.print()

  const invoiceNum = (order) => "INV-" + order.orderNumber.replace("ORD-","")
  const rate = 1500
  const tax = (amt) => amt * 0.15
  const total = (amt) => amt + tax(amt)

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:20}}>💳 Invoice Generation</h2>

      {preview && selected ? (
        <div>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            <button onClick={()=>setPreview(false)} style={{padding:"8px 16px",background:"#e2e8f0",border:"none",borderRadius:6,cursor:"pointer"}}>← Back</button>
            <button onClick={printInvoice} style={{padding:"8px 16px",background:"#10b981",color:"white",border:"none",borderRadius:6,cursor:"pointer"}}>🖨️ Print / Save PDF</button>
          </div>
          <div id="invoice" style={{background:"white",borderRadius:12,padding:40,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",maxWidth:700,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:30}}>
              <div>
                <div style={{fontSize:28,fontWeight:"bold",color:"#1e293b"}}>🚛 FleetMind</div>
                <div style={{color:"#64748b",marginTop:4}}>Fleet Management Services</div>
                <div style={{color:"#64748b",fontSize:13}}>Cape Town, South Africa</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:"bold",color:"#667eea"}}>INVOICE</div>
                <div style={{color:"#64748b",marginTop:4}}>{invoiceNum(selected)}</div>
                <div style={{color:"#64748b",fontSize:13}}>{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:30,background:"#f8fafc",padding:20,borderRadius:8}}>
              <div>
                <div style={{fontWeight:"bold",marginBottom:6,color:"#64748b",fontSize:12}}>BILL TO</div>
                <div style={{fontWeight:"bold"}}>{selected.customerName}</div>
                <div style={{fontSize:13,color:"#64748b"}}>{selected.deliveryAddress}</div>
              </div>
              <div>
                <div style={{fontWeight:"bold",marginBottom:6,color:"#64748b",fontSize:12}}>ORDER DETAILS</div>
                <div style={{fontSize:13}}><strong>Order:</strong> {selected.orderNumber}</div>
                <div style={{fontSize:13}}><strong>Driver:</strong> {selected.driver?.name||"N/A"}</div>
                <div style={{fontSize:13}}><strong>Vehicle:</strong> {selected.vehicle?.registration||"N/A"}</div>
              </div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20}}>
              <thead>
                <tr style={{background:"#1e293b",color:"white"}}>
                  <th style={{padding:"10px 14px",textAlign:"left",borderRadius:"4px 0 0 4px"}}>Description</th>
                  <th style={{padding:"10px 14px",textAlign:"right"}}>Qty</th>
                  <th style={{padding:"10px 14px",textAlign:"right"}}>Unit Price</th>
                  <th style={{padding:"10px 14px",textAlign:"right",borderRadius:"0 4px 4px 0"}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom:"1px solid #e2e8f0"}}>
                  <td style={{padding:"12px 14px"}}>Delivery Service - {selected.priority} Priority</td>
                  <td style={{padding:"12px 14px",textAlign:"right"}}>1</td>
                  <td style={{padding:"12px 14px",textAlign:"right"}}>R{rate.toFixed(2)}</td>
                  <td style={{padding:"12px 14px",textAlign:"right"}}>R{rate.toFixed(2)}</td>
                </tr>
                <tr style={{borderBottom:"1px solid #e2e8f0"}}>
                  <td style={{padding:"12px 14px"}}>From: {selected.pickupAddress}</td>
                  <td colSpan={3}></td>
                </tr>
                <tr style={{borderBottom:"1px solid #e2e8f0"}}>
                  <td style={{padding:"12px 14px"}}>To: {selected.deliveryAddress}</td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <div style={{width:250}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #e2e8f0"}}><span>Subtotal</span><span>R{rate.toFixed(2)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #e2e8f0"}}><span>VAT (15%)</span><span>R{tax(rate).toFixed(2)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontWeight:"bold",fontSize:18,color:"#667eea"}}><span>Total</span><span>R{total(rate).toFixed(2)}</span></div>
              </div>
            </div>
            <div style={{marginTop:30,padding:16,background:"#f0fdf4",borderRadius:8,fontSize:13,color:"#065f46",textAlign:"center"}}>
              Thank you for using FleetMind! Payment due within 30 days.
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
            <h3 style={{marginBottom:15,fontWeight:"bold"}}>Completed Orders — Ready for Invoice</h3>
            {orders.length === 0 && <div style={{padding:20,textAlign:"center",color:"#666"}}>No completed orders yet. Complete an order to generate an invoice.</div>}
            {orders.map(o=>(
              <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div>
                  <strong>{o.orderNumber}</strong>
                  <div style={{fontSize:13,color:"#64748b"}}>{o.customerName} • {o.deliveryAddress}</div>
                  <div style={{fontSize:12,color:"#10b981"}}>Driver: {o.driver?.name||"N/A"} | Vehicle: {o.vehicle?.registration||"N/A"}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontWeight:"bold",color:"#667eea"}}>R{(1500*1.15).toFixed(2)}</span>
                  <button onClick={()=>generateInvoice(o)} style={{padding:"6px 14px",background:"#667eea",color:"white",border:"none",borderRadius:6,cursor:"pointer",fontSize:13}}>💳 Generate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}