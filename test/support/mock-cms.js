/* @flow */
import { ApolloServer, gql } from "apollo-server";
import GraphQLJSON from "graphql-type-json";

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
    AccordionTitle: String
    Accordion: [Accordion]
    CalloutBoxes: [CalloutBoxes]
  }
  scalar DateTime
  scalar Boolean
  scalar JSON
  enum PublicationState {
    LIVE
    PREVIEW
  }
  type Banner {
    Key: String!
  }
  type Accordion {
    Title: String
    Content: String
  }
  type CalloutBoxes {
    Top: Boolean
    Bottom: Boolean
    callout: Callout
  }
  type Callout {
    id: ID!
    ShowHeading: Boolean
    Link: String
    className: ClassName
    Heading: String!
    Body: String
    Style: JSON
    Phone: String
  }

  type ClassName {
    className: String
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
                    Accordion: [
                        {
                            Title: "Victoria",
                            Content: "Accordion content for Victoria.",
                        },
                        {
                            Title: "Tasmania",
                            Content: "Accordion content for Tasmania.",
                        },
                    ],
                }]
            } else if (path === "/terms") {
                return [{
                    Title: "Our Terms",
                    Body: "Try to live a good life",
                }]
            } else if (path === "/online-safety") {
                return [];
            } else if (path === "/homeless-shelters") {
                return [
                    {
                        Title: "Shelter Services",
                        CalloutBoxes: [
                            {
                                Top: true,
                                Bottom: false,
                                callout: {
                                    ShowHeading: true,
                                    Heading: "Ask Izzy can help",
                                },
                            },
                        ],
                    },
                ];
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
    JSON: (parent, args, context, info) => {
        return GraphQLJSON.serialize(parent[info.fieldName])
    },
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
