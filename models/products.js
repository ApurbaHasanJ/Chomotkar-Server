const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const productsCollection = client.db("Chomotkar-Database").collection("Products");

module.exports = productsCollection;
