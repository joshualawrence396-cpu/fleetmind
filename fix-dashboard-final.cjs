const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// 1. Add i18n import
if (!content.includes("from \"../../lib/i18n\"")) {
  content = content.replace(
    '"use client"',
    '"use client"\nimport { tr, type Lang } from "../../lib/i18n"'
  );
  console.log("Added i18n import");
}

// 2. Fix lang type
content = content.replace(
  'const [lang, setLang] = useState("en")',
  'const [lang, setLang] = useState<Lang>("en")'
);

// 3. Add LiveMap import
if (!content.includes("LiveMap")) {
  content = content.replace(
    '"use client"',
    '"use client"\nimport dynamic from "next/dynamic"\nconst LiveMap = dynamic(() => import("../../components/LiveMap").then(m => ({ default: m.LiveMap })), { ssr: false, loading: () => <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#6366f1",fontSize:13}}>Loading map...</div> })'
  );
  console.log("Added LiveMap import");
}

// 4. Fix translation selector - use tr() function
content = content.replace(
  /\{activeTab\.replace\(\/-\/g, " "\)\.toUpperCase\(\)\}/g,
  '{tr(activeTab.replace(/-([a-z])/g, (_,c)=>c.toUpperCase()), lang) || activeTab.replace(/-/g," ").toUpperCase()}'
);

// 5. Fix welcome text to use tr()
content = content.replace(
  'Welcome back, {user?.name}',
  '{tr("welcomeBack", lang)}, {user?.name}'
);

// 6. Fix buttons to use tr()
content = content.replace(
  '"+ New Order"',
  '{tr("newOrder", lang)}'
);

// 7. Add Live Map tab render
if (!content.includes('activeTab === "live-map"')) {
  content = content.replace(
    '{/* FLEET TAB */}',
    `{/* LIVE MAP TAB */}
          {activeTab === "live-map" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={18} color="#6366f1"/> Live Fleet Map
                <span style={{ fontSize: 12, color: "#475569", fontWeight: 400 }}>— {vehicles.length} vehicles tracked</span>
                <a href="/driver" target="_blank" style={{ marginLeft: "auto", padding: "6px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, color: "#34d399", textDecoration: "none", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  📱 Driver App
                </a>
              </div>
              <div style={{ height: "calc(100vh - 220px)", minHeight: 500, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(99,102,241,0.2)" }}>
                <LiveMap vehicles={vehicles} />
              </div>
            </div>
          )}

          {/* FLEET TAB */}`
  );
  console.log("Added Live Map tab");
}

// 8. Update nav to include Live Map
content = content.replace(
  `{ label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "analytics", label: "Analytics", icon: "BarChart" }] },`,
  `{ label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "analytics", label: "Analytics", icon: "BarChart" }, { id: "live-map", label: "Live Map", icon: "MapPin" }] },`
);

// 9. Fix driver app link in topbar - add it if not there
if (!content.includes("/driver")) {
  content = content.replace(
    `<button onClick={() => setShowAddDriver(true)}`,
    `<a href="/driver" target="_blank" style={{ padding: "8px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 9, color: "#34d399", textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>📱 Driver App</a>
          <button onClick={() => setShowAddDriver(true)}`
  );
  console.log("Added Driver App link to topbar");
}

// 10. No drivers yet - better message with add button
content = content.replace(
  '{drivers.length === 0 && <div style={{ gridColumn: "1/-1", color: "#334155", textAlign: "center", padding: 40, fontSize: 13 }}>No drivers yet.</div>}',
  `{drivers.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6 }}>No drivers yet</div>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>Click the + Driver button to add your first driver</div>
                <button onClick={() => setShowAddDriver(true)} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add First Driver</button>
              </div>
            )}`
);

fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("Dashboard updated! File length:", content.length);
