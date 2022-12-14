export default (parent, args, context, info) => {
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