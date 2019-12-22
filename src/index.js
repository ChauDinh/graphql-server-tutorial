import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import uuidv4 from "uuid/v4";

let users = {
  1: {
    id: "1",
    username: "Jascha Heifetz",
    messageIds: [1]
  },
  2: {
    id: "2",
    username: "David Oistrakh",
    messageIds: [2]
  }
};

let messages = {
  1: {
    id: "1",
    text: "Hello, world!",
    userId: "1"
  },
  2: {
    id: "2",
    text: "Bye world!",
    userId: "2"
  }
};

let onlineUsers = {
  1: {
    id: "1",
    username: "A"
  },
  2: {
    id: "2",
    username: "B"
  },
  3: {
    id: "3",
    username: "C"
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

    message(id: ID!): Message!
    messages: [Message!]!

    onlineUsers: [User!]!
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
    },

    message: (parent, { id }) => {
      return messages[id];
    },

    messages: () => {
      return Object.values(messages);
    },

    onlineUsers: (parent, args, { onlineUsers }) => {
      return Object.values(onlineUsers);
    }
  },

  Message: {
    user: message => {
      return users[message.userId];
    }
  },

  User: {
    messages: user => {
      return Object.values(messages).filter(m => m.userId === user.id);
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }) => {
      // Destructoring to find message by id from the messages object.
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;
      return true;
    },

    updateMessage: (parent, { id, text }, { me }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      message.text = text;
      return true;
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
    onlineUsers
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () =>
  console.log(`The Apollo server is listening on http://localhost:8000/graphql`)
);
