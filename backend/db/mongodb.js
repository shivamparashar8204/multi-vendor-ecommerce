import mongoose from "mongoose";

export function isPlaceholderMongoUrl(url) {
  if (!url) return true;
  return (
    url.includes("YOUR_USERNAME") ||
    url.includes("YOUR_PASSWORD") ||
    url.includes("<db_password>")
  );
}

async function connectDB() {
  mongoose.connection.on("connected", () => console.log("MongoDB connected!"));
  mongoose.connection.on("error", err =>
    console.error("MongoDB connection error:", err.message)
  );

  let mongoUrl = process.env.MONGODB_URL;

  if (isPlaceholderMongoUrl(mongoUrl)) {
    console.log("No valid MONGODB_URL found — starting in-memory MongoDB...");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    mongoUrl = mongod.getUri();
    global.__MONGOD = mongod;
  }

  await mongoose.connect(mongoUrl, { dbName: "e-shop" });
}

export default connectDB;
