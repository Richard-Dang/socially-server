const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const SocialAccount = mongoose.model("SocialAccount");

const router = express.Router();

router.use(requireAuth);

// TODO: Change route to a get and accept params instead of a body by convention

router.post("/socialaccounts", async (req, res) => {
  const { userId } = req.body;
  const socialAccounts = await SocialAccount.find({ userId });

  res.send(socialAccounts);
});

// TODO: rename endpoint to /socialaccount
router.post("/addsocialaccount", async (req, res) => {
  const { accountType, username } = req.body;

  if (!accountType || !username) {
    return res
      .status(422)
      .send({ error: "You must provide an account type and username" });
  }
  try {
    const socialAccount = new SocialAccount({
      accountType,
      username,
      userId: req.user._id,
    });
    await socialAccount.save();
    res.send(socialAccount);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/socialaccounts", async (req, res) => {
  const socialAccount = req.body;
  const filter = { _id: socialAccount._id };
  const update = { username: socialAccount.username };

  const updatedAccount = await SocialAccount.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.send(updatedAccount);
});

module.exports = router;
