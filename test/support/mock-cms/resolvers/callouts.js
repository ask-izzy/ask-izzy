/* @flow */

type Callout = {|
    attributes: {|
        Key: string,
        ShowHeading: boolean | null,
        Heading: string,
    |}
|}


export default (
    parent: Object, args: Object, context: Object, info: Object
): {data: Array<Callout>} => {
    let keys = args?.filters?.Key?.eq || info?.variableValues?.keys
    if (typeof keys === "string") {
        keys = [keys]
    }
    return {
        data: callouts.filter(callout => !keys || keys.includes(callout.attributes?.Key || "")),
    }
}

export const testCallout: Callout = {
    attributes: {
        ShowHeading: true,
        Key: "test",
        Heading: "This callout was embedded in the page body",
    },
}

const callouts: Array<Callout> = [
    testCallout,
]
