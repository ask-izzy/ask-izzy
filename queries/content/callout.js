/* @flow */
import gql from "graphql-tag";

export const calloutFragment: any = gql`
fragment CalloutBox on CalloutEntity {
    id,
    attributes {
        Key,
        ShowHeading,
        Link,
        StyleClass {
            data {
                attributes {
                    className
                }
            }
        },
        Style,
        Heading,
        Body,
        Phone
    }
}`

const CalloutQuery: any = gql`
query Callout($keys: [String]!) {
    callouts(filters: {Key: {in: $keys}}) {
        data {
            ...CalloutBox
        }
    }
}
${calloutFragment}
`;

export default CalloutQuery

export type CmsCalloutBoxType = {
    callouts: {
        data: Array<CmsCalloutBoxFragmentType>
    }
}

export type CmsCalloutBoxFragmentType = {
    id: number | null,
    attributes: {
        Key: string,
        ShowHeading: boolean | null,
        Link: string | null,
        StyleClass: {
            data: {
                attributes: {
                    className: string
                } | null
            } | null
        } | null,
        Style: Object | null,
        Heading: string,
        Body: string | null,
        Phone: string | null,
    } | null
}
