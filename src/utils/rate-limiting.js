/* @flow */
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const getIP = (request) =>
    request.ip ||
    request.headers["x-forwarded-for"] ||
    request.headers["x-real-ip"] ||
    request.connection.remoteAddress;

type rateLimitArgs = {
    limit?: number,
    windowMs?: number,
    delayAfter?: number,
    delayMs?: number,
}

export function getRateLimitMiddlewares({
    limit = 10,
    windowMs = 60 * 1000,
    delayAfter = Math.round(10 / 2),
    delayMs = 500,
}: rateLimitArgs): Array<function> {
    return [
        rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
        slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    ];
}
