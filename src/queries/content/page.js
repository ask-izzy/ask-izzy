/* flow:disable */

import gql from "graphql-tag";

const pageQuery = gql`
query Page($path: String!) {
  pages(where: {Path: $path}) {
    Body,
    Path,
    Title,
    Banner {
      Key
    }
    BannerTextPrimary,
    BannerTextSecondary,
  }
}
`;

export default pageQuery;
