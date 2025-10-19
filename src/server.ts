import express from "express";
import chatRoute from "./api/chat.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());

// Route API
app.use("/api/chat", chatRoute);

// Nếu bạn muốn build frontend React trong cùng dự án:
app.use(express.static(path.join(process.cwd(), "dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
