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
    JSON: (
        parent,
        args,
        context,
        info
    ) => {
        return GraphQLJSON.serialize(parent[info.fieldName])
    },
}
