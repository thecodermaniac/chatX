import express from "express";
import "dotenv/config";
const app = express();
import cors from "cors";
import createWebSocketServer from "./wsServer.js";
import MongooseConnection from "./db/dbConnection.js";
import userRoute from "./routes/userRoutes.js";

MongooseConnection();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoute);
app.get("/", (req, res) => {
  res.send("lol");
});

const server = app.listen(process.env.PORT, function () {
  console.log(`Application is running ${process.env.PORT}`);
});

createWebSocketServer(server);
