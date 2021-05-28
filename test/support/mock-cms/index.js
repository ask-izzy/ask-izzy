/* @flow */
import { ApolloServer, gql } from "apollo-server";
import fs from "fs";

import mocks from "./resolvers"

const typeDefs = gql(
    fs.readFileSync(__dirname.concat("/strapi-schema.graphql"), "utf8")
)

const url = process.env.STRAPI_URL
let options;
if (url) {
    const {port} = new URL(url)
    options = {port}
}

// Required so exported strapi graphql schema will validate
const resolvers = {
    Morph: {
        __resolveType(obj, context, info) {
            return null;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    mocks,
    introspection: true,
    playground: true,
    uploads: false,
});

options ? server.listen(options) : server.listen()
