const express = require('express');

const app = express();

app.get('/test', (req, res) => {
    res.json({
        time: new Date().toISOString(),
        node: process.version
    });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
