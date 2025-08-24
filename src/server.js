'use strict';

require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const { ConnectSessionKnexStore } = require('connect-session-knex');
const helmet = require('helmet');
const compression = require('compression');
const db = require('./db');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Security and performance
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
const store = new ConnectSessionKnexStore({
  knex: db,
  tablename: 'sessions',
  createtable: true,
});

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);

// Locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.baseUrl = process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || 3000);
  res.locals.siteName = process.env.SITE_NAME || 'Sanoria.pk';
  next();
});

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Health check
app.get('/healthz', (req, res) => res.json({ ok: true }));

// 404 handler
app.use((req, res) => {
  res.status(404).render('home', { title: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).render('home', { title: 'Error', error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Sanoria server running on http://localhost:${port}`);
});
