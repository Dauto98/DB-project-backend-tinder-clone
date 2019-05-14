const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = decoded;
  } catch (error) {
    res.status(401).json({
      message: "Auth failed"
    });
  }
  next();
};
