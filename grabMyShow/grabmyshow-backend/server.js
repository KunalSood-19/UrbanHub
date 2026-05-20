

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
// const { Pool } = require("pg");

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

/* ===============================
   SOCKET.IO SETUP
================================= */
const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://localhost:5500"
    ],
    credentials: true
  }
});

/* ===============================
   DB CONNECT
================================= */
connectDB();

/* ===============================
   POSTGRESQL CONNECT
================================= */
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "dineout",
//   password: "kunalsood8858@",
//   port: 5432
// });

// pool.connect((err) => {

//   if (err) {
//     console.log("❌ PostgreSQL Error");
//     console.log(err);
//   } else {
//     console.log("✅ PostgreSQL Connected");
//   }

// });

/* ===============================
   MIDDLEWARE
================================= */
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost:5500"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
"/api/coupons",
require("./routes/couponRoutes")
);

/* ===============================
   EJS SETUP
================================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ===============================
   STATIC FILES
================================= */
app.use(express.static(path.resolve(__dirname, "..", "Frontend")));
/* ===============================
   HOME ROUTE
================================= */
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "Frontend", "index.html"));
});

/* ===============================
   SOCKET.IO LOGIC
================================= */
io.on("connection", (socket) => {

  console.log("✅ User Connected:", socket.id);

  socket.on("joinShow", (showId) => {
    socket.join(showId);
    console.log(`🎬 ${socket.id} joined show ${showId}`);
  });

  socket.on("seatBooked", ({ showId, seats }) => {
    socket.to(showId).emit("seatUpdate", seats);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });

});

/* ===============================
   DINE ORDER PAGE
================================= */
app.get("/dine-order", (req, res) => {

  const booking = {
    movieTitle: req.query.movie || "Interstellar: Remastered",
    theatre: req.query.theatre || "PVR IMAX, Ludhiana",
    showDate: req.query.date || "Tonight",
    showTime: req.query.time || "7:30 PM",
    seats: req.query.seats ? req.query.seats.split(",") : ["G7", "G8"],
    hall: req.query.hall || "Hall 3"
  };

  const menuData = {

    popcorn: [
      { id:"p1", emoji:"🍿", name:"Classic Salted", price:180 },
      { id:"p2", emoji:"🧈", name:"Butter Popcorn", price:200 },
      { id:"p3", emoji:"🍬", name:"Caramel Popcorn", price:220 },
      { id:"p4", emoji:"🌶", name:"Spicy Masala", price:190 }
    ],

    combos: [
      { id:"c1", emoji:"🎁", name:"Movie Combo", price:499 },
      { id:"c2", emoji:"👫", name:"Couple Combo", price:599 },
      { id:"c3", emoji:"👨‍👩‍👧‍👦", name:"Family Feast", price:899 }
    ],

    nachos: [
      { id:"n1", emoji:"🧀", name:"Cheese Nachos", price:250 },
      { id:"n2", emoji:"🌶", name:"Jalapeño Nachos", price:280 },
      { id:"n3", emoji:"🍟", name:"Fries", price:180 }
    ],

    beverages: [
      { id:"b1", emoji:"🥤", name:"Pepsi Large", price:130 },
      { id:"b2", emoji:"☕", name:"Hot Cappuccino", price:170 },
      { id:"b3", emoji:"🧋", name:"Cold Coffee", price:190 }
    ],

    desserts: [
      { id:"d1", emoji:"🍫", name:"Choco Lava Cake", price:280 },
      { id:"d2", emoji:"🍦", name:"Softy", price:160 },
      { id:"d3", emoji:"🧁", name:"Cupcake", price:220 }
    ]

  };

const restaurants = [

{
  id:"r1",
  emoji:"🍣",
  bg:"linear-gradient(135deg,#0a0f1a,#0f1825)",
  name:"Sakura Japanese Kitchen",
  cuisine:"Japanese · Sushi · Ramen",
  rating:"4.8",
  reviews:"312",
  distance:"0.3 km",
  time:"8 min walk",
  price:"₹1,800",
  type:["all","nonveg","fine"],
  tags:["Non-Veg","Fine Dining"],
  tagType:["nonveg",""]
},

{
  id:"r2",
  emoji:"🍕",
  bg:"linear-gradient(135deg,#1a0a0a,#160f0c)",
  name:"Napoli Rustica",
  cuisine:"Italian · Pizza · Pasta",
  rating:"4.6",
  reviews:"528",
  distance:"0.5 km",
  time:"10 min walk",
  price:"₹1,200",
  type:["all","nonveg"],
  tags:["Non-Veg"],
  tagType:["nonveg"]
},

{
  id:"r3",
  emoji:"🌿",
  bg:"linear-gradient(135deg,#050f08,#091310)",
  name:"The Green Bowl",
  cuisine:"Indian · Vegetarian",
  rating:"4.7",
  reviews:"445",
  distance:"0.2 km",
  time:"5 min walk",
  price:"₹800",
  type:["all","veg"],
  tags:["Pure Veg"],
  tagType:["veg"]
}

];

  const slots = [
    { time:"8:30 PM", status:"open" },
    { time:"9:00 PM", status:"few" },
    { time:"9:30 PM", status:"full" },
    { time:"10:00 PM", status:"open" }
  ];

  res.render("dine-order", {
    booking,
    menuData,
    restaurants,
    slots,
    razorpayKey: process.env.RAZORPAY_KEY_ID || "rzp_test_SL6ZrLgpI4gM3b"
  });

});

/* ===============================
   POSTGRESQL APIs
================================= */

/* RESTAURANT BOOKING */
app.post("/api/booking/restaurant", async (req, res) => {

  try {

    const {
      bookingRef,
      paymentId,
      restaurant,

      customerName,
      customerPhone,

      guests,
      date,
      slot,

      specialRequest,

      amount
    } = req.body;

    await pool.query(
      `
      INSERT INTO restaurant_bookings
      (
        booking_ref,
        payment_id,
        restaurant_name,

        customer_name,
        customer_phone,

        guests,
        booking_date,
        booking_slot,

        special_request,

        amount
      )

      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `,
      [
        bookingRef,
        paymentId,
        restaurant,

        customerName,
        customerPhone,

        guests,
        date,
        slot,

        specialRequest,

        amount
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });

  }

});

/* CINEMA FOOD ORDER */
app.post("/api/payment/cinema-order", async (req, res) => {

  try {

    const {

      orderId,

      paymentId,

      seatNo,

      hallName,

      items,

      subtotal,

      gst,

      total,

      date

    } = req.body;

    await pool.query(

      `
      INSERT INTO cinema_orders
      (

        order_id,

        payment_id,

        seat_no,

        hall_name,

        items,

        subtotal,

        gst,

        total,

        order_date

      )

      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,

      [

        orderId,

        paymentId,

        seatNo,

        hallName,

        JSON.stringify(items),

        subtotal,

        gst,

        total,

        date

      ]

    );

    res.json({

      success: true

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false

    });

  }

});
/* ===============================
   API ROUTES
================================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/theatres", require("./routes/theatreRoutes"));
app.use("/api/shows", require("./routes/showRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

/* ===============================
   GLOBAL ERROR HANDLER
================================= */
app.use((err, req, res, next) => {

  console.error("🔥 Error:", err.stack);

  res.status(err.status || 500).json({
    success:false,
    message: err.message || "Internal Server Error"
  });

});

/* ===============================
   SERVER START
================================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
