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
      id,
      Title,
      Content,
    },
    CalloutBoxes {
        Top,
        Bottom,
        callout {
          id,
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
