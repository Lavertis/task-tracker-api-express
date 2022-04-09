const jwt = require("jsonwebtoken");

const getClaimFromToken = (req, claim) => {
    let token = req.header('Authorization');
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded[claim];
};

module.exports = {
    getClaimFromToken
};