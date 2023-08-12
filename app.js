var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//const cors = require("cors");
const mongoose = require("mongoose");

var app = express();
//app.use(cors);
var server = require("http").createServer(app);

const io = require("socket.io")(server);

const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/messages");
const chatRoute = require("./routes/chat");
const paymentRoute = require("./routes/payment");

const connection = mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0.keiw4.mongodb.net/AppDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
connection.then(
  (db) => {
    console.log("Connected correctly to DB");
  },
  (err) => {
    console.log(err);
  }
);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("user connected");
  //socket.on("sendMessage", (msg) => {
  // console.log(msg);
  //io.emit("chat message", msg);
  //});

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log(userId);
    addUser(userId, socket.id);
    //io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    console.log(text);
    const id = Math.floor(
      Math.random() * Math.floor(Math.random() * Date.now())
    );
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        _id: id,
        user: { _id: senderId },
        text,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    //io.emit("getUsers", users);
  });
});

server.listen(4000, () => console.log("Server is Running!"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chat", chatRoute);
app.use("/api/card", paymentRoute);

module.exports = app;
