const mongoose = require("mongoose");
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const SocialAccount = mongoose.model("SocialAccount");

const router = express.Router();

router.use(requireAuth);

// TODO: Change route to a get and accept params instead of a body by convention

router.post("/socialaccounts", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(422).send({ error: "You must provide an userId" });
  }

  try {
    const socialAccounts = await SocialAccount.find({ userId });
    res.send(socialAccounts);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// TODO: rename endpoint to /socialaccounts
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
  const { socialAccounts } = req.body;

  if (!socialAccounts) {
    return res
      .status(422)
      .send({ error: "Must provide social accounts to update" });
  }
  // TODO: Find a better way to do this update
  try {
    const updateAccount = async (socialAccount) => {
      const filter = { _id: socialAccount._id };
      const update = { username: socialAccount.username };
      return await SocialAccount.findOneAndUpdate(filter, update, {
        new: true,
      });
    };

    const updatedAccounts = await Promise.all(
      socialAccounts.map((s) => updateAccount(s))
    );

    res.send(updatedAccounts);
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.delete("/socialaccounts", async (req, res) => {
  const { accountId } = req.body;
  console.log(accountId);

  if (!accountId) {
    return res
      .status(422)
      .send({ error: "Must provide social account ID to delete" });
  }

  try {
    const removedAccount = await SocialAccount.deleteOne({
      _id: accountId,
    });

    res.send(removedAccount);
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

module.exports = router;
