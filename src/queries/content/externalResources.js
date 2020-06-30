/* flow:disable */

import gql from "graphql-tag"

const externalResourcesQuery = gql`
query ExternalResources {
  externalResources {
    id,
    Title,
    Body,
    Author,
    Link,
  }
}
`

export default externalResourcesQuery
