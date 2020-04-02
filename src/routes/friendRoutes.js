const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");

const router = express.Router();

router.use(requireAuth);

router.get("/friends", async (req, res) => {
  const user = await User.findById(req.user._id);

  res.send(user.friends);
});

router.post("/addfriend", async (req, res) => {
  const { friendId } = req.body;

  const user = await User.findById(req.user._id);

  user.friends.push(friendId);
  user.save();

  res.send({ friendId });
});

module.exports = router;
