import PostModel from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find({}).populate("ownedbyuser");
    console.log("allPosts", allPosts);
    res.status(201).json({
      number: allPosts.length,
      allPosts,
    });
  } catch (error) {
    res.status(500).json({
      error,
      messsage: "something went wrong while getting all posts",
    });
  }
};

//get one post by id
const getPostbyId = async (req, res) => {
  console.log("getPostbyId...");
  // console.log("req :>> ", req._id);
  const { postID } = req.params;

  try {
    const requestedId = await PostModel.find({ _id: req.params._id }).exec();
    res.status(201).json({
      number: requestedId.length,
      requestedId,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong while getting a post",
    });
  }
};

//create a new post
const createAPost = async (req, res) => {
  console.log("createAPost...", req.file);
  try {
    const pictureUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "posts",
      transformation: [{ width: 800, height: 700, crop: "fill" }],
    });

    const post = await PostModel.create({
      caption: req.body.caption,
      image: pictureUpload.secure_url,
      comments: [],
      like: [],
      time: new Date(),
      ownedbyuser: req.user._id,
    });
    if (!post) {
      res.status(500).json({ error: "post couldnot be submitted" });
    }
    const user = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { posted_posts: post._id },
      }
    );
    if (!user) {
      res
        .status(206)
        .json({ post: post, error: "couldnot connect the post with the user" });
    }
    return res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addAComment = async (req, res) => {
  const postId = req.params.id;
  console.log("postId...", req.body.comment);
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(406).json({ error: "invalid id" });
  }
  try {
    const submitComment = {
      comment: req.body.comment,
      commentor: req.user._id,
      commentorName: req.user.username,
      commentorPicture: req.user.userpicture,
      commentTime: new Date(),
    };
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: submitComment },
      },
      { new: true }
    );
    if (!post) {
      return res.status(500).json({ error: "id not found" });
    }
    const newCommentId = post.comments[post.comments.length - 1]._id;
    return res.status(200).json({ post, newCommentId });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const deleteAComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    console.log("id..", commentId);
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { returnOriginal: false }
    );

    // console.log("commentId :>> ", commentId);
    // console.log("_id", _id);

    // console.log(req.body);

    if (!post) {
      return res.status(404).json({
        msg: "Comment not found",
      });
    }

    res.status(200).json({
      msg: "Comment deleted successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      error: error,
    });
  }
};

export { getAllPosts, getPostbyId, createAPost, addAComment, deleteAComment };
