const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

const sequelize = require("./configs/database.config");
const errorHandler = require("./middlewares/errorHandler");
const users = require("./routes/user.controller");
const requests = require("./routes/request.controller");
const requesters = require("./routes/requester.controller");
const drivers = require("./routes/driver.controller");
const systems = require("./routes/system.controller");
const ambulances = require("./routes/ambulance.controller");
const reports = require("./routes/report.controller");

const PORT = process.env.PORT || 3000;
const app = express();

// Load ENV variables
dotenv.config({ path: "./configs/config.env" });
// Config for server
app.use(express.json());
app.use(cors());
// Connect to MySQL
sequelize.sync();

// Mount router
app.use("/api/users", users);
app.use("/api", requests, requesters, drivers, systems, ambulances, reports);

app.use(errorHandler);

// Logger for Development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const server = app.listen(PORT, () =>
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", error => {
    console.log(`Error: ${error.message}`);
    server.close(() => process.exit());
});
