import { Server } from "socket.io";

const io = new Server(3003, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });
});

console.log("WebSocket service running on port 3003");
