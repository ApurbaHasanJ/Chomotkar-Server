const { ObjectId, ReturnDocument } = require("mongodb");
const usersCollection = require("../models/users");

// post user information
const handlePostUsers = async (req, res) => {
  const user = req.body;

  // // console.log(user);

  const query = { email: user.email };
  const existingUser = await usersCollection.findOne(query);

  if (existingUser) {
    // User already exists, handle it here (e.g., update user information)
    // // console.log("User already exists:", existingUser);
    return res.send({ message: "User already exists" });
  }

  // If the email doesn't exist, proceed to insert the new user
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

const handleUpdateUserInfo = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const updatedInfo = req.body; // Assuming the body contains the updated fields directly

  const query = { _id: new ObjectId(id) };

  const result = await usersCollection.updateOne(query, { $set: updatedInfo });
  // console.log(result);
  res.send(result);
};

module.exports = {
  handlePostUsers,
  handleGetUsers,
  handleUserRole,
  handleDeleteUser,
  handleGetAdmin,
  handleUpdateUserInfo,
};
