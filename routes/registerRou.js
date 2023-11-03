const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");


router.get("/", (req, res) => {
  const pagedata = {
    title: "Registration",
  };
  res.status(200).render("register", pagedata);
});

router.post("/", async (req, res) => {
  const pagedata = req.body;
  pagedata.title = "Registration";

  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (name && email && username && password) {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((Err) => {
      console.log(Err);
      pagedata.errorMessage = "Something went wrong";
      return res.status(200).render("register", pagedata);
    });

    if (user == null) {
      // Store
      const data = req.body;
      data.password = await bcrypt.hash(password, 10);
      User.create(data).then((user) => {
        return res.status(201).json(user);
      });
    } else {
      // User name check
      pagedata.errorMessage = "Username or Email already Taken..";
      return res.status(200).render("register", pagedata);
    }
  } else {
    pagedata.errorMessage = "Make sure each filed as valid value";
    res.status(200).render("register", pagedata);
  }
});

module.exports = router;
