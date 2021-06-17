import status from 'statuses'
import express, { Request, Response } from 'express'
import createError from 'http-errors'

export default (function (err, req, res, next) {
  // We can't do anything if we've already started sending headers
  if (res.headersSent) {
    return next(err)
  }

  const presentableError = getPresentableError(err, req, res)

  return res
    .status(presentableError.status)
    .json(presentableError)

  // If you want to return HTML using the jade templates then use this instead
  // of the above return statement:
  // res.locals.error = presentableError
  // res.status(presentableError.status)
  // res.render('error')
} as express.ErrorRequestHandler)

// This is designed to be used like a default route. If no routes match or no
// matching route generates any response then throw a 404 error.
export const nothingRenderedHandler = (function (req, res, next) {
  next(createError(404))
} as express.RequestHandler)

type PresentableError = {
  status: number;
  message: string;
  stack?: string;
}

type Error = {
  status?: number;
  statusCode?: number;
  message?: string;
  stack?: string;
}

/**
 * Based on the the current NODE_ENV setting return the error information which
 * is appropriate to display to the end user.
 */
function getPresentableError (err: Error, req: Request, res: Response): PresentableError {
  const isDevEnv = req.app.get('env') === 'development'
  const errStatus = statusIsError(err.status || err.statusCode)
    ? (err.status || err.statusCode)
    : null

  const newError: Error = {}

  // Gather all error info that is okay to present to the user
  if (isDevEnv && (errStatus || err.message)) {
    if (errStatus) {
      newError.status = errStatus
    }
    if (err.message) {
      newError.message = err.message
    }
  } else if (errStatus) {
    newError.status = errStatus
  } else if (statusIsError(res.statusCode)) {
    newError.status = res.statusCode
  }
  if (isDevEnv && err.stack) {
    newError.stack = err.stack
  }

  // Fill in any missing error info with default values
  if (!newError.status) {
    newError.status = 500
  }
  if (!newError.message) {
    newError.message =
      status.message[newError.status] || 'Unknown Error'
  }

  return {
    status: newError.status,
    message: newError.message,
    stack: newError.stack,
  }

  function statusIsError (status: unknown) {
    return typeof status === 'number'
      ? status >= 400 && status < 600
      : null
  }
}
