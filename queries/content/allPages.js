/* $FlowIgnore */

import gql from "graphql-tag";

const pageQuery = gql`
    query Page {
        pages {
            Path
            updated_at
            CalloutBoxes {
                callout {
                    id
                }
            }
        }
    }
`;

export default pageQuery;
