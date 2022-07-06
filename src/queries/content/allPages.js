/* $FlowIgnore */

import gql from "graphql-tag";

const pageQuery = gql`
    query Page {
        pages {
            Path
            CalloutBoxes {
                callout {
                    id
                }
            }
        }
    }
`;

export default pageQuery;
