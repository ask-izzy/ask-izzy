/* @flow */

import * as React from "react";
import { useQuery } from "@apollo/react-hooks";
// $FlowIgnore
import type { DocumentNode } from "graphql";

const Query = ({ children, query, args, loadingComponent, errorComponent }: {
  children: any,
  query: DocumentNode,
  args?: Object,
  loadingComponent?: any,
  errorComponent?: any
}) => {
    /*
      Paramaters:
          query: A gql query string.
          args GQL arguments to be used in the query.

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
        variables: args,
    });

    if (loading) {
        if (loadingComponent) {
            return loadingComponent;
        }
        return <p>Loading...</p>;
    }
    if (error) {
        if (errorComponent) {
            return errorComponent;
        }
        return <p>An error ocurred and we could not load this section.</p>;
    }
    if (data !== undefined) {
        return children({data});
    }
    return null
};

export default Query;
