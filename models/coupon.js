const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const couponsCollection = client.db("ChomotkarFashion").collection("Coupons");

module.exports = couponsCollection;
