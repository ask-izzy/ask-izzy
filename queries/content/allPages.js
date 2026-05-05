/* $FlowIgnore */

import gql from "graphql-tag";

const pageQuery = gql`
    query Page {
        pages {
            Path
            updatedAt
            CalloutBoxes {
                callout {
                    documentId
                }
            }
        }
    }
`;

export default pageQuery;
