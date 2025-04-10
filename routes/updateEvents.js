// routes/updateEvents.js
import express from 'express';
import { generateQR } from '../services/qrService.js';
import { encrypt } from '../services/encryptionService.mjs';
import { generateAmount } from '../services/amService.js';
import db from '../db/connection.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { participant_id, events } = req.body;

    try {


        const participantResult = await db.query(
            'SELECT * FROM participants WHERE participant_id = $1',
            [participant_id]
        );

        if (participantResult.rowCount === 0)
            return res.status(404).json({ error: 'Participant not found' });

        const participant = participantResult.rows[0];
        const amount = await generateAmount({ events });

        const { qrUrl, selectedUPI } = await generateQR({
            name: participant.name,
            amount,
            note: `Fest - ${participant_id}`
        });

        res.json({
            success: true,
            encrypted: encrypt(JSON.stringify(events)),
            id: participant_id,
            amount,
            qrUrl,
            ipu: encrypt(selectedUPI)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

export default router;
