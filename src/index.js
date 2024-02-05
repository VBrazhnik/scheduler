const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const router = require('./api');
const scheduler = require('./scheduler');
const logger = require('./logger')('main');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(router);

scheduler.start().then(() => {
    logger.info('Scheduler started');
});

app.listen(config.API_PORT, () => {
    logger.info(`Web-server is listening on port ${config.API_PORT}`);
});
