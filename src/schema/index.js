import { gql } from "apollo-server-express";

export default gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    onlineUsers: [User!]!

    message(id: ID!): Message!
    messages: [Message!]!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }
`;
