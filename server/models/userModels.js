import mongoose, { Mongoose } from "mongoose";
import { nanoid } from "nanoid";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: String },
});

userSchema.index({ userId: 1 });

userSchema.pre("save", function (next) {
  this.userId = nanoid(10);
  const salt = bycrypt.genSaltSync(Number(process.env.ROUNDS));
  const hashPassword = bycrypt.hashSync(this.password, salt);
  this.password = hashPassword;
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { email: this.email, password: this.password },
    process.env.JWTSECRECT,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

export const User = mongoose.model("UserX", userSchema);
