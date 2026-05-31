const fs = require("fs");
let content = fs.readFileSync("app/dashboard/page.tsx", "utf8");

// Add missing state variables after existing useState declarations
const oldState = `const [optimizeResult, setOptimizeResult] = useState<any>(null)`;
const newState = `const [optimizeResult, setOptimizeResult] = useState<any>(null)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [driverForm, setDriverForm] = useState({ name: "", email: "", phone: "", licenseNumber: "", licenseType: "CODE10" })`;

if (content.includes(oldState)) {
  content = content.replace(oldState, newState);
  console.log("Added showAddDriver state");
} else {
  console.log("Could not find anchor. Searching for alternatives...");
  // Try alternative anchor
  const alt = `const [optimizing, setOptimizing] = useState(false)`;
  if (content.includes(alt)) {
    content = content.replace(alt, 
      `const [optimizing, setOptimizing] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [driverForm, setDriverForm] = useState({ name: "", email: "", phone: "", licenseNumber: "", licenseType: "CODE10" })`
    );
    console.log("Added via alternative anchor");
  } else {
    console.log("ERROR: Could not find anchor point");
  }
}

// Also add createDriver function if missing
if (!content.includes("createDriver")) {
  const funcAnchor = `const createOrder = async (e: any) => {`;
  const driverFunc = `const createDriver = async (e: any) => {
    e.preventDefault()
    const res = await fetch("/api/drivers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(driverForm) })
    if (res.ok) { loadData(); setShowAddDriver(false); setDriverForm({ name: "", email: "", phone: "", licenseNumber: "", licenseType: "CODE10" }) }
  }

  `;
  content = content.replace(funcAnchor, driverFunc + funcAnchor);
  console.log("Added createDriver function");
}

// Add Add Driver button to topbar if missing
if (!content.includes("showAddDriver(true)") && content.includes("setShowNewOrder(true)")) {
  content = content.replace(
    `<button onClick={() => setShowNewOrder(true)}`,
    `<button onClick={() => setShowAddDriver(true)} style={{ padding: "8px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 9, color: "#34d399", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginRight: -8 }}>
            <span>+ Driver</span>
          </button>
          <button onClick={() => setShowNewOrder(true)}`
  );
  console.log("Added Add Driver button to topbar");
}

fs.writeFileSync("app/dashboard/page.tsx", content, "utf8");
console.log("Done! File length:", content.length);
