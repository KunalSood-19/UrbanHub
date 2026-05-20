require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const serviceRoutes = require("./routes/services");

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());

/* =========================
   CONNECT TO MONGODB
========================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {
console.log("✅ MongoDB Atlas Connected");
})

.catch((err) => {
console.log("❌ MongoDB Error:", err);
});

/* =========================
   SERVICES ROUTES
========================= */

app.use("/api/services", serviceRoutes);

/* =========================
   BOOKING SCHEMA
========================= */

const bookingSchema = new mongoose.Schema({

name: String,
email: String,
service: String,
date: String,
time: String

});

const Booking = mongoose.model("Booking", bookingSchema);

/* =========================
   SAVE BOOKING
========================= */

app.post("/api/bookings", async (req,res)=>{

try{

const booking = new Booking(req.body);

await booking.save();

res.json({
success:true,
message:"Booking saved in MongoDB"
});

}catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Booking failed"
});

}

});

/* =========================
   GET BOOKINGS
========================= */

app.get("/api/bookings", async (req,res)=>{

try{

const bookings = await Booking.find();

res.json(bookings);

}catch(error){

console.log(error);

res.status(500).json({
message:"Failed to fetch bookings"
});

}

});

/* =========================
   BOOKINGS PAGE (EJS)
========================= */

app.get("/bookings", async (req,res)=>{

const bookings = await Booking.find();

res.render("bookings", { bookings });

});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {

console.log(`🚀 Urbanservice running on port ${PORT}`);

});