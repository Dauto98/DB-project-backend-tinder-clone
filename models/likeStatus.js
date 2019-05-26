module.exports = (sequelize, DataTypes) => {
  const LikeStatus = sequelize.define("LikeStatus", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM("liked", "unliked"),
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id"
      }
    },
    targetUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id"
      }
    }
  });

  return LikeStatus;
};
