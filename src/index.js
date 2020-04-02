require("./models/User");
require("./models/SocialAccount");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requireAuth = require("./middlewares/requireAuth");
const authRoutes = require("./routes/authRoutes");
const friendRoutes = require("./routes/friendRoutes");
const socialAccountRoutes = require("./routes/socialAccountRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGODB_URL ||
  "mongodb+srv://admin:passwordpassword@sociallycluster-flhko.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(authRoutes);
app.use(friendRoutes);
app.use(socialAccountRoutes);
app.use(searchRoutes);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  userCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", err => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send("Homepage working!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
