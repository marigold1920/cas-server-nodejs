const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Role = sequelize.define(
    "role",
    {
        roleId: {
            type: DataTypes.INTEGER,
            field: "role_id",
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

module.exports = Role;
