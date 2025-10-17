import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist"))); // build React

// API proxy
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "zai-org/GLM-4.6",
        messages: [
          { role: "system", content: "Bạn là trợ lý AI thân thiện, trả lời tự nhiên." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
});

// Fallback cho React router
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 10000, () =>
  console.log(`✅ Server chạy tại cổng ${process.env.PORT || 10000}`)
);
