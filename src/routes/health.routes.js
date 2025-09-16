const express = require('express');
const routes = express.Router();

routes.get('/health', (req, res) => res.sendStatus(200));

module.exports = routes