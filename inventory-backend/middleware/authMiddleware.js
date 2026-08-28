const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("Unauthorized. no token found");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT verify failed:", error.message); // temporary — tells us the REAL reason
        const authError = new Error("Unauthorized. Invalid token");
        authError.statusCode = 401;
        throw authError;
    }
};

module.exports = authMiddleware;