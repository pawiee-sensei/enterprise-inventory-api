const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401);
        throw new Error("Unauthorized. no token found");
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch(error){
        res.status(401);
        throw new Error("Unauthorized. Invalid token");
    }
};

module.exports = authMiddleware;