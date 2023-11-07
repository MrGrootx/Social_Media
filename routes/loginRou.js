const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

router.get("/", (req, res) => {
  const pagedata = {
    title: "UserLogin",
  };
  res.status(200).render("login", pagedata);
});

router.post("/", async (req, res) => {
  const pageData = req.body;
  pageData.title = "User Login";

  const username = req.body.username.trim();
  const password = req.body.password.trim();
 

  if (username && password) {
    const user = await User.findOne({
      username: username,
    }).catch((err) => {
      console.log(err);
      pageData.errorMessage = "something went wrong";
      res.status(200).render("login", pageData);
    });
    //    console.log(user);
    if (user != null) {
      const result = await bcrypt.compare(password, user.password);
      if(result === true){
        req.session.user = user;
        req.session.mrgroot = user
        return res.redirect("/home");
      } else {
        pageData.errorMessage = "something went wrong";
        res.status(200).render("login", pageData);
      }
    } else {
      pageData.errorMessage = "User not found";
      res.status(200).render("login", pageData);
    }
  } else {
    pageData.errorMessage = "Make sure each field has a valid value";
    res.status(200).render("login", pageData);
  }
});

module.exports = router;
