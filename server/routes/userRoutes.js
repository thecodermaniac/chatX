import express from "express";
import * as user from "../controllers/userController.js";
const router = express.Router();

router.post("/register", user.UserRegister);
router.post("/login", user.UserLogin);
router.post("/add-connection", user.CreateConnection);
router.get("/get-connection/:usId", user.getConnection);
router.get("/get-req-list/:usId", user.getRequestList);
router.put("/accept-request", user.acceptRequest);
router.delete("/reject-request", user.deleteRequest);

export default router;
