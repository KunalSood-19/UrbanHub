const express = require("express");
const router = express.Router();

let bookings = [];

router.post("/", (req,res)=>{

const booking = req.body;

bookings.push(booking);

res.json({
message:"Booking successful",
data:booking
});

});

router.get("/", (req,res)=>{
res.json(bookings);
});

module.exports = router;