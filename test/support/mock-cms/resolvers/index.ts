import GraphQLJSON from "graphql-type-json";

import pages from "./pages"
import alerts from "./alerts"
import callouts from "./callouts"

type Query = {
    alerts: typeof alerts,
    pages: typeof pages,
    callouts: typeof callouts,
}

export default {
    Query: (): Query => ({
        alerts,
        pages,
        callouts,
    }),
    DateTime: (): Date => new Date(),
    JSON: (
        parent: any,
        args: any,
        context: any,
        info: any
    ): any => {
        return GraphQLJSON.serialize(parent[info.fieldName])
    },
}
