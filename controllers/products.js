const { ObjectId } = require("mongodb");
const productsCollection = require("../models/products");
const cloudinary = require("cloudinary").v2;

// Set your Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleGetProducts = async (req, res) => {
  try {
    console.log("Fetching products...");

    // short by position field in ascending order
    const result = await productsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    console.log("Products fetched successfully!");
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
    console.error("Error updating product", err);
    res.status(500).json({ message: err.message });
  }
};

const handleDeleteProduct = async (req, res) => {
  try {
    const publicIds = req.query.publicIds;
    console.log("publicIds", publicIds);

    const IdsArray = Array.isArray(publicIds) ? publicIds : JSON.parse(publicIds);
    console.log("IdsArray", IdsArray);
    // Create an array of promises for image deletions
    const deletionPromises = IdsArray.map((publicId) => {
      return new Promise((resolve, reject) => {
        console.log("publicId", publicId);
        // delete form cloudinary
        cloudinary.uploader.destroy(publicId, (err, cloudinaryRes) => {
          if (err) {
            console.error("Error deleting image from Cloudinary", err);
            reject(err);
          } else {
            console.log("Image deleted from Cloudinary", cloudinaryRes);
            resolve();
          }
        });
      });
    });

    console.log("deleta", deletionPromises);
    // Wait for all image deletions to complete
    await Promise.all(deletionPromises);

    const id = req.query.id;
    const filter = { _id: new ObjectId(id) };
    const result = await productsCollection.deleteOne(filter);
    res.send(result);
  } catch (err) {
    console.error("Error deleting product", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleGetProducts,
  handlePostProducts,
  handleUpdateProduct,
  handleDeleteProduct,
};
