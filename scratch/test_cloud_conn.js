require('dotenv').config();
const db = require('../config/database');

async function test() {
    try {
        console.log('Testing connection to:', process.env.DB_HOST);
        const [rows] = await db.query('SHOW TABLES');
        console.log('Tables found:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

test();
