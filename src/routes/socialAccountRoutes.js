const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const SocialAccount = mongoose.model("SocialAccount");

const router = express.Router();

router.use(requireAuth);

router.get("/socialaccounts", async (req, res) => {
  console.log(req.body);

  const { userId } = req.body;

  const socialAccounts = await SocialAccount.find({ userId });

  res.send(socialAccounts);
});

router.post("/socialaccounts", async (req, res) => {
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
      userId: req.user._id
    });
    await socialAccount.save();
    res.send(socialAccount);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
