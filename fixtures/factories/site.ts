import merge from "deepmerge";

import type {SiteProps} from "../../src/iss/site";
import type {AddressLocationProps} from "../../src/iss/AddressLocation";
import { Sequence } from "./Value";
import { getAddressLocationPropsFixture } from "./AddressLocation";

const idGenerator = Sequence();

export type siteFixtureProps = Partial<Omit<SiteProps, "location">> & {
    location?: Partial<AddressLocationProps> | null,
}

export default function getSiteFixture(props?: siteFixtureProps): SiteProps {
    const siteId = idGenerator();
    const {location, ...otherProps} = props || {}

    return merge({
        id: siteId,
        name: `Home of ${siteId}`,
    }, {
        ...otherProps,
        // A location of null indicates the site location is unknown
        location: location === null ?
            null
            : getAddressLocationPropsFixture(location),
    });
}
