/* $FlowIgnore */

import gql from "graphql-tag"

const externalResourcesQuery = gql`
query ExternalResources($category: [String], $tag: [String]) {
  externalResources(
    where: {
      categories:{Name_in:$category},
      tags:{Name_in:$tag}
    },
    sort: "updated_at:desc",
    limit: 10,
  ) {
    id,
    Title,
    Body,
    Author,
    Link,
    categories {
      id,
      Name,
    }
  }
}
`

export default externalResourcesQuery
