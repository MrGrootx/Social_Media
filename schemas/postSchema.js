const { model, Schema } = require("mongoose");

const PostSchema = new Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
    commentUsers: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Post", PostSchema);
