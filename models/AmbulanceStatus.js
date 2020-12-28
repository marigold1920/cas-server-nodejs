const sequelize = require("../configs/database");
const { DataTypes } = require("sequelize");

const AmbulanceStatus = sequelize.define(
    "ambulance_status",
    {
        statusCode: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: "status_code"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { freezeTableName: true, timestamps: false }
);

module.exports = AmbulanceStatus;
