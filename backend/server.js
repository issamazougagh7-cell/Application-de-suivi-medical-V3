const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const socketIO = require("./socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Init socket
const io = socketIO.init(server);
io.on("connection", (socket) => {
  // Each user joins a room named after their userId
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // Chat: join a conversation room
  socket.on("joinChat", (roomId) => {
    socket.join(roomId);
  });

  // Chat: send message in real time
  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("newMessage", data);
  });

  socket.on("disconnect", () => {});
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));