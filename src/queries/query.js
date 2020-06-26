/* flow:disable */

import React from "react";
import { useQuery } from "@apollo/react-hooks";

const Query = ({ children, query, id }) => {
    /*
      Paramaters:
          query: A gql query string.
          id: The id of the record.

      This is a simple query component which takes a query and an
      a unique identifier and performs a graphql query for the record.

      The component will return a data object with the resulting record.

      To use this component first declare a query such as:

      import gql from "graphql-tag";

      const generateQuery = gql`
        query Content($id: ID!) {
          content(id: $id) {
            id
            Description
            Body
          }
        }
      `;

      then import this module and call it as:

      <Query query={pageQuery}
             id={1}
      >
          {({data}) => {
              return <p>{data.content.Body}</p>;
          }}
      </Query>
    */

    const { data, loading, error } = useQuery(query, {
        variables: { id },
    });

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>An error ocurred and we could not load this section.</p>;
    }
    return children({ data });
};

export default Query;
