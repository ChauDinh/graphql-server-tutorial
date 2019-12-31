import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    message(id: ID!): Message!
    messages(offset: Int, limit: Int): [Message!]!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }
`;
