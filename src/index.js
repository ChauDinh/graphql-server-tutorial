import express from "express";
import cors from "cors";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import http from "http";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

const getMe = async req => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new AuthenticationError(
        "Your session expired! Please sign in again!"
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models
      };
    }
    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET
      };
    }
  },
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

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = true;

const isTest = !!process.env.TEST_DATABASE;

sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    createUserWithMessage(new Date());
  }

  httpServer.listen({ port: 8000 }, () =>
    console.log(
      `🎉  The Apollo server is listening on http://localhost:8000/graphql`
    )
  );
});

const createUserWithMessage = async date => {
  await models.User.create(
    {
      username: "admin",
      email: "hello@robin.com",
      password: "123123",
      role: "ADMIN",
      messages: [
        {
          text: "Just erase database",
          createdAt: date.setSeconds(date.setSeconds() + 1)
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
      messages: [
        {
          text: "Hello, world!",
          createdAt: date.setSeconds(date.setSeconds() + 1)
        }
      ]
    },
    { include: [models.Message] }
  );
};
