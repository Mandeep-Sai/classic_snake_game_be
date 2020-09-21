const express = require("express");
const scoreModel = require("./schema");

const router = express.Router();

router.get("/", async (req, res) => {
  const scores = await scoreModel.find();
  res.send(scores);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const newEntry = new scoreModel(req.body);
  await newEntry.save();
  res.send("ok");
});

module.exports = router;
