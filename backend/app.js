const express = require('express');

const app = express();

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({
        time: new Date().toISOString(),
        node: process.version
    });
});

router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        routes: ['/test']
    });
});

// Configure mount path via BASE_PATH (e.g. "/gdansk"). Defaults to root ('/').
const rawBase = process.env.BASE_PATH;

if (rawBase && rawBase !== '/') {
    const basePath = '/' + String(rawBase).replace(/^\/+|\/+$/g, '');
    app.use(basePath, router);
    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}${basePath}/`);
    });
} else {
    // No BASE_PATH provided: mount router at root and also at a single-segment prefix
    // This lets the app respond to both `/test` and `/<prefix>/test` (e.g. `/gdansk/test`)
    app.use('/', router);
    app.use('/:prefix', router);

    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}/ (also available at /:prefix/)`);
    });
}
