import express, { Request, Response } from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng 'message'." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it", // mô hình GLM-4.6 hoặc Gemma
        messages: [
          {
            role: "system",
            content:
              "Bạn là một trợ lý thân thiện, thông minh, luôn trả lời bằng tiếng Việt tự nhiên, dễ hiểu.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Lỗi phản hồi OpenRouter:", text);
      return res.status(response.status).json({ error: "Phản hồi không hợp lệ từ OpenRouter." });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Lỗi kết nối tới OpenRouter:", error);
    res.status(500).json({ error: "Không thể kết nối tới OpenRouter." });
  }
});

export default router;
