const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/jwtMiddleware"); // ✅ authMiddleware ki jagah jwtMiddleware

router.post("/create-order", verifyToken, paymentController.createOrder);
router.post("/verify", verifyToken, paymentController.verifyPayment);

module.exports = router;