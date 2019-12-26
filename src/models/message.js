const message = (sequelize, DataTypes) => {
  const Message = sequelize.define("messages", {
    text: {
      type: DataTypes.STRING
    }
  });

  Message.associate = models => {
    Message.belongTo(models.User);
  };

  return Message;
};

export default message;
