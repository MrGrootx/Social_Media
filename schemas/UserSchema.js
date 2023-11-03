const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/images/profilePic.png" },
  },
  { timestamps: true, versionKey: false  }
);

const User = model("User", userSchema);
module.exports = User;