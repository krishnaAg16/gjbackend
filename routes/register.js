import express from 'express';
import { registerParticipant } from '../controllers/registerController.js';
const router = express.Router();

router.post('/', registerParticipant);

export default router;
