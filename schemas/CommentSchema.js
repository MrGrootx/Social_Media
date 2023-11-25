const { model, Schema } = require("mongoose");

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    commentTo: { type: Schema.Types.ObjectId, ref: "Post" },
    commentBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Comment", CommentSchema);
