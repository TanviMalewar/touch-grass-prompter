const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const MODEL = "gemma3:1b"; // change here to swap models

app.post("/mission", async (req, res) => {
  const { weather, minutes, mood } = req.body;

  const prompt = `You are a friendly outdoor guide.
Weather: ${weather}. Time available: ${minutes} minutes. Mood: ${mood}.
Give ONE specific outdoor mini-mission in 3 short sentences.
It must need no phone and no screen. Be concrete and a little playful.`;

  try {
    const r = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt, stream: false }),
    });
    const data = await r.json();
    res.json({ mission: data.response });
  } catch (e) {
    res.status(500).json({
      mission: "Could not reach the local model. Is Ollama running?",
    });
  }
});

app.listen(3000, () => console.log("Open http://localhost:3000"));