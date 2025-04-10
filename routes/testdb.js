import express from 'express';
import db from '../db/connection.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'DB connection failed' });
    }
});

export default router;
