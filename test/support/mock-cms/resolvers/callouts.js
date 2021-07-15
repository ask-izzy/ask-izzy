/* @flow */

export default (
    parent: Object, args: Object, context: Object, info: Object
) => {
    const key = args?.where?.Key || info?.variableValues?.key
    if (key === "test") {
        return [testCallout]
    } else if (key === "nothing") {
        return [{}]
    }
    return [{}]
}

export const testCallout = {
    ShowHeading: true,
    Heading: "Ask Izzy can help",
}
