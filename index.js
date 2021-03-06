const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('app:server');

const dequeueNotes = require('./utils/dequeueNotes');
const boom = require('@hapi/boom');
const { initDB } = require('./utils/db');
const {
  logErrors,
  wrapErrors,
  clientErrorHandler
} = require('./utils/middlewares/errorsHandlers');

const {
  authRouter,
  institutionRouter,
  codeNoteRouter,
  codeYearRouter,
  noteRouter,
  userRouter
} = require('./routes');

// middleware
app.use(bodyParser.json({ limit: '500mb' }));

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, PUT, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  next();
});

// static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// routes
app.use('/auth', authRouter);
app.use('/institutions', institutionRouter);
app.use('/code_notes', codeNoteRouter);
app.use('/code_years', codeYearRouter);
app.use('/notes', noteRouter);
app.use('/users', userRouter);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);

// not found
app.use((req, res, next) => {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  res.status(statusCode).json(payload);
});

(async function() {
  // database connect
  await initDB();
  // server
  dequeueNotes();
  const port = process.env.PORT || 3000;

  const server = app.listen(port, function() {
    debug(`Listening http://localhost:${server.address().port}`);
  });
})();
