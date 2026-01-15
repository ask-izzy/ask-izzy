/* @flow */
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { HttpsProxyAgent } from "https-proxy-agent";

const fetch = global.fetch;

function proxyFetch(url, options = {}) {
    if (typeof window === "undefined" && process.env.HTTP_PROXY) {
        options.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
    }
    return fetch(url, options);
}

// $FlowIgnore Let's not bother trying to type this with flow. I'll be easy to
// do when we move to typescript.
const client: any = new ApolloClient({
    link: new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
        fetch: proxyFetch,
    }),
    cache: new InMemoryCache(),
});

export default client;

// We'll type these property when moving to typescript
export async function queryGraphQlWithErrorLogging(query: any): any {
    try {
        return await client.query(query)
    } catch (error) {
        console.error(error.message)
        if (error.graphQLErrors?.length) {
            console.error(error.graphQLErrors)
        }
        if (error.networkError) {
            console.error(error.networkError.message)
            console.error(error.networkError.result)
        }
        throw error
    }
}
