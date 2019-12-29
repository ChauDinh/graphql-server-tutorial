import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import "dotenv/config";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin("admin"),
    secret: process.env.SECRET
  }),
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace("SequelizeValidationError:", "")
      .replace("Validation error: ", "");

    return {
      ...error,
      message
    };
  }
});

server.applyMiddleware({ app, path: "/graphql" });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWithMessage();
  }

  app.listen({ port: 8000 }, () =>
    console.log(
      `🎉  The Apollo server is listening on http://localhost:8000/graphql`
    )
  );
});

const createUserWithMessage = async () => {
  await models.User.create(
    {
      username: "admin",
      email: "hello@robin.com",
      password: "123123",
      messages: [
        {
          text: "Just erase database"
        }
      ]
    },
    { include: [models.Message] }
  );

  await models.User.create(
    {
      username: "guess",
      email: "hello@guess.com",
      password: "321321",
      messages: [{ text: "Hello, world!" }]
    },
    { include: [models.Message] }
  );
};
