import asyncHandler from "express-async-handler";
import User from "../../models/user/userModel.js";

import {
  hashPassword,
  generateVerificationToken,
} from "../../utilis/helpers.js";

import generateToken from "../../utilis/generateToken.js";

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
    const user = await User.create({
      email,
      name,
      password: await hashPassword(password),
      verificationToken: generateVerificationToken(),
      //   expire set 24 hours
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    if (user) {
      generateToken(res, user._id);
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

export { registerUser };
