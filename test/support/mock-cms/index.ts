/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { ApolloServer, gql } from "apollo-server";
import fs from "fs";
import path, {dirname} from "path"
import { fileURLToPath } from 'url';



import mocks from "./resolvers/index.js"

const typeDefs = gql(
    fs.readFileSync(dirname(fileURLToPath(import.meta.url)).concat("/strapi-schema.graphql"), "utf8")
)

const port = process.env.PORT
if (!port) {
    throw Error("PORT env var must be set to start mock CMS")
}

let options = {
    port,
};

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

server.listen(options)

console.info(`Mock CMS server running at: http://localhost:${port}`)


