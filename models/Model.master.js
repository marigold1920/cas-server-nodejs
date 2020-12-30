const Ambulance = require("./Ambulance");
const AmbulanceStatus = require("./AmbulanceStatus");
const Configuration = require("./Configuration");
const Request = require("./Request");
const RequestStatus = require("./RequestStatus");
const Role = require("./Role");
const User = require("./User");

// Status relationship
// AmbulanceStatus.hasMany(Ambulance);
Ambulance.belongsTo(AmbulanceStatus, { foreignKey: "ambulance_status", as: "status" });

// User relationship
// User.hasMany(Ambulance);
Ambulance.belongsTo(User, { foreignKey: "driver_id", as: "driver" });

// Status relationship
Request.belongsTo(RequestStatus, { foreignKey: "request_status", as: "status" });

// Ambulance relationship
// Ambulance.hasMany(Request);
Request.belongsTo(Ambulance, { foreignKey: "ambulance_id", as: "ambulance" });

// Driver relationship
// User.hasMany(Request);
Request.belongsTo(User, { foreignKey: "driver_id", as: "driver" });

// Requester relationship
// User.hasMany(Request);
Request.belongsTo(User, { foreignKey: "requester_id", as: "requester" });

// Role.hasMany(User);
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

module.exports = {
    Ambulance,
    AmbulanceStatus,
    Configuration,
    Request,
    RequestStatus,
    Role,
    User
};
