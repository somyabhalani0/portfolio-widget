const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'https://somyabhalani-portfolio.vercel.app' }));
app.use(express.json());

// Securely store the API key on the backend
const API_KEY = "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";

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.2-11b-vision-instruct',
        messages: req.body.messages,
        max_tokens: 512,
        temperature: 1,
        top_p: 1,
        stream: false
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
        return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://somyabhalani-portfolio.vercel.app`);
});

