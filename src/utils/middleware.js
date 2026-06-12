/* @flow */

import { NextApiRequest, NextApiResponse } from "next/server"

export async function callMiddlewares(
    middlewares: Array<(typeof NextApiRequest, typeof NextApiResponse, (error?: any) => void) => void>,
    request: typeof NextApiRequest,
    response?: typeof NextApiResponse
): Promise<{ responseStub?: any }> {
    let responseStub: {
        headers: { [key: string]: any },
        headersSet: boolean,
        statusCode?: number,
        statusCodeSet: boolean,
        body?: any,
        sent: boolean,
    } = {
        headers: {},
        headersSet: false,
        statusCodeSet: false,
        sent: false,
    }
    const useResponseStub = !response
    if (useResponseStub) {
        response = {
            setHeader: (key: string, value: any) => {
                responseStub.headers[key] = value
                responseStub.headersSet = true
            },
            status: (statusCode: number) => {
                responseStub.statusCode = statusCode
                responseStub.statusCodeSet = true
            },
            send: (body) => {
                console.log("Response body set to:", body)
                responseStub.body = body
                responseStub.sent = true
            },
        }
    }
    for (const middleware of middlewares) {
        await promisifyMiddleware(middleware)(request, response)
    }
    if (useResponseStub) {
        return {
            responseStub,
        }
    }
    return {}
}

type Middleware = (typeof NextApiRequest, typeof NextApiResponse, (error?: any) => void) => void
type PromisifiedMiddleware = (typeof NextApiRequest, typeof NextApiResponse) => Promise<void>

export const promisifyMiddleware = (middleware: Middleware): PromisifiedMiddleware =>
    (request: typeof NextApiRequest, response: typeof NextApiResponse) =>
        new Promise<void>(async(resolve, reject) => {
            let responseSent = false
            await middleware(request, response, (error) => {
                if (responseSent) {
                    console.warn("Middleware called next() after returning.")
                    return
                }
                responseSent = true
                if (error === undefined) {
                    resolve()
                } else {
                    reject(error)
                }
            });
            if (!responseSent) {
                responseSent = true
                resolve()
            }
        });
