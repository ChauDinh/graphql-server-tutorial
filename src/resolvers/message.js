import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated, isMessageOwner } from "./authorization";

export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },

    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    }
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        try {
          return await models.Message.create({
            text,
            userId: me.id
          });
        } catch (error) {
          throw new Error(error);
        }
      }
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      }
    ),

    updateMessage: async (parent, { id, text }, { models }) => {
      return await models.Message.update(
        {
          text: text
        },
        { where: { id } }
      );
    }
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findById(message.userId);
    }
  }
};
