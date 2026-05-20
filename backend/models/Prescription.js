const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    patientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // patient-side visibility
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    medications: [{ name: String, dosage: String, duration: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);