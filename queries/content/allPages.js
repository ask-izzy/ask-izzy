/* @flow */

import gql from "graphql-tag";

const pageQuery: any = gql`
    query Page {
        pages {
            data {
                attributes {
                    Path
                    updatedAt
                    CalloutBoxes {
                        callout {
                            data {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default pageQuery;

export type CmsResponsePages = {
    pages: {
        data: Array<CmsPageMetaDetails>
    } | null
}

export type CmsPageMetaDetails = {
    attributes: {
        Path: string,
        updatedAt: string | null,
        CalloutBoxes: Array<{
            callout: {
                data: {
                    id: number,
                } | null
            } | null
        }> | null
    } | null
}
