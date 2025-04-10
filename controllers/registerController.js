import db from '../db/connection.js';
import { generateQR } from '../services/qrService.js';
import { generateAmount } from '../services/amService.js';
import { encrypt } from '../services/encryptionService.mjs';

export const registerParticipant = async (req, res) => {
    const { name, email, phone, college, events } = req.body;

    try {
        const totalAmount = await generateAmount({ events });

        const participantId = 'PART' + Math.floor(100000 + Math.random() * 900000);

        // console.log("Amount: ", totalAmount)
        await db.query(
            'INSERT INTO participants (participant_id, name, email, phone, college) VALUES ($1, $2, $3, $4, $5)',
            [participantId, name, email, phone, college]
        );

        const { qrUrl, selectedUPI } = await generateQR({
            name,
            amount: totalAmount,
            note: `Fest - ${participantId}`
        });


        // console.log('EVENTS:', events);
        // console.log('JSON STRINGIFIED:', JSON.stringify(events));
        // console.log('SELECTED UPI:', selectedUPI);

        res.json({
            success: true,
            encrypted: encrypt(JSON.stringify(events)),
            id: participantId,
            amount: totalAmount,
            qrUrl,
            ipu: encrypt(selectedUPI)
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
