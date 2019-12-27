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
    createMessage: async (parent, { text }, { me, models }) => {
      // const id = uuidv4();
      return await models.Message.create({
        text,
        userId: me.id
      });
    },

    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id } });
    },

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
