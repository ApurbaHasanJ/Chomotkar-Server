const { MongoClient, ServerApiVersion } = require("mongodb");

// Get user and pass
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
// console.log(DB_USER);

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@chomotkar.94yu6mo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (err) {
    console.error("Error connecting to MongoDB");
    throw err;
  }
};

module.exports = {
  client,
  connectMongoDB,
};
