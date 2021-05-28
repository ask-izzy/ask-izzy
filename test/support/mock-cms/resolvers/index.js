/* @flow */
import GraphQLJSON from "graphql-type-json";

import pages from "./pages"
import alerts from "./alerts"
import callouts from "./callouts"

export default {
    Query: () => ({
        alerts,
        pages,
        callouts,
    }),
    DateTime: () => new Date(),
    JSON: (parent: Object, args: Object, context: Object, info: Object) => {
        return GraphQLJSON.serialize(parent[info.fieldName])
    },
}
