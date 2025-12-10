const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const { OpenAI } = require('openai');
const Trip = require('../../models/Trip');
const User = require('../../models/User');

// Lazily create client to avoid crashing server if key is missing at boot
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};
// @route   Post api/trips/generate
// @desc    Generate a post
// @access  Private
router.post("/generate", async (req, res) => {
    const { prompt } = req.body;
  
  if (!prompt || !prompt.trim()) {
    return res.status(400).send('Prompt is required');
  }

  const openai = getOpenAI();
  if (!openai) {
    return res.status(500).send('Missing OpenAI API key');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `${prompt} Format your response using Markdown. Use headings, subheadings, bullet points, and bold to organize the information.`
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '';
    console.log(content);
    global_response = content;
    global_prompt = prompt; 
    res.send(content);
  } catch (err) {
    const status = err?.status || err?.response?.status;
    const msg =
      status === 429
        ? 'OpenAI quota exceeded. Check your OpenAI billing/plan.'
        : 'OpenAI request failed';
    console.error('OpenAI error:', err.message);
    res.status(status || 500).send(msg);
  }
  });

module.exports = router;
