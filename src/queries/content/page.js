/* flow:disable */

import gql from "graphql-tag";

const pageQuery = gql`
query Page {
  pages {
    Body,
    Path,
    Title,
    Banner,
  }
}
`;

export default pageQuery;
