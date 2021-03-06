const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, username } = req.body;

  try {
    const user = new User({ email, password, name, username });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "SOCIALLY_SECRET_KEY");
    res.send({ token, currentUser: user });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid email or password" });
  }

  try {
    await user.comparePassword(password);

    const token = jwt.sign({ userId: user._id }, "SOCIALLY_SECRET_KEY");
    res.send({ token, currentUser: user });
  } catch (err) {
    return res.status(422).send({ error: "Invalid email or password" });
  }
});

module.exports = router;
