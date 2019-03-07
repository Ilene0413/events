module.exports = function (sequelize, DataTypes) {

    var Customer = sequelize.define("Customer", {
        first: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        last: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        // add any validation to the below fields if we want - similar to above
        venueId: {
            type: DataTypes.INTEGER
        },
        eventDate: {
            type: DataTypes.DATE
        },
        eventId: {
            type :DataTypes.INTEGER
        },
        saved: {
            type: DataTypes.BOOLEAN
        },
        purchased: {
            type: DataTypes.BOOLEAN
        },
        numPurchased: {
            type: DataTypes.INTEGER
        }
    });
    return Customer;
};