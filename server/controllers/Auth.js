import userModel from "../models/Auth.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import CustomerNotificationModel from "../models/CustomerNotificationsForHome.js";

dotenv.config();

const JWT_TOKEN = process.env.JWT_TOKEN;

export const createAccount = async (req, res) => {
  const { username, password, fullname, role, property } = req.body;
  try {
    const existingUser = await userModel.findOne({ username: username });
    if (existingUser) {
      return res.status(500).json({
        message:
          "A user already exists with this username, use a different one!!",
      });
    }

    const newUser = new userModel({
      username: username,
      password: password,
      fullname: fullname,
      role: role,
      property: property,
    });
    const saveUser = await newUser.save();
    if (saveUser) {
      return res.status(201).json({
        message:
          "The account has been created successfully, Now you can login.",
        user: saveUser,
      });
    }
  } catch (error) {
    console.error("Failed to create the account due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to create the account, please try again!!" });
  }
};

export const checkLogin = async (req, res) => {
  const { loginusername, loginpassword } = req.body;
  try {
    const user = await userModel.findOne({ username: loginusername });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this username does not exist." });
    }

    const isPasswordTrue = await user.comparePassword(loginpassword);
    if (!isPasswordTrue) {
      return res.status(404).json({
        message:
          "The password or username you entered is incorrect, please use correct details to login!!",
      });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_TOKEN, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({ message: "Login successfull!!", token, user });
  } catch (error) {
    console.error("Failed to login due to : ", error);
    return res.status(500).json({
      message: "Failed to login with given details, please try again!!",
    });
  }
};

export const changeProfileInfo = async (req, res) => {
  const { userId } = req.query;
  const { newUsername, newFullName, newPassword } = req.body;
  if ((!newFullName, !newUsername, !newPassword)) {
    return res.status(400).json({
      message: "Please enter all the fields to correctly update your profile.",
    });
  }
  try {
    const existingUN = await userModel.findOne({ username: newUsername });
    if (existingUN) {
      return res.status(400).json({
        message: "This username is not available, please use a different one!!",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not found" });
    }
    const isPasswordMatch = await user.comparePassword(newPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message:
          "The password you entered is incorrect, please use a correct one for updation.",
      });
    }
    user.username = newUsername;
    user.fullname = newFullName;
    const saveUser = await user.save();

    const CustomerNofication = new CustomerNotificationModel({
      userId: userId,
      message: `You profile details has been changed recently`,
      type: "profile_changed",
    });

    await CustomerNofication.save();

    return res.status(200).json({
      message: "Your profile has been updated with new details!!",
      user: saveUser,
    });
  } catch (error) {
    console.error("Failed to update your profile due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to update your profile, please try again!!" });
  }
};
