const {getClaimFromToken} = require("../helpers");

const authenticated = (req, res, next) => {
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