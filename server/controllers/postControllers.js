import PostModel from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";

//TO GET ALL POSTS

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

//TO GET ONE POST

const getPostbyId = async (req, res) => {
  console.log("getPostbyId...");
  // console.log("req :>> ", req._id);
  const { postID } = req.params;
  // console.log("postIDId", postID);

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

//TO CREATE A NEW POST

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

//TO ADD A COMMENT

const addAComment = async (req, res) => {
  const postId = req.params.id;
  // console.log("postId...", postId);
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

//TO DELETE A COMMENT

const deleteAComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    console.log("id..", commentId);
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { returnOriginal: false }
    );

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

//TO LIKE A POST

const likeAPost = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log("useriddddd", userId);
    const postId = req.params.id;
    // console.log("postid", postId);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(406).json({ error: "invalid id" });
    }

    const post = await PostModel.findOne({
      _id: postId,
    });
    // console.log("here...", post);
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "This is already in likes" });
    }

    const updatedLikes = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } }, // Use $addToSet to ensure unique values
      { new: true }
    );
    console.log("postlike", updatedLikes);
    return res.status(200).json({ message: "added to likes" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//TO UNLIKE A POST

const unlikeAPost = async (req, res) => {
  try {
    const postId = req.params.id;
    // console.log("unlikepost", postId);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(406).json({ error: "invalid id" });
    }

    console.log("here...");
  } catch (error) {}
};

export {
  getAllPosts,
  getPostbyId,
  createAPost,
  addAComment,
  deleteAComment,
  likeAPost,
  unlikeAPost,
};
