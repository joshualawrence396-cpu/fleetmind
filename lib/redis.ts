import { Redis } from "@upstash/redis"

// Upstash Redis - free tier 10k commands/day
// Sign up free at https://upstash.com
let redis: Redis | null = null

export function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL.includes("your_")) {
    return null
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

export async function cacheGet(key: string): Promise<any> {
  try {
    const r = getRedis()
    if (!r) return null
    return await r.get(key)
  } catch { return null }
}

export async function cacheSet(key: string, value: any, ttlSeconds = 300): Promise<void> {
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

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return
    const keys = await r.keys(pattern)
    if (keys.length > 0) await r.del(...keys)
  } catch {}
}