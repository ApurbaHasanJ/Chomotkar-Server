const { ObjectId } = require("mongodb");
const reviewCollection = require("../models/reviews");

const handlePostReview = async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
};

const handleGetReviews = async (req, res) => {
  const review = await reviewCollection
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  res.send(review);
};

const handleUpdateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedData = req.body;
    const updateProduct = await reviewCollection.updateOne(filter, {
      $set: updatedData,
    });
    res.send(updateProduct);
  } catch (err) {
    console.error("Error updating product", err);
    res.status(500).json({ message: err.message });
  }
};

const handleDeleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await reviewCollection.deleteOne(filter);
    res.send(result);
  } catch (err) {
    console.error("Error deleting product", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleGetReviews,
  handlePostReview,
  handleUpdateReview,
  handleDeleteReview,
};
