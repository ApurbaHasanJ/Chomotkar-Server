const express = require("express");
const jwt = require("jsonwebtoken");
const usersCollection = require("../models/users");

const router = express.Router();

// JWT setup
router.post("/", (req, res) => {
  const user = req.body;

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "23h",
  });
  res.send({ token });
});

// JWT verification middleware
const verifyJWT = (req, res, next) => {
  // Define an array of routes that should skip token verification
  const excludedRoutes = ["/dashboard/my-carts", "/dashboard/wishlist", "/dashboard/add-review", "/dashboard/pending-orders"];

  const authorization = req.headers.authorization;
  const currentRoute = req.path;

  if (excludedRoutes.includes(currentRoute)) {
    return next();
  }

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

// verify admin middleware
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  if (user?.role !== "admin") {
    res.status(403).send({ error: true, message: "forbidden access" });
  }
  next();
};

module.exports = {
  authRouter: router,
  verifyJWT: verifyJWT,
  verifyAdmin,
};
