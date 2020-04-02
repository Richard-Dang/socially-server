const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");

const router = express.Router();

router.use(requireAuth);

router.get("/search", async (req, res) => {
  // Need to get set of all users that aren't friends
  const allUsers = await User.find({});
  const currentUser = await User.findById(req.user._id);
  const friends = currentUser.friends;

  console.log(typeof currentUser._id);

  const searchableUsers = allUsers.filter(
    user => !friends.includes(user._id) && !currentUser._id.equals(user._id)
  );

  res.send(searchableUsers);
});

module.exports = router;
