// Cloudflare Workers AI - FREE 150 requests/day
// Sign up: https://dash.cloudflare.com
// Get Account ID from: https://dash.cloudflare.com > Right sidebar
// Get API Token: https://dash.cloudflare.com/profile/api-tokens > Create Token > "Workers AI (read)"

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ""
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || ""

// Available free models
export const CF_MODELS = {
  fast: "@cf/meta/llama-3-8b-instruct",        // General purpose - fast
  code: "@cf/meta/codellama-7b-instruct-awq",   // Code generation
  embed: "@cf/baai/bge-small-en-v1.5",          // Embeddings
  sql: "@cf/defog/sqlcoder-7b-2",               // SQL generation
}

export async function cloudflareAI(
  prompt: string,
  systemPrompt: string = "You are FleetMind AI, a South African logistics assistant.",
  model: string = CF_MODELS.fast
): Promise<string> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || CF_ACCOUNT_ID.includes("your_")) {
    // Fallback response when no CF credentials
    return JSON.stringify({
      response: "AI response (add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env for real AI)",
      simulated: true
    })
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          max_tokens: 1024,
          temperature: 0.7,
        })
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Cloudflare AI error: ${res.status} - ${err}`)
    }

    const data = await res.json()
    return data.result?.response || data.result?.text || "No response"
  } catch (error: any) {
    console.error("Cloudflare AI error:", error.message)
    throw error
  }
}

export async function cloudflareEmbed(text: string): Promise<number[]> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return []
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODELS.embed}`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: [text] })
      }
    )
    const data = await res.json()
    return data.result?.data?.[0] || []
  } catch { return [] }
}