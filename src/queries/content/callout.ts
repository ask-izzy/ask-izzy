import gql from "graphql-tag";

const CalloutQuery = gql`
query Callout($keys: [String]!) {
    callouts(where: {Key: $keys}) {
        id,
        Key,
        ShowHeading,
        Link,
        className {
            className
        },
        Style,
        Heading,
        Body,
        Phone
    }
}
 `;

export default CalloutQuery
