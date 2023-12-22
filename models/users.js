const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const usersCollection = client.db("ChomotkarFashion").collection("Users");

module.exports = usersCollection;
