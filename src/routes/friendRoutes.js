const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");

const router = express.Router();

router.use(requireAuth);

router.get("/friends", async (req, res) => {
  const friendIds = req.user.friends;

  try {
    const friends = await User.find({
      _id: {
        $in: friendIds,
      },
    });

    res.send(friends);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/friends", async (req, res) => {
  const { friendId } = req.body;
  const user = req.user;

  if (!friendId) {
    res.status(422).send({ error: "Must provide friendId to add" });
  }

  try {
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
      res.send({ friendId });
    } else {
      res.status(422).send({ error: "Friend has already been added" });
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete("/friends", async (req, res) => {
  const { friendId } = req.body;
  const user = req.user;

  if (!friendId) {
    res.status(422).send({ error: "Must provide friendId to delete" });
  }

  try {
    if (user.friends.includes(friendId)) {
      user.friends.pull(friendId);
      await user.save();
      res.send({ friendId });
    } else {
      res.status(422).send({ error: "Friend has already been removed" });
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
