const { model, Schema } = require("mongoose");

const PostSchema = new Schema({
  content: { type: String, trim: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  pinned: Boolean,
});

module.exports = model("Post", PostSchema);
