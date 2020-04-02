const mongoose = require("mongoose");

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  accountType: {
    type: String,
    required: true,
    enum: ["facebook", "instagram", "linkedin"],
    default: "facebook"
  },
  username: {
    type: String,
    required: true,
    unique: true
  }
});

mongoose.model("SocialAccount", socialAccountSchema);
