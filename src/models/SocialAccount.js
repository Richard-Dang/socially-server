const mongoose = require("mongoose");

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accountType: {
    type: String,
    required: true,
    enum: [
      "facebook",
      "instagram",
      "linkedin",
      "twitter",
      "twitch",
      "steam",
      "soundcloud",
      "github",
      "flickr",
    ],
    default: "facebook",
  },
  username: {
    type: String,
    required: true,
  },
});

mongoose.model("SocialAccount", socialAccountSchema);
