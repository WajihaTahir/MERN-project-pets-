import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  commentorId: {
    type: String,
    required: true,
  },
  commentorName: {
    type: String,
    required: true,
  },

  commentorPicture: {
    type: String,
    required: true,
  },

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
  userName: { type: String, required: true },
  userPicture: { type: String, required: false },
  caption: { type: String, required: true },
  image: { type: String, required: true },
  time: { type: Date, required: false },
  comments: [commentSchema],
  likes: [
    {
      type: String,
    },
  ],
  // ownedbyuser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const PostModel = mongoose.model("post", postSchema);

export default PostModel;
