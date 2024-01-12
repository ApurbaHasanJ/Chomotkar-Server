const { client } = require("../connection");

// / Get the database and collection on which to run the operation
const couponsCollection = client.db("Chomotkar-Database").collection("Coupons");

module.exports = couponsCollection;
