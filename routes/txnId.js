import express from 'express';
import { decrypt } from '../services/encryptionService.mjs';
import { generateAmount } from '../services/amService.js';
import db from '../db/connection.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { participant_id, tid, encrypted, ipu } = req.body;

  try {
    const eventIds = JSON.parse(decrypt(encrypted));
    const upi = decrypt(ipu);
    console.log("EVENTS:" + eventIds + " UPI:" + upi)

    const amount = await generateAmount({ events: eventIds });

    await db.query(
      `INSERT INTO transactions (tid, participant_id, amount, upi, events) VALUES ($1, $2, $3, $4, $5)`,
      [tid, participant_id, amount, upi, JSON.stringify(eventIds)]
    );

    res.status(200).json({ success: true });

  } catch (err) {
    console.error('TxnID Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
