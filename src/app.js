const express = require("express");
const app = express();

const connectDB = require("./config/database");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
const cors = require("cors");

const http = require("http");
const Message = require("./models/message")
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:5174","https://dev-tinder-web-flax.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5174","https://dev-tinder-web-flax.vercel.app/"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const swipeRouter = require("./routes/swipe");
const userRouter = require("./routes/user");
const matchRouter = require("./routes/matches");
const chatRouter = require("./routes/chat");

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("joinChat", ({ userId }) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("sendMessage", async ({ senderId, targetUserId, text }) => {
    try {
      const newMessage = new Message({ senderId, targetUserId, text });
      await newMessage.save();
      io.to(targetUserId).emit("messageReceived", newMessage);
      io.to(senderId).emit("messageReceived", newMessage);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
});

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", swipeRouter);
app.use("/", userRouter);
app.use("/", matchRouter);
app.use("/", chatRouter);

connectDB()
  .then(() => {
    console.log("DB is connected");
    server.listen(PORT, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error Connecting to MongoDB:", err);
  });
