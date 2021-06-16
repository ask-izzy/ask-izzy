/* $FlowIgnore */

import gql from "graphql-tag";

export default gql`
query Alerts(
  $state: [String],
  $screenLocation: [String],
) {
  alerts(
    where: {
      _or: [
        { states_null: true },
        { states: { Name_in: [$state] } },
      ]
      screenLocation: $screenLocation,
    },
  ) {
    id
    title
    body
    created_at
    alertLevel
    defaultToOpen
    states {
      Name
    }
    screenLocation
  }
}
`
