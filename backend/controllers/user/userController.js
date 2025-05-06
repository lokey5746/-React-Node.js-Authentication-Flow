import asyncHandler from "express-async-handler";
import User from "../../models/user/userModel.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../../utilis/sendMails.js";
import { hashPassword, verifyPassword } from "../../utilis/helpers.js";
import generateToken from "../../utilis/generateToken.js";

// @desc  Register User
// @route POST /api/v1/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      throw new Error("All feild are required");
    }

    //   check is user exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("Email already taken");
    }
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
      email,
      name,
      password: await hashPassword(password),
      verificationToken,
      //   expire set 24 hours
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    if (user) {
      // jwt
      generateToken(res, user._id);

      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        status: "success",
        message: "user register sucessfully",
        data: user,
        token: generateToken(res, user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User data");
    }

    // jwt
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc  Verify User
// @route POST /api/users/verify
// @access Public
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc  Login User
// @route POST /api/users/login
// @access Public

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check email exist
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("email not exist");
    }
    // verify password
    const isMatched = await verifyPassword(password, user.password);
    if (!isMatched) {
      throw new Error("invalid login ceredentials");
    }
    generateToken(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
// @desc  Logout User
// @route POST /api/users/logout
// @access Public
const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export { registerUser, verifyEmail, logout, login };
