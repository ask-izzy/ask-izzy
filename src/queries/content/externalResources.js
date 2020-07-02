/* flow:disable */

import gql from "graphql-tag"

const externalResourcesQuery = gql`
query ExternalResources($category: [String]) {
  externalResources(where: {categories:{Name_in:$category}}) {
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
