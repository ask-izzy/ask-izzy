import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    pages(
      sort: String
      limit: Int
      start: Int
      where: JSON
      publicationState: PublicationState
    ): [Page]
  }
  type Page {
    id: ID!
    created_at: DateTime!
    updated_at: DateTime!
    Title: String!
    Body: String
    Path: String!
    Banner: String
  }
  scalar DateTime
  scalar JSON
  enum PublicationState {
    LIVE
    PREVIEW
  }
`;

const mocks = {
  Query: () =>({
    pages: (parent, args, context, info) => {
      const path = args?.where?.Path || info?.variableValues?.path
      // console.log(parent, args, context, info)
      // console.log(1, path, 1, info.variableValues)
      if (path === '/about') {
        return [{
          Title: "About Ask Izzy",
          Body: "We’re always making improvements.",
        }]
      } else if (path === '/terms') {
        return [{
          Title: "Our Terms",
          Body: "Try to live a good life",
        }]
      } else if (path === '/online-safety') {
        return []
      } else if (path === '/food-info') {
        return [
          {Title: "Page 1"},
          {Title: "Page 2"},
        ]
      }
      return [{}]
    },
  }),
  DateTime: () => new Date(),
}

const url = process.env.STRAPI_URL
let options;
if (url) {
  const {port, hostname: host} = new URL(url)
  options = {port, host}
}

const server = new ApolloServer({
  typeDefs,
  mocks,
});

options ? server.listen(options) : server.listen()