const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");

const router = express.Router();

router.use(requireAuth);

router.get("/friends", async (req, res) => {
  const friendIds = req.user.friends;

  const friends = await User.find({
    _id: {
      $in: friendIds
    }
  });

  res.send(friends);
});

router.post("/addfriend", async (req, res) => {
  const { friendId } = req.body;
  const user = req.user;

  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId);
    await user.save();
    res.send({ friendId });
  } else {
    res.status(422).send({ error: "Friend has already been added" });
  }
});

router.get("/user", (req, res) => {
  res.send(req.user);
});

module.exports = router;
