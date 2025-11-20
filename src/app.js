const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const swipeRouter = require("./routes/swipe");
const userRouter = require("./routes/user");
const matchRouter = require("./routes/matches")

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", swipeRouter);
app.use("/", userRouter);
app.use("/", matchRouter)

connectDB()
  .then(() => {
    console.log("DB is connected");
    app.listen(PORT, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
