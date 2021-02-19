/* $FlowIgnore */

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
    AccordionTitle,
    Accordion {
      Title,
      Content,
    }
  }
}
`;

export default pageQuery;
