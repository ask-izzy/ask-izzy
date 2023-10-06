/* @flow */
import { ApolloClient, InMemoryCache } from "@apollo/client";

// $FlowIgnore Let's not bother trying to type this with flow. I'll be easy to
// do when we move to typescript.
const client: any = new ApolloClient({
    uri: new URL("/graphql", process.env.NEXT_PUBLIC_STRAPI_URL),
    cache: new InMemoryCache(),
});

export default client;

// We'll type these property when moving to typescript
export async function queryGraphQlWithErrorLogging<Response>(query: any): Promise<{data: Response}> {
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
