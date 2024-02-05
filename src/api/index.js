const express = require('express');
const echoAtTime = require('./controllers/echo-at-time');

const router = express.Router();

router.post('/echoAtTime', echoAtTime);

module.exports = router;
