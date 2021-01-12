const sequelize = require("../configs/database.config");
const { DataTypes } = require("sequelize");

const Setting = sequelize.define(
    "setting",
    {
        distance: DataTypes.INTEGER,
        typeRequest: {
            field: "type_request",
            type: DataTypes.INTEGER,
            defaultValue: 6
        }
    },
    { freezeTableName: true, timestamps: false, initialAutoIncrement: 1 }
);

module.exports = Setting;
