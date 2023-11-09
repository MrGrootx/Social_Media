const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const connectDB = require("./db/connect");
const middleware = require("./middleware/middleware");

const app = express();
const port = process.env.PORT;

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Mr Groot",
    resave: true,
    saveUninitialized: false,
  })
);

const staticUri = path.join(__dirname, "public");
app.use(express.static(staticUri));

// Routes
const registerRoute = require("./routes/registerRou");
const loginRoute = require("./routes/loginRou");
const logOutRoute = require("./routes/logoutRou");

app.use("/register", middleware.isLogin, registerRoute);
app.use("/login", middleware.isLogin, loginRoute);
app.use("/logout", logOutRoute);

// HOME PAGE
app.get(["/", "/index", "/home"], middleware.isAlreadyLogin, (req, res) => {
  const PageData = {
    title: "Home Page",
    UserDetails: req.session.mrgroot,
  };

  res.status(200).render("home", PageData);
});

// SETTINGS PAGE
app.get("/settings", middleware.isAlreadyLogin, (req, res) => {
  const PageData = {
    title: "Settings  ",
    UserDetails: req.session.mrgroot,
  };

  res.status(200).render("settings", PageData);
});

// Api Routes
const postApiRoute = require("./routes/api/posts");
app.use("/api/posts", postApiRoute);

app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});
