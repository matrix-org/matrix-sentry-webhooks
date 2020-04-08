const express = require('express');
const client = require('./client');
const routes = require('./routes');

// Config
require('dotenv').config();

// App
const app = express();
app.use(express.json());

// Initialize Matrix client
client.init();

// Routes
app.get('/', routes.getRoot);
app.post('/receive', routes.postEvents);

app.listen(process.env.APP_PORT || 3000, () => {});
