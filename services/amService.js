import db from '../db/connection.js';

export const generateAmount = async ({ events }) => {


    if (!Array.isArray(events) || events.length === 0) return 0;

    const query = `
    SELECT SUM(price) AS total
    FROM events
    WHERE event_id = ANY($1)
  `;

    const result = await db.query(query, [events]);

    return parseInt(result.rows[0].total) || 0;
};
