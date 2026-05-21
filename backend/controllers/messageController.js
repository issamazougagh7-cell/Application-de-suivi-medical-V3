const Message = require("../models/Message");

// Build deterministic room ID from two user IDs
const getRoomId = (a, b) => [a, b].sort().join("_");

const getMessages = async (req, res) => {
  try {
    const roomId = getRoomId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    // Mark received messages as read
    await Message.updateMany(
      { roomId, receiver: req.user._id, read: false },
      { read: true }
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const roomId = getRoomId(req.user._id.toString(), receiverId);
    const message = await Message.create({
      roomId,
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    // Notify receiver
    const notify = require("../utils/notify");
    await notify({
      recipient: receiverId,
      sender: req.user._id,
      type: "message",
      title: "New Message",
      body: `${req.user.name}: ${text.slice(0, 60)}${text.length > 60 ? "..." : ""}`,
      link: `/chat/${req.user._id}`,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    // Find all unique roomIds this user is part of
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name role")
      .populate("receiver", "name role");

    // Deduplicate by roomId, keep latest message
    const seen = new Set();
    const conversations = [];
    for (const m of messages) {
      if (!seen.has(m.roomId)) {
        seen.add(m.roomId);
        conversations.push(m);
      }
    }
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
