const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');

const app = express();

mongoose.set('strictQuery', false);

logger.info('connecting to mongodb');

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to mongodb');
	})
	.catch((error) => {
		logger.error('error connecting to mongodb:', error.message);
	});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
