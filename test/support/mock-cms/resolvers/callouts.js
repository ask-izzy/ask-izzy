/* @flow */

type Callout = {
    ShowHeading: boolean,
    Key: string,
    Heading: string,
}

export default (
    parent: Object, args: Object, context: Object, info: Object
): Array<Callout> => {
    let keys = args?.where?.Key || info?.variableValues?.keys
    if (typeof keys === "string") {
        keys = [keys]
    }
    return callouts
        .filter(callout => !keys || keys.includes(callout.Key))
}

export const testCallout = {
    ShowHeading: true,
    Key: "test",
    Heading: "This callout was embedded in the page body",
}

const callouts = [
    testCallout,
]