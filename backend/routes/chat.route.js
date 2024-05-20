const express = require("express");
const Chat = require("../model/chatModel.js");
const router = express.Router();
const {
  getMessages,
  createChats,
  getChat,
  getChats,
} = require("../controller/chatController.js");

router.post("/", getMessages);

router.get("/", getChats);

router.get("/:id", getChat);

router.post("/save", createChats);

// router.delete("/:id", deleteChat);

module.exports = router;
