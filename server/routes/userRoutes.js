import express from "express";
import {
  deleteUser,
  findUserByEmail,
  getAllUsers,
  getProfile,
  login,
  signup,
  test,
  updateUser,
  uploadPicture,
} from "../controllers/userControllers.js";
import UserModel from "../models/userModel.js";
import multerUpload from "../middlewares/multer.js";
import passport from "passport";
import jwtAuth from "../middlewares/jwtAuth.js";

const userRouter = express.Router();

userRouter.get("/test", test);

userRouter.get("/all", getAllUsers);

userRouter.get("/find/:email", findUserByEmail);

userRouter.get("/profile", jwtAuth, getProfile);

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.patch(
  "/updateprofile/:_id",
  jwtAuth,
  // multerUpload.single("userpicture"),
  updateUser
);

userRouter.post(
  "/pictureUpload",
  multerUpload.single("userpicture"),
  uploadPicture
);

userRouter.delete("/user/:id", jwtAuth, deleteUser);

export default userRouter;
