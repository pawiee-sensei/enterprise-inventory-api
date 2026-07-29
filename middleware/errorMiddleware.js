const errorMiddleware = (err, req, res, next) =>{
    console.error(err);

    const statusCode = res.statusCode !== 200
        ? res.statusCode
        :500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorMiddleware;