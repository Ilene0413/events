module.exports = function (sequelize, DataTypes) {
  var Login = sequelize.define("Login", {
    // Giving the Login model a name of type STRING
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Login.associate = function (models) {
    // Associating Login with Event
    // When a Login is deleted, also delete any associated Excursions
    Login.hasMany(models.Event, {
      onDelete: "cascade"
    });
  }

  return Login;

};
