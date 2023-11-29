const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../schemas/UserSchema");

router.get("/", (req, res) => {
  const pageData = {
    title: "Profile Page",
    UserDetails: req.session.mrgroot,
    UserDetailsJson: JSON.stringify(req.session.mrgroot),
    profileUser: req.session.mrgroot,
  };

  res.status(200).render("ProfilePage", pageData);
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const pageData = await getUser(username, req.session.mrgroot);
  res.status(200).render("ProfilePage", pageData);
});

async function getUser(username, userLoggedIn) {
  const isObjectId = mongoose.Types.ObjectId.isValid(username);
  const query = isObjectId ? { _id: username } : { username: username };
  const user = await User.findOne(query);
  if (user == null) {
    return {
      title: "Profile not Found",
      UserDetails: userLoggedIn,
      UserDetailsJson: JSON.stringify(userLoggedIn),
    };
  }
  return {
    title: user.username,
    UserDetails: userLoggedIn,
    UserDetailsJson: JSON.stringify(userLoggedIn),
    profileUser: user,
  };
}

module.exports = router;
