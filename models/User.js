const sequelize = require("../configs/database");
const { DataTypes } = require("sequelize");
const Role = require("./Role");

const User = sequelize.define(
    "user",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            field: "image_url",
            defaultValue: "https://i.ibb.co/y8fgyVB/blank-profile-picture-png.png"
        },
        displayName: {
            type: DataTypes.STRING,
            field: "display_name",
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: "is_active",
            defaultValue: true
        },
        dateCreated: {
            type: DataTypes.DATEONLY,
            field: "date_created",
            defaultValue: new Date()
        },
        ratingLevel: {
            type: DataTypes.INTEGER,
            field: "rating_level",
            defaultValue: 5
        },
        numOfRequests: {
            type: DataTypes.INTEGER,
            field: "num_of_requests",
            defaultValue: 0
        },
        successRate: {
            type: DataTypes.FLOAT,
            field: "success_rate"
        }
    },
    { timestamps: false, initialAutoIncrement: 100, freezeTableName: true }
);

// Role.hasMany(User);
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = User;
