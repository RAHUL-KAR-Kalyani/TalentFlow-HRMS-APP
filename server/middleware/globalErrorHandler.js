const globalErrorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    // const message = err.message;
    const message = "Internal Server Error (Hanlded by Global Error Handler)";

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

module.exports = globalErrorHandler;
