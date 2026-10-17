const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, process.env.DB_FILE || 'products.db'));

// Create the table if it does not exist
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// Add the sample records only when the table is empty
const row = db.prepare('SELECT COUNT(*) AS n FROM products').get();
if (row.n === 0) {
  db.exec(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'));
}

module.exports = db;