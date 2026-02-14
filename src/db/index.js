const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require('../config');

// ensure data dir exists
const dataDir = path.dirname(config.dbFile);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let dbPromise = null;
async function getDb() {
	if (!dbPromise) {
		dbPromise = open({ filename: config.dbFile, driver: sqlite3.Database });
	}
	return dbPromise;
}

module.exports = { getDb };
