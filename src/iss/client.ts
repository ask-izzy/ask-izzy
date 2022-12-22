import createClient from "@/src/ix-web-js-client/apis/iss/index.js"
import type {ISS3Client} from "@/src/ix-web-js-client/apis/iss/v3.js"
import type {ISS4Client} from "@/src/ix-web-js-client/apis/iss/v4.js"

export function getIssVersion(): "3" | "4" {
    const issVersion = process.env.NEXT_PUBLIC_ISS_VERSION
    if (["3", "4"].includes(issVersion as string)) {
        return issVersion === "3" ? "3" : "4"
    } else {
        throw Error(`Unknown ISS version: ${issVersion}`)
    }
}

let iss3Client: ISS3Client,
    iss4Client: ISS4Client;

function getIssClient(version: "3"): Promise<ISS3Client>
function getIssClient(version: "4"): Promise<ISS4Client>

async function getIssClient(
    version: "3" | "4",
): Promise<ISS3Client | ISS4Client> {
    if (version === "3") {
        if (!iss3Client) {
            iss3Client = await createClient(
                {
                    baseUrl: (process.env.NEXT_PUBLIC_ISS_BASE_URL as string),
                    key: (process.env.NEXT_PUBLIC_ISS_API_KEY as string),
                },
                "3",
            )
        }
        return iss3Client
    } else {
        if (!iss4Client) {
            iss4Client = await createClient(
                {
                    baseUrl: (process.env.NEXT_PUBLIC_ISS_BASE_URL as string),
                    token: (process.env.NEXT_PUBLIC_ISS_API_TOKEN || "<not set>" as string),
                },
                "4",
            )
        }
        return iss4Client
    }
}

export {getIssClient}
