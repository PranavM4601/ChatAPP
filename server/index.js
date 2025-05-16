const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Track users per room
const roomUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);

    const username = socket.handshake.query.username || "Unknown";

    // Add user to the room list
    if (!roomUsers[room]) roomUsers[room] = [];

    const alreadyInRoom = roomUsers[room].some((u) => u.id === socket.id);
    if (!alreadyInRoom) {
      const user = { id: socket.id, username };
      roomUsers[room].push(user);
    }

    // Notify clients in the room
    io.to(room).emit("active_users", roomUsers[room]);
  });

  socket.on("send_message", (data) => {
    console.log("Broadcasting to room:", data.room);
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((room) => {
      if (roomUsers[room]) {
        roomUsers[room] = roomUsers[room].filter((u) => u.id !== socket.id);
        io.to(room).emit("active_users", roomUsers[room]);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
