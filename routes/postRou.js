const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
  const pageData = {
    title: "Post Page",
    UserDetails: req.session.mrgroot,
    UserDetailsJson: JSON.stringify(req.session.mrgroot),
    postId: req.params.id,
  };

  res.status(200).render("postPage", pageData);
});

module.exports = router;
