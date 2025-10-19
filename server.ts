import express from "express";
import { createClient } from "@supabase/supabase-js";
// Cần cài đặt 'node-fetch' (npm install node-fetch) vì đây là môi trường Node.js ES module
import fetch from "node-fetch"; 
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Khởi tạo dotenv để tải biến môi trường (SUPABASE_URL, HF_TOKEN, v.v.)
dotenv.config();

// Cấu hình ES Module path để làm việc với __dirname trong môi trường ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Khởi tạo Express App
const app = express();
const PORT = process.env.PORT || 10000; // Sử dụng cổng 10000 làm mặc định

// --- Middlewares ---
app.use(cors()); // Cho phép truy cập từ các domain khác (quan trọng cho frontend)
app.use(express.json()); // Phân tích body JSON từ request

// --- Supabase Config ---
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Kiểm tra xem biến môi trường Supabase đã được thiết lập chưa
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ LỖI: Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// --- ROUTE API ---

// 1. API Chatbot sử dụng GLM-4.6 từ Hugging Face
app.post("/api/chat", async (req, res) => {
  const { message: userMessage } = req.body;
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!userMessage) {
    return res.status(400).json({ error: "Thiếu nội dung tin nhắn." });
  }
  if (!HF_TOKEN) {
    console.error("❌ LỖI: Thiếu HF_TOKEN trong .env");
    return res.status(500).json({ error: "Lỗi cấu hình server (token AI)." });
  }

  console.log(`💬 Yêu cầu Chat từ người dùng: ${userMessage.substring(0, 50)}...`);

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "zai-org/GLM-4.6",
        messages: [
          { role: "system", content: "Bạn là trợ lý AI thân thiện, trả lời tự nhiên bằng tiếng Việt." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Lỗi API Hugging Face:", response.status, errorData);
        return res.status(response.status).json({ error: "Lỗi từ dịch vụ AI bên ngoài.", details: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi trong quá trình gọi Hugging Face:", err);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ (chatbot)." });
  }
});

// 2. API Lấy link video đã ký tên (Signed URL) từ Supabase Storage
app.get("/api/video", async (req, res) => {
  // Lấy tên file từ query string, mặc định là "Chiyonoo.mp4"
  const fileName = (req.query.file as string) || "Chiyonoo.mp4"; 
  
  console.log(`🎥 Yêu cầu link video: ${fileName}`);

  // Tạo URL đã ký tên, thời hạn 1 giờ (3600 giây). Thay "music" bằng tên bucket của bạn.
  const { data, error } = await supabase.storage
    .from("music") 
    .createSignedUrl(fileName, 3600); 

  if (error) {
    console.error("❌ Lỗi Supabase Storage:", error.message);
    // Có thể là file không tồn tại, hoặc lỗi quyền truy cập
    return res.status(500).json({ error: `Lỗi khi lấy link video từ Supabase: ${error.message}` });
  }

  // Trả về URL tạm thời
  res.json({ url: data?.signedUrl });
});


// --- Phục vụ Frontend (Static Files) ---
// Phục vụ các file tĩnh (HTML, CSS, JS) từ thư mục 'dist' (React/Vite build)
app.use(express.static(path.join(__dirname, "dist")));

// Fallback Route: Trả về index.html cho mọi route không phải API
// Quan trọng cho việc sử dụng React Router ở phía frontend
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- Chạy Server ---
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`   Sử dụng môi trường ES Module.`);
});

