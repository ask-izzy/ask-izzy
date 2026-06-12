/* @flow */

/*
middleware.js runs in a more limited runtime than Node.js. So we can't use src/utils/rate-limiting.js in middleware.js
because express-rate-limit depends on Node-specific APIs. Hence this simple custom rate-limiter implementation.
*/

export type EdgeRateLimitState = {
    allowed: boolean,
    totalHits: number,
    quoteRemaining: number,
    limitPartiallyExpiresAt: Date,
    limitFullyExpiresAt: Date,
}

type SlidingWindowRateLimiterOptions = {
    maxRequests: number,
    windowMs: number,
    cleanupIntervalOps?: number,
}

export class SlidingWindowRateLimiter {
    maxRequests: number
    windowMs: number
    requests: Map<string, Array<number>>
    operationsSinceCleanup: number
    cleanupIntervalOps: number

    constructor(options: SlidingWindowRateLimiterOptions) {
        const {
            maxRequests,
            windowMs,
            cleanupIntervalOps = 100,
        } = options

        this.maxRequests = maxRequests
        this.windowMs = windowMs
        this.requests = new Map()
        this.operationsSinceCleanup = 0
        this.cleanupIntervalOps = cleanupIntervalOps
    }

    registerHitAndGetState(key: string): EdgeRateLimitState {
        this.registerHit(key)

        return this.getState(key)
    }

    registerHit(key: string): void {
        const recent = this.requests.get(key) || []
        recent.push(Date.now())
        this.requests.set(key, recent)
    }

    getState(key: string): EdgeRateLimitState {
        this.maybeCleanup()
        const now = Date.now()
        const windowStart = now - this.windowMs
        const recent = this.getRecentTimestampsForKey(key, windowStart)

        if (recent.length === 0) {
            this.requests.delete(key)
            return {
                allowed: true,
                totalHits: 0,
                quoteRemaining: this.maxRequests,
                limitPartiallyExpiresAt: new Date(now),
                limitFullyExpiresAt: new Date(now),
            }
        }

        this.requests.set(key, recent)
        const totalHits = recent.length
        const partiallyExpiresIndex = totalHits >= this.maxRequests ?
            totalHits - this.maxRequests
            : -1
        const partiallyExpiresTimestamp = partiallyExpiresIndex >= 0 ?
            recent[partiallyExpiresIndex] + this.windowMs
            : now
        const fullyExpiresTimestamp = recent[totalHits - 1] + this.windowMs

        return {
            allowed: totalHits < this.maxRequests,
            totalHits,
            quoteRemaining: this.maxRequests - totalHits,
            limitPartiallyExpiresAt: new Date(partiallyExpiresTimestamp),
            limitFullyExpiresAt: new Date(fullyExpiresTimestamp),
        }
    }

    resetKey(key: string): void {
        this.requests.delete(key)
    }

    cleanup(): void {
        const windowStart = Date.now() - this.windowMs
        for (const [key, timestamps] of this.requests.entries()) {
            if (timestamps.every((timestamp) => timestamp <= windowStart)) {
                this.requests.delete(key)
            }
        }
    }

    getRecentTimestampsForKey(key: string, windowStart: number): Array<number> {
        const timestamps = this.requests.get(key) || []
        return timestamps.filter((timestamp) => timestamp > windowStart)
    }

    maybeCleanup(): void {
        this.operationsSinceCleanup += 1
        if (this.operationsSinceCleanup >= this.cleanupIntervalOps) {
            this.cleanup()
            this.operationsSinceCleanup = 0
        }
    }
}
