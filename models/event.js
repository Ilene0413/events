// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations  
//(can check assighment 15-sequelize/01-Activities/02-Day/10-Sequelize-Validations)
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("Event", {
    Event_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },

    Venue_ID: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },

    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
       isDate: true
      }
    },
    numberOfpeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    cost: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
       min: 1
      }
    },
    totalCost: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
       min: 1
      }
    }
  });

  Event.associate = function(models) {
    // We're saying that a Excursion should belong to a Login
    // A Events can't be created without a Login due to the foreign key constraint
    Event.belongsTo(models.Login, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Event;
};
