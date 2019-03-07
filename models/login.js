module.exports = function (sequelize, DataTypes) {

    var Login = sequelize.define("Customer", {
        first: {
            type: DataTypes.STRING,
            // AllowNull is a flag that restricts a burger from being entered if it doesn't
            // have a text value
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        last: {
            type: DataTypes.STRING,
            // AllowNull is a flag that restricts a burger from being entered if it doesn't
            // have a text value
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            // AllowNull is a flag that restricts a burger from being entered if it doesn't
            // have a text value
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        venueId: DataTypes.INTEGER,
        eventDate: DataTypes.DATE,
        eventId: DataTypes.INTEGER,
        saved: DataTypes.BOOLEAN,
        purchased: DataTypes.BOOLEAN,
        numPurchased: DataTypes.INTEGER

    });
    return Customer;
};
