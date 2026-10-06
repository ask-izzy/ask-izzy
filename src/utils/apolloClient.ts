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
        // @ts-expect-error TODO(ts-migration): Property 'method' does not exist on type '{}'.
        method: options.method || "POST",
        // @ts-expect-error TODO(ts-migration): Property 'headers' does not exist on type '{}'.
        headers: options.headers,
        // @ts-expect-error TODO(ts-migration): Property 'body' does not exist on type '{}'.
        data: options.body,
        httpAgent: agent,
        httpsAgent: agent,
        proxy: false, // See https://github.com/axios/axios/issues/2072#issuecomment-567473812
    };

    // @ts-expect-error TODO(ts-migration): No overload matches this call.
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

// do when we move to typescript.
const client: any = new ApolloClient({
    link: new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
        // @ts-expect-error TODO(ts-migration): Type '(url: any, options?: {}) => Promise<{ ok: boolean; status: number…
        fetch: axiosFetch,
    }),
    cache: new InMemoryCache(),
});

export default client;

// We'll type these property when moving to typescript
export async function queryGraphQlWithErrorLogging(query: any): Promise<any> {
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
