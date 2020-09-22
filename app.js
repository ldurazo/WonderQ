const express = require('express');
const indexRouter = require('./routes/index');
const http = require('http');

const app = express();

const port = '3000';

/**
 * Set ports and server
 */
app.set('port', port);
const server = http.createServer(app);
server.listen(port);

/**
 * Middleware setup
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Route setup
 */
app.use('/', indexRouter);

/**
 * Error handling, last resort middleware
 */
app.use((err, req, res) => {
  res.status(404);

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

module.exports = app;
