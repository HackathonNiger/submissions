const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

module.exports = generateToken;