const ErrorResponse = require("../utils/errorResponse");

const errorHanlder = (error, request, response, next) => {
    response.status(error.statusCode || 500).json({
        success: false,
        errorMessage: error.message || "Server error!"
    });
};

module.exports = errorHanlder;
