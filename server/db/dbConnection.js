import mongoose from "mongoose";

export default async function MongooseConnection() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log(error);
    console.log("COULD NOT CONNECT TO DB");
  }
}
