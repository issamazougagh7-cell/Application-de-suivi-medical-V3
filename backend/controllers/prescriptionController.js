const Prescription = require("../models/Prescription");
const notify = require("../utils/notify");

const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create({ ...req.body, doctor: req.user._id });

    if (req.body.patientUser) {
      await notify({
        recipient: req.body.patientUser,
        sender: req.user._id,
        type: "prescription",
        title: "New Prescription Issued",
        body: `Dr. ${req.user.name} issued a new prescription for you`,
        link: "/prescriptions",
      });
    }

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    let prescriptions;
    if (req.user.role === "doctor") {
      prescriptions = await Prescription.find({ doctor: req.user._id })
        .populate("patient", "name")
        .populate("doctor", "name email")
        .sort({ date: -1 });
    } else {
      prescriptions = await Prescription.find({ patientUser: req.user._id })
        .populate("patient", "name")
        .populate("doctor", "name email")
        .sort({ date: -1 });
    }
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePrescription = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Prescription removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPrescription, getPrescriptions, deletePrescription };