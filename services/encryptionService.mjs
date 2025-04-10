// encryptionService.mjs
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from('developbykrishnadevkrishnadev32b', 'utf-8');
const iv = Buffer.from('krishnadevrules!', 'utf-8');


export function encrypt(text) {
    if (typeof text !== 'string') {
        console.error('ENCRYPTION ERROR: Input is not a string:', text);
        throw new Error('Encryption input must be a string');
    }
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
