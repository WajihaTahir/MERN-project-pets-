import express from "express";
import {
  addAComment,
  createAPost,
  deleteAComment,
  deletePost,
  getAllPosts,
  getPostbyId,
  likeAPost,
  unlikeAPost,
  updatePost,
} from "../controllers/postControllers.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import multerUpload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.post("/addacomment/:id", jwtAuth, addAComment);
postRouter.delete("/deleteacomment/", jwtAuth, deleteAComment);
postRouter.post("/likepost/:id", jwtAuth, likeAPost);
postRouter.patch("/unlikepost/:id", jwtAuth, unlikeAPost);
postRouter.get("/post/:_id", getPostbyId);
postRouter.delete("/deletePost/:id", jwtAuth, deletePost);
postRouter.post(
  "/postnewpost",
  [jwtAuth, multerUpload.single("image")],
  createAPost
);
postRouter.put(
  "/updatePost/:_id",
  [jwtAuth, multerUpload.single("image")],
  updatePost
);

export default postRouter;
