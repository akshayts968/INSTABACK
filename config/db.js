const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to DB");

    const store = MongoStore.create({
      mongoUrl: process.env.MONGO,
      crypto: {
        secret: process.env.SECRET,
      },
      touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
      console.log("ERROR in MONGO SESSION STORE:", err);
    });
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
};

module.exports = connectDB;
