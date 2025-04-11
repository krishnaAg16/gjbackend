// routes/stats.js
import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Get total participants
    const participantsResult = await db.query(`SELECT COUNT(*) FROM participant_events`);
    const participantCount = parseInt(participantsResult.rows[0].count);

    // Get unique event registrations
    const eventResult = await db.query(`SELECT COUNT(*) FROM events`);
    const eventCount = parseInt(eventResult.rows[0].count);

    res.status(200).json({
      success: true,
      total_registrations: participantCount,
      unique_events: eventCount
    });
  } catch (err) {
    console.error('Stats API Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

export default router;
