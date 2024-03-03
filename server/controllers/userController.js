import { User } from "../models/UserModels.js";
import bycrypt from "bcrypt";

export async function UserLogin(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error("Invalid email");
      error.code = 401;
      throw error;
    }
    const validPassword = bycrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid password");
      error.code = 401;
      throw error;
    }
    const token = user.generateAuthToken();
    res.status(200).send({
      loginToken: token,
      userName: user.userName,
      userId: user.userId,
    });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}

export async function UserRegister(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const error = new Error("User already exists. Try login");
      error.code = 409;
      throw error;
    }
    user = new User({
      email: req.body.email,
      userName: req.body.name,
      password: req.body.password,
    });
    await user.save();
    res.status(201).send({ message: "Your profile is created" });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}
