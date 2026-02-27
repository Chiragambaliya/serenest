const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'serenest.db');
const db = new Database(dbPath);

// Enable WAL for better concurrent read performance
db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      specialist TEXT NOT NULL,
      session_type TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      reaching_out_as TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS doctor_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      specialty TEXT NOT NULL,
      years_experience TEXT NOT NULL,
      introduction TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  console.log('Database initialized at', dbPath);
}

module.exports = { db, initDb };
