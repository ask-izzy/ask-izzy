/**
 * Starts a HTTP server and serves our Express app
 */
import http from 'http'
import Pino from 'pino-http'

import createApp from './app'

// If babel-watch starts supporting "--require" then we can use
// "-r node_modules/dotenv/config" in the "dev" package.json script instead of
// the following. https://github.com/kmagiera/babel-watch/issues/3
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

// Type override necessary until logger property is added
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/52283
interface HttpLogger extends Pino.HttpLogger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logger: any
}

const pino = Pino() as HttpLogger


const domainsToProxy = Object.entries(process.env)
  .filter(envVar => envVar[0].match(/^PROXY_\d+$/))
  .map(
    ([key, domain]) => ({
      port: parseInt(key.match(/\d+/)[0]),
      domain
    })
  )

for (const domainToProxy of domainsToProxy) {
  const app = createApp(domainToProxy.domain)

  app.set('port', domainToProxy.port)
  app.use(pino)

  const server = http.createServer(app)

  server.on('error', onError)
  server.listen(domainToProxy.port)
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + String(port)

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      pino.logger.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      pino.logger.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}
