/* @flow */

let STRAPI_URL = "";

if (typeof window !== "undefined" && window.STRAPI_URL) {
    STRAPI_URL = window.STRAPI_URL;
}

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "cross-fetch";
import { HttpLink } from "apollo-link-http";

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: STRAPI_URL + "/graphql",
    fetch,
});
const client = new ApolloClient({
    cache,
    link,
    fetch: fetch,
});

export default client;
