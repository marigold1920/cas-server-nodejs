const sequelize = require("../configs/database.config");
const { DataTypes } = require("sequelize");

const RequestStatus = sequelize.define(
    "request_status",
    {
        statusCode: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: "status_code"
        },
        name: {
            type: DataTypes.STRING
        }
    },
    { freezeTableName: true, timestamps: false }
);

module.exports = RequestStatus;
