import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const searchRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute for search
  analytics: true,
});

export const uploadRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 uploads per minute
  analytics: true,
});

export function getClientIp(req: Request): string {
  // In Next.js App Router (especially on Vercel), IP can be retrieved from headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
