import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// KHÔNG bao giờ đưa key này ra client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// API: trả về signed URL video (hết hạn sau 1h)
app.get("/api/video", async (req, res) => {
  const fileName = "song1.mp4"; // bạn có thể đổi thành query param
  const { data, error } = await supabase
    .storage
    .from("music")
    .createSignedUrl(fileName, 3600);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ url: data?.signedUrl });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend chạy tại http://localhost:${PORT}`);
});
