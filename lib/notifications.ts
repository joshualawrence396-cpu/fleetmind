// FleetMind Notification Service - Resend Email Only

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL DEMO]", to, subject)
    return { simulated: true }
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `FleetMind <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
        to: [to],
        subject,
        html,
      })
    })
    const data = await res.json()
    if (data.error) console.error("Resend error:", data.error)
    return data
  } catch (e: any) {
    console.error("Email error:", e.message)
    return { error: e.message }
  }
}

export function buildOrderEmail(orderNumber: string, driverName?: string, status?: string): string {
  const colors: Record<string, string> = { created: "#6366f1", dispatched: "#f59e0b", delivered: "#10b981", failed: "#ef4444" }
  const color = colors[status || "created"] || "#6366f1"
  return `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0a0f1e;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px 32px">
        <div style="font-size:22px;font-weight:900;color:white">FleetMind</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px">South Africa Logistics OS</div>
      </div>
      <div style="padding:32px">
        <h2 style="color:white;font-size:20px;margin:0 0 16px">Order Update</h2>
        <div style="background:${color}15;border:1px solid ${color}30;border-radius:12px;padding:20px;margin-bottom:24px">
          <div style="font-size:13px;color:#94a3b8;margin-bottom:4px">Order Number</div>
          <div style="font-size:24px;font-weight:800;color:${color}">${orderNumber}</div>
          ${driverName ? `<div style="font-size:13px;color:#94a3b8;margin-top:8px">Driver: <strong style="color:white">${driverName}</strong></div>` : ""}
        </div>
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/track/${orderNumber}" style="display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;font-size:14px">Track Your Order</a>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #1e293b;text-align:center">
        <div style="font-size:12px;color:#334155">FleetMind SA 2026 - Built in Cape Town</div>
      </div>
    </div>
  `
}
