import {ISS4Client} from "./v4";
import type {ISS4ClientProps} from "./v4";

function createClient(props: ISS4ClientProps): ISS4Client {
    return new ISS4Client(props)
}

export default createClient
