module.exports = (sequelize, DataTypes) => sequelize.define("Feedback", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  userID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "User",
      key: "id"
    }
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  response: {
    type: DataTypes.STRING
  }
});
