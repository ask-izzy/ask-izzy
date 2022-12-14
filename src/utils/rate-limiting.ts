import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const applyMiddleware = (middleware) => (request, response) =>
    new Promise((resolve, reject) => {
        middleware(request, response, (result) =>
            result instanceof Error ? reject(result) : resolve(result),
        );
    });

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
}: rateLimitArgs): Array<(...args: Array<any>) => any> {
    return [
        slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
        rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
    ].map(applyMiddleware);
}
