const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: {
      type: Array,
      default: []
    },
    createdAt: {
      type: Date,
      default: Date()
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("card", CardSchema);
