const sequelize = require("../configs/database.config");
const { DataTypes } = require("sequelize");

const Configuration = sequelize.define(
    "system_configuration",
    {
        itemId: {
            type: DataTypes.INTEGER,
            field: "item_id",
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING
        },
        value: {
            type: DataTypes.INTEGER
        },
        min: {
            type: DataTypes.INTEGER
        },
        max: {
            type: DataTypes.INTEGER
        }
    },
    { freezeTableName: true, timestamps: false }
);

module.exports = Configuration;
