import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server";

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, { expiresIn });
};

export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },

    onlineUsers: (parent, args, { models }) => {
      return Object.values(models.onlineUsers);
    }
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret }
    ) => {
      const user = await models.User.create({
        username,
        email,
        password
      });

      return { token: createToken(user, secret, "30m") };
    },

    signIn: async (parent, { login, password }, { models, secret }) => {
      // first, check the username/email whether exist in database;
      const user = await models.User.findByLogin(login);
      if (!user) {
        throw new UserInputError("No user found with this login credentials");
      }

      // then, check the password input with hashed password in database
      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError("Invalid password");
      }

      return {
        token: createToken(user, secret, "30m")
      };
    }
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      });
    }
  }
};
