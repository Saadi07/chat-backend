const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    user: {
      _id: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
