import { Redis } from "@upstash/redis"

// Upstash Redis
let redisInstance: Redis | null = null

export function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_URL.includes("your_")
  ) {
    return null
  }

  if (!redisInstance) {
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }

  return redisInstance
}

// Backwards compatibility export
export const redis = getRedis()

// Stream names
export const STREAMS = {
  VEHICLE_LOCATIONS: "vehicle_locations",
  ALERTS: "alerts",
} as const

// Publish to Redis stream
export async function publishToStream(
  stream: string,
  data: any
): Promise<void> {
  try {
    const r = getRedis()

    if (!r) {
      console.log("Redis unavailable:", stream, data)
      return
    }

    await r.xadd(stream, "*", {
      data: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Redis stream publish error:", error)
  }
}

export async function cacheGet(key: string): Promise<any> {
  try {
    const r = getRedis()
    if (!r) return null

    return await r.get(key)
  } catch {
    return null
  }
}

export async function cacheSet(
  key: string,
  value: any,
  ttlSeconds = 300
): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return

    await r.setex(key, ttlSeconds, JSON.stringify(value))
  } catch {}
}

export async function cacheDel(key: string): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return

    await r.del(key)
  } catch {}
}

export async function cacheInvalidatePattern(
  pattern: string
): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return

    const keys = await r.keys(pattern)

    if (keys.length > 0) {
      await r.del(...keys)
    }
  } catch {}
}