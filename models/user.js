module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    facebookLink: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.BOOLEAN
    },
    dob: {
      type: DataTypes.DATE
    }
  });

  return User;
};
