import express from 'express';
import db from '../../db/connection.js';

const router = express.Router();


router.get('/participant', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM participants`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Participants Fetch Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/transaction', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM transactions`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Transactions Fetch Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/events', async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT * FROM events`);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Events Fetch Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/participant-event', async (req, res) => {
    try {
        const { rows } = await db.query(`
      SELECT pe.participant_id, pe.event_id, e.event_name, e.committee, t.tid
      FROM participant_events pe
      JOIN events e ON pe.event_id = e.event_id
      JOIN transactions t ON pe.tid = t.tid
    `);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Participant Events Fetch Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
