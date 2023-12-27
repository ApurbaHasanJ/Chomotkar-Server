const { ObjectId, ReturnDocument } = require("mongodb");
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

const handleUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.body.role;

    const userFilter = { _id: new ObjectId(id) };

    const updatedRole = {
      $set: { role: role },
    };

    const result = await usersCollection.updateOne(userFilter, updatedRole);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleDeleteUser = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(filter);
  res.send(result);
};

module.exports = {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
  handleDeleteUser,
};
