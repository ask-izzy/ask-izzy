import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
    cache: new InMemoryCache(),
});

export default client;

export async function queryGraphQlWithErrorLogging<T>(query: T) {
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
