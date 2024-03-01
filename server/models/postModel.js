import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  commentor: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  comment: {
    type: String,
    required: true,
  },
  commentTime: {
    type: Date,
    required: true,
  },
});

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String, required: true },
  comments: [commentSchema],
  likes: [{ type: String }],
  ownedbyuser: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Reference to user schema
  time: { type: Date, required: false },
});

// Define a virtual property to get userName from associated user data
postSchema.virtual("userName", {
  ref: "user",
  localField: "ownedbyuser",
  foreignField: "_id",
  justOne: true,
  autopopulate: true, // Automatically populate the user data
});

const PostModel = mongoose.model("post", postSchema);

export default PostModel;
