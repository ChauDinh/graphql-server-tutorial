import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    message(id: ID!): Message!
    # messages(offset: Int, limit: Int): [Message!]! - offset/limit pagination
    messages(cursor: String, limit: Int): MessageConnection! # cursor-based pagination
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }
`;
