/* @flow */
import merge from "deepmerge";

import type {site} from "../../src/iss/site";
import { Sequence } from "./Value";

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
