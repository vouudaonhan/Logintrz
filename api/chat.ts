import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("OpenRouter error:", error);
    res.status(500).json({ error: "OpenRouter request failed" });
  }
});

export default router;
