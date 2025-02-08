import express from "express";
import "dotenv/config";
const app = express();
import cors from "cors";
import createWebSocketServer from "./wsServer.js";
import MongooseConnection from "./db/dbConnection.js";
import userRoute from "./routes/userRoutes.js";
import webpush from "web-push"

MongooseConnection();
app.use(express.json());
app.use(cors());

const subscriptions = new Map();

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_KEY_PUBLIC,
  process.env.VAPID_KEY_PRIVATE
);

app.use("/api/user", userRoute);
app.get("/", (req, res) => {
  res.send("lol");
});

app.post("/subscribe", (req, res) => {
  const { userId, subscription } = req.body;
  subscriptions.set(userId, subscription);
  res.status(201).json({ message: "Subscribed successfully!" });
});

const server = app.listen(process.env.PORT, function () {
  console.log(`Application is running ${process.env.PORT}`);
});

createWebSocketServer(server, webpush);
