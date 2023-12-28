const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// JWT setup
router.post("/", (req, res) => {
  const user = req.body;

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '23h',
  });
  res.send({ token });
});

// JWT verification middleware
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Invalid authorization" });
  }
  
  // Bearer token
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "Invalid authorization" });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = {
  authRouter: router,
  verifyJWT: verifyJWT,
};
