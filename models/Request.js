const sequelize = require("../configs/database.config");
const { DataTypes } = require("sequelize");
var moment = require("moment");

const Request = sequelize.define(
    "request",
    {
        pickUp: {
            type: DataTypes.JSON,
            field: "pickup",
            allowNull: false
        },
        destination: {
            type: DataTypes.JSON
        },
        patientName: {
            type: DataTypes.STRING,
            field: "patient_name"
        },
        patientPhone: {
            type: DataTypes.STRING,
            field: "patient_phone"
        },
        healthInformation: {
            type: DataTypes.STRING,
            field: "health_information"
        },
        createdDate: {
            type: DataTypes.DATEONLY,
            field: "created_date"
        },
        createdTime: {
            type: DataTypes.STRING,
            field: "created_time"
        },
        morbidity: {
            type: DataTypes.STRING
        },
        morbidityNote: {
            type: DataTypes.STRING,
            field: "morbidity_note"
        },
        isOther: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "is_other"
        },
        isEmergency: {
            type: DataTypes.BOOLEAN,
            field: "is_emergency",
            defaultValue: true
        },
        region: {
            type: DataTypes.STRING
        },
        feedbackDriver: {
            type: DataTypes.STRING,
            field: "feedback_driver"
        },
        feedbackService: {
            type: DataTypes.STRING,
            field: "feedback_service"
        },
        ratingService: {
            type: DataTypes.FLOAT,
            field: "rating_service"
        },
        ratingDriver: {
            type: DataTypes.FLOAT,
            field: "rating_driver"
        },
        reason: {
            type: DataTypes.STRING
        }
    },
    { freezeTableName: true, initialAutoIncrement: 100, timestamps: false }
);

module.exports = Request;
