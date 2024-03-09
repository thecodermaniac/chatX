import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user1Id: { type: String, required: true, ref: "UserX" },
  user2Id: { type: String, required: true, ref: "UserX" },
  isaccept: { type: Boolean, required: true, default: false },
});

export const Connect = mongoose.model("RequestX", requestSchema);
