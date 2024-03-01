import mongoose, { isValidObjectId } from "mongoose";
import UserModel from "../models/userModel.js";
import cloudinaryConfig from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { encryptPassword, verifyPassword } from "../utils/encryptPassword.js";
import validator from "validator";
import { generateToken } from "../utils/tokenServices.js";

const test = (req, res) => {
  res.send("testing successful");
};

//get all users

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find({}).select("-password");
    res.status(200).json(allUsers);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({ error: "server error" });
  }
};

//find one user by email

const findUserByEmail = async (req, res) => {
  console.log(req.params);
  try {
    const foundUser = await UserModel.findOne({
      email: req.params.email,
    }).select("-password");
    if (!foundUser) {
      return res.status(404).json({ error: "no user found" });
    }
    res.status(200).json(foundUser);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({ error: "server error" });
  }
};

//signup a new user

const signup = async (req, res) => {
  console.log(req.body);

  const { email, password, username, userpicture } = req.body;
  if (!email || !password || !username)
    return res.status(400).json({ error: "All fields must be included" });
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email is not valid" });
  }
  // if (!validator.isStrongPassword(password)) {
  //   return res.status(400).json({ error: "Password is not strong enough" });
  // }
  const options = {
    min: 2,
    max: 10,
  };
  if (!validator.isLength(password, options)) {
    return res.status(400).json({ error: "Password is not strong enough" });
  }

  try {
    //if all credentials provided, checking if there is an existing user.
    const existingUser = await UserModel.findOne({ email: email });
    //user with same email exists
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
    }
    //new user, no user with same email exists
    if (!existingUser) {
      try {
        const hashedPassword = await encryptPassword(password); //encrypt password
        if (!hashedPassword) {
          //if password can't be encrypted
          res.status(500).json({ error: "problem encoding password." });
        }
        if (hashedPassword) {
          //if password is encrypted
          const newUser = await UserModel.create({
            email: email,
            password: hashedPassword,
            username: username,
            userpicture: userpicture,
          });
          console.log("new user", newUser);
          if (newUser)
            res.status(201).json({
              message: "user registered",
              error: false,
              data: {
                user: {
                  username: newUser.username,
                  email: newUser.email,
                  userpicture: newUser.userpicture,
                },
              },
            });
        } else {
          res.status(400).json({ error: "user couldn't be created" });
        }
      } catch (error) {
        console.log(
          "something bad happened, user couldnot be created with hashed password",
          error
        );
      }
    }
  } catch (error) {
    if (error.code === 11000)
      res.status(400).json({ error: "Email already registered" });
    console.log(error);
    res.status(500).json({ error: "something went wrong..." });
  }
};

//login a user

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email, password :>> ", email, password);
  if (!email || !password)
    return res.status(400).json({ error: "All fields must be included" });
  try {
    const foundUser = await UserModel.findOne({ email: email });

    if (!foundUser)
      return res.status(404).json({ error: "no user with that email" });
    if (foundUser) {
      const isPasswordCorrect = await verifyPassword(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(500).json({
          error: "password incorrect",
        });
      }
      if (isPasswordCorrect) {
        const token = generateToken(foundUser._id);
        if (!token) {
          return res.status(500).json({
            message: "error occured during generating the token",
            error: true,
            data: null,
          });
        }
        if (token) {
          const user = {
            _id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
            createdAt: foundUser.createdAt,
          };
          return res.status(200).json({
            message: "user logged in successfully",
            error: false,
            data: {
              user: user,
              token,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

//update an existing user

const updateUser = async (req, res) => {
  const { username, email, userpicture } = req.body;
  const id = req.body._id;
  try {
    const updatedUserFields = {};
    if (username) {
      const existingUsername = await UserModel.findOne({ username: username });
      if (existingUsername && username !== req.user.username) {
        return res.status(400).json({ error: "username is already in use" });
      }
      updatedUserFields.username = username;
    }
    if (email) {
      const existingEmail = await UserModel.findOne({ email: email });
      if (existingEmail && email !== req.user.email) {
        return res.status(400).json({ error: "email is already in use" });
      }
      updatedUserFields.email = email;
    }
    if (userpicture) {
      updatedUserFields.userpicture = userpicture;
    }
    const updatedUserData = await UserModel.findByIdAndUpdate(
      id,
      updatedUserFields,
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: "update successful", user: updatedUserData });
  } catch (error) {
    res.status.json({ message: "error updating the user info", error: error });
  }
};

//REVIEW logic to update profile
//? 1st : check which properties to update are coming in the request
//? 2nd: IF there is an image coming, we need to upload it to cloudnary
//? 4th: NICE TO HAVE : what are we gonna do with the previous profile image???
//? 5th: once Image is uploaded and we have the url from cloudinary, do request to mongoDB to update user profile (findByIdAndUpdate)

//upload the picture for the user profile

const uploadPicture = async (req, res) => {
  console.log("req", req.file);
  if (!req.file) {
    console.log("file format not supported.");
    res.status(500).json({ message: "file not supported" });
  }
  if (req.file) {
    //Upload a picture
    try {
      const pictureUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "userProfiles",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      });
      console.log("picture upload", pictureUpload);

      res.status(201).json({
        message: "file uploaded successfully",
        error: false,
        data: { imageUrl: pictureUpload.secure_url },
      });
    } catch (error) {
      console.log("error on pictureUpload", error);
      res.status(500).json({
        message: "file not uploaded",
        error: true,
        data: null,
      });
    }
  }
};

const getProfile = async (req, res) => {
  console.log("profile from user");
  console.log("req get profile", req.user);
  const { user } = req;
  if (!user) {
    res.status(500).json({
      message: "you are not logged in and authorized",
      error: true,
      data: null,
    });
  }
  if (user) {
    res.status(200).json({
      message: "request successful",
      error: false,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          userpicture: user.userpicture,
        },
      },
    });
  }
};

export {
  test,
  getAllUsers,
  findUserByEmail,
  signup,
  login,
  updateUser,
  uploadPicture,
  getProfile,
};
