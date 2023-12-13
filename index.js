// importing required modules and setting up Express
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware setup
app.use(cors());
app.use(express.json());

// Connecting to MongoDB using the connectMongoDB function from connection.js
connectMongoDB()
  .then((client) => {
    // Routes setup

    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  })
  .catch((err) => {
    console.error("Error: " + err.message);
  });

  app.get("/", (req, res)=>{
    res.send("Chomotkar is selling")
  })

  app.listen(port, ()=>{
    console.log(`Chomotkar is listening on ${port}`)
  })