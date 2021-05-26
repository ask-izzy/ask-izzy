/* $FlowIgnore */
import gql from "graphql-tag";

const CalloutQuery = gql`
query Callout($key: String) {
    callouts(where: {Key: $key}) {
        id,
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
