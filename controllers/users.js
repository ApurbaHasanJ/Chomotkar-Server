const usersCollection = require("../models/users");

const handlePostUsers = async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.send(result);
};

const handleGetUsers = async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
};

module.exports = { handlePostUsers, handleGetUsers };
