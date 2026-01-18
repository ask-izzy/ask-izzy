/* @flow */
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { HttpsProxyAgent } from "https-proxy-agent";
import axios from "axios";

const proxy = process.env.HTTP_PROXY;

async function axiosFetch(url, options = {}) {
    const agent = (typeof window === "undefined" && proxy) ?
        new HttpsProxyAgent(proxy)
        : undefined;

    const axiosOptions = {
        url,
        method: options.method || "POST",
        headers: options.headers,
        data: options.body,
        httpAgent: agent,
        httpsAgent: agent,
        proxy: false, // See https://github.com/axios/axios/issues/2072#issuecomment-567473812
    };

    const response = await axios(axiosOptions);
    return {
        ok: true,
        status: response.status,
        json: async() => response.data,
        text: async() => JSON.stringify(response.data),
        headers: {
            get: (key) => response.headers[key.toLowerCase()],
        },
    };
}

// $FlowIgnore Let's not bother trying to type this with flow. I'll be easy to
// do when we move to typescript.
const client: any = new ApolloClient({
    link: new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
        fetch: axiosFetch,
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
