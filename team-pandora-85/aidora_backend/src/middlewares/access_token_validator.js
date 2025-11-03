const jwt = require("jsonwebtoken");

const validatorAcessToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).json({
            title: "Unauthorized",
            message: "You are not authorized for this action",
          });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    } else {
      throw Error(`requires authorization.`);
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

module.exports = validatorAcessToken;
