import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./api/chat.ts";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Gắn route chat
app.use("/api/chat", chatRouter);

// Test route (tùy chọn)
app.get("/", (req, res) => {
  res.send("✅ Server đang hoạt động!");
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));
