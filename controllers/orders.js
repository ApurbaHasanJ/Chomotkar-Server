const orderCollection = require("../models/orders");


const handleGetOrders = async (req, res) => {
  const order = await orderCollection.find().sort({ createdAt: -1 }).toArray();
//   console.log(order);
  res.send(order);
};


module.exports ={
    handleGetOrders
}