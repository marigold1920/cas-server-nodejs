const Ambulance = require("./Ambulance");
const AmbulanceStatus = require("./AmbulanceStatus");
const Configuration = require("./Configuration");
const Request = require("./Request");
const RequestStatus = require("./RequestStatus");
const Role = require("./Role");
const User = require("./User");
const Setting = require("./Setting");

// Status relationship
Ambulance.belongsTo(AmbulanceStatus, { foreignKey: "ambulance_status", as: "status" });

// User relationship
Ambulance.belongsTo(User, { foreignKey: "driver_id", as: "driver" });

// Status relationship
Request.belongsTo(RequestStatus, { foreignKey: "request_status", as: "status" });

// Ambulance relationship
Request.belongsTo(Ambulance, { foreignKey: "ambulance_id", as: "ambulance" });

// Driver relationship
Request.belongsTo(User, { foreignKey: "driver_id", as: "driver" });

// Requester relationship
Request.belongsTo(User, { foreignKey: "requester_id", as: "requester" });

// Role relationship
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

// Setting relationship
Setting.belongsTo(User, { foreignKey: "user_id", as: "setting" });

module.exports = {
    Ambulance,
    AmbulanceStatus,
    Configuration,
    Request,
    RequestStatus,
    Role,
    User,
    Setting
};
