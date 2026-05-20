const express = require("express");
const router = express.Router();

const theatreController = require("../controllers/theatreController");

router.post("/", theatreController.addTheatre);
router.get("/", theatreController.getTheatresByCity);

module.exports = router;