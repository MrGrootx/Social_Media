const express = require("express");

const router = express.Router();

const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/postSchema");
const Comment = require("../../schemas/CommentSchema");

// Get All post Details

router.get("/", (req, res) => {
  Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({ createdAt: 1 })
    .then(async (results) => {
      results = await User.populate(results, { path: "retweetData.postedBy" });

      return res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

router.post("/", async (req, res) => {
  // return res.status(200).send(req.body);
  if (!req.body.content.trim()) {
    console.log("Content Not Found");
    return res.sendStatus(400);
  }
  const postData = {
    content: req.body.content,
    postedBy: req.session.mrgroot,
  };

  Post.create(postData).then(async (newPost) => {
    newPost = await User.populate(newPost, { path: "postedBy" });
    return res.status(200).send(newPost);
  });
});

//LikePosts
router.put("/:id/like", async (req, res) => {
  const postId = req.params.id;
  //   console.log(postId);
  const userId = req.session.mrgroot._id;
  const isLiked =
    req.session.mrgroot.likes && req.session.mrgroot.likes.includes(postId);
  const option = isLiked ? "$pull" : "$addToSet";

  req.session.mrgroot = await User.findByIdAndUpdate(
    userId,
    {
      [option]: { likes: postId },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  res.status(200).send(post);
});

router.post("/:id/retweetBtn", async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.mrgroot._id;
  // Delete if already retweeted
  const deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId,
  }).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  let repost = deletedPost;
  if (repost == null) {
    repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
      (err) => {
        console.log(err);
        res.sendStatus(400);
      }
    );
  }

  const option = deletedPost ? "$pull" : "$addToSet";

  req.session.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: { retweets: repost._id },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      [option]: { retweetUsers: userId },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });
  res.status(200).send(post);
});

//Comments
router.post("/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const comment = req.body.comment;
  const userId = req.session.mrgroot._id;

  let postedComment = await Comment.create({
    comment: comment,
    commentBy: userId,
    commentTo: postId,
  }).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { commentUsers: userId },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });

  res.status(200).send(postedComment);
});

//Previous Comments For a post
router.get("/:id/usercomment", async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ commentTo: postId })
    .populate("commentBy")
    .sort({ createdAt: 1 })
    .then(async (results) => {
      await User.populate(results, { path: "commentBy.postedBy" });
      return res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

//Get Single Post
router.get("/:id/single", (req, res) => {
  const postID = req.params.id;

  Post.findById({ _id: postID })
    .populate("postedBy")
    .populate("retweetData")
    .sort({ createdAt: 1 })
    .then(async (results) => {
      results = await User.populate(results, { path: "retweetData.postedBy" });

      const comments = await Comment.find({ commentTo: postID })
        .populate("commentBy")
        .sort({
          createdAt: 1,
        });

      return res.status(200).send({ post: results, comments: comments });
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

//Delete Post & comments
router.delete("/:id", async (req, res) => {
  const postID = req.params.id;
  const userId = req.session.mrgroot._id;
  try {
    await Post.findByIdAndDelete(postID);
    await Post.deleteMany({ retweetData: postID });
    await Comment.deleteMany({ commentTo: postID });

    return res.status(202).send({ status: "success" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
