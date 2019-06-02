module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM("seen", "unseen"),
      defaultValue: "unseen",
      allowNull: false
    },
    header: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
        require: true
      },
      targetKey: "id"
    });
  };

  return Notification;
};
