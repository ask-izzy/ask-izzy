import type AddressLocation from "./AddressLocation"
import type {AddressLocationProps} from "./AddressLocation"

export type site = {
    id: number,
    name: string,
    location?: AddressLocation | null,
}

// The shape of a site as returned by ISS
export type SiteProps = Omit<site, "location"> & {
    location?: AddressLocationProps | null,
}
