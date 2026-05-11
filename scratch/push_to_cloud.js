require('dotenv').config();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function migrate() {
    try {
        console.log('Reading SQL file...');
        const sqlPath = path.join(__dirname, '../database/koperasi_desa_sukadalem.sql');
        let content = fs.readFileSync(sqlPath, 'utf8');

        console.log('Filtering SQL (Removing Triggers, Delimiters, and DEFINERs)...');

        // 1. Remove entire blocks between DELIMITER $$ and DELIMITER ;
        let sql = content.replace(/DELIMITER \$\$[\s\S]*?DELIMITER ;/g, '');

        // 2. Remove any standalone CREATE TRIGGER statements
        sql = sql.replace(/CREATE TRIGGER[\s\S]*?;/g, '');

        // 3. Remove DEFINER clauses (Crucial for Cloud DBs)
        // Matches DEFINER=`user`@`host` or DEFINER=user@host
        sql = sql.replace(/\/\*!50013 DEFINER=[\s\S]*?\*\/ /g, '');
        sql = sql.replace(/DEFINER=`[^`]+`@`[^`]+`/g, '');
        sql = sql.replace(/DEFINER=[^\s]+ /g, '');

        // 4. Remove leftover $$ marks
        sql = sql.replace(/\$\$/g, '');

        console.log('Connecting to cloud database...');
        const mysql = require('mysql2/promise');
        const tempConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            multipleStatements: true,
            ssl: { rejectUnauthorized: false }
        });

        console.log('Wiping existing tables...');
        await tempConn.query('SET foreign_key_checks = 0;');
        const [tables] = await tempConn.query('SHOW TABLES');
        for (let table of tables) {
            const tableName = Object.values(table)[0];
            await tempConn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
            await tempConn.query(`DROP VIEW IF EXISTS \`${tableName}\``);
        }
        await tempConn.query('SET foreign_key_checks = 1;');

        console.log('Disabling sql_require_primary_key...');
        await tempConn.query('SET SESSION sql_require_primary_key = 0;');

        console.log('Executing migration (Final Version)...');
        await tempConn.query(sql);

        console.log('Migration successful!');
        await tempConn.end();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
