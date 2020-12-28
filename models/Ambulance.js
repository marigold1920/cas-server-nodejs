const sequelize = require("../configs/database");
const { DataTypes } = require("sequelize");
const User = require("./User");
const AmbulanceStatus = require("./AmbulanceStatus");

const Ambulance = sequelize.define(
    "ambulance",
    {
        licensePlate: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "license_plate"
        },
        driverLicense: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "driver_license"
        },
        identityCard: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "identity_card"
        },
        registerLicense: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "register_license"
        },
        registryCertificate: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "registry_certificate"
        },
        registrationDate: {
            type: DataTypes.DATEONLY,
            field: "registration_date",
            defaultValue: new Date()
        },
        expirationDate: {
            type: DataTypes.DATEONLY,
            field: "expiration_date"
        },
        note: {
            type: DataTypes.JSON
        }
    },
    { freezeTableName: true, timestamps: false, initialAutoIncrement: 1 }
);

// Status relationship
// AmbulanceStatus.hasMany(Ambulance);
Ambulance.belongsTo(AmbulanceStatus, { foreignKey: "ambulance_status", as: "status" });

// User relationship
// User.hasMany(Ambulance);
Ambulance.belongsTo(User, { foreignKey: "driver_id", as: "driver" });

module.exports = Ambulance;
