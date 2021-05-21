import express from 'express'
import proxy from 'express-http-proxy'

import routes from './routes/index'
import errorHandler, { nothingRenderedHandler } from './middleware/errorHandler'

export default function(proxyDomain) {
  const app = express()

  app.use('/', proxy(proxyDomain, {
    https: true
  }));

  app.use(nothingRenderedHandler)
  app.use(errorHandler)

  return app
}
