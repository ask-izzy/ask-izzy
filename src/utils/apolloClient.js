/* flow:disable */

if (typeof global.fetch === "undefined") {
    global.fetch = require("node-fetch");
}

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { HttpLink } from "apollo-link-http";

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: "http://localhost:1337/graphql",
});
const client = new ApolloClient({
    cache,
    link,
    fetch: fetch,
});

export default client;
