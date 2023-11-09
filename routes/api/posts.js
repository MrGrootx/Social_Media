const express = require("express");

const router = express.Router();

const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/postSchema");

// Get All post Details

router.get("/", (req, res) => {
    Post.find()
    .populate("postedBy")
    .sort({ createdAt: 1 })
    .then((results) => {
        return res.status(200).send(results);
    }).catch((err) => {
        console.log(err)
        return res.sendStatus(400);
    })
})

router.post("/", async (req, res) => {
    // return res.status(200).send(req.body);
    if(!req.body.content.trim()) {
        console.log("Content Not Found");
        return res.sendStatus(400);
    }
    const postData = {
        content: req.body.content,
        postedBy: req.session.mrgroot,
    }

    Post.create(postData).then(async (newPost) => {
        newPost = await User.populate(newPost, { path: "postedBy" });
        return res.status(200).send(newPost);
    })
});


module.exports = router;