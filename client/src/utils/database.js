const { MongoClient } = require("mongodb");

let database;

const connectToMongoDb = async () => {
  try {
    if (!database) {
      const cl = await MongoClient.connect('localhost:27017');
      database = cl.db('ganache_truffle');
    }
  } catch (err) {
    console.log("failed to connect to atlas", err);
  }
};

connectToMongoDb()
  .then(() => {})
  .catch((err) => console.log(err));

const asyncConnectToMongodb = async () => {
  try {
    const client = await MongoClient.connect('localhost:27017');
    return client.db('ganache_truffle');
  } catch (err) {
    console.log("failed to connect to atlas", err);
    return undefined;
  }
};

const getDatabase = () => database;

module.exports = {
  asyncConnectToMongodb,
  getDatabase,
};