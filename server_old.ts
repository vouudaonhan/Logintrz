import express from "express";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Supabase Config ---
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// --- Static Frontend (React/Vite build) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist"))); // phục vụ build React

// --- API 1: Chatbot GLM-4.6 ---
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
    console.error("❌ Lỗi Hugging Face:", err);
    res.status(500).json({ error: "Lỗi máy chủ (chatbot)." });
  }
});

// --- API 2: Lấy link video từ Supabase ---
app.get("/api/video", async (req, res) => {
  const fileName = req.query.file || "Chiyonoo.mp4"; // có thể truyền ?file=ten.mp4
  const { data, error } = await supabase.storage
    .from("music")
    .createSignedUrl(fileName as string, 3600); // 1h

  if (error) {
    console.error("❌ Lỗi Supabase:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ url: data?.signedUrl });
});

// --- Fallback cho React router ---
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- Chạy server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
