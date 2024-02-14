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
    const requestedId = await PostModel.find({ _id: req.params._id }).exec();
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

//create a new post

const createPost = async (req, res) => {
  try {
    const { username, userpicture, petpicture, caption, time } = req.body;

    function IsNullOrUndefined(value) {
      return (
        value === null ||
        value === "null" ||
        value === "undefined" ||
        value === undefined ||
        value === ""
      );
    }

    if (
      IsNullOrUndefined(username) ||
      IsNullOrUndefined(userpicture) ||
      IsNullOrUndefined(petpicture) ||
      IsNullOrUndefined(caption) ||
      IsNullOrUndefined(time)
    ) {
      return res.status(400).json({
        error: "Some fields are missing",
        msg: "missing fields",
      });
    } else {
      const newPost = new PostModel({
        userName: req.user.userName,
        userPicture: req.user.userPicture,
        caption: req.body.caption,
        image: req.body.image,
        time: req.body.time,
        likes: req.body.likes,
      });
      try {
        const savedPost = await newPost.save();
        res.status(201).json({
          message: "saving post successful",
          post: {
            userName: savedPost.userName,
            userPicture: savedPost.userPicture,
            caption: savedPost.caption,
            image: savedPost.image,
            time: savedPost.time,
            likes: savedPost.likes,
          },
        });
      } catch (error) {
        res.status(500).json({
          msg: "error while posting a post",
          error: error,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: "something went wrong in creating posts section",
      error: error,
    });
  }
};

export { getAllPosts, getPostbyId, createPost };
