import merge from "deepmerge";
import {$Shape} from "utility-types";

import type {site} from "@/src/iss/site.js";
import { Sequence } from "@/fixtures/factories/Value.js";



const idGenerator = Sequence();

export default function getSiteFixture(props?: $Shape<site>): site {
    const siteId = idGenerator();
    const organisationId = idGenerator();

    return merge({
        id: siteId,
        name: `Home of ${siteId}`,
        organisation: {
            id: organisationId,
            name: `Organization of ${organisationId}`,
        },
    }, props || {});
}
