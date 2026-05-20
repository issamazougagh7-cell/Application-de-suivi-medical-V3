const express = require("express");
const router = express.Router();
const { createPatient, getPatients, getPatientById, updatePatient, deletePatient } = require("../controllers/patientController");
const { protect, doctorOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, doctorOnly, getPatients).post(protect, doctorOnly, createPatient);
router.route("/:id")
  .get(protect, getPatientById)
  .put(protect, doctorOnly, updatePatient)
  .delete(protect, doctorOnly, deletePatient);

module.exports = router;