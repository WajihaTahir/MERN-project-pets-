import express from "express";
import { getAllPosts, getPostbyId } from "../controllers/postControllers.js";


const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.get("/:_id", getPostbyId);
export default postRouter;
