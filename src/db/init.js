const { getDb } = require('./index');
const path = require('path');
const logger = require('../logger');

async function runMigrations() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS itineraries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      destination TEXT NOT NULL,
      days INTEGER NOT NULL,
      priorities TEXT NOT NULL,
      items TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_itineraries_user ON itineraries(user_id);
  `);

  logger.info('Database initialized and migrations run');
}

if (require.main === module) {
  (async () => {
    try {
      await runMigrations();
      console.log('DB initialized at', path.resolve());
    } catch (err) {
      console.error('Failed to init DB', err);
      process.exit(1);
    }
  })();
}

module.exports = { runMigrations };
