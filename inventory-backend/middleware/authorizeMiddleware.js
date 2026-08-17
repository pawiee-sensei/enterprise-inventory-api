const authorize = (...allowedRoles) => {

    return (req, res, next) => {

        if(!req.user){
            res.status(401);
            throw new Error("Unauthorized");
        }

        if(!allowedRoles.includes(req.user.role)){
            res.status(403);
            throw new Error("Forbidden. You do not have permission");
        }

        next();
    };
};

module.exports = authorize; 