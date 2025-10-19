const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Khởi tạo OpenAI client cho OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,  // Lưu key trong .env
});

// Route cho chat completion
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemma-2-9b-it:free',  // Gemma-2-9B free tier
      messages: [
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Lỗi khi gọi API' });
  }
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
