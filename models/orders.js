const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const orderCollection = client.db("Chomotkar-Database").collection("Orders");

module.exports = orderCollection;
