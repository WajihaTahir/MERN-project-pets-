import PostModel from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";

//TO GET ALL POSTS

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find({}) //finding all documents in a collection.
      .populate("ownedbyuser") //ownedbyuser is populated by data from user model as a ref.
      .populate({
        path: "comments",
        populate: {
          path: "commentor", //each field within the commentor is populated using the data from user model.
          model: "user",
        },
      });
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

//GET ALL POSTS OF ONE USER
const getAllPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPosts = await PostModel.find({ ownedbyuser: userId })
      .populate("ownedbyuser")
      .populate({
        path: "comments",
        populate: {
          path: "commentor",
          model: "user",
        },
      });

    if (userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for the user." });
    }

    res.status(200).json({
      number: userPosts.length,
      userPosts,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({
      error,
      message: "Something went wrong while getting user posts.",
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
    const requestedId = await PostModel.find({ _id: req.params._id });
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
      ownedbyuser: req.user._id, //giving the user id to the property ownedbyuser here
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

//TO UPDATE A POST

const updatePost = async (req, res) => {
  console.log("updatePost...", req.file);
  try {
    let updatedFields = {};
    if (req.body.caption) {
      updatedFields.caption = req.body.caption;
    }

    if (req.file) {
      const pictureUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
        transformation: [{ width: 800, height: 700, crop: "fill" }],
      });
      updatedFields.image = pictureUpload.secure_url;
    }
    const postId = req.params._id; // Assuming postId is passed in the request params
    console.log("postId", postId);
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $set: updatedFields },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const deleteResult = await cloudinary.uploader.destroy(req.body.public_id);
    return res.status(200).json(deleteResult);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//TO DELETE A POST

const deletePost = async (req, res) => {
  const postId = req.params.id;
  // console.log("postiddelete", postId);
  try {
    const postToDelete = await PostModel.findOneAndDelete({ _id: postId });
    console.log("post to delete", postToDelete);
    if (!postToDelete) {
      return res.status(404).json({ message: "no post found with that id" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong in deleting a post",
      error: error,
    });
  }
};

//TO ADD A COMMENT

const addAComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  // console.log("postId...", postId);
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(406).json({ error: "invalid id" });
  }
  try {
    const submitComment = {
      comment: req.body.comment,
      commentor: req.user._id, //containers the id of the user commenting
      commentorName: req.user.username,
      commentorPicture: req.user.userpicture,
      commentTime: new Date(),
      commentorId: userId,
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
    const newCommentId = post.comments[post.comments.length - 1]._id; //gives the index of the newly added comment in the array.

    return res.status(200).json({ post, newCommentId });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

//TO DELETE A COMMENT

const deleteAComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    // console.log("id..", commentId);
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
      return res.status(400).json({ message: "This is not in likes" });
    }

    const updatedLikes = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } }, // Use $addToSet to ensure unique values
      { new: true }
    );
    // console.log("here at like", updatedLikes);
    return res.status(200).json({ message: "added to likes", updatedLikes });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//TO UNLIKE A POST

const unlikeAPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(406).json({ error: "invalid id" });
    }

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: "This is  in likes" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    // console.log("here at unlike", updatedPost);
    return res.status(200).json({ message: "removed from likes", updatedPost });
  } catch (error) {
    // console.error("Error unliking post:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllPosts,
  getAllPostsByUser,
  getPostbyId,
  createAPost,
  addAComment,
  deleteAComment,
  likeAPost,
  unlikeAPost,
  updatePost,
  deletePost,
};
