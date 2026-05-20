const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate connection requests
connectionSchema.index({ patient: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model("Connection", connectionSchema);