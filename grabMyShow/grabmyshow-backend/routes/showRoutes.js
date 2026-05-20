const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");

router.get("/seat-availability/:id", showController.getSeatAvailability);
router.post("/", showController.createShow);
router.get("/", showController.getShowsByMovie);
router.get("/:showId/seats", showController.getSeatAvailability);

module.exports = router;