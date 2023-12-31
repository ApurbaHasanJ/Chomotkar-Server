const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const orderCollection = client.db("ChomotkarFashion").collection("Orders");

module.exports = orderCollection;
