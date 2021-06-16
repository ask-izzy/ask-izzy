import request from 'supertest'

import createApp from '../src/app'

const app = createApp('api.serviceseeker.com.au')

describe('Proxy request', () => {
  it('/ returns the root of ISS', () =>
    request(app)
      .get('/')
      .expect(/Infoxchange Service Seeker/)
      .expect(200),
  )
})
