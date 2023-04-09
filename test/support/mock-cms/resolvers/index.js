import GraphQLJSON from "graphql-type-json";

import pages from "./pages.js"
import alerts from "./alerts.js"
import callouts from "./callouts.js"


export default {
    Query: () => ({
        alerts,
        pages,
        callouts,
    }),
    DateTime: () => new Date(),
    JSON: (
        parent,
        args,
        context,
        info
    ) => {
        return GraphQLJSON.serialize(parent[info.fieldName])
    },
}
