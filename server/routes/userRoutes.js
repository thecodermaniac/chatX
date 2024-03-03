import express from "express";
import * as user from "../controllers/userController.js";
const router = express.Router();

router.post("/register", user.UserRegister);
router.post("/login", user.UserLogin);

export default router;
