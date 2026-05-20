const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middleware/jwtMiddleware");

router.get(
  "/analytics",
  verifyToken,
  verifyAdmin,
  adminController.getAnalytics
);

router.get(
  "/show-revenue/:showId",
  verifyToken,
  verifyAdmin,
  adminController.getShowRevenue
);

module.exports = router;