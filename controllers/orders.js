const { ObjectId } = require("mongodb");
const orderCollection = require("../models/orders");

const handleGetOrders = async (req, res) => {
  const order = await orderCollection.find().sort({ createdAt: -1 }).toArray();
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

const handleRejectOrder = async (req, res) => {
  try {
    const encodedDate = req.params.date;
    const orderStatus = req.body.orderStatus;
    const date = decodeURIComponent(encodedDate);
    console.log("Received date:", date);

    const query = { createdAt: date };
    // console.log("query", query);
    const newOrderStatus = {
      $set: { orderStatus: orderStatus },
    };

    const result = await orderCollection.updateOne(query, newOrderStatus);
    console.log(result);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  handleGetOrders,
  handleOrderStatus,
  handleRejectOrder,
};


