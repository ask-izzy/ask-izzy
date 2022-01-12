const { Issuer } = require('openid-client');

export default async function createClient(props) {
    const client = new ISS4Client()
    await client.init(props)
    return client
}

class ISS4Client {
  openIdClient;

  async init({baseUrl, clientId, clientSecret}) {
    const issuer = await Issuer.discover(baseUrl);

    this.openIdClient = new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
    });

    const tokenSet = await client.grant({
        grant_type: 'client_credentials'
    })

    console.log('validated Token claims', tokenSet);

  }
}
createClient({
    aseUrl:
    clientId:
    clientSecret:
}).then(() => console.log('done'))
