import express from "express";
import connectDB from "./db/mongodb.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/UserRoutes.js";
import cors from "cors";
import shopRouter from "./routes/shopRoutes.js";
import productRouter from "./routes/productRoutes.js";
import eventsRouter from "./routes/eventRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
import withdrawRouter from "./routes/withdrawRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS — allow any localhost port in development
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
      ].filter(Boolean);

      const isLocalhost =
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/localhost:\d+$/.test(origin);

      if (allowedOrigins.includes(origin) || isLocalhost) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "./uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/v2/user", userRouter);
app.use("/api/v2/seller", shopRouter);
app.use("/api/v2/product", productRouter);
app.use("/api/v2/events", eventsRouter);
app.use("/api/v2/coupons", couponRouter);
app.use("/api/v2/payment", stripeRouter);
app.use("/api/v2/order", orderRouter);
app.use("/api/v2/conversation", conversationRouter);
app.use("/api/v2/messages", messagesRouter);
app.use("/api/v2/withdraw-request", withdrawRouter);
app.use("/api/v2/ai", aiRouter);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    if (process.env.SEED_DB === "true") {
      const { seedDatabase } = await import("./scripts/seed.js");
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  })
  .catch(error => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });