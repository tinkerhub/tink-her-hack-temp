const logger = require('../logger');

function errorHandler(err, req, res, next) {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
}

module.exports = errorHandler;
