// Helper: create a notification + emit socket event
const Notification = require("../models/Notification");
const socketIO = require("../socket");

const notify = async ({ recipient, sender, type, title, body, link = "/" }) => {
  try {
    const notif = await Notification.create({ recipient, sender, type, title, body, link });
    const io = socketIO.getIO();
    io.to(recipient.toString()).emit("notification", notif);
    return notif;
  } catch (err) {
    console.error("Notify error:", err.message);
  }
};

module.exports = notify;
