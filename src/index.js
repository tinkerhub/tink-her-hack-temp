const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const routes = require('./routes');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./logger');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.use('/api', routes);

// Serve the chosen frontend file at root (index9.html in project root)
app.get('/', (req, res) => {
	res.sendFile(path.join(process.cwd(), 'index.html'));
});

// static serving for frontend files (serve other assets from project root)
app.use(express.static(process.cwd()));

app.use(errorHandler);

module.exports = app;
