/* $FlowIgnore */
import gql from "graphql-tag";

const CalloutQuery = gql`
query Callout($keys: [String]!) {
    callouts(filters: {Key: {in: $keys}}) {
        documentId,
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
