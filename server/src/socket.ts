import { Server as IOServer } from "socket.io";

export const registerSocket = (io: IOServer) => {
  io.on("connection", (socket) => {
    console.log(`socket user ${socket.id} connected`);
  });
};
