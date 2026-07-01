const Database = require('better-sqlite3');

const db = new Database(':memory:');
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    od_rx TEXT,
    os_rx TEXT,
    amount REAL NOT NULL,
    method TEXT NOT NULL CHECK(method IN ('cash', 'card', 'insurance', 'gcash')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'failed')),
    notes TEXT,
    items TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY,
    payment_id TEXT NOT NULL UNIQUE,
    receipt_number TEXT NOT NULL UNIQUE,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    generated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
  );
`);

module.exports = db;
