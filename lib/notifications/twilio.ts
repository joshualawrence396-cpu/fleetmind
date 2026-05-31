// Replaced by Resend email - see lib/notifications.ts
export async function sendEmail(to: string, subject: string, html: string) {
  const { sendEmail: _send } = await import("../notifications")
  return _send(to, subject, html)
}
