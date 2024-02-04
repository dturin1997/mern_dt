import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import express, { json } from "express";
import fileUpload from "express-fileupload";
import apiRoutes from "./routes/apiRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(helmet());

const httpServer = createServer(app);
global.io = new Server(httpServer);

app.use(cors());

app.use(json());
app.use(cookieParser());
app.use(fileUpload());

const admins = [];
let activeChats = [];
function get_random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

io.on("connection", (socket) => {
  socket.on("admin connected with server", (adminName) => {
    admins.push({ id: socket.id, admin: adminName });
  });

  socket.on("client sends message", (msg) => {
    if (admins.length === 0) {
      socket.emit("no admin", "");
    } else {
      let client = activeChats.find((client) => client.clientId === socket.id);
      let targetAdminId;
      if (client) {
        targetAdminId = client.adminId;
      } else {
        let admin = get_random(admins);
        activeChats.push({ clientId: socket.id, adminId: admin.id });
        targetAdminId = admin.id;
      }
      socket.broadcast
        .to(targetAdminId)
        .emit("server sends message from client to admin", {
          user: socket.id,
          message: msg,
        });
    }
  });

  socket.on("admin sends message", ({ user, message }) => {
    socket.broadcast
      .to(user)
      .emit("server sends message from admin to client", message);
  });

  socket.on("admin closes chat", (socketId) => {
    socket.broadcast.to(socketId).emit("admin closed chat", "");
    let c = io.sockets.sockets.get(socketId);
    c.disconnect(); // reason:  server namespace disconnect
  });

  socket.on("disconnect", (reason) => {
    // admin disconnected
    const removeIndex = admins.findIndex((item) => item.id === socket.id);
    if (removeIndex !== -1) {
      admins.splice(removeIndex, 1);
    }
    activeChats = activeChats.filter((item) => item.adminId !== socket.id);

    // client disconnected
    const removeIndexClient = activeChats.findIndex(
      (item) => item.clientId === socket.id
    );
    if (removeIndexClient !== -1) {
      activeChats.splice(removeIndexClient, 1);
    }
    socket.broadcast.emit("disconnected", {
      reason: reason,
      socketId: socket.id,
    });
  });
});

app.get("/", async (req, res, next) => {
  res.json({ message: "API running..." });
});

// mongodb connection
connectDB();

app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
