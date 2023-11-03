const express = require("express");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    const pagedata = {
        title: "Registration",
    }
    res.status(200).render("register", pagedata)
})

module.exports = router;