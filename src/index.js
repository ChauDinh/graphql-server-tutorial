import express from 'express';
import cors from 'cors';
import {ApolloServer} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, {sequelize} from './models';

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('admin'),
  }),
});

server.applyMiddleware({app, path: '/graphql'});

const eraseDatabaseOnSync = true;

sequelize.sync({force: eraseDatabaseOnSync}).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWithMessage();
  }

  app.listen({port: 8000}, () =>
    console.log(
      `The Apollo server is listening on http://localhost:8000/graphql`,
    ),
  );
});

const createUserWithMessage = async () => {
  await models.User.create(
    {
      username: 'admin',
      messages: [
        {
          text: 'Just erase database',
        },
      ],
    },
    {include: [models.Message]},
  );

  await models.User.create(
    {
      username: 'guess',
      messages: [{text: 'Hello, world!'}],
    },
    {include: [models.Message]},
  );
};
