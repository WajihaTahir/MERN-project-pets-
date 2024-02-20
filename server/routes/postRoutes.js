import express from "express";
import {
  addAComment,
  createAPost,
  deleteAComment,
  getAllPosts,
  getPostbyId,
} from "../controllers/postControllers.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import multerUpload from "../middlewares/multer.js";

const postRouter = express.Router();

postRouter.get("/allposts", getAllPosts);
postRouter.post("/addacomment/:id", jwtAuth, addAComment);
postRouter.delete("/deleteacomment/", jwtAuth, deleteAComment);
postRouter.get("/post/:_id", getPostbyId);
postRouter.post(
  "/postnewpost",
  [jwtAuth, multerUpload.single("image")],
  createAPost
);
export default postRouter;
