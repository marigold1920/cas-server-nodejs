const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("cas", "admin", "12345679", {
    host: "cas-capstone.cx6mpywgkrge.ap-southeast-1.rds.amazonaws.com",
    dialect: "mysql"
});

module.exports = sequelize;
