const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const reviewCollection = client.db("ChomotkarFashion").collection("Reviews");

module.exports = reviewCollection;
