import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";

let users = {
  1: {
    id: "1",
    username: "Jascha Heifetz"
  },
  2: {
    id: "2",
    username: "David Oistrakh"
  }
};

const app = express();

app.use(cors());

/**
 * GraphQL Schema provides to the Apollo server all data for reading and writing via graphql.
 * The schema consists type definitions
 */
const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`;

/**
 * Resolvers are used to return data for fields from the schema.
 * Resolver is a function that resolves data for graphql fields in the schema.
 */
const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () =>
  console.log(`The Apollo server is listening on http://localhost:8000/graphql`)
);
