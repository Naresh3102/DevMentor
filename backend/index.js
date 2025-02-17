const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoute = require("./routes/chat.route.js");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/chats", chatRoute);

mongoose
  .connect("mongodb://localhost:27017/devmentor")
  .then(() => {
    console.log("Connected to database..");
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
