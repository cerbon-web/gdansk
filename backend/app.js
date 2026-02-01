const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

// Simple file logger: append console output to backend.log next to this file
try {
    const LOG_PATH = path.join(__dirname, 'backend.log');
    const logStream = fs.createWriteStream(LOG_PATH, { flags: 'a' });
    const origLog = console.log.bind(console);
    const origError = console.error.bind(console);

    function serializeArgs(args) {
        return args.map(a => {
            if (typeof a === 'string') return a;
            try { return JSON.stringify(a); } catch (e) { return String(a); }
        }).join(' ');
    }

    console.log = (...args) => {
        try { logStream.write(new Date().toISOString() + ' [LOG] ' + serializeArgs(args) + '\n'); } catch (e) { /* ignore */ }
        origLog(...args);
    };
    console.error = (...args) => {
        try { logStream.write(new Date().toISOString() + ' [ERR] ' + serializeArgs(args) + '\n'); } catch (e) { /* ignore */ }
        origError(...args);
    };

    process.on('exit', () => { try { logStream.end(); } catch (e) {} });
    process.on('uncaughtException', (err) => { try { console.error('uncaughtException', err); } finally { process.exit(1); } });
} catch (e) {
    // if logging setup fails, continue without file logging
}

// Database files (use the specific required database name)
const DB_NAME = 'rnwhnxpk_cerbon';
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

async function initDatabase(cb) {
    // connection params from env with sensible defaults
    const DB_HOST = process.env.DB_HOST || '127.0.0.1';
    const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
    const DB_USER = process.env.DB_USER || 'rnwhnxpk_cerbon';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'eunckdPQpEL3F9Fz5RHu';

    try {
        // connect without database to ensure DB exists
        const adminConn = await mysql.createConnection({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD, multipleStatements: true });
        await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await adminConn.end();

        // create pool for app
        const pool = mysql.createPool({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD, database: DB_NAME, waitForConnections: true, connectionLimit: 10, multipleStatements: true });

        // check for CREATED table
        const [rows] = await pool.query("SHOW TABLES LIKE 'CREATED'");
        if (rows.length) {
            console.log('Database already initialized.');
            return cb(null, pool);
        }

        // read and run schema
        const sql = fs.readFileSync(SCHEMA_FILE, 'utf8');
        await pool.query(sql);
        await pool.query("INSERT INTO CREATED(created_at) VALUES (NOW())");
        console.log('Database initialized from schema.sql');
        return cb(null, pool);
    } catch (e) {
        return cb(e);
    }
}

function startServer(db) {
    // attach db to app locals for later use
    app.locals.db = db;
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
}

// Simple CORS middleware to allow requests from the frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

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

// Initialize DB and start server
initDatabase((err, db) => {
    if (err) {
        console.error('Failed to initialize database', err);
        process.exit(1);
    }
    startServer(db);
});
