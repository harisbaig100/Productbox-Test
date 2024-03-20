module.exports = {
    writeHeader: function (response) {
        if (!response.finished) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(`
                <html>
                <head>
                    <title>Full stack challenge</title>
                </head>
                <body>
                    <h1>Following are the titles of given websites: </h1>
                    <ul>
            `);
        }
    },

    writeUrlTitle: function (response, title) {
        if (!response.finished) {
            response.write(`<li>${title}</li>`);
        }
    },

    writeFooter: function (response) {
        if (!response.finished) {
            response.write(`
                </ul>
                </body>
                </html>
            `);
            response.end();
        }
    },

    noAddressInUrl: function (response) {
        if (!response.finished) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(`
                <html>
                <head>
                    <title>Full Stack Challenge</title>
                </head>
                <body>
                    <h1>No Address Found:</h1>
                    <ul>
                        <li>Please enter address in URL</li>
                    </ul>
                </body>
                </html>
            `);
            response.end();
        }
    },
};
