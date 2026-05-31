const fs = require("fs");
let dash = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Add imports if missing
if (!dash.includes("LiveMap")) {
  dash = dash.replace(
    'import { ChatBot } from "../../components/ChatBot"',
    'import { ChatBot } from "../../components/ChatBot"\nimport dynamic from "next/dynamic"\nimport { t } from "../../lib/i18n"\nconst LiveMap = dynamic(() => import("../../components/LiveMap").then(m => ({ default: m.LiveMap })), { ssr: false, loading: () => <div style={{height:"500px",background:"#0a0f1e",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#475569"}}>Loading map...</div> })'
  );
}

// Add live-map to NAV
dash = dash.replace(
  '{ label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "analytics", label: "Analytics", icon: "BarChart" }] },',
  '{ label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "analytics", label: "Analytics", icon: "BarChart" }, { id: "live-map", label: "Live Map", icon: "MapPin" }] },'
);

// Add driver-app to NAV
if (!dash.includes("driver-app")) {
  dash = dash.replace(
    '{ label: "DEVELOPER", items: [{ id: "api-docs", label: "API Docs", icon: "FileText" }, { id: "testing", label: "Testing", icon: "FlaskConical" }, { id: "monitoring", label: "Monitoring", icon: "Activity" }] },',
    '{ label: "DEVELOPER", items: [{ id: "api-docs", label: "API Docs", icon: "FileText" }, { id: "testing", label: "Testing", icon: "FlaskConical" }, { id: "monitoring", label: "Monitoring", icon: "Activity" }] },\n  { label: "APPS", items: [{ id: "driver-app", label: "Driver App", icon: "Truck" }] },'
  );
}

// Fix welcome text
dash = dash.replace(
  'Welcome back, {user?.name}',
  '{t("welcome", lang)}, {user?.name}'
);

// Fix New Order button
dash = dash.replace(
  '<Plus size={14} /> New Order',
  '<Plus size={14} /> {t("newOrder", lang)}'
);

// Fix Sign Out
dash = dash.replace(
  '<LogOut size={13} /> Sign Out',
  '<LogOut size={13} /> {t("signOut", lang)}'
);

// Make section labels smaller  
dash = dash.replace(
  /fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "1\.5px", padding: "8px 8px 4px"/g,
  'fontSize: 9, fontWeight: 700, color: "#1e293b", letterSpacing: "1.5px", padding: "5px 8px 3px"'
);

// Add live-map tab render before FLEET TAB comment
const livemapTab = `          {/* LIVE MAP TAB */}
          {activeTab === "live-map" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><MapPin size={18} color="#6366f1"/> Live Fleet Map</div>
              <LiveMap vehicles={vehicles} drivers={drivers} height="calc(100vh - 200px)" />
            </div>
          )}

          {/* DRIVER APP */}
          {activeTab === "driver-app" && (
            <div style={{ padding: 24, textAlign: "center" }}>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 20, padding: 40, border: "1px solid rgba(99,102,241,0.15)", maxWidth: 420, margin: "0 auto" }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
                  <Truck size={40} color="white" />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 10 }}>FleetMind Driver App</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>Full mobile PWA for drivers. GPS tracking, delivery management, proof of delivery, customer calls and navigation. Works offline.</div>
                <a href="/driver" target="_blank" style={{ display: "block", padding: "14px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 12, color: "white", textDecoration: "none", fontSize: 15, fontWeight: 700, boxShadow: "0 8px 25px rgba(99,102,241,0.4)", marginBottom: 12 }}>Open Driver App →</a>
                <div style={{ fontSize: 12, color: "#334155" }}>Share with drivers: {typeof window !== "undefined" ? window.location.origin : ""}/driver</div>
              </div>
            </div>
          )}

`;

if (!dash.includes("live-map tab")) {
  dash = dash.replace('          {/* FLEET TAB */', livemapTab + '          {/* FLEET TAB */');
}

fs.writeFileSync("app/dashboard/page.tsx", dash, "utf8");
console.log("Dashboard updated with map + driver app + translations!");
