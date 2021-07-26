/* @flow */
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "node-fetch";

export default function(STRAPI_URL: string = ""): any {
    if (typeof global.fetch === "undefined") {
        global.fetch = require("node-fetch");
    }

    if (!STRAPI_URL && typeof window !== "undefined" && window.STRAPI_URL) {
        STRAPI_URL = window.STRAPI_URL;
    }

    const cache = new InMemoryCache();
    const link = new HttpLink({
        uri: STRAPI_URL + "/graphql",
    });
    return new ApolloClient({
        cache,
        link,
        fetch: fetch,
    });
}
