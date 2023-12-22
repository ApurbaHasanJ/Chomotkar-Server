// importing required modules and setting up Express
const express = require("express");
const cors = require("cors");
// connect mongodb
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware setup
const corsOptions = {
  origin: ["http://localhost:5173", "https://chomotkar-server.vercel.app/"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// connect mongodb
const { connectMongoDB } = require("./connection");

// routes
const productsCollection = require("./routes/products");
const usersCollection = require("./routes/users");

// Connecting to MongoDB using the connectMongoDB function from connection.js
connectMongoDB()
  .then((client) => {
    // Routes setup

    // products collection
    app.use("/products", productsCollection);

    // users collection
    app.use("/users", usersCollection);

    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  })
  .catch((err) => {
    console.error("Error: " + err.message);
  });

app.get("/", (req, res) => {
  res.send("Chomotkar is selling");
});

app.listen(port, () => {
  console.log(`Chomotkar is listening on ${port}`);
});
