module.exports = (sequelize, DataTypes) => sequelize.define("Image", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  }
});
