require("dotenv").config();
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
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 3000;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongoUri =
  process.env.MONGODB_URL ||
  `mongodb+srv://RichardDang:${mongodb_password}@cluster0-flhko.mongodb.net/Socially?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(authRoutes);
app.use(friendRoutes);
app.use(socialAccountRoutes);
app.use(searchRoutes);
app.use(userRoutes);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send("Homepage working!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
