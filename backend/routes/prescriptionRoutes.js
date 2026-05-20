const express = require("express");
const router = express.Router();
const { createPrescription, getPrescriptions, deletePrescription } = require("../controllers/prescriptionController");
const { protect, doctorOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, getPrescriptions).post(protect, doctorOnly, createPrescription);
router.route("/:id").delete(protect, doctorOnly, deletePrescription);

module.exports = router;