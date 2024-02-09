import PostModel from "../models/postModel.js";

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find({});
    res.status(201).json({
      number: allPosts.length,
      allPosts,
    });
  } catch (error) {
    res.status(500).json({
      error,
      messsage: "something went wrong in the server",
    });
  }
};




//get one post by id
const getPostbyId = async (req, res) => {
  // console.log("req :>> ", req._id);
  const { postID } = req.params;

  try {
    const requestedId = await PostModel
      .find({ _id: req.params._id })
      .exec();
    res.status(201).json({
      number: requestedId.length,
      requestedId,
    });
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong in the server",
    });
  }
};

export {
  getAllPosts,
  getPostbyId}