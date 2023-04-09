import {ISS3Client, ISS3ClientProps} from "@/src/ix-web-js-client/apis/iss/v3.js";
import {ISS4Client, ISS4ClientProps} from "@/src/ix-web-js-client/apis/iss/v4.js";


function createClient(props: ISS3ClientProps, version: "3"): ISS3Client
function createClient(props: ISS4ClientProps, version?: "4"): ISS4Client

function createClient(
    props: ISS3ClientProps | ISS4ClientProps,
    version?: "3" | "4",
): ISS3Client | ISS4Client {
    if (version === "3") {
        return new ISS3Client(props as ISS3ClientProps)
    } else {
        return new ISS4Client(props as ISS4ClientProps)
    }
}

export default createClient
