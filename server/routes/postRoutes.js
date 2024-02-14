import express from "express";
import {
  createPost,
  getAllPosts,
  getPostbyId,
} from "../controllers/postControllers.js";

const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.get("/:_id", getPostbyId);
postRouter.get("/postnewpost", createPost);
export default postRouter;
