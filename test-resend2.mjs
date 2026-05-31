import { readFileSync } from "fs"
const env = readFileSync(".env", "utf8")
const key = env.match(/RESEND_API_KEY=([^\r\n]+)/)?.[1]?.trim()
console.log("Key found:", key ? key.substring(0,12)+"..." : "NOT FOUND")
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ from: "onboarding@resend.dev", to: ["delivered@resend.dev"], subject: "FleetMind Test", html: "<p>Test</p>" })
})
const data = await res.json()
console.log("Status:", res.status)
console.log("Result:", JSON.stringify(data, null, 2))
