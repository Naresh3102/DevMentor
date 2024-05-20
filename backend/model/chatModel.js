const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  currentSection: {
    type: String,
    required: true,
  },
  messages: {
    type: Object,
    required: true,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
