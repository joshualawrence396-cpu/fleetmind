const fs = require("fs");
const path = require("path");

function write(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
  console.log("Created:", p);
}

// PATCH route for driver location update
write("app/api/drivers/[id]/route.ts", `import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const driver = await prisma.driver.update({
      where: { id: params.id },
      data: {
        ...(body.latitude && { latitude: parseFloat(body.latitude) }),
        ...(body.longitude && { longitude: parseFloat(body.longitude) }),
        ...(body.status && { status: body.status }),
        ...(body.vehicleId !== undefined && { vehicleId: body.vehicleId || null }),
      },
      include: { vehicle: true }
    })
    return NextResponse.json(driver)
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.driver.delete({ where: { id: params.id } })
    return NextResponse.json({ deleted: true })
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
`);

// Now add the Add Driver modal to dashboard
let dash = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Add "Add Driver" button to topbar
dash = dash.replace(
  `<button onClick={() => setShowNewOrder(true)} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> {t("newOrder", lang)}
          </button>`,
  `<button onClick={() => setShowAddDriver(true)} style={{ padding: "8px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 9, color: "#10b981", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> {t("addDriver", lang)}
          </button>
          <button onClick={() => setShowNewOrder(true)} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> {t("newOrder", lang)}
          </button>`
);

// Add Driver Modal after New Order Modal
const addDriverModal = `
          {/* ADD DRIVER MODAL */}
          {showAddDriver && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 20, padding: 32, width: 480, border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 6 }}>Add Driver</div>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>Driver will appear on Live Map automatically</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input placeholder="Full Name *" value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} style={inp}/>
                  <input placeholder="Phone Number" value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value})} style={inp}/>
                  <input placeholder="Email" type="email" value={driverForm.email} onChange={e => setDriverForm({...driverForm, email: e.target.value})} style={inp}/>
                  <input placeholder="License Number" value={driverForm.licenseNumber} onChange={e => setDriverForm({...driverForm, licenseNumber: e.target.value})} style={inp}/>
                  <select value={driverForm.licenseType} onChange={e => setDriverForm({...driverForm, licenseType: e.target.value})} style={inp}>
                    <option value="CODE_8">Code 8 (Light)</option>
                    <option value="CODE_10">Code 10 (Heavy)</option>
                    <option value="CODE_14">Code 14 (Extra Heavy)</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                  </select>
                  <select value={driverForm.vehicleId} onChange={e => setDriverForm({...driverForm, vehicleId: e.target.value})} style={inp}>
                    <option value="">Assign Vehicle (Optional)</option>
                    {vehicles.filter(v => !v.driver).map((v: any) => <option key={v.id} value={v.id}>{v.registration} — {v.make} {v.model}</option>)}
                  </select>
                </div>
                <div style={{ padding: "10px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.12)", fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 18 }}>
                  📍 Driver location will be auto-assigned in South Africa and appear on Live Map immediately
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setShowAddDriver(false)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>{t("cancel", lang)}</button>
                  <button type="button" disabled={!driverForm.name} onClick={async () => {
                    const res = await fetch("/api/drivers", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(driverForm) })
                    if (res.ok) {
                      setShowAddDriver(false)
                      setDriverForm({ name:"", phone:"", email:"", licenseNumber:"", licenseType:"CODE_10", vehicleId:"" })
                      loadData()
                      if (activeTab !== "live-map") setActiveTab("live-map")
                    }
                  }} style={{ flex: 2, padding: 12, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, opacity: !driverForm.name ? 0.6 : 1 }}>
                    Add Driver → View on Map
                  </button>
                </div>
              </div>
            </div>
          )}
`;

dash = dash.replace(
  `          {/* New Order Modal */}`,
  addDriverModal + `          {/* New Order Modal */}`
);

fs.writeFileSync("app/dashboard/page.tsx", dash, "utf8");
console.log("Driver modal + map integration done!");
