const config = require('../config/config');
const addressController = require('../controllers/AddressController');
const express = require('express');

const app = express();

// Task 1 - using plain Node.js callbacks 
app.get("/I/want/title/usingNode/", addressController.getWebsiteTitleUsingNode);

// Task 2 - using async.js (flow library)
app.get("/I/want/title/usingAsync/", addressController.getWebsiteTitleUsingAsync);

// Task 3 - using promises (RSVP)
app.get("/I/want/title/usingRsvp/", addressController.getWebsiteTitleUsingRsvp);

// BONUS - Task 4 - using Streams for reactive prog (Rxjs)
app.get("/I/want/title/usingRxjs/", addressController.getWebsiteTitleUsingRxjs);

// route handler for all other routes
app.use('*', (req, res) => {
    res.status(404).send('404 - Not Found');
});

const server = app.listen(config.port, () => {
    console.info(`Server started on port ${config.port}.`);
});

server.on('error', (err) => {
    console.error('An error occurred while starting the server:', err);
});
