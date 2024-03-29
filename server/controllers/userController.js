import { User } from "../models/UserModels.js";
import { Connect } from "../models/requestModel.js";
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

export async function CreateConnection(req, res) {
  try {
    const oldConnect1 = await Connect.find({
      $and: [{ user1Id: req.body.sender }, { user2Id: req.body.receiver }],
    });
    const oldConnect2 = await Connect.find({
      $and: [{ user2Id: req.body.sender }, { user1Id: req.body.receiver }],
    });
    console.log(oldConnect1.length || oldConnect2.length !== 0);
    if (oldConnect1.length || oldConnect2.length !== 0) {
      const error = new Error("Connection already exits");
      error.code = 409;
      throw error;
    }
    const newConnect = new Connect({
      user1Id: req.body.sender,
      user2Id: req.body.receiver,
    });

    await newConnect.save();
    res.status(201).send({
      commonId: newConnect._id,
    });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}

export async function getConnection(req, res) {
  try {
    const specificUserId = req.params.usId;
    console.log(specificUserId);
    const list = await Connect.aggregate([
      {
        $match: {
          $or: [{ user1Id: specificUserId }, { user2Id: specificUserId }],
          isaccept: true,
        },
      },
      {
        $lookup: {
          from: "userxes",
          localField: "user1Id",
          foreignField: "userId",
          as: "user1",
        },
      },
      {
        $lookup: {
          from: "userxes",
          localField: "user2Id",
          foreignField: "userId",
          as: "user2",
        },
      },
      {
        $unwind: "$user1",
      },
      {
        $unwind: "$user2",
      },
      {
        $project: {
          _id: 1,
          user1: {
            userName: "$user1.userName",
            userId: "$user1.userId",
          },
          user2: {
            userName: "$user2.userName",
            userId: "$user2.userId",
          },
        },
      },
    ]);

    res.status(200).send({ list: list });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}

export async function getRequestList(req, res) {
  try {
    const user2 = req.params.usId;
    const reqList = await Connect.aggregate([
      {
        $match: {
          $and: [{ user2Id: user2 }, { isaccept: false }],
        },
      },
      {
        $lookup: {
          from: "userxes",
          localField: "user1Id",
          foreignField: "userId",
          as: "user1",
        },
      },
      {
        $unwind: "$user1",
      },
      {
        $project: {
          _id: 1,
          user1: {
            userName: "$user1.userName",
            userId: "$user1.userId",
          },
        },
      },
    ]);
    res.status(200).send({
      requestList: reqList,
    });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}

export async function acceptRequest(req, res) {
  try {
    const updateRes = await Connect.findByIdAndUpdate(req.body.ConId, {
      isaccept: true,
    });
    if (!updateRes) {
      const error = new Error("No such request found");
      error.code = 404;
      throw error;
    }
    res.status(200).send({ message: "Request accepted" });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}

export async function deleteRequest(req, res) {
  try {
    const deleteRes = await Connect.findByIdAndDelete(req.body.ConId);
    if (!deleteRes) {
      const error = new Error("Nothing to reject");
      error.code = 404;
      throw error;
    }
    res.status(200).send({ message: "Request Deleted" });
  } catch (error) {
    res.status(500 || error.code).send({ message: error.message });
  }
}
