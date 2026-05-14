/* $FlowIgnore */

import gql from "graphql-tag";

export default gql`
query Alerts(
  $state: [String],
  $screenLocation: [String],
) {
  alerts(
    filters: {
      or: [
        { states: { documentId: { null: true } } },
        { states: { Name: { in: $state } } },
      ]
      screenLocation: { in: $screenLocation },
    },
  ) {
    documentId
    title
    body
    createdAt
    updatedAt
    alertLevel
    defaultToOpen
    states {
      Name
    }
    screenLocation
  }
}
`
