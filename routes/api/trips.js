const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const {OpenAI} = require('openai');
const Trip = require('../../models/Trip');
const User = require('../../models/User');

const openai = new OpenAI({
    apiKey: 'API_KEY_HERE',
});
// @route   Post api/trips/generate
// @desc    Generate a post
// @access  Private
router.post("/generate", async (req, res) => {
    const { prompt } = req.body;
  
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": prompt +  "Format your response using Markdown. Use headings, subheadings, bullet points, and bold to organize the information."
        }
      ]
    });
    console.log(completion.choices[0].message.content);
    global_response = completion.choices[0].message.content;
    global_prompt = prompt; 
    res.send(completion.choices[0].message.content);
  });

module.exports = router;
