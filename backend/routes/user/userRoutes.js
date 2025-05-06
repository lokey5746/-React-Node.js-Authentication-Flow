import express from "express";
import {
  registerUser,
  verifyEmail,
  logout,
  login,
} from "../../controllers/user/userController.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(login);
router.route("/verify").post(verifyEmail);
router.route("/logout").post(logout);

export default router;
