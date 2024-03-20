const config = require('../config/config');
const addressController = require('../controllers/AddressController');
const express = require('express');

const app = express();

// Task 1 - using plain Node.js callbacks 
app.get("/I/want/title", addressController.getWebsiteTitleUsingNode);

const server = app.listen(config.port, () => {
    console.info(`Server started on port ${config.port}.`);
});

server.on('error', (err) => {
    console.error('An error occurred while starting the server:', err);
});
