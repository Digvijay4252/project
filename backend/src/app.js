const path = require('path');
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors({ origin: process.env.APP_ORIGIN || '*' }));
try {
  // Keep request logging enabled when dependency is present.
  const morgan = require('morgan');
  app.use(morgan('dev'));
} catch (error) {
  console.warn('morgan not installed, request logging disabled');
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
