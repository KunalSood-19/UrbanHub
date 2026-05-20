const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "movieDB"
    });

    console.log("MongoDB Atlas connected ✅");
    console.log("Connected DB:", mongoose.connection.name);

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;