const app = require('./index');
const config = require('./config');
const logger = require('./logger');
const dbInit = require('./db/init');

const port = config.port;

async function start() {
  try {
    // Ensure DB structure
    await dbInit.runMigrations?.();

    app.listen(port, () => {
      logger.info(`Server listening on port ${port}`);
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    console.error(err);
    process.exit(1);
  }
}

start();
