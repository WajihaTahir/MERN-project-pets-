import { isValidObjectId } from "mongoose";
import UserModel from "../models/userModel.js";

const test = (req, res) => {
  res.send("testing successful");
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find({}).select("-password"); //find everything
    res.status(200).json(allUsers);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({ error: "server error" });
  }
};

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

const signup = async (req, res) => {
  console.log(req.body);
  const { email, password, username } = req.body;
  if (!email | !password)
    return res.status(400).json({ error: "All fields must be included" });

  try {
    const newUser = await UserModel.create({ email, password, username });
    console.log(newUser);
    if (newUser) res.status(201).json(newUser);
    else res.status(400).json({ error: "user couldn't be created" });
  } catch (error) {
    if (error.code === 11000)
      res.status(400).json({ error: "Email already registered" });
    console.log(error);
    res.status(500).json({ error: "something went wrong..." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields must be included" });
  try {
    const foundUser = await UserModel.findOne({ email: email });
    if (!foundUser)
      return res.status(404).json({ error: "no user with that email" });
    if (foundUser.password === password) {
      const user = {
        _id: foundUser._id,
        email: foundUser.email,
        username: foundUser.username,
        createdAt: foundUser.createdAt,
      };
      return res.status(200).json(user);
    } else return res.status(400).json({ error: "password incorrect" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const valid = isValidObjectId(id);
  console.log(valid);
  if (!valid) return res.status(400).json({ error: "invalid id" });
  if (!id) return res.status(400).json({ error: "id is missing" });
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }); //to get the updated version
    if (!updatedUser) return res.status(404).json({ error: "user not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export { test, getAllUsers, findUserByEmail, signup, login, updateUser };
