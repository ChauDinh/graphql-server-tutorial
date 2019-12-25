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
    }
  },

  User: {
    messages: (user, args, { models }) => {
      return Object.values(models.messages).filter(m => m.userId === user.id);
    }
  }
};
