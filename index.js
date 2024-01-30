const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
const corsOptions = {
  origin: ["http://localhost:5173", "https://chomotkarfashion-67485.web.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const { connectMongoDB } = require("./connection");

// Connect to MongoDB and set up routes after successful connection
connectMongoDB()
  .then((client) => {
    // Routes setup
    const { authRouter } = require("./services/auth");
    const productsCollection = require("./routes/products");
    const usersCollection = require("./routes/users");
    const couponCollection = require("./routes/coupon");
    const reviewCollection = require("./routes/reviews");
    const paymentApi = require("./routes/payment");
    const ordersCollection = require("./routes/orders");

    // Use the authentication router
    app.use("/jwt", authRouter);

    // Payment method
    app.use("/", paymentApi);

    // Order management admin route
    app.use("/orders", ordersCollection);

    // Products collection
    app.use("/products", productsCollection);

    // Users collection
    app.use("/users", usersCollection);

    // Coupon collection
    app.use("/coupons", couponCollection);

    // Review collection
    app.use("/reviews", reviewCollection);

    client.db("admin").command({ ping: 1 });
    // console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Additional routes for testing
    app.get("/me", (req, res) => {
      res.send("Welcome to me");
    });

    app.get("/", (req, res) => {
      res.send("Chomotkar is selling");
    });

    // Start the server after setting up routes
    app.listen(port, () => {
      // console.log(`Chomotkar is listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error: " + err.message);
  });
