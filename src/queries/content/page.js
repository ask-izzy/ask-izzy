/* $FlowIgnore */

import gql from "graphql-tag";

const pageQuery = gql`
query Page($path: String!) {
  pages(where: {Path: $path}) {
    Body,
    Path,
    Title,
    Banner,
    BannerTextPrimary,
    BannerTextSecondary,
  }
}
`;

export default pageQuery;
