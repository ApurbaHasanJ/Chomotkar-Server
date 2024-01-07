// Importing required modules and setting up Express
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
// console.log(port);

// Middleware setup
const corsOptions = {
  origin: ["http://localhost:5173", "https://chomotkar-fashion-server.vercel.app/"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


// connect mongodb
const { connectMongoDB } = require("./connection");

// console.log(store_id, store_passwd);

// routes
const { authRouter } = require("./services/auth");
const productsCollection = require("./routes/products");
const usersCollection = require("./routes/users");
const couponCollection = require("./routes/coupon");
const reviewCollection = require("./routes/reviews");
const orderAPI = require("./routes/payment");
const ordersCollection= require("./routes/orders");

// Connecting to MongoDB using the connectMongoDB function from connection.js
connectMongoDB()
  .then((client) => {
    // Routes setup
    // Use the authentication router
    app.use("/jwt", authRouter);

    //  payment method
    app.use("/order", orderAPI);

    // order management admin route
    app.use("/orders", ordersCollection);

    // products collection
    app.use("/products", productsCollection);

    // users collection
    app.use("/users", usersCollection);

    // coupon collection
    app.use("/coupons", couponCollection);

    // review collection
    app.use("/reviews", reviewCollection);

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
