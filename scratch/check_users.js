require('dotenv').config();
const db = require('../config/database');

async function check() {
    try {
        const [rows] = await db.query('SELECT id, username, password, role FROM users');
        console.log('Users found:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
