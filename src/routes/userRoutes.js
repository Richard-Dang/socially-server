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

  if (!name) {
    return res.status(422).send({ error: "Must provide name to update" });
  }

  try {
    const filter = { _id: req.user._id };
    const update = { name, bio };

    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.send(updatedUser);
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

module.exports = router;
