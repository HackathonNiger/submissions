const mongoose = require("mongoose");

const connectDataBase = async () => {
  try {
    let a = process.env.LIVE_DB_URL;
    let b = process.env.TEST_DB_URL;
    const connectDB = await mongoose.connect(a);
    if (!connectDB) {
      console.log("Unable to connect the database");
    } else {
      console.log("Database Connected Successfully");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDataBase;
