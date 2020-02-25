const jwt = require("jsonwebtoken"),
    config = require("../config.js");

async function verifyToken(req, res) {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.json({
            success: false,
            auth: false,
            token: null
        });
    }

    const decoded = await jwt.verify(token, config.jwtSECRET);
    return decoded;
}

module.exports = verifyToken;
