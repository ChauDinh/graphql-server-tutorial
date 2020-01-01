import { combineResolvers } from "graphql-resolvers";
import Sequelize from "sequelize";

import { isAuthenticated, isMessageOwner } from "./authorization";

const toCursorHash = str => Buffer.from(str).toString("base64");

const fromCursorHash = str => Buffer.from(str, "base64").toString("ascii");

export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },

    // messages: async (parent, { offset = 0, limit = 100 }, { models }) => {
    //   return await models.Message.findAll({ offset, limit });
    // } - offset/limit pagination

    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOption = cursor
        ? {
            where: { createdAt: { [Sequelize.Op.lt]: fromCursorHash(cursor) } }
          }
        : {};
      const messages = await models.Message.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOption
      });

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
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
      return await models.User.findByPk(message.userId);
    }
  }
};
