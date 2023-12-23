const { ObjectId } = require("mongodb");
const productsCollection = require("../models/products");

const handleGetProducts = async (req, res) => {
  try {
    // short by position field in ascending order
    const result = await productsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ message: err.message });
  }
};

// post product
const handlePostProducts = async (req, res) => {
  try {
    const productData = req.body;
    console.log(productData);

    const result = await productsCollection.insertOne(productData);
    console.log(result);

    res.send(result);
  } catch (err) {
    console.error("Error posting products", err);
    res.status(500).json({ message: err.message });
  }
};

// update product
const handleUpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedData = req.body;
    const updateProduct = await productsCollection.updateOne(filter, {
      $set: updatedData,
    });
    res.send(updateProduct);
  } catch (err) {
    console.error("Error updating products", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleGetProducts,
  handlePostProducts,
  handleUpdateProduct,
};
