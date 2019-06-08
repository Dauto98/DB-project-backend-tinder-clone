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
      type: DataTypes.ENUM("F", "M")
    },
    age: {
      type: DataTypes.INTEGER
    }
  });

  User.associate = models => {
    User.hasMany(models.Feedback, {
      onDelete: "CASCADE",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
        require: true
      },
      targetKey: "id"
    });

    User.hasMany(models.Notification, {
      onDelete: "CASCADE",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
        require: true
      },
      targetKey: "id"
    });

    User.hasMany(models.Image, {
      onDelete: "CASCADE",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
        require: true
      },
      targetKey: "id"
    });
  };

  return User;
};
