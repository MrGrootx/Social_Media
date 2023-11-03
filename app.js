const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bodyParser = require("body-parser");
const connectDB = require('./db/connect')

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

const staticUri = path.join(__dirname, "public");
app.use(express.static(staticUri));

// Routes
const registerRoute = require("./routes/registerRou");
app.use("/register", registerRoute);

const loginRoute = require("./routes/loginRou");
app.use("/login", loginRoute);

app.get(["/", "/index", "home"], (req, res) => {
  res.send("Hello World");
});

app.get("/about", (req, res) => {
  res.send("About World");
});

app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});
