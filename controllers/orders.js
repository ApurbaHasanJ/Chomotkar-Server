const { ObjectId } = require("mongodb");
const orderCollection = require("../models/orders");

const handleGetOrders = async (req, res) => {
  const order = await orderCollection.find().sort({ acceding: -1 }).toArray();
  //   console.log(order);
  res.send(order);
};

const handleOrderStatus = async (req, res) => {
  const id = req.params.id;
  const orderStatus = req.body.orderStatus;
  const query = { _id: new ObjectId(id) };
  const newOrderStatus = {
    $set: { orderStatus: orderStatus },
  };

  const result = await orderCollection.updateOne(query, newOrderStatus);
  res.send(result);
};

const handleGetUserOrders = async (req, res) => {
  try {
    // const projection = { acceding: 1, orderStatus: 1, paidStatus: 1 };

    const orders = await orderCollection.find().sort({ acceding: -1 }).toArray();
    // console.log(orders);

    res.send(orders)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


module.exports = {
  handleGetOrders,
  handleOrderStatus,
  handleGetUserOrders,
};


