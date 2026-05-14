/* $FlowIgnore */

import gql from "graphql-tag";

const pageQuery = gql`
query Page($path: String!) {
  pages(filters: {Path: {eq: $path}}) {
    Body,
    Path,
    Title,
    banner {
      Key
    }
    BannerTextPrimary,
    BannerTextSecondary,
    AccordionTitle,
    Accordion {
      id,
      Title,
      Content,
    },
    CalloutBoxes {
        Top,
        Bottom,
        callout {
          documentId,
          ShowHeading,
          Link,
          className {
           className
          },
          Style,
          Heading,
          Body,
          Phone
        }
    }
  }
}
`;

export default pageQuery;
