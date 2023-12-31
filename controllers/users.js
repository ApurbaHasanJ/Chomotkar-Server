const { ObjectId, ReturnDocument } = require("mongodb");
const usersCollection = require("../models/users");

// post function
const handlePostUsers = async (req, res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.send(result);
};

// get function
const handleGetUsers = async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
};

// role update function
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

// delete user function
const handleDeleteUser = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(filter);
  res.send(result);
};

// get admin from users collection
const handleGetAdmin = async (req, res) => {
  const email = req.params.email;

  if (req.decoded.email !== email) {
    res.send({ admin: false });
    return;
  }

  const query = { email: email };
  const user = await usersCollection.findOne(query);
  const result = { admin: user?.role === "admin" };
  res.send(result);
};

module.exports = {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
  handleDeleteUser,
  handleGetAdmin,
};
