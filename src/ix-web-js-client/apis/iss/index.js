/* @flow */
import type {ISS3ClientType} from "./v3.js";
import type {ISS3ClientProps} from "./v3.js";
import ISS3Client from "./v3.js";
import type {ISS4ClientProps} from "./v4.js";
import type {ISS4ClientType} from "./v4.js";
import ISS4Client from "./v4.js";


declare function createClient(props: ISS3ClientProps, version: "3"): ISS3ClientType
declare function createClient(props: ISS4ClientProps, version?: "4"): ISS4ClientType

function createClient(
    props: ISS3ClientProps | ISS4ClientProps,
    version?: "3" | "4"
): ISS3ClientType | ISS4ClientType {
    if (version === "3") {
        // Due to our declared signatures for this function we know that if
        // version is "3" then props must be ISS3ClientProps. Flow is not smart
        // enough to know that here but if we were to call this function
        // like this:
        //
        // const props: ISS4ClientProps = {baseUrl: "value", token: "value"}
        // createClient(props, "3")
        //
        // Flow would complain. Thus we can safely type cast here.
        const castProps: ISS3ClientProps = (props: any)
        return ISS3Client(castProps)
    } else {
        // Same as above comment
        const castProps: ISS4ClientProps = (props: any)
        return ISS4Client(castProps)
    }
}

export default createClient
