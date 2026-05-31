const fs = require("fs");

let dash = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// 1. Add imports
if (!dash.includes("LiveMap")) {
  dash = dash.replace(
    `import { ChatBot } from "../../components/ChatBot"`,
    `import { ChatBot } from "../../components/ChatBot"
import dynamic from "next/dynamic"
import { t, LANGS } from "../../lib/i18n"
const LiveMap = dynamic(() => import("../../components/LiveMap").then(m => ({ default: m.LiveMap })), { 
  ssr: false, 
  loading: () => <div style={{height:"100%",minHeight:400,background:"#080d1a",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#475569",flexDirection:"column",gap:12}}><div style={{fontSize:32}}>🗺️</div><div>Loading map...</div></div> 
})`
  );
}

// 2. Fix language selector - full dropdown
dash = dash.replace(
  `<select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", fontSize: 12, cursor: "pointer", outline: "none" }}>
            <option value="en">🇿🇦 English</option>
            <option value="af">🇿🇦 Afrikaans</option>
            <option value="zu">🇿🇦 Zulu</option>
            <option value="xh">🇿🇦 Xhosa</option>
          </select>`,
  `<select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: "7px 14px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, color: "#a5b4fc", fontSize: 13, cursor: "pointer", outline: "none", fontFamily:"system-ui", fontWeight:600 }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
          </select>`
);

// 3. Fix welcome text
dash = dash.replace(
  `{t("welcome", lang)}, {user?.name}`,
  `{t("welcome", lang)}, {user?.name}`
);
// If not already translated
if (!dash.includes('t("welcome"')) {
  dash = dash.replace(
    `Welcome back, {user?.name}`,
    `{t("welcome", lang)}, {user?.name}`
  );
}

// 4. Fix New Order button
if (!dash.includes('t("newOrder"')) {
  dash = dash.replace(
    `<Plus size={14} /> New Order`,
    `<Plus size={14} /> {t("newOrder", lang)}`
  );
}

// 5. Fix Sign Out  
if (!dash.includes('t("signOut"')) {
  dash = dash.replace(
    `<LogOut size={13} /> Sign Out`,
    `<LogOut size={13} /> {t("signOut", lang)}`
  );
}

// 6. Slim sidebar section labels
dash = dash.replace(
  /fontSize: 9, fontWeight: 700, color: "#1e293b"/g,
  'fontSize: 9, fontWeight: 700, color: "#1e293b"'
);
dash = dash.replace(
  /fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "1\.5px", padding: "8px 8px 4px"/g,
  'fontSize: 9, fontWeight: 700, color: "#1e293b", letterSpacing: "1.5px", padding: "4px 8px 2px"'
);

// 7. Add live-map to NAV if not there
if (!dash.includes('"live-map"')) {
  dash = dash.replace(
    `{ label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "analytics", label: "Analytics", icon: "BarChart" }] },`,
    `{ label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "live-map", label: "Live Map", icon: "MapPin" }, { id: "analytics", label: "Analytics", icon: "BarChart" }] },`
  );
}

// 8. Add driver-app to NAV if not there
if (!dash.includes('"driver-app"')) {
  dash = dash.replace(
    `{ label: "APPS", items: [{ id: "driver-app", label: "Driver App", icon: "Truck" }] },`,
    ``
  );
  dash = dash.replace(
    `{ label: "DEVELOPER", items: [{ id: "api-docs"`,
    `{ label: "APPS", items: [{ id: "driver-app", label: "Driver App", icon: "Truck" }] },
  { label: "DEVELOPER", items: [{ id: "api-docs"`
  );
}

// 9. Add Live Map render tab if not there
if (!dash.includes("activeTab === \"live-map\"")) {
  const liveMapTab = `          {/* LIVE MAP */}
          {activeTab === "live-map" && (
            <div style={{ height: "calc(100vh - 120px)" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={18} color="#6366f1"/> {t("livemap", lang)}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#10b981" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}/>
                  Live tracking
                </div>
              </div>
              <LiveMap vehicles={vehicles} drivers={drivers} height="calc(100vh - 180px)" />
            </div>
          )}

`;
  dash = dash.replace(
    `          {/* FLEET TAB */}`,
    liveMapTab + `          {/* FLEET TAB */}`
  );
}

// 10. Add driver-app render tab if not there
if (!dash.includes("activeTab === \"driver-app\"")) {
  const driverAppTab = `          {/* DRIVER APP */}
          {activeTab === "driver-app" && (
            <div style={{ padding: 8 }}>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 20, padding: 40, border: "1px solid rgba(99,102,241,0.15)", maxWidth: 440, margin: "0 auto", textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 22, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
                  <Truck size={40} color="white" />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 10 }}>FleetMind Driver App</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
                  Full mobile PWA for SA drivers. Realtime GPS sync, delivery management, proof of delivery, customer calls & navigation. Works offline in poor signal areas.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                  {[["📍","Real-time GPS"],["📦","Delivery Management"],["✅","POD Capture"],["📞","Customer Calls"],["🗺️","Google Navigation"],["📴","Offline Mode"]].map(([icon, label]) => (
                    <div key={label} style={{ padding: "10px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.1)", fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{icon}</span>{label}
                    </div>
                  ))}
                </div>
                <a href="/driver" target="_blank" style={{ display: "block", padding: "14px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 12, color: "white", textDecoration: "none", fontSize: 15, fontWeight: 700, boxShadow: "0 8px 25px rgba(99,102,241,0.4)", marginBottom: 12 }}>
                  Open Driver App →
                </a>
                <div style={{ fontSize: 12, color: "#334155" }}>Share with drivers: /driver</div>
              </div>
            </div>
          )}

`;
  dash = dash.replace(
    `          {/* FLEET TAB */}`,
    driverAppTab + `          {/* FLEET TAB */}`
  );
}

// 11. Add driver patch API route reference - update drivers state in loadData
dash = dash.replace(
  `const [vehicles, setVehicles] = useState<any[]>([])`,
  `const [vehicles, setVehicles] = useState<any[]>([])
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [driverForm, setDriverForm] = useState({ name:"", phone:"", email:"", licenseNumber:"", licenseType:"CODE_10", vehicleId:"" })`
);

// 12. Make stat cards use translations
dash = dash.replace(
  `{ label: "Total Vehicles"`,
  `{ label: t("totalVehicles", lang)`
);
dash = dash.replace(
  `{ label: "Active Drivers"`,
  `{ label: t("activeDrivers", lang)`
);
dash = dash.replace(
  `{ label: "Total Orders"`,
  `{ label: t("totalOrders", lang)`
);
dash = dash.replace(
  `{ label: "Success Rate"`,
  `{ label: t("successRate", lang)`
);

fs.writeFileSync("app/dashboard/page.tsx", dash, "utf8");
console.log("Dashboard updated!");
