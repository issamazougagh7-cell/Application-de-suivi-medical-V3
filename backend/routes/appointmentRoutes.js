const express = require("express");
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");
const { protect, doctorOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAppointments).post(protect, doctorOnly, createAppointment);
router.route("/:id").put(protect, doctorOnly, updateAppointment).delete(protect, doctorOnly, deleteAppointment);

module.exports = router;