import express from "express";
import {
  registerUser,
  verifyEmail,
  logout,
  login,
  forgotPassword,
  resetPassword,
} from "../../controllers/user/userController.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/verify").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

export default router;
