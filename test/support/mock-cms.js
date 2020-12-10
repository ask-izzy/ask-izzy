/* @flow */
import { ApolloServer, gql } from "apollo-server";

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
    Banner: Banner
    BannerTextPrimary: String
    BannerTextSecondary: String
  }
  scalar DateTime
  scalar JSON
  enum PublicationState {
    LIVE
    PREVIEW
  }
  type Banner {
    Key: String!
  }
`;

const mocks = {
    Query: () => ({
        pages: (parent, args, context, info) => {
            const path = args?.where?.Path || info?.variableValues?.path
            if (path === "/about") {
                return [{
                    Title: "About Ask Izzy",
                    Body: "We’re always making improvements.",
                    Banner: {
                        Key: "food",
                    },
                    BannerTextPrimary: "Some primary text",
                    BannerTextSecondary: "Some secondary text",
                }]
            } else if (path === "/terms") {
                return [{
                    Title: "Our Terms",
                    Body: "Try to live a good life",
                }]
            } else if (path === "/online-safety") {
                return []
            } else if (path === "/food-info") {
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
    const {port} = new URL(url)
    options = {port}
}

const server = new ApolloServer({
    typeDefs,
    mocks,
});

options ? server.listen(options) : server.listen()