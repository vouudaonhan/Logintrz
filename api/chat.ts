import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it",
        messages: [
          { role: "system", content: "Bạn là một trợ lý thân thiện và thông minh, trả lời bằng tiếng Việt." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ OpenRouter Error:", error);
    res.status(500).json({ error: "Lỗi kết nối tới OpenRouter." });
  }
});

export default router;
