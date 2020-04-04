const requireAuth = require("../middlewares/requireAuth");
const express = require("express");
const mongoose = require("mongoose");

const User = mongoose.model("User");

const router = express.Router();
router.use(requireAuth);

router.get("/user", (req, res) => {
  res.send(req.user);
});

router.put("/user", async (req, res) => {
  const { name, bio } = req.body;
  const filter = { _id: req.user._id };
  const update = { name, bio };

  const updatedUser = await User.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.send(updatedUser);
});

module.exports = router;
