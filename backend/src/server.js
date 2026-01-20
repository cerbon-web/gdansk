const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple API endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Mosque of Gdansk',
    description: 'Islamic Cultural Centre in Gdansk - API for site metadata',
    year: 2026
  });
});

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
