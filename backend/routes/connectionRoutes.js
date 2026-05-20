const express = require("express");
const router = express.Router();
const { searchDoctor, sendRequest, getMyConnections, respondToRequest } = require("../controllers/connectionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/search", protect, searchDoctor);
router.post("/request", protect, sendRequest);
router.get("/", protect, getMyConnections);
router.put("/:id/respond", protect, respondToRequest);

module.exports = router;