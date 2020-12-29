const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const sequelize = require("./configs/database");
const errorHandler = require("./middlewares/errorHandler");
const users = require("./routes/user.controllers");
const requests = require("./routes/request.controllers");
const requester = require('./routes/requester.controller');

const PORT = process.env.PORT || 5000;
const app = express();

// Load ENV variables
dotenv.config({ path: "./configs/config.env" });
// Config for server
app.use(express.json());
// Connect to MySQL
sequelize.sync();

// Mount router
app.use("/api/users", users);
app.use("/api", requests);
app.use("/api", requester);

app.use(errorHandler);

// Logger for Development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const server = app.listen(PORT, () =>
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhanled promise rejections
process.on("unhandledRejection", error => {
    console.log(`Error: ${error.message}`);
    server.close(() => process.exit());
});
