const config = require('../config/config');

const express = require('express');
const app = express();

app.listen(config.port, () => {
    console.info(`Server started on port ${config.port}.`);
  }).on('error', (err) => {
    console.error('An error occurred while starting the server:', err);
});
