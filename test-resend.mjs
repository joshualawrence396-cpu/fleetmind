const key = process.env.RESEND_API_KEY || require("fs").readFileSync(".env","utf8").match(/RESEND_API_KEY=([^\r\n]+)/)?.[1]
console.log("Key found:", key ? key.substring(0,8)+"..." : "NOT FOUND")
fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ from: "onboarding@resend.dev", to: ["delivered@resend.dev"], subject: "FleetMind Test", html: "<p>Test</p>" })
}).then(r=>r.json()).then(d=>console.log("Resend result:", JSON.stringify(d))).catch(e=>console.log("Error:",e.message))
