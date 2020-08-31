/* @flow */

// $FlowIgnore
import gql from "graphql-tag";

const bannerQuery = gql`
query Banner($id: ID!) {
  banner(id: $id) {
    id
    Description
    Body
  }
}
`;

export default bannerQuery;
