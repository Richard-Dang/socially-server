require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requireAuth = require("./middleware/requireAuth");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGODB_URL ||
  "mongodb+srv://admin:passwordpassword@sociallycluster-flhko.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(authRoutes);

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
