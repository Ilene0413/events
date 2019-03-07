module.exports = function (sequelize, DataTypes) {
    var Login = sequelize.define("Login", {
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
        // defaultValue is a flag that defaults a new burger devoured value to false if
        // it isn't supplied one

        purchased: DataTypes.BOOLEAN,
        // defaultValue is a flag that defaults a new burger devoured value to false if
        // it isn't supplied one
        numPurchased: DataTypes.INTEGER

    });
    return Login;
};
