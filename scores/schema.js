const { Schema, model } = require("mongoose");

const scoreSchema = new Schema(
  {
    name: String,
    score: Number,
  },
  { timestamps: true }
);

const scoreModel = model("scores", scoreSchema);
module.exports = scoreModel;
