import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  //upon receiving a "message-sent" signal, the websocket sends a "received-message" signal back with the id of the sent chat room
  socket.on("message-sent", (chatRoom) => {
    socket.broadcast.emit("received-message", chatRoom);
  });
});
