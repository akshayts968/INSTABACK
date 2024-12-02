const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, 
    });
    console.log("Connected to DB");

    const store = new MongoDBStore({
      uri: process.env.MONGO,
      collection: 'sessions',
      crypto: {
          secret: process.env.secret,
      },
      touchAfter: 24 * 3600,
  });

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
};

module.exports = connectDB;
