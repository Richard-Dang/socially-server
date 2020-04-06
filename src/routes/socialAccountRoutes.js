const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const SocialAccount = mongoose.model("SocialAccount");

const router = express.Router();

router.use(requireAuth);

router.get("/socialaccounts", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(422).send({ error: "You must provide an userId" });
  }

  try {
    const socialAccounts = await SocialAccount.find({ userId });
    const allAccountTypes = SocialAccount.schema.path("accountType").enumValues;
    const usedAccountTypes = socialAccounts.map((a) => a.accountType);

    const unusedAccountTypes = allAccountTypes.filter(
      (a) => !usedAccountTypes.includes(a)
    );

    res.send({ socialAccounts, unusedAccountTypes });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
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
      userId: req.user._id,
    });
    await socialAccount.save();
    res.send(socialAccount);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// Workaround for any account modification (add, update, delete):
// Delete all accounts with userId and then just add list of accounts from state
router.put("/socialaccounts", async (req, res) => {
  const { socialAccounts } = req.body;
  const userId = req.user._id;

  console.log(socialAccounts);

  const updateAccount = async (socialAccount) => {
    const { accountType, username } = socialAccount;
    const newSocialAccount = new SocialAccount({
      userId,
      accountType,
      username,
    });
    return await newSocialAccount.save();
  };

  try {
    await SocialAccount.deleteMany({ userId });

    const updatedAccounts = await Promise.all(
      socialAccounts.map((s) => updateAccount(s))
    );

    res.send(updatedAccounts);
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

module.exports = router;
