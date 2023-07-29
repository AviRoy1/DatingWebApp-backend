import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import connectDB from "./src/config/DB.js";
import apiRouter from "./src/routes/index.js";
import ApiError from "./src/utils/index.js";
import Razorpay from "razorpay";
import { Server } from "socket.io";

dotenv.config();
const app = express();

// set security HTTP headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

connectDB();
app.use("/api", apiRouter);

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// send back a 404 error for any unknown api request
// app.use((_req, _res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
// });

const server = app.listen(5000, () => {
  console.log(`Server is running on port- ${5000}`.bgWhite.red);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("connected users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

    console.log("user Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log(user);
    console.log("Data: ", data);

    if (user) {
      io.to(user.socketId).emit("receive-message", data);
      console.log("data sent");
    }
  });
});
