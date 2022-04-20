const {getClaimFromToken} = require("../helpers");

const authenticated = (req, res, next) => {
    // #swagger.security = [{bearerAuth: []}]
    const userId = getClaimFromToken(req, '_id');
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    req.userId = userId
    return next();
};

module.exports = authenticated;