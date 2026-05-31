import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Simulated courier rate engines for SA providers
const COURIER_RATES: Record<string, (weight: number, distance: number, service: string) => number> = {
  BOB_GO: (w, d, s) => s === "EXPRESS" ? 95 + (w * 12) + (d * 0.8) : 65 + (w * 8) + (d * 0.5),
  ARAMEX: (w, d, s) => s === "EXPRESS" ? 110 + (w * 15) + (d * 0.9) : 75 + (w * 10) + (d * 0.6),
  COURIER_GUY: (w, d, s) => s === "EXPRESS" ? 85 + (w * 11) + (d * 0.7) : 60 + (w * 7) + (d * 0.45),
  DSV: (w, d, s) => s === "EXPRESS" ? 120 + (w * 14) + (d * 1.0) : 80 + (w * 9) + (d * 0.65),
  PUDO: (w, d, s) => 45 + (w * 6) + (d * 0.3), // locker-based, always economy
  POSTNET: (w, d, s) => 55 + (w * 7) + (d * 0.35),
}

const ETA: Record<string, Record<string, string>> = {
  BOB_GO: { EXPRESS: "Next day", STANDARD: "2-3 days", ECONOMY: "3-5 days" },
  ARAMEX: { EXPRESS: "Same day", STANDARD: "1-2 days", ECONOMY: "3-4 days" },
  COURIER_GUY: { EXPRESS: "Next day", STANDARD: "2-3 days", ECONOMY: "4-5 days" },
  DSV: { EXPRESS: "Next day", STANDARD: "2-4 days", ECONOMY: "5-7 days" },
  PUDO: { ECONOMY: "3-5 days" },
  POSTNET: { STANDARD: "2-4 days", ECONOMY: "4-6 days" },
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, weightKg = 1, distanceKm = 50, serviceLevel = "STANDARD" } = body

    const accounts = await prisma.courierAccount.findMany({ where: { isActive: true } })
    const activeProviders = accounts.length > 0
      ? accounts.map(a => a.provider)
      : Object.keys(COURIER_RATES)

    const quotes = activeProviders.map(provider => {
      const rateFn = COURIER_RATES[provider]
      if (!rateFn) return null
      const price = Math.round(rateFn(weightKg, distanceKm, serviceLevel) * 100) / 100
      const eta = ETA[provider]?.[serviceLevel] || ETA[provider]?.STANDARD || "3-5 days"
      return { provider, service: serviceLevel, price, currency: "ZAR", eta, recommended: false }
    }).filter(Boolean)

    // Sort by price, mark cheapest as recommended
    quotes.sort((a: any, b: any) => a.price - b.price)
    if (quotes.length > 0) (quotes[0] as any).recommended = true

    // Save rates if orderId provided
    if (orderId) {
      await Promise.all(quotes.map((q: any) =>
        prisma.courierRate.create({
          data: { provider: q.provider, orderId, service: q.service, price: q.price, currency: q.currency, eta: q.eta, rawQuote: q }
        })
      ))
    }

    return NextResponse.json({ quotes, cheapest: quotes[0], fastest: quotes.find((q: any) => q.provider === "ARAMEX") })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}