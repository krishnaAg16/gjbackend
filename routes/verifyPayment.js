import express from 'express';
import db from '../db/connection.js';
import { sendConfirmationEmail } from '../services/emailSender.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { tid, amount } = req.body;

  try {
    // 1. Fetch transaction
    const txnResult = await db.query(
      'SELECT * FROM transactions WHERE tid = $1',
      [tid]
    );

    if (txnResult.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const txn = txnResult.rows[0];

    // 2. Validate status and amount
    if (txn.status === 'paid') {
      return res.status(400).json({ error: 'Transaction already verified' });
    }

    if (txn.amount !== parseInt(amount)) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // 3. Insert into participant_events for each event
    for (const eventId of txn.events) {
      await db.query(
        `INSERT INTO participant_events (participant_id, event_id, tid)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`, // avoids duplicate inserts if retried
        [txn.participant_id, eventId, tid]
      );
    }

    // 4. Mark transaction as paid
    await db.query(
      `UPDATE transactions SET status = 'paid' WHERE tid = $1`,
      [tid]
    );

    // 5. Fetch participant details
    const participantRes = await db.query(
      'SELECT * FROM participants WHERE participant_id = $1',
      [txn.participant_id]
    );

    const participant = participantRes.rows[0];

    // 6. Fetch event names
    const eventNamesRes = await db.query(
      `SELECT e.event_name FROM participant_events pe
       JOIN events e ON pe.event_id = e.event_id
       WHERE pe.participant_id = $1 AND pe.tid = $2`,
      [txn.participant_id, tid]
    );

    const eventNames = eventNamesRes.rows.map(row => row.event_name).join(', ');
    console.log(eventNames)

    // 7. Send confirmation email
    await sendConfirmationEmail({
      email: participant.email,
      name: participant.name,
      id: participant.participant_id,
      events: eventNames
    });

    // 8. Response
    res.json({
      success: true,
      message: 'Payment verified and participant registered successfully'
    });

  } catch (err) {
    console.error('Payment Verification Error:', err);
    res.status(500).json({ error: 'Something went wrong during verification' });
  }
});

export default router;
