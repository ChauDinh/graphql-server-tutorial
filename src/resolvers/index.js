export default {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }, { models }) => {
      return models.users[id];
    },
    users: () => {
      return Object.values(models.users);
    },

    onlineUsers: (parent, args, { models }) => {
      return Object.values(models.onlineUsers);
    },

    message: (parent, { id }, { models }) => {
      return models.messages[id];
    },

    messages: (parent, args, { models }) => {
      return Object.values(models.messages);
    }
  },

  User: {
    messages: (user, args, { models }) => {
      return Object.values(models.messages).filter(m => m.userId === user.id);
    }
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };

      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }, { models }) => {
      // Destructoring to find message by id from the messages object.
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages;
      return true;
    },

    updateMessage: (parent, { id, text }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      message.text = text;
      return true;
    }
  }
};
