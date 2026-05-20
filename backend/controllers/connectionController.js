const User = require("../models/User");
const Connection = require("../models/Connection");
const notify = require("../utils/notify");

const searchDoctor = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });
    const doctor = await User.findOne({ email, role: "doctor" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "No doctor found with this email" });
    const existing = await Connection.findOne({ patient: req.user._id, doctor: doctor._id });
    res.json({ doctor, connectionStatus: existing?.status || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendRequest = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor")
      return res.status(404).json({ message: "Doctor not found" });
    const existing = await Connection.findOne({ patient: req.user._id, doctor: doctorId });
    if (existing) return res.status(400).json({ message: "Request already sent" });
    const connection = await Connection.create({ patient: req.user._id, doctor: doctorId });

    await notify({
      recipient: doctorId,
      sender: req.user._id,
      type: "connection_request",
      title: "New Connection Request",
      body: `${req.user.name} wants to connect with you as their doctor`,
      link: "/connections",
    });

    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyConnections = async (req, res) => {
  try {
    const filter = req.user.role === "doctor"
      ? { doctor: req.user._id }
      : { patient: req.user._id };
    const connections = await Connection.find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email");
    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const connection = await Connection.findById(req.params.id).populate("doctor", "name");
    if (!connection) return res.status(404).json({ message: "Connection not found" });
    if (connection.doctor._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    connection.status = status;
    await connection.save();

    if (status === "accepted") {
      await notify({
        recipient: connection.patient,
        sender: req.user._id,
        type: "connection_accepted",
        title: "Connection Accepted!",
        body: `Dr. ${connection.doctor.name} accepted your connection request`,
        link: "/find-doctor",
      });
    }

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchDoctor, sendRequest, getMyConnections, respondToRequest };