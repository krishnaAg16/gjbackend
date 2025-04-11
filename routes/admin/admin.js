import express from 'express';
import db from '../../db/connection.js';
import viewRoutes from './viewAll.js'; // Correct import path and name

const router = express.Router();

// Admin: Add Event API
router.post('/addEvent', async (req, res) => {
    const { event_name, committee, price } = req.body;

    if (!event_name || !committee || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Invalid input: event_name, committee, and valid price are required.' });
    }

    try {
        const result = await db.query(
            `INSERT INTO events (event_name, committee, price) VALUES ($1, $2, $3) RETURNING *`,
            [event_name.trim(), committee.trim(), price]
        );

        return res.status(201).json({
            success: true,
            message: 'Event added successfully',
            event: result.rows[0]
        });
    } catch (err) {
        console.error('Add Event Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.use('/view', viewRoutes);

export default router;


