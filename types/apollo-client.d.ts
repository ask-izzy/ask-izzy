declare module "@apollo/client" {
    import { ApolloProvider as ApolloProviderOriginal } from "@apollo/client/react/context/ApolloProvider";
    import { ApolloClient as ApolloClientOriginal } from "@apollo/client/core";
    import { InMemoryCache as InMemoryCacheOriginal } from "@apollo/client/cache/inmemory/inMemoryCache";
    import { DocumentNode } from "graphql";

    export const ApolloProvider: typeof ApolloProviderOriginal;
    export class ApolloClient<TCache> extends ApolloClientOriginal<TCache> {
        constructor(config: any);
        query<TData, TVariables = OperationVariables>(
            options: QueryOptions<TVariables, TData>
          ): Promise<FetchResult<TData>>;
    }
    export class InMemoryCache extends InMemoryCacheOriginal {}

    export function useQuery<TData = any, TVariables = any>(
        query: DocumentNode,
        options?: QueryHookOptions<TData, TVariables>
    ): QueryResult<TData, TVariables>;
}